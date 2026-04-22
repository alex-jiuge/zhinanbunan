export type ChatRole = 'user' | 'assistant' | 'system';

export interface Message {
  id: string;
  role: ChatRole;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface Conversation {
  id: string;
  userId: string;
  type: 'self-exploration' | 'city-match' | 'major-analysis' | 'jd-parser' | 'family-bridge' | 'free-chat';
  title?: string;
  messages: Message[];
  summary?: ConversationSummary;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface ConversationSummary {
  id: string;
  userId: string;
  conversationId: string;
  title: string;
  content: string;
  keyQuestions: string[];
  coreConclusions: string[];
  importantSteps: string[];
  suggestions: string[];
  featureKey: string;
  messageCount: number;
  startTime: string;
  endTime: string;
  createdAt: string;
}

export interface DialogContext {
  activeConversationId: string;
  previousConversationId?: string;
  summaryContext?: string;
  isNewConversation: boolean;
}

export interface ChatResponse {
  content: string;
  suggestedReplies?: string[];
  step?: number;
  metadata?: Record<string, unknown>;
}
