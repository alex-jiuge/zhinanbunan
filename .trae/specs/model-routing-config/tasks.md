# Tasks

- [x] Task 1: 创建模型配置类型系统
  - [x] 定义 ModelConfig 接口（id, name, provider, baseUrl, apiKey, modelId, temperature, maxTokens, enabled）
  - [x] 定义 FeatureModelBinding 接口（featureKey, primaryModelId, fallbackModelIds）
  - [x] 定义 ModelUsageRecord 接口（modelId, featureKey, timestamp, status, latencyMs, tokensUsed, errorMessage）
  - [x] 定义 ModelRegistryState 接口（models[], bindings[], records[], defaultModelId）
  - [x] 预置支持的模型列表（GLM-4-Flash, LongCat-Flash-Thinking, 自定义 OpenAI 兼容模型）

- [x] Task 2: 实现 localStorage 模型配置存储层
  - [x] 创建 modelConfigDB 模块（CRUD 操作）
  - [x] 实现配置加密存储（base64 + 盐值）和解密读取
  - [x] 实现使用统计的持久化存储
  - [x] 实现配置的序列化/反序列化

- [x] Task 3: 实现 ModelRegistry 核心管理类
  - [x] 实现模型注册/查询方法
  - [x] 实现功能模块到模型的绑定查询
  - [x] 实现 getModelForFeature(featureKey) 方法
  - [x] 实现 setBinding(featureKey, primaryModelId, fallbackModelIds) 方法
  - [x] 实现 getAllConfigs / getConfig / updateConfig / deleteConfig 方法

- [x] Task 4: 实现模型路由层（ModelRouter）
  - [x] 实现统一调用接口 routeRequest(messages, featureKey, options)
  - [x] 实现优先级逻辑：主模型 → 备选模型 1 → 备选模型 2
  - [x] 实现故障检测和自动切换逻辑
  - [x] 实现调用结果记录到监控日志
  - [x] 实现重试机制（最多 3 次尝试）

- [x] Task 5: 实现模型调用监控
  - [x] 实现 UsageTracker 类，记录每次调用数据
  - [x] 实现 getUsageStats(modelId, timeRange) 方法
  - [x] 实现 getFeatureUsage(featureKey) 方法
  - [x] 实现 getTotalTokenUsage() 方法
  - [x] 实现导出/清空统计数据方法

- [x] Task 6: 修改现有 AI 调用入口
  - [x] 修改 src/lib/ai/generate.ts 中的 generateAIResponse 函数
  - [x] 改为接受 featureKey 参数，内部走模型路由层
  - [x] 保持对外接口兼容（可选 featureKey，默认使用全局默认模型）
  - [x] 更新所有 API route 调用，传入对应的 featureKey

- [x] Task 7: 创建后台模型配置页面
  - [x] 创建 src/app/admin/model-config/page.tsx
  - [x] 实现功能模块列表展示
  - [x] 实现模型选择器下拉
  - [x] 实现 API 密钥、基础 URL、温度等参数表单
  - [x] 实现添加自定义模型功能
  - [x] 实现保存/加载配置
  - [x] 在 Header 中添加"模型配置"入口

- [x] Task 8: 创建模型使用监控面板
  - [x] 在模型配置页面添加"使用统计"标签页
  - [x] 实现调用次数统计展示
  - [x] 实现 token 消耗图表（使用 Recharts）
  - [x] 实现各功能模块使用分布
  - [x] 实现成功率、平均响应时间展示

- [x] Task 9: 创建初始默认配置
  - [x] 实现默认配置初始化逻辑
  - [x] GLM-4-Flash 设为全局默认模型（免费）
  - [x] 为各功能模块设置合理的模型绑定
  - [x] 长文本解析（JD 分析）绑定 LongCat-Flash-Thinking（如有额度）
  - [x] 对话类功能绑定 GLM-4-Flash

# Task Dependencies
- Task 2 depends on Task 1
- Task 3 depends on Task 2
- Task 4 depends on Task 3
- Task 5 depends on Task 4
- Task 6 depends on Task 4
- Task 7 depends on Task 3
- Task 8 depends on Task 5 and Task 7
- Task 9 depends on Task 2

# Parallelization Notes
- Task 1, Task 7 可以并行（类型定义和 UI 开发互不依赖）
- Task 6 的各 API route 修改可以并行进行
