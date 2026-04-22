import type { ConversationSummary, Conversation, Message } from '@/types/chat';

const STORAGE_KEYS = {
  CONVERSATIONS: 'compass:conversations',
  SUMMARIES: 'compass:summaries',
  DIALOG_CONTEXT: 'compass:dialog-context',
} as const;

const MAX_CONVERSATIONS = 50;
const MAX_SUMMARIES = 100;

function safeGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch {
    console.error(`Failed to load localStorage key: ${key}`);
    return defaultValue;
  }
}

function safeSet(key: string, value: unknown): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Failed to save localStorage key: ${key}`, error);
    return false;
  }
}

function trimToLimit<T extends { updatedAt?: string; createdAt?: string }>(
  items: T[],
  limit: number
): T[] {
  if (items.length <= limit) return items;
  const sorted = [...items].sort((a, b) => {
    const dateA = a.updatedAt || a.createdAt || '';
    const dateB = b.updatedAt || b.createdAt || '';
    return dateB.localeCompare(dateA);
  });
  return sorted.slice(0, limit);
}

export function loadConversations(userId: string): Conversation[] {
  const all = safeGet<Record<string, Conversation[]>>(STORAGE_KEYS.CONVERSATIONS, {});
  return all[userId] || [];
}

export function saveConversations(userId: string, conversations: Conversation[]): void {
  const all = safeGet<Record<string, Conversation[]>>(STORAGE_KEYS.CONVERSATIONS, {});
  const trimmed = trimToLimit(conversations, MAX_CONVERSATIONS);
  all[userId] = trimmed;
  safeSet(STORAGE_KEYS.CONVERSATIONS, all);
}

export function addConversation(userId: string, conversation: Conversation): void {
  const conversations = loadConversations(userId);
  conversations.unshift(conversation);
  saveConversations(userId, conversations);
}

export function updateConversation(userId: string, conversationId: string, updates: Partial<Conversation>): boolean {
  const conversations = loadConversations(userId);
  const index = conversations.findIndex(c => c.id === conversationId);
  if (index === -1) return false;
  conversations[index] = { ...conversations[index], ...updates, updatedAt: new Date().toISOString() };
  saveConversations(userId, conversations);
  return true;
}

export function deleteConversation(userId: string, conversationId: string): boolean {
  const conversations = loadConversations(userId);
  const filtered = conversations.filter(c => c.id !== conversationId);
  if (filtered.length === conversations.length) return false;
  saveConversations(userId, filtered);
  return true;
}

export function loadSummaries(userId: string): ConversationSummary[] {
  const all = safeGet<Record<string, ConversationSummary[]>>(STORAGE_KEYS.SUMMARIES, {});
  return all[userId] || [];
}

export function saveSummaries(userId: string, summaries: ConversationSummary[]): void {
  const all = safeGet<Record<string, ConversationSummary[]>>(STORAGE_KEYS.SUMMARIES, {});
  const trimmed = trimToLimit(summaries, MAX_SUMMARIES);
  all[userId] = trimmed;
  safeSet(STORAGE_KEYS.SUMMARIES, all);
}

export function addSummary(userId: string, summary: ConversationSummary): void {
  const summaries = loadSummaries(userId);
  summaries.unshift(summary);
  saveSummaries(userId, summaries);
}

export function updateSummary(userId: string, summaryId: string, updates: Partial<ConversationSummary>): boolean {
  const summaries = loadSummaries(userId);
  const index = summaries.findIndex(s => s.id === summaryId);
  if (index === -1) return false;
  summaries[index] = { ...summaries[index], ...updates };
  saveSummaries(userId, summaries);
  return true;
}

export function deleteSummary(userId: string, summaryId: string): boolean {
  const summaries = loadSummaries(userId);
  const filtered = summaries.filter(s => s.id !== summaryId);
  if (filtered.length === summaries.length) return false;
  saveSummaries(userId, filtered);
  return true;
}

export function loadDialogContext(userId: string): {
  activeConversationId: string;
  previousConversationId?: string;
  summaryContext?: string;
  isNewConversation: boolean;
} {
  const all = safeGet<Record<string, {
    activeConversationId: string;
    previousConversationId?: string;
    summaryContext?: string;
    isNewConversation: boolean;
  }>>(STORAGE_KEYS.DIALOG_CONTEXT, {});
  return all[userId] || {
    activeConversationId: '',
    isNewConversation: true,
  };
}

export function saveDialogContext(userId: string, context: {
  activeConversationId: string;
  previousConversationId?: string;
  summaryContext?: string;
  isNewConversation: boolean;
}): void {
  const all = safeGet<Record<string, unknown>>(STORAGE_KEYS.DIALOG_CONTEXT, {});
  all[userId] = context;
  safeSet(STORAGE_KEYS.DIALOG_CONTEXT, all);
}

export function getConversationById(userId: string, conversationId: string): Conversation | undefined {
  const conversations = loadConversations(userId);
  return conversations.find(c => c.id === conversationId);
}

export function getSummaryById(userId: string, summaryId: string): ConversationSummary | undefined {
  const summaries = loadSummaries(userId);
  return summaries.find(s => s.id === summaryId);
}

export function getConversationMessages(userId: string, conversationId: string): Message[] {
  const conv = getConversationById(userId, conversationId);
  return conv ? conv.messages : [];
}

export function getActiveConversation(userId: string): Conversation | undefined {
  const context = loadDialogContext(userId);
  if (!context.activeConversationId) return undefined;
  return getConversationById(userId, context.activeConversationId);
}

export function clearAllUserData(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const conversations = safeGet<Record<string, Conversation[]>>(STORAGE_KEYS.CONVERSATIONS, {});
    const summaries = safeGet<Record<string, ConversationSummary[]>>(STORAGE_KEYS.SUMMARIES, {});
    const contexts = safeGet<Record<string, unknown>>(STORAGE_KEYS.DIALOG_CONTEXT, {});
    delete conversations[userId];
    delete summaries[userId];
    delete contexts[userId];
    safeSet(STORAGE_KEYS.CONVERSATIONS, conversations);
    safeSet(STORAGE_KEYS.SUMMARIES, summaries);
    safeSet(STORAGE_KEYS.DIALOG_CONTEXT, contexts);
  } catch {
    // Ignore errors on clear
  }
}

export const conversationStorage = {
  loadSummaries,
  saveSummaries,
  addSummary,
  loadConversations,
  saveConversations,
  addConversation,
  updateConversation,
  deleteConversation,
  loadDialogContext,
  saveDialogContext,
  getConversationById,
  getSummaryById,
  getConversationMessages,
  getActiveConversation,
  clearAllUserData,
};
