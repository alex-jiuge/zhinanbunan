import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { jdText, targetRole } = body;

    const systemPrompt = `You are a senior HR and career planner, skilled at "translating" job descriptions to help job seekers understand the reality of positions.

## Output Format
Must return strictly valid JSON:

{
  "roleOverview": {
    "title": "Job title",
    "reality": "Description of actual job content",
    "seniority": "Level"
  },
  "dailyWork": [
    {"task": "Task", "frequency": "Frequency", "description": "Description"}
  ],
  "skillRequirements": {
    "mustHave": ["Must-have 1", "Must-have 2"],
    "niceToHave": ["Nice-to-have 1", "Nice-to-have 2"],
    "hiddenRequirements": ["Hidden requirement 1", "Hidden requirement 2"]
  },
  "salaryRange": {
    "entry": "Entry-level range",
    "mid": "Mid-level range",
    "senior": "Senior-level range"
  },
  "redFlags": ["Red flag 1", "Red flag 2"],
  "matchAnalysis": {
    "overallMatch": 72,
    "matchedSkills": ["Matched skill"],
    "gapSkills": ["Gap skill"],
    "suggestions": ["Suggestion 1", "Suggestion 2"]
  }
}`;

    const targetRoleText = targetRole ? `Target Role: ${targetRole}` : '';
    const taskPrompt = `JD Content:\n${jdText}\n\n${targetRoleText}\n\nPlease parse and return JSON results.`;

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: taskPrompt },
    ], 'jd-parser');

    const content = typeof response === 'string' ? response : response;
    let analysisResult;

    try {
      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');
      analysisResult = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
    } catch {
      analysisResult = {
        roleOverview: { title: targetRole || 'Unknown Position', reality: 'Need further understanding', seniority: 'Entry/Mid-level' },
        dailyWork: [{ task: 'Daily work', frequency: 'Daily', description: 'Execute based on job requirements' }],
        skillRequirements: { mustHave: ['Professional ability'], niceToHave: ['Related experience'], hiddenRequirements: ['Stress resistance'] },
        salaryRange: { entry: '8K-15K', mid: '15K-30K', senior: '30K+' },
        redFlags: ['Watch out for overtime culture'],
        matchAnalysis: { overallMatch: 60, matchedSkills: ['Basic ability'], gapSkills: ['Practical experience'], suggestions: ['Supplement related skills', 'Gain internship experience'] },
      };
    }

    return NextResponse.json(analysisResult);
  } catch {
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
