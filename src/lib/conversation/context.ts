import { ConversationManager } from './manager';

export function buildDialogContext(userId: string): string {
  const context = ConversationManager.getDialogContext(userId);

  if (context.isNewConversation || !context.summaryContext) {
    return '';
  }

  return `## 上次对话总结\n${context.summaryContext}\n\n请基于以上历史对话内容，继续为用户提供建议。`;
}
