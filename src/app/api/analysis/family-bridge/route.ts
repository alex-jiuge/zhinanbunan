import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetCareer, targetCity, parentConcerns, childArguments } = body;

    const systemPrompt = `You are a psychology consultant and career planner specializing in family communication.

## Output Format
Must return strictly valid JSON:

{
  "parentFriendlyDescription": {
    "title": "Introduction title for parents",
    "analogy": "Use real-life analogy to explain this career",
    "stability": "Objective analysis of stability",
    "income": "Objective analysis of income (with specific numbers)",
    "development": "Objective analysis of development prospects"
  },
  "dataPoints": [
    {
      "claim": "Possible parent concern",
      "counterData": "Specific data to address it"
    }
  ],
  "conversationGuide": [
    {
      "parentSays": "What parents might say",
      "suggestedReply": "Suggested reply"
    }
  ],
  "compromiseSuggestions": [
    "Compromise suggestion 1",
    "Compromise suggestion 2"
  ]
}`;

    const concernsText = parentConcerns?.join(', ') || '';
    const childText = childArguments ? `Child's thoughts: ${childArguments}` : '';
    const taskPrompt = `Target Career: ${targetCareer}\nTarget City: ${targetCity}\nParent Concerns: ${concernsText}\n${childText}\n\nPlease generate a communication plan and return JSON results.`;

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: taskPrompt },
    ], 'family-bridge');

    const content = typeof response === 'string' ? response : response;
    let analysisResult;

    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      analysisResult = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } catch {
      analysisResult = {
        parentFriendlyDescription: {
          title: `What is a ${targetCareer}?`,
          analogy: 'Like a core coordinator of a team',
          stability: 'Although not a government job, industry demand is high',
          income: 'Starting salary is generally 8000-15000 RMB',
          development: 'Can progress to management roles',
        },
        dataPoints: [{ claim: 'Is it stable?', counterData: 'Industry demand continues to grow' }],
        conversationGuide: [{ parentSays: 'Is this job stable?', suggestedReply: 'The industry has large demand, it is easy to find another job' }],
        compromiseSuggestions: ['Try for 1-2 years first', 'Prefer large companies, relatively more stable'],
      };
    }

    return NextResponse.json(analysisResult);
  } catch {
    return NextResponse.json({ error: 'Generation failed' }, { status: 500 });
  }
}
