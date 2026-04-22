// 模型提供商类型
export type ModelProvider = 'zhipu' | 'volcengine' | 'longcat' | 'baidu' | 'cloudflare' | 'custom';

// 模型配置
export interface ModelConfig {
  id: string;
  name: string;
  provider: ModelProvider;
  baseUrl: string;
  apiKey: string; // 加密存储
  modelId: string;
  temperature: number;
  maxTokens: number;
  maxContextLength: number;
  enabled: boolean;
  priority: number; // 优先级，数字越小优先级越高
  createdAt: string;
  updatedAt: string;
}

// 功能模块模型绑定
export interface FeatureModelBinding {
  featureKey: string;
  featureName: string;
  description: string;
  primaryModelId: string;
  fallbackModelIds: string[];
}

// 模型使用记录
export interface ModelUsageRecord {
  id: string;
  modelId: string;
  modelName: string;
  featureKey: string;
  timestamp: string;
  status: 'success' | 'error' | 'timeout' | 'fallback';
  latencyMs: number;
  tokensUsed: number;
  errorMessage?: string;
  fallbackFrom?: string; // 如果是从其他模型切换过来
}

// 模型注册表状态
export interface ModelRegistryState {
  models: ModelConfig[];
  bindings: FeatureModelBinding[];
  defaultModelId: string;
  isInitialized: boolean;
}

// 功能模块枚举
export const FEATURE_KEYS = [
  'self-exploration',
  'city-match',
  'family-bridge',
  'major-analysis',
  'jd-parser',
  'chat-general',
] as const;

export type FeatureKey = typeof FEATURE_KEYS[number];

// 预置模型配置模板
export const PRESET_MODELS: Omit<ModelConfig, 'id' | 'createdAt' | 'updatedAt'>[] = [
  {
    name: 'GLM-4-Flash-250414',
    provider: 'zhipu',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4/',
    apiKey: '',
    modelId: 'glm-4-flash-250414',
    temperature: 0.7,
    maxTokens: 4096,
    maxContextLength: 200000,
    enabled: true,
    priority: 1,
  },
  {
    name: 'Doubao-flash',
    provider: 'volcengine',
    baseUrl: 'https://ark.cn-beijing.volces.com/api/v3/',
    apiKey: '',
    modelId: 'doubao-flash',
    temperature: 0.7,
    maxTokens: 4096,
    maxContextLength: 128000,
    enabled: true,
    priority: 2,
  },
  {
    name: 'LongCat-Flash-Thinking',
    provider: 'longcat',
    baseUrl: 'https://api.longcat.chat/openai/v1',
    apiKey: '',
    modelId: 'longcat-flash-thinking',
    temperature: 0.7,
    maxTokens: 8192,
    maxContextLength: 128000,
    enabled: true,
    priority: 3,
  },
  {
    name: 'ERNIE-Speed-128K',
    provider: 'baidu',
    baseUrl: 'https://qianfan.baidubce.com/v2/',
    apiKey: '',
    modelId: 'ernie-speed-128k',
    temperature: 0.7,
    maxTokens: 4096,
    maxContextLength: 128000,
    enabled: false,
    priority: 4,
  },
  {
    name: 'Llama-3-8B',
    provider: 'cloudflare',
    baseUrl: 'https://ai.cloudflare.com/api/',
    apiKey: '',
    modelId: '@cf/meta/llama-3-8b-instruct',
    temperature: 0.7,
    maxTokens: 2048,
    maxContextLength: 8192,
    enabled: false,
    priority: 5,
  },
];

// 默认功能模块绑定
export const DEFAULT_BINDINGS: Omit<FeatureModelBinding, 'featureName' | 'description'>[] = [
  { featureKey: 'self-exploration', primaryModelId: 'preset:glm-4-flash', fallbackModelIds: [] },
  { featureKey: 'city-match', primaryModelId: 'preset:glm-4-flash', fallbackModelIds: [] },
  { featureKey: 'family-bridge', primaryModelId: 'preset:glm-4-flash', fallbackModelIds: [] },
  { featureKey: 'major-analysis', primaryModelId: 'preset:glm-4-flash', fallbackModelIds: [] },
  { featureKey: 'jd-parser', primaryModelId: 'preset:longcat-flash-thinking', fallbackModelIds: ['preset:glm-4-flash'] },
  { featureKey: 'chat-general', primaryModelId: 'preset:glm-4-flash', fallbackModelIds: [] },
];
