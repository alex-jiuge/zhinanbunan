import { NextResponse } from 'next/server';
import { SAMPLE_INTERNSHIPS, Internship } from '@/types/internship';

interface UserProfile {
  major?: string;
  city?: string;
  industry?: string;
  skills?: string[];
}

function calculateMatchScore(internship: Internship, profile: UserProfile | null): number {
  if (!profile) return 0;

  let score = 0;

  if (profile.city && internship.location.includes(profile.city)) {
    score += 40;
  }

  if (profile.industry && internship.industry === profile.industry) {
    score += 30;
  }

  if (profile.major && internship.title.includes(profile.major.slice(0, 2))) {
    score += 20;
  }

  if (profile.skills) {
    const matchedSkills = profile.skills.filter((skill) =>
      internship.requirements.some((req) => req.includes(skill))
    );
    score += Math.min((matchedSkills.length / internship.requirements.length) * 10, 10);
  }

  return Math.min(Math.round(score), 100);
}

function generateMatchReasons(internship: Internship, profile: UserProfile | null): string[] {
  const reasons: string[] = [];
  if (!profile) return reasons;

  if (profile.city && internship.location.includes(profile.city)) {
    reasons.push('匹配你的首选城市');
  }
  if (profile.industry && internship.industry === profile.industry) {
    reasons.push('匹配你的目标行业');
  }
  if (profile.major && internship.title.includes(profile.major.slice(0, 2))) {
    reasons.push('与你的专业相关');
  }
  return reasons;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profile } = body as { profile: UserProfile | null };

    const internshipsWithScores = SAMPLE_INTERNSHIPS.map((internship) => {
      const matchScore = calculateMatchScore(internship, profile);
      return {
        ...internship,
        matchScore,
        matchReasons: generateMatchReasons(internship, profile),
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({ internships: internshipsWithScores });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
