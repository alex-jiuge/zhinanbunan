import type { ModelConfig } from './types';
import type { ModelMessage } from 'ai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { generateText } from 'ai';
import { ModelRegistry } from './registry';
import { UsageTracker } from './tracker';
import { decrypt } from './storage';

export interface RouteRequestOptions {
  messages: ModelMessage[];
  featureKey?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface RouteResult {
  text: string;
  modelId: string;
  modelName: string;
  latencyMs: number;
  tokensUsed: number;
  usedFallback: boolean;
}

export class ModelRouter {
  static async routeRequest(options: RouteRequestOptions): Promise<RouteResult> {
    const { messages, featureKey = 'chat-general', temperature, maxTokens } = options;
    
    // 获取该功能模块的模型链
    const modelChain = ModelRegistry.getModelChainForFeature(featureKey);
    if (modelChain.length === 0) {
      throw new Error(`No models configured for feature: ${featureKey}`);
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < Math.min(modelChain.length, 3); attempt++) {
      const model = modelChain[attempt];
      const usedFallback = attempt > 0;
      const startTime = Date.now();

      try {
        const result = await this.callModel(model, messages, temperature, maxTokens);
        const latencyMs = Date.now() - startTime;

        // 记录成功
        UsageTracker.recordUsage({
          modelId: model.id,
          modelName: model.name,
          featureKey,
          timestamp: new Date().toISOString(),
          status: usedFallback ? 'fallback' : 'success',
          latencyMs,
          tokensUsed: result.tokensUsed,
          fallbackFrom: usedFallback ? modelChain[0].name : undefined,
        });

        return {
          text: result.text,
          modelId: model.id,
          modelName: model.name,
          latencyMs,
          tokensUsed: result.tokensUsed,
          usedFallback,
        };
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        const latencyMs = Date.now() - startTime;

        // 记录失败
        UsageTracker.recordUsage({
          modelId: model.id,
          modelName: model.name,
          featureKey,
          timestamp: new Date().toISOString(),
          status: 'error',
          latencyMs,
          tokensUsed: 0,
          errorMessage: lastError.message,
        });

        console.warn(`模型 ${model.name} 调用失败，尝试备选:`, lastError.message);
      }
    }

    throw new Error(`所有模型调用均失败 (${featureKey}): ${lastError?.message}`);
  }

  private static async callModel(
    model: ModelConfig,
    messages: ModelMessage[],
    temperature?: number,
    maxTokens?: number
  ): Promise<{ text: string; tokensUsed: number }> {
    const apiKey = decrypt(model.apiKey);
    
    const provider = createOpenAICompatible({
      name: model.provider,
      baseURL: model.baseUrl,
      apiKey: apiKey,
    });

    const aiModel = provider(model.modelId);

    const result = await generateText({
      model: aiModel,
      messages,
      temperature: temperature ?? model.temperature,
      maxOutputTokens: maxTokens ?? model.maxTokens,
    });

    // 估算 token 用量（API 返回的 usage 或基于文本长度估算）
    const tokensUsed = this.estimateTokens(result.text);

    return { text: result.text, tokensUsed };
  }

  private static estimateTokens(text: string): number {
    // 简单估算：英文约 1 token/4 字符，中文约 1 token/1.5 字符
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars / 1.5 + otherChars / 4);
  }
}
