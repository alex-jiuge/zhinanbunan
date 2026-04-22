# AI 模型路由与配置管理系统 Spec

## Why
项目当前仅支持单一 AI 模型配置。鉴于 LongCat-Flash-Thinking 提供每日 50 万 tokens 免费额度，GLM-4-Flash 官方永久免费，需要实现模型差异化调用策略，充分利用各模型免费额度，同时确保服务的稳定性和可扩展性。

## What Changes
- 新增模型配置管理系统（ModelRegistry），支持多模型注册、选择、切换
- 新增后台模型配置界面，支持管理员为各 AI 功能模块独立配置模型和 API 密钥
- 新增模型路由层，实现优先级逻辑和自动故障切换
- 新增模型调用监控，记录调用次数、token 消耗、响应状态
- 修改现有 AI 调用入口，统一走模型路由层
- 新增模型配置加密存储机制
- 预留模型扩展接口

## Impact
- 新增能力：模型路由、配置管理、使用监控
- 新增文件：`src/lib/ai/model-registry/` 完整模块、`src/app/admin/model-config/` 管理页面
- 修改文件：`src/lib/ai/generate.ts`（统一入口）、各 API route（适配新接口）
- 数据存储：localStorage 扩展（模型配置、使用统计）
- 无破坏性变更：现有功能保持兼容

## ADDED Requirements

### Requirement: 模型配置管理
系统 SHALL 提供模型注册、配置、查询能力，支持按功能模块绑定特定模型。

#### Scenario: 配置模型
- **WHEN** 管理员在后台配置页面为"自我认知对话"模块选择 GLM-4-Flash
- **THEN** 系统保存配置到 localStorage，包含模型类型、API 密钥、基础 URL、温度等参数
- **AND** API 密钥进行简单加密存储（base64 + 自定义盐值，MVP 级别防护）

#### Scenario: 查询功能模块的模型
- **WHEN** 业务代码调用 `getModelForFeature('self-exploration')`
- **THEN** 系统返回该功能模块当前配置的模型信息
- **AND** 如果该模块未配置，返回全局默认模型

### Requirement: 模型路由与故障切换
系统 SHALL 实现模型调用的统一路由，支持优先级排序和自动故障切换。

#### Scenario: 正常调用
- **WHEN** 业务代码发起 AI 对话请求
- **THEN** 系统根据功能模块配置获取目标模型
- **AND** 使用对应模型的 API 配置发起调用
- **AND** 返回响应

#### Scenario: 模型故障自动切换
- **WHEN** 主模型（GLM-4-Flash）调用失败（网络错误、额度超限、服务异常）
- **THEN** 系统自动切换至备选模型列表中的下一个可用模型
- **AND** 重试调用，最多尝试 2 次备选
- **AND** 记录切换事件到监控日志

### Requirement: 模型调用监控
系统 SHALL 记录各模型的使用数据，用于优化配置。

#### Scenario: 记录调用数据
- **WHEN** 一次 AI 调用完成
- **THEN** 系统记录：模型名称、功能模块、调用时间、响应状态、耗时、token 用量
- **AND** 数据持久化到 localStorage

#### Scenario: 查看使用统计
- **WHEN** 管理员查看模型使用统计
- **THEN** 系统展示各模型的调用次数、总 token 消耗、成功率、平均响应时间

### Requirement: 后台模型配置界面
系统 SHALL 提供可视化的模型配置管理界面。

#### Scenario: 配置模型参数
- **WHEN** 管理员访问 `/admin/model-config` 页面
- **THEN** 系统展示所有 AI 功能模块列表
- **AND** 每个模块可独立选择模型、填写 API 密钥、设置基础 URL 和温度
- **AND** 支持添加自定义模型

#### Scenario: 查看监控面板
- **WHEN** 管理员点击"使用统计"标签
- **THEN** 系统展示各模型调用次数、token 消耗图表
- **AND** 显示各功能模块的使用分布

### Requirement: 模型扩展接口
系统 SHALL 提供清晰的模型扩展接口，支持未来无缝集成新模型。

#### Scenario: 添加新模型
- **WHEN** 开发者需要集成新的 AI 模型
- **THEN** 只需在模型注册表中添加配置项（名称、base URL、API 格式）
- **AND** 无需修改业务层代码

## MODIFIED Requirements

### Requirement: AI 对话基础设施
原系统直接使用 DeepSeek 配置调用 AI。现改为通过模型路由层统一调用，业务代码无需关心具体模型实现。

**Migration**: 修改 `generateAIResponse` 函数，内部走模型路由层，对外接口保持不变。

### Requirement: AI 分析接口
所有分析类 API route（城市匹配、专业分析、JD 解析、家庭沟通桥）原直接使用 generateAIResponse。现改为通过模型路由层调用，支持按功能模块使用不同模型。

**Migration**: 各 route 文件传入功能模块标识（如 'city-match'），由路由层决定具体模型。
