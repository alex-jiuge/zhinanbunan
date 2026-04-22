// 提示词变量定义
export interface PromptVariable {
  key: string; // 变量名，如 {{model_name}}
  label: string; // 显示名，如 "模型名称"
  type: 'text' | 'select' | 'number' | 'textarea' | 'boolean'; // 变量类型
  defaultValue: string | number | boolean; // 默认值
  required: boolean; // 是否必填
  options?: string[]; // 下拉选项（当 type 为 select 时）
  placeholder?: string; // 占位符
  description?: string; // 变量说明
}

// 提示词版本
export interface PromptVersion {
  id: string;
  promptId: string; // 所属提示词 ID
  version: number; // 版本号
  content: string; // 提示词内容
  variables: PromptVariable[]; // 该版本使用的变量
  changeLog: string; // 更新说明
  createdAt: string;
  createdBy?: string;
  isCurrent: boolean; // 是否为当前版本
}

// 提示词分类
export type PromptCategory = 
  | 'self-exploration' // 自我认知
  | 'city-match' // 城市匹配
  | 'major-analysis' // 专业分析
  | 'jd-parser' // JD 解析
  | 'family-bridge' // 家庭沟通桥
  | 'custom'; // 自定义

// 提示词状态
export type PromptStatus = 'draft' | 'active' | 'archived' | 'testing';

// 提示词模板
export interface PromptTemplate {
  id: string; // 唯一标识
  name: string; // 名称
  category: PromptCategory; // 分类
  status: PromptStatus; // 状态
  description: string; // 描述
  systemPrompt: string; // 系统提示词主体（支持变量占位符 {{variable}}）
  userPrompt?: string; // 用户提示词模板（可选）
  variables: PromptVariable[]; // 变量定义
  currentVersion: number; // 当前版本
  tags: string[]; // 标签
  metadata: {
    model?: string; // 推荐模型
    temperature?: number; // 推荐温度
    maxTokens?: number; // 推荐最大输出
    contextWindow?: number; // 上下文窗口
  };
  usageCount: number; // 使用次数
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

// 提示词 Markdown 文档
export interface PromptDoc {
  id: string;
  promptId: string; // 关联的提示词 ID
  title: string; // 文档标题
  content: string; // Markdown 内容
  sections: {
    overview?: string; // 概述
    usage?: string; // 使用说明
    examples?: string; // 使用示例
    changelog?: string; // 更新记录
  };
  createdAt: string;
  updatedAt: string;
}

// 知识库条目
export interface KnowledgeEntry {
  id: string;
  title: string; // 知识标题
  content: string; // 知识内容
  category: PromptCategory | 'general'; // 分类
  tags: string[]; // 标签
  embeddings?: number[]; // 向量嵌入（预留）
  references: string[]; // 关联的提示词 ID 列表
  createdAt: string;
  updatedAt: string;
}

// 提示词配置
export interface PromptConfig {
  id: string;
  promptId: string; // 关联的提示词 ID
  variables: Record<string, string | number | boolean>; // 变量值映射
  model?: string; // 使用的模型
  temperature?: number;
  maxTokens?: number;
  enabled: boolean; // 是否启用
  environment: 'development' | 'staging' | 'production'; // 环境
  createdAt: string;
  updatedAt: string;
}

// 提示词步骤（用于多步对话）
export interface PromptStep {
  step: number;
  name: string;
  templateId: string; // 使用的提示词模板 ID
  variables: Record<string, string | number | boolean>; // 步骤变量
  condition?: string; // 触发条件（可选）
  suggestedReplies: string[];
  nextStep?: number; // 下一步
}

// 提示词工作流
export interface PromptWorkflow {
  id: string;
  name: string;
  description: string;
  category: PromptCategory;
  steps: PromptStep[];
  config: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// 提示词渲染结果
export interface RenderedPrompt {
  systemPrompt: string;
  userPrompt?: string;
  variables: Record<string, unknown>;
  templateId: string;
  version: number;
}
