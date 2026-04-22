export interface Internship {
  id: string;
  title: string;
  company: string;
  location: string;
  industry: string;
  description: string;
  requirements: string[];
  salary: string;
  duration: string;
  matchScore: number;
  matchReasons: string[];
  tags: string[];
  postedAt: string;
}

export interface InternshipRecommendation {
  internship: Internship;
  matchScore: number;
  matchDetails: {
    majorMatch: number;
    locationMatch: number;
    assessmentMatch: number;
    overallMatch: number;
  };
  reasons: string[];
}

export interface InternshipFilter {
  city?: string;
  industry?: string;
  minMatchScore?: number;
}

export const SAMPLE_INTERNSHIPS: Internship[] = [
  {
    id: 'int1',
    title: '产品运营实习生',
    company: '字节跳动',
    location: '北京',
    industry: '互联网',
    description: '负责产品运营策略制定、数据分析、用户增长等工作',
    requirements: ['本科及以上学历', '数据分析能力', '沟通协调能力', '逻辑思维能力强'],
    salary: '200-300/天',
    duration: '3-6个月',
    matchScore: 0,
    matchReasons: [],
    tags: ['产品运营', '数据分析', '大厂'],
    postedAt: '2025-03-15',
  },
  {
    id: 'int2',
    title: '人力资源实习生',
    company: '阿里巴巴',
    location: '杭州',
    industry: '互联网',
    description: '参与招聘、培训、员工关系管理等人力资源工作',
    requirements: ['人力资源管理相关专业优先', '沟通表达能力强', '有责任心'],
    salary: '150-250/天',
    duration: '3个月以上',
    matchScore: 0,
    matchReasons: [],
    tags: ['人力资源', '招聘', '大厂'],
    postedAt: '2025-03-10',
  },
  {
    id: 'int3',
    title: '市场营销实习生',
    company: '腾讯',
    location: '深圳',
    industry: '互联网',
    description: '参与市场营销活动策划、品牌推广、社交媒体运营',
    requirements: ['市场营销相关专业', '创意思维', '文案能力'],
    salary: '200-300/天',
    duration: '3-6个月',
    matchScore: 0,
    matchReasons: [],
    tags: ['市场营销', '品牌推广', '大厂'],
    postedAt: '2025-03-08',
  },
];
