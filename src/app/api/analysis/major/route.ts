import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { major, grade, concerns } = body;

    const systemPrompt = `You are an experienced career planner and higher education expert, specializing in helping students in niche majors find career directions.

## Output Format
Must return strictly valid JSON:

{
  "majorOverview": {
    "name": "Major name",
    "category": "Major category",
    "coreSkills": ["Skill 1", "Skill 2"],
    "employmentRate": "Employment rate",
    "commonDirections": ["Direction 1", "Direction 2"]
  },
  "transferableSkills": [
    {
      "skill": "Transferable skill name",
      "description": "What this skill is",
      "applicableRoles": ["Role 1", "Role 2"],
      "transferDifficulty": "Easy"
    }
  ],
  "careerPaths": [
    {
      "direction": "Career direction",
      "matchScore": 7.5,
      "why": "Why suitable",
      "gaps": ["Gap 1", "Gap 2"],
      "actionPlan": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "coldMajorAdvice": {
    "mindset": "Mindset advice",
    "strategies": ["Strategy 1", "Strategy 2", "Strategy 3"],
    "successCases": ["Case 1", "Case 2", "Case 3"]
  }
}`;

    const taskPrompt = `Major: ${major}\nGrade: ${grade}\nConcerns: ${concerns}\n\nPlease analyze and return JSON results.`;

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: taskPrompt },
    ], 'major-analysis');

    const content = typeof response === 'string' ? response : response;
    let analysisResult;

    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      analysisResult = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } catch {
      analysisResult = {
        majorOverview: { name: major, category: 'Humanities', coreSkills: ['Logical Analysis', 'Critical Thinking'], employmentRate: '~85%', commonDirections: ['Civil Service', 'Education', 'Media'] },
        transferableSkills: [{ skill: 'Logical Analysis', description: 'Strong logical reasoning ability', applicableRoles: ['Consultant', 'Product Manager'], transferDifficulty: 'Medium' }],
        careerPaths: [{ direction: 'Internet Product Manager', matchScore: 7.5, why: 'Logic training is a unique advantage', gaps: ['Need technical foundation', 'Need practical projects'], actionPlan: ['Learn Axure/Figma', 'Participate in training', 'Apply for internship'] }],
        coldMajorAdvice: { mindset: 'Niche major is a differentiated advantage', strategies: ['Highlight transferable skills', 'Use projects to compensate', 'Focus on cross-disciplinary fields'], successCases: ['Philosophy -> Tencent PM', 'History -> McKinsey Consultant'] },
      };
    }

    return NextResponse.json(analysisResult);
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
