import { SELF_EXPLORATION_STEPS } from '@/lib/ai/prompts/self-exploration';
import { CITY_MATCH_PROMPT } from '@/lib/ai/prompts/city-match';
import { MAJOR_ANALYSIS_PROMPT } from '@/lib/ai/prompts/major-analysis';
import { JD_PARSER_PROMPT } from '@/lib/ai/prompts/jd-parser';
import { FAMILY_BRIDGE_PROMPT } from '@/lib/ai/prompts/family-bridge';
import { PromptManager } from './manager';
import { PromptVariable } from './types';

// 迁移状态标记
let hasMigrated = false;

export function migrateExistingPrompts(): void {
  if (typeof window === 'undefined') return;
  if (hasMigrated) return;

  const migrationFlag = localStorage.getItem('prompt-migration-done');
  if (migrationFlag) {
    hasMigrated = true;
    return;
  }

  try {
    migrateSelfExploration();
    migrateCityMatch();
    migrateMajorAnalysis();
    migrateJDParser();
    migrateFamilyBridge();
    migrateKnowledge();

    localStorage.setItem('prompt-migration-done', 'true');
    hasMigrated = true;
    console.log('提示词迁移完成');
  } catch (error) {
    console.error('提示词迁移失败:', error);
  }
}

function migrateSelfExploration(): void {
  const steps = SELF_EXPLORATION_STEPS;
  steps.forEach((step) => {
    const variables: PromptVariable[] = [
      {
        key: 'tone',
        label: '语气',
        type: 'select',
        defaultValue: '亲切自然',
        required: false,
        options: ['亲切自然', '正式', '轻松', '专业'],
        description: 'AI 对话的语气风格',
      },
      {
        key: 'max_length',
        label: '回复长度',
        type: 'number',
        defaultValue: 100,
        required: false,
        description: 'AI 回复的最大字数',
      },
    ];

    PromptManager.createTemplate({
      name: `自我认知 - 第${step.step}步: ${step.name}`,
      category: 'self-exploration',
      description: `自我认知引擎第 ${step.step} 步：${step.name}`,
      systemPrompt: step.systemPrompt,
      variables,
      tags: ['self-exploration', `step-${step.step}`, step.name],
      metadata: {
        temperature: 0.8,
        maxTokens: 300,
      },
    });
  });
}

function migrateCityMatch(): void {
  const variables: PromptVariable[] = [
    {
      key: 'user_industry',
      label: '目标行业',
      type: 'text',
      defaultValue: '互联网/科技',
      required: true,
      description: '用户的目标行业',
    },
    {
      key: 'target_cities',
      label: '目标城市列表',
      type: 'text',
      defaultValue: '北京, 上海, 杭州',
      required: true,
      description: '用户感兴趣的城市列表',
    },
    {
      key: 'lifestyle',
      label: '生活节奏',
      type: 'select',
      defaultValue: '中等',
      required: false,
      options: ['快节奏', '中等', '慢节奏'],
    },
    {
      key: 'budget',
      label: '预算水平',
      type: 'select',
      defaultValue: '中等',
      required: false,
      options: ['低', '中等', '高'],
    },
    {
      key: 'user_profile_summary',
      label: '用户画像摘要',
      type: 'textarea',
      defaultValue: '',
      required: false,
      description: '用户自我认知画像摘要信息',
    },
  ];

  PromptManager.createTemplate({
    name: '城市匹配分析',
    category: 'city-match',
    description: '根据用户偏好分析并推荐最适合的城市',
    systemPrompt: CITY_MATCH_PROMPT.systemPrompt,
    variables,
    tags: ['city-match', 'recommendation', 'analysis'],
    metadata: {
      temperature: 0.7,
      maxTokens: 2000,
    },
  });
}

function migrateMajorAnalysis(): void {
  const variables: PromptVariable[] = [
    {
      key: 'major_name',
      label: '专业名称',
      type: 'text',
      defaultValue: '',
      required: true,
    },
    {
      key: 'grade',
      label: '年级',
      type: 'select',
      defaultValue: '大三',
      required: false,
      options: ['大一', '大二', '大三', '大四'],
    },
    {
      key: 'concerns',
      label: '困惑描述',
      type: 'textarea',
      defaultValue: '',
      required: false,
    },
  ];

  PromptManager.createTemplate({
    name: '专业分析',
    category: 'major-analysis',
    description: '分析专业背景，挖掘可迁移技能，推荐职业路径',
    systemPrompt: MAJOR_ANALYSIS_PROMPT.systemPrompt,
    variables,
    tags: ['major-analysis', 'career', 'skills'],
    metadata: {
      temperature: 0.7,
      maxTokens: 2000,
    },
  });
}

