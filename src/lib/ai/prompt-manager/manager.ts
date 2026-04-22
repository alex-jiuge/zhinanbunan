import { nanoid } from 'nanoid';
import { PromptTemplate, PromptVariable, PromptVersion, PromptDoc, KnowledgeEntry, PromptConfig } from './types';
import { renderPromptTemplate, validateVariables, mergeVariables } from './template-engine';
import { templateDB, versionDB, docDB, knowledgeDB, configDB } from './database';

// 提示词管理服务
export class PromptManager {
  // ====== 模板 CRUD ======

  static createTemplate(params: {
    name: string;
    category: PromptTemplate['category'];
    description: string;
    systemPrompt: string;
    userPrompt?: string;
    variables: PromptVariable[];
    tags?: string[];
    metadata?: PromptTemplate['metadata'];
  }): PromptTemplate {
    const now = new Date().toISOString();
    const template: PromptTemplate = {
      id: `pt_${nanoid()}`,
      name: params.name,
      category: params.category,
      status: 'draft',
      description: params.description,
      systemPrompt: params.systemPrompt,
      userPrompt: params.userPrompt,
      variables: params.variables,
      currentVersion: 1,
      tags: params.tags || [],
      metadata: params.metadata || {},
      usageCount: 0,
      createdAt: now,
      updatedAt: now,
    };

    templateDB.create(template);

    // 创建初始版本
    this.createVersion(template.id, template.systemPrompt, params.variables, '初始版本');

    return template;
  }

  static updateTemplate(id: string, updates: Partial<PromptTemplate>): PromptTemplate | undefined {
    const existing = templateDB.find(id);
    if (!existing) return undefined;

    // 如果更新了提示词内容，创建新版本
    if (updates.systemPrompt && updates.systemPrompt !== existing.systemPrompt) {
      existing.currentVersion += 1;
      this.createVersion(
        id,
        updates.systemPrompt,
        updates.variables || existing.variables,
        '更新提示词内容'
      );
    }

    return templateDB.update(id, {
      ...updates,
      updatedAt: new Date().toISOString(),
    })!;
  }

  static deleteTemplate(id: string): boolean {
    // 删除关联数据
    versionDB.list(id).forEach((v) => versionDB.delete(v.id));
    const doc = docDB.findByPromptId(id);
    if (doc) docDB.delete(doc.id);

    return templateDB.delete(id);
  }

  static getTemplate(id: string): PromptTemplate | undefined {
    return templateDB.find(id);
  }

  static listTemplates(filter?: { category?: string; status?: string; tag?: string }): PromptTemplate[] {
    let templates = templateDB.list();

    if (filter?.category) {
      templates = templates.filter((t) => t.category === filter.category);
    }
    if (filter?.status) {
      templates = templates.filter((t) => t.status === filter.status);
    }
    if (filter?.tag) {
      templates = templates.filter((t) => t.tags.includes(filter.tag!));
    }

    return templates;
  }

  // ====== 版本控制 ======

  static createVersion(
    promptId: string,
    content: string,
    variables: PromptVariable[],
    changeLog: string
  ): PromptVersion {
    const existingVersions = versionDB.list(promptId);
    const nextVersion = existingVersions.length + 1;
    const template = templateDB.find(promptId);

    // 将旧版本标记为非当前
    existingVersions.forEach((v) => {
      versionDB.update(v.id, { isCurrent: false });
    });

    const version: PromptVersion = {
      id: `pv_${nanoid()}`,
      promptId,
      version: nextVersion,
      content,
      variables,
      changeLog,
      createdAt: new Date().toISOString(),
      isCurrent: true,
    };

    versionDB.create(version);

    // 更新模板当前版本号和提示词内容
    if (template) {
      templateDB.update(promptId, {
        systemPrompt: content,
        variables,
        currentVersion: nextVersion,
        updatedAt: new Date().toISOString(),
      });
    }

    return version;
  }

