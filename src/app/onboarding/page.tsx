'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useChatStore } from '@/store/chat-store';
import { useUserStore } from '@/store/user-store';
import { SELF_EXPLORATION_STEPS } from '@/lib/ai/prompts/self-exploration';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ChatInput } from '@/components/chat/ChatInput';
import { StepProgress } from '@/components/layout/StepProgress';
import { Button } from '@/components/ui/button';
import { Message, UserProfile } from '@/types';
import { ArrowLeft, SkipForward, Sparkles } from 'lucide-react';

interface ChatApiResponse {
  content: string;
  suggestedReplies: string[];
  step: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [userId, setUserId] = useLocalStorage<string>('compass-user-id', '');
  const { messages, currentStep, isLoading, setMessages, setCurrentStep, setIsLoading, setIsCompleted } = useChatStore();
  const { setProfile } = useUserStore();
  const [suggestedReplies, setSuggestedReplies] = useState<string[]>([]);
  const [aiResponseComplete, setAiResponseComplete] = useState(false);

  useEffect(() => {
    if (!userId) {
      const newId = nanoid();
      setUserId(newId);
    }
    initializeConversation();
  }, []);

  const initializeConversation = async () => {
    setIsLoading(true);
    const welcomeMessage: Message = {
      id: nanoid(),
      role: 'assistant',
      content: '你好！我是你的 AI 伙伴小航。我将陪你一起探索自己，找到人生的方向。准备好了吗？',
      createdAt: new Date().toISOString(),
    };
    setMessages([welcomeMessage]);
    setIsLoading(false);
    sendToAI(0, '我准备好了，开始吧！');
  };

  const sendToAI = async (step: number, userMessage: string) => {
    setIsLoading(true);
    setAiResponseComplete(false);

    const userMsg: Message = {
      id: nanoid(),
      role: 'user',
      content: userMessage,
      createdAt: new Date().toISOString(),
    };
    setMessages([...messages, userMsg]);

    try {
      const currentPrompt = SELF_EXPLORATION_STEPS[step];
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          conversationType: 'self-exploration',
          step: step + 1,
          totalSteps: 8,
          systemPrompt: currentPrompt.systemPrompt,
          message: userMessage,
          conversationHistory: messages.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) throw new Error('API request failed');

      const data: ChatApiResponse = await response.json();
      const aiMsg: Message = {
        id: nanoid(),
        role: 'assistant',
        content: data.content,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, userMsg, aiMsg]);
      setSuggestedReplies(data.suggestedReplies || []);
      setCurrentStep(data.step);
      setAiResponseComplete(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  const handleSend = (message: string) => {
    sendToAI(currentStep, message);
  };

  const handleQuickReply = (reply: string) => {
    handleSend(reply);
  };

  const handleSkip = () => {
    if (currentStep < 4) {
      sendToAI(currentStep, '我想跳过这个问题，继续下一个。');
    }
  };

  const handleGenerateProfile = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/profile/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          messages: messages.map((m) => ({ role: m.role, content: m.content })),
          completedSteps: currentStep,
        }),
      });

      if (!response.ok) throw new Error('Failed to generate profile');

      const profile: UserProfile = await response.json();
      setProfile(profile);
      localStorage.setItem('compass-user-profile', JSON.stringify(profile));
      setIsCompleted(true);
      router.push('/');
    } catch (error) {
      console.error('Profile generation error:', error);
      setIsLoading(false);
    }
  };

  const canGenerateProfile = currentStep >= 4;

  return (
    <div className="flex h-svh flex-col">
      <div className="border-b bg-slate-50 px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <h1 className="font-semibold">自我认知探索</h1>
          <StepProgress currentStep={currentStep} totalSteps={8} />
        </div>
      </div>

      <div className="flex-1 container mx-auto px-3 py-3 sm:px-4 sm:py-4 min-h-0">
        <div className="mx-auto max-w-3xl">
          <div className="flex h-full flex-col">
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatWindow messages={messages} isLoading={isLoading} />
            </div>

            {aiResponseComplete && suggestedReplies.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {suggestedReplies.map((reply, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickReply(reply)}
                    className="rounded-full"
                  >
                    {reply}
                  </Button>
                ))}
              </div>
            )}

            <div className="space-y-2">
              <ChatInput onSend={handleSend} disabled={isLoading} />

              <div className="flex gap-2">
                {canGenerateProfile && (
                  <Button
                    variant="default"
                    className="flex-1"
                    onClick={handleGenerateProfile}
                    disabled={isLoading}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    生成画像
                  </Button>
                )}
                <Button variant="outline" onClick={handleSkip} disabled={isLoading || currentStep >= 7}>
                  <SkipForward className="mr-2 h-4 w-4" />
                  跳过
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
