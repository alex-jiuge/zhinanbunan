export type HollandDimension =
  | 'realistic'
  | 'investigative'
  | 'artistic'
  | 'social'
  | 'enterprising'
  | 'conventional';

export interface HollandScore {
  dimension: HollandDimension;
  score: number;
  label: string;
  description: string;
  careers: string[];
}

export interface AssessmentQuestion {
  id: string;
  dimension: HollandDimension;
  text: string;
}

export interface AssessmentAnswer {
  questionId: string;
  value: number;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  answers: AssessmentAnswer[];
  scores: HollandScore[];
  dominantType: HollandDimension;
  completedAt: string;
  createdAt: string;
}

export const HOLLAND_DIMENSION_LABELS: Record<HollandDimension, string> = {
  realistic: '实用型 (R)',
  investigative: '研究型 (I)',
  artistic: '艺术型 (A)',
  social: '社会型 (S)',
  enterprising: '企业型 (E)',
  conventional: '常规型 (C)',
};

export const HOLLAND_DIMENSION_DESCRIPTIONS: Record<HollandDimension, string> = {
  realistic: '喜欢动手操作，偏好机械、工具、动植物等具体事物',
  investigative: '喜欢观察、思考、分析，对科学和理论有浓厚兴趣',
  artistic: '富有创造力和想象力，喜欢自由、不受约束的工作环境',
  social: '乐于助人、善于沟通，关注他人的福祉和发展',
  enterprising: '有领导力和说服力，喜欢影响和管理他人',
  conventional: '注重细节和秩序，擅长数据处理和系统化管理',
};

export const HOLLAND_DIMENSION_CAREERS: Record<HollandDimension, string[]> = {
  realistic: ['工程师', '技术员', '建筑师', '农业专家', '机械师'],
  investigative: ['研究员', '数据科学家', '医生', '程序员', '分析师'],
  social: ['教师', '心理咨询师', '社工', '人力资源', '医护'],
  enterprising: ['销售经理', '企业家', '律师', '项目经理', '政治家'],
  artistic: ['设计师', '作家', '音乐家', '摄影师', '导演'],
  conventional: ['会计师', '行政助理', '数据录入员', '银行职员', '审计师'],
};

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  { id: 'r1', dimension: 'realistic', text: '我喜欢动手修理或组装物品' },
  { id: 'r2', dimension: 'realistic', text: '我更愿意从事户外或体力活动的工作' },
  { id: 'r3', dimension: 'realistic', text: '我喜欢使用工具或操作机械设备' },
  { id: 'r4', dimension: 'realistic', text: '我对植物、动物或自然现象感兴趣' },
  { id: 'i1', dimension: 'investigative', text: '我喜欢思考复杂的理论问题' },
  { id: 'i2', dimension: 'investigative', text: '我享受通过数据分析找到答案的过程' },
  { id: 'i3', dimension: 'investigative', text: '我对科学研究或新技术有好奇心' },
  { id: 'i4', dimension: 'investigative', text: '我喜欢独立思考和逻辑推理' },
  { id: 'a1', dimension: 'artistic', text: '我喜欢创作（写作、绘画、音乐等）' },
  { id: 'a2', dimension: 'artistic', text: '我对美学和设计有敏锐的感知' },
  { id: 'a3', dimension: 'artistic', text: '我喜欢自由、不受约束的工作环境' },
  { id: 'a4', dimension: 'artistic', text: '我经常有独特的想法或创意' },
  { id: 's1', dimension: 'social', text: '我喜欢帮助他人解决困难' },
  { id: 's2', dimension: 'social', text: '我善于倾听和理解他人的感受' },
  { id: 's3', dimension: 'social', text: '我对教育或培训工作感兴趣' },
  { id: 's4', dimension: 'social', text: '我喜欢在团队中与他人协作' },
  { id: 'e1', dimension: 'enterprising', text: '我喜欢领导和组织团队活动' },
  { id: 'e2', dimension: 'enterprising', text: '我善于说服他人接受我的观点' },
  { id: 'e3', dimension: 'enterprising', text: '我对商业和创业有浓厚兴趣' },
  { id: 'e4', dimension: 'enterprising', text: '我愿意承担风险以获取更大的回报' },
  { id: 'c1', dimension: 'conventional', text: '我喜欢有序、有规律的工作环境' },
  { id: 'c2', dimension: 'conventional', text: '我擅长处理数字和细节信息' },
  { id: 'c3', dimension: 'conventional', text: '我做事注重计划和流程' },
  { id: 'c4', dimension: 'conventional', text: '我对数据管理和系统整理有经验或兴趣' },
];

export function calculateHollandScores(answers: AssessmentAnswer[]): HollandScore[] {
  const dimensionScores: Record<HollandDimension, number[]> = {
    realistic: [],
    investigative: [],
    artistic: [],
    social: [],
    enterprising: [],
    conventional: [],
  };

  for (const answer of answers) {
    const question = ASSESSMENT_QUESTIONS.find((q) => q.id === answer.questionId);
    if (question) {
      dimensionScores[question.dimension].push(answer.value);
    }
  }

  const dimensions: HollandDimension[] = [
    'realistic',
    'investigative',
    'artistic',
    'social',
    'enterprising',
    'conventional',
  ];

  return dimensions.map((dimension) => {
    const scores = dimensionScores[dimension];
    const average = scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
    const normalizedScore = Math.round((average / 5) * 100);

    return {
      dimension,
      score: normalizedScore,
      label: HOLLAND_DIMENSION_LABELS[dimension],
      description: HOLLAND_DIMENSION_DESCRIPTIONS[dimension],
      careers: HOLLAND_DIMENSION_CAREERS[dimension],
    };
  });
}

export function getDominantType(scores: HollandScore[]): HollandDimension {
  return scores.reduce((a, b) => (a.score > b.score ? a : b)).dimension;
}
