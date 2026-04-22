import { ModelRouter } from './model-registry/router';
import { ModelRegistry } from './model-registry/registry';
import type { ModelMessage } from 'ai';
import { buildContextForFeature } from '@/lib/user-info/context-builder';
import { buildDialogContext } from '@/lib/conversation/context';

// Initialize on first import
if (typeof window === 'undefined') {
  try {
    ModelRegistry.initialize();
  } catch {
    // SSR - skip initialization
  }
}

export async function generateAIResponse(
  messages: Array<{ role: string; content: string }>,
  featureKey?: string,
  userId?: string
) {
  const context = userId ? buildContextForFeature(userId, featureKey || 'chat-general') : '';
  const dialogContext = userId ? buildDialogContext(userId) : '';

  const enhancedMessages = [...messages];

  if (context || dialogContext) {
    const systemMessage = enhancedMessages.find((m) => m.role === 'system');
    let contextContent = '';
    
    if (context) {
      contextContent += `## 用户信息\n${context}`;
    }
    
    if (dialogContext) {
      contextContent += `\n\n${dialogContext}`;
    }

    if (systemMessage) {
      systemMessage.content = `${systemMessage.content}\n\n${contextContent}`;
    } else {
      enhancedMessages.unshift({
        role: 'system',
        content: contextContent.trim(),
      });
    }
  }

  const result = await ModelRouter.routeRequest({
    messages: enhancedMessages as ModelMessage[],
    featureKey: featureKey || 'chat-general',
    temperature: 0.7,
    maxTokens: 2000,
  });

  return result.text;
}

export { ModelRouter, ModelRegistry };
