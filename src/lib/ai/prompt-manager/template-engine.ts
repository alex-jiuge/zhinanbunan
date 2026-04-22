import { PromptTemplate, PromptVariable, RenderedPrompt } from './types';

// 从文本中提取所有变量占位符
export function extractVariables(template: string): string[] {
  const regex = /\{\{(\w+)\}\}/g;
  const variables: string[] = [];
  let match;
  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  return variables;
}

// 验证变量是否完整定义
export function validateVariables(
  template: string,
  definedVars: PromptVariable[]
): { missing: string[]; unused: string[] } {
  const usedVars = extractVariables(template);
  const definedKeys = definedVars.map((v) => v.key);
  
  const missing = usedVars.filter((v) => !definedKeys.includes(v));
  const unused = definedKeys.filter((k) => !usedVars.includes(k));
  
  return { missing, unused };
}

// 渲染提示词（替换变量）
export function renderPrompt(
  template: string,
  variables: Record<string, string | number | boolean>
): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = variables[key];
    if (value === undefined) {
      console.warn(`提示词变量 "${key}" 未提供值，保留占位符`);
      return match;
    }
    return String(value);
  });
}

// 完整渲染提示词模板
export function renderPromptTemplate(
  template: PromptTemplate,
  variables: Record<string, string | number | boolean>
): RenderedPrompt {
  const renderedSystem = renderPrompt(template.systemPrompt, variables);
  const renderedUser = template.userPrompt
    ? renderPrompt(template.userPrompt, variables)
    : undefined;

  return {
    systemPrompt: renderedSystem,
    userPrompt: renderedUser,
    variables,
    templateId: template.id,
    version: template.currentVersion,
  };
}

// 构建默认变量值
export function buildDefaultVariables(
  variables: PromptVariable[]
): Record<string, string | number | boolean> {
  const defaults: Record<string, string | number | boolean> = {};
  variables.forEach((v) => {
    defaults[v.key] = v.defaultValue;
  });
  return defaults;
}

// 合并变量（默认值 + 用户值）
export function mergeVariables(
  template: PromptTemplate,
  userVariables: Record<string, string | number | boolean>
): Record<string, string | number | boolean> {
  const defaults = buildDefaultVariables(template.variables);
  return { ...defaults, ...userVariables };
}
