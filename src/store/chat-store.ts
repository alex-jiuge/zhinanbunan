import { create } from 'zustand';
import { Message, Conversation } from '@/types';

interface ChatState {
  currentConversation: Conversation | null;
  messages: Message[];
  currentStep: number;
  totalSteps: number;
  isCompleted: boolean;
  isLoading: boolean;

  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  setCurrentStep: (step: number) => void;
  setTotalSteps: (total: number) => void;
  setIsCompleted: (completed: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  resetChat: () => void;
}

const initialState = {
  currentConversation: null,
  messages: [],
  currentStep: 0,
  totalSteps: 8,
  isCompleted: false,
  isLoading: false,
};

export const useChatStore = create<ChatState>((set) => ({
  ...initialState,

  setMessages: (messages) => set({ messages }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  setCurrentStep: (step) => set({ currentStep: step }),

  setTotalSteps: (total) => set({ totalSteps: total }),

  setIsCompleted: (completed) => set({ isCompleted: completed }),

  setIsLoading: (loading) => set({ isLoading: loading }),

  resetChat: () => set(initialState),
}));
