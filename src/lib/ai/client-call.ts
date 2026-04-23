/**
 * 客户端 AI 调用工具
 * 用于纯静态站点（Cloudflare Pages）直接调用 AI 模型 API
 */

export interface ClientMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ClientCallOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

/**
 * 直接调用智谱AI API（客户端模式）
 * @param messages 消息数组
 * @param systemPrompt 系统提示词
 * @param options 调用选项
 * @returns AI 响应文本
 */
export async function callZhipuAI(
  messages: ClientMessage[],
  systemPrompt?: string,
  options?: ClientCallOptions
): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/';
  const model = process.env.NEXT_PUBLIC_AI_MODEL || 'glm-4-flash-250414';

  if (!apiKey) {
    throw new Error('AI_API_KEY 未配置，请设置环境变量 NEXT_PUBLIC_AI_API_KEY');
  }

  const allMessages = systemPrompt
    ? [{ role: 'system' as const, content: systemPrompt }, ...messages]
    : messages;

  const response = await fetch(`${baseUrl}chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: allMessages.map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: options?.stream ?? false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API 调用失败 (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

/**
 * 调用智谱AI API（流式输出）
 * @param messages 消息数组
 * @param systemPrompt 系统提示词
 * @param onChunk 接收每个文本块的回调
 * @param options 调用选项
 */
export async function callZhipuAIStream(
  messages: ClientMessage[],
  systemPrompt: string,
  onChunk: (chunk: string) => void,
  options?: ClientCallOptions
): Promise<void> {
  const apiKey = process.env.NEXT_PUBLIC_AI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_AI_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4/';
  const model = process.env.NEXT_PUBLIC_AI_MODEL || 'glm-4-flash-250414';

  if (!apiKey) {
    throw new Error('AI_API_KEY 未配置，请设置环境变量 NEXT_PUBLIC_AI_API_KEY');
  }

  const allMessages = [
    { role: 'system' as const, content: systemPrompt },
    ...messages,
  ];

  const response = await fetch(`${baseUrl}chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: allMessages.map(m => ({ role: m.role, content: m.content })),
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 4096,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI API 调用失败 (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error('响应体为空');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine === 'data: [DONE]') continue;

        if (trimmedLine.startsWith('data: ')) {
          try {
            const jsonStr = trimmedLine.slice(6);
            const data = JSON.parse(jsonStr);
            const content = data.choices?.[0]?.delta?.content;
            if (content) {
              onChunk(content);
            }
          } catch {
            // Ignore parse errors for malformed chunks
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}
