import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';
import { UserProfile } from '@/types';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, messages } = body;

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

    const conversationText = messages.map((m: { role: string; content: string }) => `${m.role}: ${m.content}`).join('\n');

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Conversation record:\n${conversationText}\n\nPlease generate user profile JSON.` },
    ], 'self-exploration');

    const content = typeof response === 'string' ? response : response;
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

    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
