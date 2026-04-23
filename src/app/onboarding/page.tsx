'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useChatStore } from '@/store/chat-store';
import { useUserStore } from '@/store/user-store';
import { SELF_EXPLORATION_STEPS } from '@/lib/ai/prompts/self-exploration';
import { callZhipuAI } from '@/lib/ai/client-call';
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
      const conversationMessages: { role: 'user' | 'assistant'; content: string }[] = messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      }));

      const content = await callZhipuAI(
        conversationMessages,
        currentPrompt.systemPrompt,
        { maxTokens: 2000 }
      );

      const aiMsg: Message = {
        id: nanoid(),
        role: 'assistant',
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages([...messages, userMsg, aiMsg]);
      const nextStep = step + 1;
      setSuggestedReplies(nextStep < SELF_EXPLORATION_STEPS.length ? SELF_EXPLORATION_STEPS[nextStep].suggestedReplies : []);
      setCurrentStep(nextStep);
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
      const systemPrompt = `You are a warm, professional college life planning consultant. Based on the following conversation, generate a personal growth profile for the user.

## Output Format
Must return strictly valid JSON:

{
  "personalityType": "Personality type description",
  "values": ["Freedom", "Creativity"],
  "interests": ["Technology", "Writing"],
  "strengths": ["Logical analysis", "Deep thinking"],
  "weaknesses": ["Public speaking", "Quick decisions"],
  "lifestylePref": {
    "pace": "Moderate pace",
    "environment": "City with cultural atmosphere",
    "social": "Small circle deep socializing"
  },
  "academicScore": 7.5,
  "practiceScore": 6.0,
  "socialScore": 5.5,
  "skillScore": 7.0,
  "mentalScore": 7.0,
  "summary": "About 200 characters comprehensive profile",
  "isCompleted": true
}

## Notes
- All scores based on conversation, range 1-10
- Summary should be warm, sincere, personalized
- Personality type should be concise and clear`;

      const conversationText = messages.map((m) => `${m.role}: ${m.content}`).join('\n');
      const content = await callZhipuAI(
        [{ role: 'user' as const, content: `Conversation record:\n${conversationText}\n\nPlease generate user profile JSON.` }],
        systemPrompt,
        { maxTokens: 2000 }
      );

      let profileData: Record<string, unknown>;
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        const jsonStr = content.slice(jsonStart, jsonEnd + 1);
        profileData = JSON.parse(jsonStr);
      } catch {
        profileData = {
          personalityType: 'Explorer',
          values: ['Freedom', 'Growth', 'Creativity'],
          interests: ['Learning', 'Exploration'],
          strengths: ['Thinking ability'],
          weaknesses: ['Practical experience'],
          lifestylePref: { pace: 'Moderate', environment: 'Open', social: 'Small circle' },
          academicScore: 6.5,
          practiceScore: 5.5,
          socialScore: 5.5,
          skillScore: 6.0,
          mentalScore: 6.5,
          summary: 'You are someone who is exploring yourself.',
          isCompleted: true,
        };
      }

      const profile: UserProfile = {
        id: crypto.randomUUID(),
        userId: userId,
        personalityType: profileData.personalityType as string,
        values: profileData.values as string[],
        interests: profileData.interests as string[],
        strengths: profileData.strengths as string[],
        weaknesses: profileData.weaknesses as string[],
        lifestylePref: profileData.lifestylePref as UserProfile['lifestylePref'],
        academicScore: profileData.academicScore as number,
        practiceScore: profileData.practiceScore as number,
        socialScore: profileData.socialScore as number,
        skillScore: profileData.skillScore as number,
        mentalScore: profileData.mentalScore as number,
        summary: profileData.summary as string,
        isCompleted: true,
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
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
