# 对话总结与历史记录管理系统 - 开发计划

## 目标
为"指南不南"实现对话总结与历史记录管理功能，支持对话自动总结、历史记录管理、多窗口合并总结、上下文延续等功能。

---

## 实现步骤

### 第一步：扩展类型系统

**1.1 新增对话总结类型**
```typescript
interface ConversationSummary {
  id: string;
  userId: string;
  conversationId: string;
  title: string;              // 自动生成的对话标题
  content: string;            // 结构化总结内容
  keyQuestions: string[];     // 关键问题
  coreConclusions: string[];  // 核心结论
  importantSteps: string[];   // 重要步骤
  suggestions: string[];      // 后续建议
  featureKey: string;         // 关联的功能模块
  messageCount: number;       // 消息总数
  startTime: string;
  endTime: string;
  createdAt: string;
}

interface ConversationHistory {
  id: string;
  userId: string;
  title: string;
  featureKey: string;
  messages: Message[];
  summary?: ConversationSummary;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;          // 是否为活跃对话
}
```

**1.2 新增对话状态类型**
```typescript
interface DialogContext {
  activeConversationId: string;
  previousConversationId?: string;
  summaryContext?: string;    // 上一轮对话的总结作为上下文
  isNewConversation: boolean;
}
```

---

### 第二步：实现对话存储层

**2.1 扩展 chat-store**
- 添加 `conversations` 数组，存储所有对话历史
- 添加 `conversationSummaries` 数组，存储所有总结记录
- 添加 `activeConversationId` 标识当前对话
- 添加 `previousSummaryContext` 存储上一轮总结

**2.2 localStorage 存储**
- `compass:conversations` - 对话历史记录
- `compass:summaries` - 总结记录
- 支持按 userId 隔离

---

### 第三步：实现 AI 对话总结功能

**3.1 总结 Prompt 模板**
```
你是一个专业的对话总结助手。请对以下对话进行全面分析，生成结构化总结。

## 输出格式
必须返回严格合法的 JSON：

{
  "title": "对话主题标题",
  "keyQuestions": ["用户提出的关键问题1", "关键问题2"],
  "coreConclusions": ["核心结论1", "核心结论2"],
  "importantSteps": ["重要步骤1", "重要步骤2"],
  "suggestions": ["后续建议1", "后续建议2"]
}

## 规则
- 提取对话中最有价值的信息
- 保持客观、准确
- 建议要具体、可执行
- 总字数控制在 500 字以内
```

**3.2 总结生成函数**
```typescript
async function generateConversationSummary(
  messages: Message[],
  featureKey: string
): Promise<ConversationSummary>
```

---

### 第四步：实现对话组件

**4.1 对话总结按钮**
- 在 ChatWindow 底部添加"总结对话"按钮
- 对话结束时自动显示
- 点击后调用 AI 生成总结
- 显示 Loading 状态

**4.2 总结展示卡片**
- 结构化展示：关键问题、核心结论、重要步骤、后续建议
- 支持展开/收起
- 支持复制到剪贴板

---

### 第五步：实现历史记录窗口

**5.1 历史总结列表页面** (`/chat-history`)
- 按时间倒序展示所有总结
- 支持按功能模块筛选
- 支持按时间范围筛选
- 支持搜索（按标题、关键词）

**5.2 总结详情页面**
- 展示完整总结内容
- 显示关联对话信息
- 支持导出为 Markdown

---

### 第六步：实现多窗口合并总结

**6.1 对话选择界面**
- 展示所有历史对话列表
- 支持多选（checkbox）
- 显示每个对话的基本信息（标题、时间、消息数）

**6.2 合并总结功能**
- 选择多个对话后，点击"合并总结"
- AI 对多个对话内容进行综合分析
- 生成跨对话的整合总结

---

### 第七步：实现对话上下文延续

**7.1 新对话自动关联**
- 开启新对话时，检测是否有上一轮对话
- 如果有，加载上一轮总结作为 system prompt 上下文
- 用户可选择"延续上次对话"或"开启全新对话"

**7.2 上下文注入**
```typescript
// 在 generateAIResponse 中
if (previousSummaryContext) {
  systemMessage.content += `\n\n## 上次对话总结\n${previousSummaryContext}`;
}
```

---

### 第八步：创建 API 路由

**8.1 总结生成 API**
- `POST /api/conversations/summarize` - 生成单个对话总结
- `POST /api/conversations/merge-summarize` - 生成多对话合并总结

**8.2 历史记录 API**
- `GET /api/conversations?userId=xxx` - 获取对话历史列表
- `GET /api/conversations/summaries?userId=xxx` - 获取总结记录
- `DELETE /api/conversations/:id` - 删除对话记录

---

### 第九步：UI 集成

**9.1 Header 导航**
- 添加"对话历史"入口

**9.2 ChatWindow 增强**
- 对话结束时显示"总结对话"按钮
- 支持查看当前对话的历史总结
- 支持开启新对话/延续上次对话

---

### 第十步：测试与优化

- 测试总结生成质量
- 测试 localStorage 存储限制处理
- 测试多窗口合并功能
- 优化 AI 调用次数（总结只在需要时生成）

---

## 技术要点

1. **AI 总结只在用户主动触发时生成**，避免不必要的 API 调用
2. **localStorage 容量控制**：对话历史保留最近 50 条，总结保留最近 100 条
3. **上下文延续**：自动携带上一轮总结，AI 回复更连贯
4. **隐私安全**：所有数据存储在本地，不上传服务器
