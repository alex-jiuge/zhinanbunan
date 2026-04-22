import { PromptTemplate, PromptVersion, PromptDoc, KnowledgeEntry, PromptConfig, PromptWorkflow } from './types';

// localStorage 键名
const STORAGE_KEYS = {
  TEMPLATES: 'prompt-manager:templates',
  VERSIONS: 'prompt-manager:versions',
  DOCS: 'prompt-manager:docs',
  KNOWLEDGE: 'prompt-manager:knowledge',
  CONFIGS: 'prompt-manager:configs',
  WORKFLOWS: 'prompt-manager:workflows',
} as const;

// 通用数据库操作
class LocalStorageDB {
  private get<T>(key: string): T[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch {
      console.warn(`读取 localStorage 失败: ${key}`);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.error('localStorage 存储空间已满');
      }
      throw error;
    }
  }

  // 查找
  findById<T extends { id: string }>(key: string, id: string): T | undefined {
    return this.get<T>(key).find((item) => item.id === id);
  }

  // 查找全部
  findAll<T>(key: string): T[] {
    return this.get<T>(key);
  }

  // 条件查找
  findBy<T>(key: string, predicate: (item: T) => boolean): T[] {
    return this.get<T>(key).filter(predicate);
  }

  // 创建
  create<T extends { id: string }>(key: string, item: T): T {
    const items = this.get<T>(key);
    items.push(item);
    this.set(key, items);
    return item;
  }

  // 更新
  update<T extends { id: string }>(key: string, id: string, updates: Partial<T>): T | undefined {
    const items = this.get<T>(key);
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return undefined;
    items[index] = { ...items[index], ...updates };
    this.set(key, items);
    return items[index];
  }

  // 删除
  delete(key: string, id: string): boolean {
    const items = this.get<Record<string, unknown>>(key);
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.set(key, filtered);
    return true;
  }
}

const db = new LocalStorageDB();

// 提示词模板 CRUD
export const templateDB = {
  list: () => db.findAll<PromptTemplate>(STORAGE_KEYS.TEMPLATES),
  find: (id: string) => db.findById<PromptTemplate>(STORAGE_KEYS.TEMPLATES, id),
  findByCategory: (category: string) =>
    db.findBy<PromptTemplate>(STORAGE_KEYS.TEMPLATES, (t) => t.category === category),
  findByStatus: (status: string) =>
    db.findBy<PromptTemplate>(STORAGE_KEYS.TEMPLATES, (t) => t.status === status),
  create: (template: PromptTemplate) => db.create(STORAGE_KEYS.TEMPLATES, template),
  update: (id: string, updates: Partial<PromptTemplate>) =>
    db.update(STORAGE_KEYS.TEMPLATES, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.TEMPLATES, id),
};

// 版本管理
export const versionDB = {
  list: (promptId: string) =>
    db.findBy<PromptVersion>(STORAGE_KEYS.VERSIONS, (v) => v.promptId === promptId),
  find: (id: string) => db.findById<PromptVersion>(STORAGE_KEYS.VERSIONS, id),
  findCurrent: (promptId: string) =>
    db.findBy<PromptVersion>(STORAGE_KEYS.VERSIONS, (v) => v.promptId === promptId && v.isCurrent)?.[0],
  create: (version: PromptVersion) => db.create(STORAGE_KEYS.VERSIONS, version),
  update: (id: string, updates: Partial<PromptVersion>) =>
    db.update<PromptVersion>(STORAGE_KEYS.VERSIONS, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.VERSIONS, id),
  rollback: (promptId: string, version: number): boolean => {
    const versions = db.findBy<PromptVersion>(STORAGE_KEYS.VERSIONS, (v) => v.promptId === promptId);
    const target = versions.find((v) => v.version === version);
    if (!target) return false;

    versions.forEach((v) => {
      const isCurrent = v.version === version;
      db.update<PromptVersion>(STORAGE_KEYS.VERSIONS, v.id, { isCurrent });
    });
    return true;
  },
};

// 文档管理
export const docDB = {
  list: () => db.findAll<PromptDoc>(STORAGE_KEYS.DOCS),
  findByPromptId: (promptId: string) =>
    db.findBy<PromptDoc>(STORAGE_KEYS.DOCS, (d) => d.promptId === promptId)?.[0],
  create: (doc: PromptDoc) => db.create(STORAGE_KEYS.DOCS, doc),
  update: (id: string, updates: Partial<PromptDoc>) =>
    db.update(STORAGE_KEYS.DOCS, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.DOCS, id),
};

// 知识库管理
export const knowledgeDB = {
  list: () => db.findAll<KnowledgeEntry>(STORAGE_KEYS.KNOWLEDGE),
  findByCategory: (category: string) =>
    db.findBy<KnowledgeEntry>(STORAGE_KEYS.KNOWLEDGE, (k) => k.category === category),
  findByTags: (tags: string[]) =>
    db.findBy<KnowledgeEntry>(STORAGE_KEYS.KNOWLEDGE, (k) =>
      tags.some((tag) => k.tags.includes(tag))
    ),
  search: (query: string) => {
    const entries = db.findAll<KnowledgeEntry>(STORAGE_KEYS.KNOWLEDGE);
    const lowerQuery = query.toLowerCase();
    return entries.filter(
      (e) =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.content.toLowerCase().includes(lowerQuery) ||
        e.tags.some((t) => t.toLowerCase().includes(lowerQuery))
    );
  },
  create: (entry: KnowledgeEntry) => db.create(STORAGE_KEYS.KNOWLEDGE, entry),
  update: (id: string, updates: Partial<KnowledgeEntry>) =>
    db.update(STORAGE_KEYS.KNOWLEDGE, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.KNOWLEDGE, id),
};

// 配置管理
export const configDB = {
  list: () => db.findAll<PromptConfig>(STORAGE_KEYS.CONFIGS),
  findByPromptId: (promptId: string) =>
    db.findBy<PromptConfig>(STORAGE_KEYS.CONFIGS, (c) => c.promptId === promptId),
  findByEnvironment: (env: string) =>
    db.findBy<PromptConfig>(STORAGE_KEYS.CONFIGS, (c) => c.environment === env),
  create: (config: PromptConfig) => db.create(STORAGE_KEYS.CONFIGS, config),
  update: (id: string, updates: Partial<PromptConfig>) =>
    db.update(STORAGE_KEYS.CONFIGS, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.CONFIGS, id),
};

// 工作流管理
export const workflowDB = {
  list: () => db.findAll<PromptWorkflow>(STORAGE_KEYS.WORKFLOWS),
  find: (id: string) => db.findById<PromptWorkflow>(STORAGE_KEYS.WORKFLOWS, id),
  findByCategory: (category: string) =>
    db.findBy<PromptWorkflow>(STORAGE_KEYS.WORKFLOWS, (w) => w.category === category),
  create: (workflow: PromptWorkflow) => db.create(STORAGE_KEYS.WORKFLOWS, workflow),
  update: (id: string, updates: Partial<PromptWorkflow>) =>
    db.update(STORAGE_KEYS.WORKFLOWS, id, updates),
  delete: (id: string) => db.delete(STORAGE_KEYS.WORKFLOWS, id),
};
