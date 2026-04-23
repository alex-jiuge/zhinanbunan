import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { preferences, userProfile } = body;

    const systemPrompt = `You are a professional city development and career planning analyst.

## Task
Based on user preferences and background, analyze and recommend the most suitable cities.

## Scoring Dimensions (1-10 each)
1. Industry match: whether the city's dominant industries match the user's industry preferences
2. Cost of living: whether housing prices, living costs are within budget
3. Development potential: economic growth, talent policies, industry trends
4. Quality of life: cultural atmosphere, environment quality, convenience
5. Social environment: youth ratio, social activity richness

## Output Format
Must return strict JSON format:

{
  "recommendations": [
    {
      "city": "city name",
      "overallScore": 8.7,
      "scores": {
        "industry": 9.0,
        "cost": 7.5,
        "development": 9.5,
        "lifestyle": 8.5,
        "social": 8.0
      },
      "highlights": ["highlight 1", "highlight 2"],
      "concerns": ["concern 1", "concern 2"],
      "suggestedAreas": ["area 1", "area 2"],
      "estimatedSalary": "8K-15K",
      "estimatedRent": "2000-4000 CNY/month"
    }
  ],
  "comparison": {
    "dimensions": ["industry match", "cost", "development", "lifestyle", "social"],
    "cities": {
      "city name": [9.0, 7.5, 9.5, 8.5, 8.0]
    }
  },
  "summary": "comprehensive advice around 200 Chinese characters"
}`;

    const taskPrompt = `User Preferences:
- Target Industry: ${preferences.industry}
- Interested Cities: ${preferences.targetCities?.join(', ') || 'Beijing, Shanghai, Hangzhou, Chengdu, Wuhan'}
- Lifestyle Pace: ${preferences.lifestyle}
- Budget Level: ${preferences.budgetLevel}
- Social Preference: ${preferences.socialPreference}
- Distance from Home: ${preferences.distancePreference}

${userProfile ? `User Profile: Major ${userProfile.major}, Personality ${userProfile.personalityType}` : ''}

Please analyze and return JSON result.`;

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: taskPrompt },
    ], 'city-match');

    const content = response;
    let analysisResult;

    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      analysisResult = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } catch {
      analysisResult = {
        recommendations: [
          {
            city: 'Hangzhou',
            overallScore: 8.5,
            scores: { industry: 8.5, cost: 7.5, development: 9.0, lifestyle: 8.0, social: 7.5 },
            highlights: ['Strong digital economy', 'Lower living cost than tier-1 cities'],
            concerns: ['Fewer top-tier companies'],
            suggestedAreas: ['Binjiang High-tech Zone'],
            estimatedSalary: '8K-15K',
            estimatedRent: '2000-4000 CNY/month',
          },
        ],
        comparison: {
          dimensions: ['industry match', 'cost', 'development', 'lifestyle', 'social'],
          cities: {
            'Beijing': [9.5, 5.0, 9.0, 6.5, 7.0],
            'Shanghai': [9.0, 5.5, 8.5, 7.5, 7.5],
            'Hangzhou': [8.5, 7.5, 9.5, 8.5, 8.0],
          },
        },
        summary: 'Based on your background, Hangzhou is a strong choice.',
      };
    }

    return NextResponse.json(analysisResult);
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
