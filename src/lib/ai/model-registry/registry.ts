import type { ModelConfig, FeatureModelBinding } from './types';
import { PRESET_MODELS, DEFAULT_BINDINGS } from './types';
import {
  loadModels,
  saveModels,
  loadBindings,
  saveBindings,
  loadDefaultModelId,
  saveDefaultModelId,
  isInitialized,
  setInitialized,
} from './storage';

export const FEATURE_INFO_MAP: Record<string, { name: string; description: string }> = {
  'self-exploration': { name: '自我认知对话', description: '8步引导式对话，生成用户画像' },
  'city-match': { name: '城市匹配分析', description: '基于用户偏好推荐城市' },
  'family-bridge': { name: '家庭沟通桥', description: '生成给父母的职业说明书' },
  'major-analysis': { name: '专业分析', description: '冷门专业可迁移技能挖掘' },
  'jd-parser': { name: 'JD 智能翻译器', description: '解析招聘描述' },
  'chat-general': { name: '通用对话', description: '通用 AI 对话场景' },
};

export class ModelRegistry {
  static initialize(): void {
    if (isInitialized()) return;

    const existingModels = loadModels();
    if (existingModels.length === 0) {
      const now = new Date().toISOString();
      const presetModels: ModelConfig[] = PRESET_MODELS.map((preset, index) => ({
        ...preset,
        id: `preset_${index}`,
        createdAt: now,
        updatedAt: now,
      }));
      saveModels(presetModels);

      // Set GLM-4-Flash as default
      saveDefaultModelId('preset_0');
    }

    const existingBindings = loadBindings();
    if (existingBindings.length === 0) {
      const defaultBindings: FeatureModelBinding[] = DEFAULT_BINDINGS.map((binding) => {
        const featureInfo = FEATURE_INFO_MAP[binding.featureKey] || { name: binding.featureKey, description: '' };
        return {
          ...binding,
          featureName: featureInfo.name,
          description: featureInfo.description,
        };
      });
      saveBindings(defaultBindings);
    }

    setInitialized(true);
  }

  static getAllConfigs(): ModelConfig[] {
    return loadModels();
  }

  static getConfig(id: string): ModelConfig | undefined {
    return loadModels().find(m => m.id === id);
  }

  static createConfig(config: Omit<ModelConfig, 'id' | 'createdAt' | 'updatedAt'>): ModelConfig {
    const now = new Date().toISOString();
    const newConfig: ModelConfig = {
      ...config,
      id: `model_${Date.now()}`,
      createdAt: now,
      updatedAt: now,
    };
    const models = loadModels();
    models.push(newConfig);
    saveModels(models);
    return newConfig;
  }

  static updateConfig(id: string, updates: Partial<ModelConfig>): ModelConfig | undefined {
    const models = loadModels();
    const index = models.findIndex(m => m.id === id);
    if (index === -1) return undefined;
    models[index] = { ...models[index], ...updates, updatedAt: new Date().toISOString() };
    saveModels(models);
    return models[index];
  }

  static deleteConfig(id: string): boolean {
    const models = loadModels();
    const filtered = models.filter(m => m.id !== id);
    if (filtered.length === models.length) return false;
    saveModels(filtered);
    return true;
  }

  static getModelForFeature(featureKey: string): ModelConfig | undefined {
    const bindings = loadBindings();
    const binding = bindings.find(b => b.featureKey === featureKey);
    if (!binding) {
      const defaultId = loadDefaultModelId();
      if (defaultId) return this.getConfig(defaultId);
      return loadModels()[0];
    }
    return this.getConfig(binding.primaryModelId);
  }

  static getModelChainForFeature(featureKey: string): ModelConfig[] {
    const bindings = loadBindings();
    const binding = bindings.find(b => b.featureKey === featureKey);
    if (!binding) {
      const defaultId = loadDefaultModelId();
      if (defaultId) {
        const defaultModel = this.getConfig(defaultId);
        return defaultModel ? [defaultModel] : [];
      }
      return loadModels().slice(0, 1);
    }
    const models: ModelConfig[] = [];
    const primary = this.getConfig(binding.primaryModelId);
    if (primary) models.push(primary);
    binding.fallbackModelIds.forEach(id => {
      const m = this.getConfig(id);
      if (m) models.push(m);
    });
    return models;
  }

  static setBinding(featureKey: string, primaryModelId: string, fallbackModelIds: string[]): FeatureModelBinding {
    const bindings = loadBindings();
    const index = bindings.findIndex(b => b.featureKey === featureKey);

    const featureInfo = FEATURE_INFO_MAP[featureKey] || { name: featureKey, description: '' };

    const binding: FeatureModelBinding = {
      featureKey,
      featureName: featureInfo.name,
      description: featureInfo.description,
      primaryModelId,
      fallbackModelIds,
    };

    if (index === -1) {
      bindings.push(binding);
    } else {
      bindings[index] = binding;
    }
    saveBindings(bindings);
    return binding;
  }

  static getAllBindings(): FeatureModelBinding[] {
    return loadBindings();
  }

  static setDefaultModelId(id: string): void {
    saveDefaultModelId(id);
  }

  static getDefaultModelId(): string | null {
    return loadDefaultModelId();
  }
}
