import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';
import { SELF_EXPLORATION_STEPS } from '@/lib/ai/prompts/self-exploration';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { systemPrompt, message, conversationHistory = [], step } = body;

    const messages: Array<{ role: string; content: string }> = [
      { role: 'system', content: systemPrompt || '' },
      ...conversationHistory,
      { role: 'user', content: message },
    ];

    const response = await generateAIResponse(messages, 'self-exploration');

    const promptStep = SELF_EXPLORATION_STEPS[step] || SELF_EXPLORATION_STEPS[0];
    const suggestedReplies = promptStep.suggestedReplies;

    return NextResponse.json({
      content: response,
      suggestedReplies,
      step: step + 1,
    });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