function migrateJDParser(): void {
  const variables: PromptVariable[] = [
    {
      key: 'jd_text',
      label: 'JD 内容',
      type: 'textarea',
      defaultValue: '',
      required: true,
    },
    {
      key: 'target_role',
      label: '目标岗位',
      type: 'text',
      defaultValue: '',
      required: false,
    },
  ];

  PromptManager.createTemplate({
    name: 'JD 智能翻译器',
    category: 'jd-parser',
    description: '深度解析招聘描述，翻译成求职者能理解的内容',
    systemPrompt: JD_PARSER_PROMPT.systemPrompt,
    variables,
    tags: ['jd-parser', 'career', 'analysis'],
    metadata: {
      temperature: 0.6,
      maxTokens: 2000,
    },
  });
}

function migrateFamilyBridge(): void {
  const variables: PromptVariable[] = [
    {
      key: 'target_career',
      label: '目标职业',
      type: 'text',
      defaultValue: '',
      required: true,
    },
    {
      key: 'target_city',
      label: '目标城市',
      type: 'text',
      defaultValue: '',
      required: true,
    },
    {
      key: 'parent_concerns',
      label: '父母担忧列表',
      type: 'textarea',
      defaultValue: '',
      required: true,
    },
    {
      key: 'child_arguments',
      label: '孩子想法',
      type: 'textarea',
      defaultValue: '',
      required: false,
    },
  ];

  PromptManager.createTemplate({
    name: '家庭沟通桥',
    category: 'family-bridge',
    description: '生成给父母看的职业说明书和沟通指南',
    systemPrompt: FAMILY_BRIDGE_PROMPT.systemPrompt,
    variables,
    tags: ['family-bridge', 'communication', 'parents'],
    metadata: {
      temperature: 0.7,
      maxTokens: 2000,
    },
  });
}

function migrateKnowledge(): void {
  PromptManager.addKnowledge({
    title: '如何编写高质量的提示词',
    content: `## 高质量提示词编写指南

### 基本原则
1. 明确角色定义：告诉 AI 它是什么角色
2. 清晰的输出格式：使用 JSON schema 或明确的格式说明
3. 行为准则：列出 AI 应该遵守的规则
4. 示例驱动：提供具体的输入输出示例

### 变量使用
- 使用 {{variable}} 语法
- 为每个变量提供默认值
- 必填变量需要有清晰的说明

### 版本管理
- 每次修改提示词都创建新版本
- 记录详细的 change log
- 定期审查和归档过时版本`,
    category: 'general',
    tags: ['提示词工程', '最佳实践', '编写指南'],
    references: [],
  });

  PromptManager.addKnowledge({
    title: '自我认知引擎设计原理',
    content: `## 自我认知引擎

### 设计思路
8 步引导式对话，逐步深入了解用户：
1. 破冰 - 建立信任
2. 兴趣探索 - 发现内在动力
3. 成就感来源 - 找到价值锚点
4. 性格特质 - 了解行为模式
5. 能力自评 - 评估技能水平
6. 价值观排序 - 确定优先级
7. 生活方式偏好 - 了解理想状态
8. 综合画像确认 - 总结并反馈

### 关键设计点
- 每次只问一个问题
- 回复控制在 100 字以内
- 不说教，不给建议
- 提供快捷回复选项`,
    category: 'self-exploration',
    tags: ['自我认知', '对话设计', '心理学'],
    references: [],
  });

  PromptManager.addKnowledge({
    title: '城市匹配算法说明',
    content: `## 城市匹配分析框架

### 评分维度
1. 产业匹配 (0-10)：城市产业与用户行业意向的匹配度
2. 生活成本 (0-10)：预算范围内的生活可行性
3. 发展潜力 (0-10)：经济增长、人才政策、产业趋势
4. 生活品质 (0-10)：文化氛围、环境质量、便利性
5. 社交环境 (0-10)：年轻人比例、社交活动

### 数据参考
- 薪资数据参考 2025-2026 年实际水平
- 租金数据考虑合租和整租
- 人才政策以各地政府官方发布为准`,
    category: 'city-match',
    tags: ['城市分析', '评分模型', '数据参考'],
    references: [],
  });
}
