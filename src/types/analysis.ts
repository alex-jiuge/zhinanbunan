export interface AnalysisResult {
  id: string;
  userId: string;
  type: 'city-match' | 'major-analysis' | 'jd-parser' | 'family-bridge';
  title?: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  createdAt: string;
}

export interface CityAnalysis {
  recommendations: Array<{
    city: string;
    overallScore: number;
    scores: {
      industry: number;
      cost: number;
      development: number;
      lifestyle: number;
      social: number;
    };
    highlights: string[];
    concerns: string[];
    suggestedAreas: string[];
    estimatedSalary: string;
    estimatedRent: string;
  }>;
  comparison: {
    dimensions: string[];
    cities: Record<string, number[]>;
  };
  summary: string;
}

export interface MajorAnalysis {
  majorOverview: {
    name: string;
    category: string;
    coreSkills: string[];
    employmentRate: string;
    commonDirections: string[];
  };
  transferableSkills: Array<{
    skill: string;
    description: string;
    applicableRoles: string[];
    transferDifficulty: '低' | '中' | '高';
  }>;
  careerPaths: Array<{
    direction: string;
    matchScore: number;
    why: string;
    gaps: string[];
    actionPlan: string[];
  }>;
  coldMajorAdvice: {
    mindset: string;
    strategies: string[];
    successCases: string[];
  };
}

export interface JDAnalysis {
  roleOverview: {
    title: string;
    reality: string;
    seniority: string;
  };
  dailyWork: Array<{
    task: string;
    frequency: string;
    description: string;
  }>;
  skillRequirements: {
    mustHave: string[];
    niceToHave: string[];
    hiddenRequirements: string[];
  };
  salaryRange: {
    entry: string;
    mid: string;
    senior: string;
  };
  redFlags: string[];
  matchAnalysis?: {
    overallMatch: number;
    matchedSkills: string[];
    gapSkills: string[];
    suggestions: string[];
  };
}

export interface FamilyBridgeResult {
  parentFriendlyDescription: {
    title: string;
    analogy: string;
    stability: string;
    income: string;
    development: string;
  };
  dataPoints: Array<{
    claim: string;
    counterData: string;
  }>;
  conversationGuide: Array<{
    parentSays: string;
    suggestedReply: string;
  }>;
  compromiseSuggestions: string[];
}
