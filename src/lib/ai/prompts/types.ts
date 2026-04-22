export interface PromptStep {
  step: number;
  name: string;
  systemPrompt: string;
  suggestedReplies: string[];
}

export interface PromptTemplate {
  id: string;
  name: string;
  systemPrompt: string;
  steps?: PromptStep[];
  buildTaskPrompt?: (context: Record<string, unknown>) => string;
}
