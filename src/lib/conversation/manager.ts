import { nanoid } from 'nanoid';
import type { Conversation, ConversationSummary, Message } from '@/types/chat';
import {
  loadConversations,
  saveConversations,
  updateConversation,
  deleteConversation,
  loadSummaries,
  addSummary,
  deleteSummary,
  loadDialogContext,
  saveDialogContext,
  getConversationById,
  getActiveConversation,
} from './storage';
import { generateConversationSummary, generateMergeSummary, type SummaryResult } from './summarizer';

export class ConversationManager {
  static createConversation(
    userId: string,
    type: Conversation['type'],
    title?: string
  ): Conversation {
    const now = new Date().toISOString();
    const conversation: Conversation = {
      id: `conv_${nanoid()}`,
      userId,
      type,
      title: title || this.getDefaultTitle(type),
      messages: [],
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    const conversations = loadConversations(userId);
    conversations.forEach(c => {
      c.isActive = false;
    });

    conversations.unshift(conversation);
    saveConversations(userId, conversations);

    saveDialogContext(userId, {
      activeConversationId: conversation.id,
      previousConversationId: conversations.length > 1 ? conversations[1].id : undefined,
      isNewConversation: true,
    });

    return conversation;
  }

  static addMessage(
    userId: string,
    conversationId: string,
    message: Omit<Message, 'id' | 'createdAt'>
  ): Message {
    const conversations = loadConversations(userId);
    const index = conversations.findIndex(c => c.id === conversationId);
    if (index === -1) {
      throw new Error(`Conversation not found: ${conversationId}`);
    }

    const newMessage: Message = {
      ...message,
      id: `msg_${nanoid()}`,
      createdAt: new Date().toISOString(),
    };

    conversations[index].messages.push(newMessage);
    conversations[index].updatedAt = new Date().toISOString();
    conversations[index].isActive = true;
    saveConversations(userId, conversations);

    return newMessage;
  }

  static async summarizeConversation(
    userId: string,
    conversationId: string
  ): Promise<SummaryResult> {
    const conversation = getConversationById(userId, conversationId);
    if (!conversation) {
      return {
        summary: {
          id: `summary_${nanoid()}`,
          userId,
          conversationId,
          title: '对话未找到',
          content: '无法找到对应的对话记录。',
          keyQuestions: [],
          coreConclusions: [],
          importantSteps: [],
          suggestions: [],
          featureKey: 'unknown',
          messageCount: 0,
          startTime: new Date().toISOString(),
          endTime: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        success: false,
        error: 'Conversation not found',
      };
    }

    if (conversation.messages.length === 0) {
      return {
        summary: {
          id: `summary_${nanoid()}`,
          userId,
          conversationId,
          title: conversation.title || '空对话',
          content: '该对话暂无消息记录。',
          keyQuestions: [],
          coreConclusions: [],
          importantSteps: [],
          suggestions: [],
          featureKey: conversation.type,
          messageCount: 0,
          startTime: conversation.createdAt,
          endTime: conversation.updatedAt,
          createdAt: new Date().toISOString(),
        },
        success: true,
      };
    }

    const result = await generateConversationSummary(
      userId,
      conversationId,
      conversation.messages,
      conversation.type
    );

    if (result.success && result.summary) {
      addSummary(userId, result.summary);
      updateConversation(userId, conversationId, { summary: result.summary });
    }

    return result;
  }

  static async mergeSummarizeConversations(
    userId: string,
    conversationIds: string[]
  ): Promise<{ content: string; success: boolean; error?: string }> {
    if (conversationIds.length < 2) {
      return {
        content: '至少需要选择两个对话才能进行合并总结。',
        success: false,
        error: 'Not enough conversations',
      };
    }

    const summaries = conversationIds
      .map(id => {
        const conv = getConversationById(userId, id);
        if (!conv) return null;
        return {
          title: conv.title || '未命名对话',
          content: conv.summary?.content || `该对话包含 ${conv.messages.length} 条消息。`,
          featureKey: conv.type,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    if (summaries.length < 2) {
      return {
        content: '有效的对话数量不足，无法进行合并总结。',
        success: false,
        error: 'Not enough valid conversations',
      };
    }

    return generateMergeSummary(userId, summaries);
  }

  static getConversations(userId: string): Conversation[] {
    return loadConversations(userId);
  }

  static getSummaries(userId: string): ConversationSummary[] {
    return loadSummaries(userId);
  }

  static getConversation(userId: string, conversationId: string): Conversation | undefined {
    return getConversationById(userId, conversationId);
  }

  static getActiveConversation(userId: string): Conversation | undefined {
    return getActiveConversation(userId);
  }

  static getDialogContext(userId: string) {
    return loadDialogContext(userId);
  }

  static continuePreviousConversation(userId: string): Conversation | undefined {
    const context = loadDialogContext(userId);
    if (!context.previousConversationId) {
      return undefined;
    }

    const previous = getConversationById(userId, context.previousConversationId);
    if (!previous) return undefined;

    const conversations = loadConversations(userId);
    conversations.forEach(c => {
      c.isActive = false;
    });

    previous.isActive = true;
    previous.updatedAt = new Date().toISOString();
    saveConversations(userId, conversations);

    const prevSummary = previous.summary;
    saveDialogContext(userId, {
      activeConversationId: previous.id,
      previousConversationId: context.activeConversationId,
      summaryContext: prevSummary ? prevSummary.content : undefined,
      isNewConversation: false,
    });

    return previous;
  }

  static startNewConversation(
    userId: string,
    type: Conversation['type'],
    title?: string
  ): Conversation {
    const context = loadDialogContext(userId);
    const newConv = this.createConversation(userId, type, title);

    saveDialogContext(userId, {
      activeConversationId: newConv.id,
      previousConversationId: context.activeConversationId,
      isNewConversation: true,
    });

    return newConv;
  }

  static deleteConversation(userId: string, conversationId: string): boolean {
    const success = deleteConversation(userId, conversationId);
    if (success) {
      const context = loadDialogContext(userId);
      if (context.activeConversationId === conversationId) {
        const conversations = loadConversations(userId);
        const newActive = conversations.find(c => c.isActive) || conversations[0];
        if (newActive) {
          saveDialogContext(userId, {
            activeConversationId: newActive.id,
            previousConversationId: context.previousConversationId,
            isNewConversation: true,
          });
        }
      }
    }
    return success;
  }

  static deleteSummary(userId: string, summaryId: string): boolean {
    return deleteSummary(userId, summaryId);
  }

  private static getDefaultTitle(type: string): string {
    const titles: Record<string, string> = {
      'self-exploration': '自我认知探索',
      'city-match': '城市匹配分析',
      'major-analysis': '专业分析',
      'jd-parser': 'JD 翻译器',
      'family-bridge': '家庭沟通桥',
      'free-chat': '自由对话',
    };
    return titles[type] || '新对话';
  }
}
