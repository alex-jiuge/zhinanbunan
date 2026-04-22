import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

const deepseek = createOpenAICompatible({
  name: 'deepseek',
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
  baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com',
});

export const deepseekModel = deepseek(process.env.DEEPSEEK_MODEL || 'deepseek-chat');

export { deepseek };
