export type ActionItemStatus = 'not-started' | 'in-progress' | 'completed';

export interface PathActionItem {
  id: string;
  title: string;
  description: string;
  status: ActionItemStatus;
  dueDate?: string;
  estimatedHours?: number;
}

export interface PathStage {
  id: string;
  name: string;
  description: string;
  timeline: string;
  goals: string[];
  actionItems: PathActionItem[];
}

export interface CareerPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  stages: PathStage[];
  targetRole: string;
  estimatedDuration: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CAREER_PATHS: CareerPath[] = [
  {
    id: 'path1',
    userId: '',
    title: '互联网产品经理路径',
    description: '从入门到胜任产品经理职位的成长路线',
    targetRole: '产品经理',
    estimatedDuration: '12-18 个月',
    stages: [
      {
        id: 'stage1',
        name: '基础学习',
        description: '建立产品思维基础',
        timeline: '第 1-3 个月',
        goals: ['了解产品经理角色', '学习产品思维', '掌握基础工具'],
        actionItems: [
          { id: 'action1', title: '阅读《启示录》', description: '学习现代产品方法论', status: 'not-started', estimatedHours: 8 },
          { id: 'action2', title: '完成产品经理入门课程', description: '系统学习产品知识', status: 'not-started', estimatedHours: 20 },
          { id: 'action3', title: '学习 Axure/Figma', description: '掌握原型设计工具', status: 'not-started', estimatedHours: 10 },
        ],
      },
      {
        id: 'stage2',
        name: '实践项目',
        description: '通过项目积累经验',
        timeline: '第 4-8 个月',
        goals: ['完成 2-3 个产品项目', '积累作品集', '学习数据分析'],
        actionItems: [
          { id: 'action4', title: '设计一个产品原型', description: '从 0 到 1 设计完整产品', status: 'not-started', estimatedHours: 30 },
          { id: 'action5', title: '参与校园产品项目', description: '实战积累经验', status: 'not-started' },
          { id: 'action6', title: '学习 SQL 基础', description: '掌握数据查询技能', status: 'not-started', estimatedHours: 15 },
        ],
      },
      {
        id: 'stage3',
        name: '实习求职',
        description: '进入互联网公司实习',
        timeline: '第 9-12 个月',
        goals: ['获得产品实习 offer', '积累实战经验', '建立行业人脉'],
        actionItems: [
          { id: 'action7', title: '优化简历和作品集', description: '准备求职材料', status: 'not-started', estimatedHours: 5 },
          { id: 'action8', title: '投递实习岗位', description: '积极寻找机会', status: 'not-started' },
          { id: 'action9', title: '准备产品面试', description: '模拟面试练习', status: 'not-started', estimatedHours: 10 },
        ],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
