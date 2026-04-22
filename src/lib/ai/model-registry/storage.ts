import type { ModelConfig, FeatureModelBinding, ModelUsageRecord } from './types';

const STORAGE_KEYS = {
  MODELS: 'model-registry:models',
  BINDINGS: 'model-registry:bindings',
  DEFAULT_MODEL: 'model-registry:default-model',
  USAGE_RECORDS: 'model-registry:usage-records',
  INITIALIZED: 'model-registry:initialized',
} as const;

const SALT = 'compass-mvp-2026';

function encrypt(text: string): string {
  return btoa(`${SALT}:${text}`);
}

export function decrypt(encrypted: string): string {
  const decoded = atob(encrypted);
  const parts = decoded.split(':');
  return parts.slice(1).join(':');
}

function isSSR(): boolean {
  return typeof window === 'undefined';
}

export function saveModels(models: ModelConfig[]): void {
  if (isSSR()) return;

  const modelsToSave = models.map((model) => ({
    ...model,
    apiKey: encrypt(model.apiKey),
  }));

  try {
    localStorage.setItem(STORAGE_KEYS.MODELS, JSON.stringify(modelsToSave));
  } catch (error) {
    console.error('Failed to save models to localStorage:', error);
  }
}

export function loadModels(): ModelConfig[] {
  if (isSSR()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MODELS);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ModelConfig[];

    return parsed.map((model) => ({
      ...model,
      apiKey: decrypt(model.apiKey),
    }));
  } catch (error) {
    console.error('Failed to load models from localStorage:', error);
    return [];
  }
}

export function saveBindings(bindings: FeatureModelBinding[]): void {
  if (isSSR()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.BINDINGS, JSON.stringify(bindings));
  } catch (error) {
    console.error('Failed to save bindings to localStorage:', error);
  }
}

export function loadBindings(): FeatureModelBinding[] {
  if (isSSR()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BINDINGS);
    if (!raw) return [];

    return JSON.parse(raw) as FeatureModelBinding[];
  } catch (error) {
    console.error('Failed to load bindings from localStorage:', error);
    return [];
  }
}

export function saveDefaultModelId(id: string): void {
  if (isSSR()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_MODEL, id);
  } catch (error) {
    console.error('Failed to save default model ID to localStorage:', error);
  }
}

export function loadDefaultModelId(): string | null {
  if (isSSR()) return null;

  try {
    return localStorage.getItem(STORAGE_KEYS.DEFAULT_MODEL);
  } catch (error) {
    console.error('Failed to load default model ID from localStorage:', error);
    return null;
  }
}

export function saveUsageRecords(records: ModelUsageRecord[]): void {
  if (isSSR()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.USAGE_RECORDS, JSON.stringify(records));
  } catch (error) {
    console.error('Failed to save usage records to localStorage:', error);
  }
}

export function loadUsageRecords(): ModelUsageRecord[] {
  if (isSSR()) return [];

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USAGE_RECORDS);
    if (!raw) return [];

    return JSON.parse(raw) as ModelUsageRecord[];
  } catch (error) {
    console.error('Failed to load usage records from localStorage:', error);
    return [];
  }
}

export function addUsageRecord(record: ModelUsageRecord): void {
  if (isSSR()) return;

  try {
    const records = loadUsageRecords();
    records.push(record);
    saveUsageRecords(records);
  } catch (error) {
    console.error('Failed to add usage record:', error);
  }
}

export function setInitialized(value: boolean): void {
  if (isSSR()) return;

  try {
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, String(value));
  } catch (error) {
    console.error('Failed to set initialized flag:', error);
  }
}

export function isInitialized(): boolean {
  if (isSSR()) return false;

  try {
    const value = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    return value === 'true';
  } catch (error) {
    console.error('Failed to check initialized status:', error);
    return false;
  }
}
