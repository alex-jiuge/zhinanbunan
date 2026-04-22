import { ModelRouter } from '@/lib/ai/model-registry/router';
import type { ModelMessage } from 'ai';
import type { ConversationSummary, Message } from '@/types/chat';
import { nanoid } from 'nanoid';

const SUMMARIZE_SYSTEM_PROMPT = `你是一个专业的对话总结助手。请对以下对话进行全面分析，生成结构化总结。

## 输出格式
必须返回严格合法的 JSON，不要包含任何其他内容：

{
  "title": "对话主题标题（20字以内）",
  "content": "完整的结构化总结内容（300-500字）",
  "keyQuestions": ["用户提出的关键问题1", "关键问题2"],
  "coreConclusions": ["核心结论1", "核心结论2"],
  "importantSteps": ["重要步骤/行动1", "重要步骤2"],
  "suggestions": ["后续建议1", "后续建议2"]
}

## 规则
- 提取对话中最有价值的信息，去除冗余内容
- 保持客观、准确，不要添加对话中未提及的信息
- 建议要具体、可执行
- 关键问题、核心结论、重要步骤、后续建议各 2-5 条
- content 字段要包含完整的结构化总结，使用清晰的段落和要点
- 如果对话内容不足，相应字段可以为空数组`;

export interface SummaryResult {
  summary: ConversationSummary;
  success: boolean;
  error?: string;
}

export async function generateConversationSummary(
  userId: string,
  conversationId: string,
  messages: Message[],
  featureKey: string
): Promise<SummaryResult> {
  if (messages.length < 2) {
    return {
      summary: {
        id: `summary_${nanoid()}`,
        userId,
        conversationId,
        title: '简短对话',
        content: '对话内容较少，无需总结。',
        keyQuestions: [],
        coreConclusions: [],
        importantSteps: [],
        suggestions: [],
        featureKey,
        messageCount: messages.length,
        startTime: messages[0]?.createdAt || new Date().toISOString(),
        endTime: messages[messages.length - 1]?.createdAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      success: true,
    };
  }

  const conversationText = messages
    .filter(m => m.role !== 'system')
    .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
    .join('\n');

  try {
    const result = await ModelRouter.routeRequest({
      messages: [
        { role: 'system', content: SUMMARIZE_SYSTEM_PROMPT },
        { role: 'user', content: `对话内容：\n${conversationText}\n\n请生成结构化总结并返回 JSON。` },
      ] as ModelMessage[],
      featureKey: 'chat-general',
      temperature: 0.7,
      maxTokens: 2000,
    });

    const response = result.text;

    let parsed;
    try {
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}');
      if (jsonStart === -1 || jsonEnd === -1) {
        throw new Error('No JSON found in response');
      }
      parsed = JSON.parse(response.slice(jsonStart, jsonEnd + 1));
    } catch (parseError) {
      return {
        summary: {
          id: `summary_${nanoid()}`,
          userId,
          conversationId,
          title: '总结生成失败',
          content: `AI 返回格式解析失败。原始回复：${response.slice(0, 200)}...`,
          keyQuestions: [],
          coreConclusions: [],
          importantSteps: [],
          suggestions: [],
          featureKey,
          messageCount: messages.length,
          startTime: messages[0]?.createdAt || new Date().toISOString(),
          endTime: messages[messages.length - 1]?.createdAt || new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        success: false,
        error: parseError instanceof Error ? parseError.message : 'JSON parse failed',
      };
    }

    const summary: ConversationSummary = {
      id: `summary_${nanoid()}`,
      userId,
      conversationId,
      title: parsed.title || '对话总结',
      content: parsed.content || '',
      keyQuestions: Array.isArray(parsed.keyQuestions) ? parsed.keyQuestions : [],
      coreConclusions: Array.isArray(parsed.coreConclusions) ? parsed.coreConclusions : [],
      importantSteps: Array.isArray(parsed.importantSteps) ? parsed.importantSteps : [],
      suggestions: Array.isArray(parsed.suggestions) ? parsed.suggestions : [],
      featureKey,
      messageCount: messages.length,
      startTime: messages[0]?.createdAt || new Date().toISOString(),
      endTime: messages[messages.length - 1]?.createdAt || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    return { summary, success: true };
  } catch (error) {
    return {
      summary: {
        id: `summary_${nanoid()}`,
        userId,
        conversationId,
        title: '总结生成失败',
        content: error instanceof Error ? error.message : '未知错误',
        keyQuestions: [],
        coreConclusions: [],
        importantSteps: [],
        suggestions: [],
        featureKey,
        messageCount: messages.length,
        startTime: messages[0]?.createdAt || new Date().toISOString(),
        endTime: messages[messages.length - 1]?.createdAt || new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function generateMergeSummary(
  userId: string,
  summaries: { title: string; content: string; featureKey: string }[]
): Promise<{ content: string; success: boolean; error?: string }> {
  if (summaries.length < 2) {
    return {
      content: '至少需要选择两个对话才能进行合并总结。',
      success: false,
      error: 'Not enough conversations selected',
    };
  }

  const summariesText = summaries
    .map((s, i) => `## 对话 ${i + 1}: ${s.title}\n功能模块: ${s.featureKey}\n${s.content}`)
    .join('\n\n---\n\n');

  const mergePrompt = `你是一个专业的对话分析助手。以下是对多个对话的总结，请进行综合分析，生成整合总结。

## 输出要求
请生成一段结构化的整合总结，包含：
1. 整体概况：所有对话的共同主题和核心关注点
2. 关键发现：从多个对话中提炼出的重要洞察
3. 行动建议：综合所有对话内容后的具体行动建议
4. 关注重点：需要特别关注的领域

总字数控制在 800 字以内，使用清晰的段落和要点格式。

## 对话总结内容
${summariesText}`;

  try {
    const result = await ModelRouter.routeRequest({
      messages: [
        { role: 'user', content: mergePrompt },
      ] as ModelMessage[],
      featureKey: 'chat-general',
      temperature: 0.7,
      maxTokens: 2000,
    });

    return { content: result.text, success: true };
  } catch (error) {
    return {
      content: error instanceof Error ? error.message : '合并总结生成失败',
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