  static rollbackVersion(promptId: string, version: number): boolean {
    const success = versionDB.rollback(promptId, version);
    if (!success) return false;

    const currentVersion = versionDB.list(promptId).find((v) => v.version === version && v.isCurrent);
    if (!currentVersion) return false;

    const template = templateDB.find(promptId);
    if (!template) return false;

    templateDB.update(promptId, {
      systemPrompt: currentVersion.content,
      variables: currentVersion.variables,
      currentVersion: version,
      updatedAt: new Date().toISOString(),
    });

    return true;
  }

  static getVersionHistory(promptId: string): PromptVersion[] {
    return versionDB.list(promptId).sort((a, b) => b.version - a.version);
  }

  // ====== 渲染提示词 ======

  static renderPrompt(
    templateId: string,
    variables: Record<string, string | number | boolean>
  ): ReturnType<typeof renderPromptTemplate> | null {
    const template = templateDB.find(templateId);
    if (!template || template.status === 'archived') return null;

    // 合并默认变量
    const merged = mergeVariables(template, variables);

    // 验证变量完整性
    const validation = validateVariables(template.systemPrompt, template.variables);
    if (validation.missing.length > 0) {
      console.warn(`提示词 "${template.name}" 缺少变量: ${validation.missing.join(', ')}`);
    }

    const rendered = renderPromptTemplate(template, merged);

    // 更新使用次数
    templateDB.update(templateId, { usageCount: template.usageCount + 1 });

    return rendered;
  }

  // ====== 文档管理 ======

  static createDoc(params: {
    promptId: string;
    title: string;
    content: string;
    sections?: PromptDoc['sections'];
  }): PromptDoc {
    const now = new Date().toISOString();
    const doc: PromptDoc = {
      id: `pd_${nanoid()}`,
      promptId: params.promptId,
      title: params.title,
      content: params.content,
      sections: params.sections || {},
      createdAt: now,
      updatedAt: now,
    };

    docDB.create(doc);
    return doc;
  }

  static updateDoc(id: string, updates: Partial<PromptDoc>): PromptDoc | undefined {
    return docDB.update(id, { ...updates, updatedAt: new Date().toISOString() });
  }

  static getDoc(promptId: string): PromptDoc | undefined {
    return docDB.findByPromptId(promptId);
  }

  // ====== 知识库管理 ======

  static addKnowledge(params: {
    title: string;
    content: string;
    category: KnowledgeEntry['category'];
    tags: string[];
    references: string[];
  }): KnowledgeEntry {
    const now = new Date().toISOString();
    const entry: KnowledgeEntry = {
      id: `pk_${nanoid()}`,
      title: params.title,
      content: params.content,
      category: params.category,
      tags: params.tags,
      references: params.references,
      createdAt: now,
      updatedAt: now,
    };

    knowledgeDB.create(entry);
    return entry;
  }

  static searchKnowledge(query: string): KnowledgeEntry[] {
    return knowledgeDB.search(query);
  }

  static getKnowledgeByCategory(category: string): KnowledgeEntry[] {
    return knowledgeDB.findByCategory(category);
  }

  // ====== 配置管理 ======

  static createConfig(params: {
    promptId: string;
    variables: Record<string, string | number | boolean>;
    environment?: PromptConfig['environment'];
    model?: string;
    temperature?: number;
    maxTokens?: number;
  }): PromptConfig {
    const now = new Date().toISOString();
    const config: PromptConfig = {
      id: `pc_${nanoid()}`,
      promptId: params.promptId,
      variables: params.variables,
      model: params.model,
      temperature: params.temperature,
      maxTokens: params.maxTokens,
      enabled: true,
      environment: params.environment || 'development',
      createdAt: now,
      updatedAt: now,
    };

    configDB.create(config);
    return config;
  }

  static updateConfig(id: string, updates: Partial<PromptConfig>): PromptConfig | undefined {
    return configDB.update(id, { ...updates, updatedAt: new Date().toISOString() });
  }

  static getConfig(promptId: string, environment: string): PromptConfig | undefined {
    return configDB.findByPromptId(promptId).find((c) => c.environment === environment);
  }
}

export { PromptManager as default };
