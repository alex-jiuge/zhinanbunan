# 剩余任务详细开发计划

## Phase A: 移动端适配优化（优先级：高）

- [x] Task A1: 优化首页移动端布局
  - [x] SubTask A1.1: 修改首页 Hero 区域移动端字体大小（text-3xl → text-2xl on mobile）
  - [x] SubTask A1.2: 优化功能卡片网格布局（1列 on mobile, 2列 on tablet, 3列 on desktop）
  - [x] SubTask A1.3: 调整按钮触控区域（最小 h-11 w-full on mobile）
  - [x] SubTask A1.4: 优化统计数据展示移动端布局（1列 on mobile, 2列 on tablet, 4列 on desktop）
  - [x] SubTask A1.5: 测试首页移动端渲染正确性

- [x] Task A2: 优化聊天界面移动端体验
  - [x] SubTask A2.1: 消息输入框固定在底部（sticky bottom-0）
  - [x] SubTask A2.2: 消息区域自适应高度（flex-1 min-h-0）
  - [x] SubTask A2.3: 优化移动端消息气泡宽度（max-w-[85%] on mobile）
  - [x] SubTask A2.4: 移动端键盘弹出时布局稳定（避免内容跳动）
  - [x] SubTask A2.5: 测试聊天界面移动端全流程

- [x] Task A3: 添加移动端侧边栏导航
  - [x] SubTask A3.1: 创建 MobileSidebar 组件（Drawer 样式）
  - [x] SubTask A3.2: 实现侧边栏打开/关闭动画（slide-in-from-left）
  - [x] SubTask A3.3: 添加导航项和当前路由高亮
  - [x] SubTask A3.4: 添加遮罩层（点击关闭）
  - [x] SubTask A3.5: 集成到 Header 汉堡菜单

## Phase B: 性能优化（优先级：中）

- [x] Task B1: 实现组件懒加载
  - [x] SubTask B1.1: 使用 next/dynamic 导入管理页面（admin/prompt-manager, admin/model-config）
  - [x] SubTask B1.2: 使用 next/dynamic 导入聊天历史页面（chat-history）
  - [x] SubTask B1.3: 按需导入图表组件（RadarChart, CityCompareChart）
  - [x] SubTask B1.4: 验证懒加载不影响首屏性能

- [x] Task B2: 优化 API 响应缓存
  - [x] SubTask B2.1: 创建 useCachedApi Hook（localStorage + TTL）
  - [x] SubTask B2.2: 为提示词管理 API 添加缓存（5 分钟 TTL）
  - [x] SubTask B2.3: 为模型配置 API 添加缓存（10 分钟 TTL）
  - [x] SubTask B2.4: 为城市数据 API 添加缓存（30 分钟 TTL）

## Phase C: AI 职业性格测评功能（优先级：中）

- [x] Task C1: 设计测评题库和评分模型
  - [x] SubTask C1.1: 创建测评类型定义（src/types/assessment.ts）
  - [x] SubTask C1.2: 定义 Holland RIASEC 六维度接口（Realistic, Investigative, Artistic, Social, Enterprising, Conventional）
  - [x] SubTask C1.3: 设计 24 道测评题目（每维度 4 题）
  - [x] SubTask C1.4: 实现评分计算函数（Likert 5 级量表 → 维度得分 0-100）
  - [x] SubTask C1.5: 实现测评结果存储（localStorage）

- [x] Task C2: 创建测评页面 UI
  - [x] SubTask C2.1: 创建 /assessment 页面路由
  - [x] SubTask C2.2: 实现测评欢迎页面（说明、预计时间、开始按钮）
  - [x] SubTask C2.3: 实现测评进度条组件（当前题号/总题数）
  - [x] SubTask C2.4: 实现单选题组件（5 级 Likert 量表：非常不符合 → 非常符合）
  - [x] SubTask C2.5: 实现自动保存逻辑（每答一题保存到 localStorage）
  - [x] SubTask C2.6: 实现"上一题/下一题"导航
  - [x] SubTask C2.7: 实现测评完成页面（提交按钮、进度提示）

- [x] SubTask C2.8: 测试测评全流程（开始 → 答题 → 完成 → 提交）

- [x] Task C3: 实现测评结果展示和 AI 解读
  - [x] SubTask C3.1: 创建 AssessmentResult 组件（雷达图展示六维度）
  - [x] SubTask C3.2: 实现维度详情卡片（分数、描述、适合职业）
  - [x] SubTask C3.3: 实现主导类型高亮展示
  - [x] SubTask C3.4: 创建 AI 解读 API 路由（/api/assessment/interpret）
  - [x] SubTask C3.5: 实现 AI 解读页面（流式输出，基于测评结果生成建议）
  - [x] SubTask C3.6: 将测评结果保存到用户画像
  - [x] SubTask C3.7: 在 Header 添加"职业测评"导航链接
  - [x] SubTask C3.8: 测试测评结果展示和 AI 解读

## Phase D: 智能实习推荐功能（优先级：中）

- [x] Task D1: 设计实习数据结构
  - [x] SubTask D1.1: 创建实习类型定义（src/types/internship.ts）
  - [x] SubTask D1.2: 定义 Internship 接口（id, title, company, location, requirements, matchScore, matchReasons）
  - [x] SubTask D1.3: 创建实习数据种子文件（20 个示例实习岗位）
  - [x] SubTask D1.4: 实现推荐匹配算法函数

- [x] Task D2: 实现推荐算法
  - [x] SubTask D2.1: 创建 matchInternships 函数（基于用户画像计算匹配度）
  - [x] SubTask D2.2: 实现评分逻辑（专业匹配 40% + 城市偏好 30% + 测评结果 30%）
  - [x] SubTask D2.3: 生成匹配理由（3-5 条具体原因）
  - [x] SubTask D2.4: 按匹配度排序返回结果
  - [x] SubTask D2.5: 创建推荐 API 路由（POST /api/internships/recommend）

- [x] Task D3: 创建推荐结果展示页面
  - [x] SubTask D3.1: 创建 /internships 页面路由
  - [x] SubTask D3.2: 实现推荐列表布局（卡片式，按匹配度排序）
  - [x] SubTask D3.3: 实现实习卡片组件（标题、公司、地点、匹配度标签）
  - [x] SubTask D3.4: 实现筛选器（城市、行业、匹配度阈值）
  - [x] SubTask D3.5: 实现实习详情页面（/internships/[id]）
  - [x] SubTask D3.6: 详情页展示完整职位信息和匹配分析
  - [x] SubTask D3.7: 在 Header 添加"实习推荐"导航链接
  - [x] SubTask D3.8: 测试推荐流程和展示效果

## Phase E: 成长路径规划功能（优先级：中）

- [x] Task E1: 设计路径可视化数据结构
  - [x] SubTask E1.1: 创建路径类型定义（src/types/career-path.ts）
  - [x] SubTask E1.2: 定义 PathStage 接口（阶段名、目标、行动项列表、时间范围）
  - [x] SubTask E1.3: 定义 PathActionItem 接口（标题、描述、状态、截止日期）
  - [x] SubTask E1.4: 创建预设路径模板（3-5 个典型职业路径）

- [x] Task E2: 实现路径可视化组件
  - [x] SubTask E2.1: 创建 Timeline 组件（垂直时间轴样式）
  - [x] SubTask E2.2: 实现阶段节点（圆形图标 + 标题 + 状态指示器）
  - [x] SubTask E2.3: 实现行动项列表（复选框 + 描述 + 截止日期）
  - [x] SubTask E2.4: 实现状态颜色（completed=green, in-progress=blue, not-started=gray）
  - [x] SubTask E2.5: 添加展开/收起动画

- [x] Task E3: 创建路径规划页面
  - [x] SubTask E3.1: 创建 /career-path 页面路由
  - [x] SubTask E3.2: 实现 AI 生成路径逻辑（基于用户画像和测评结果）
  - [x] SubTask E3.3: 创建路径生成 API 路由（POST /api/career-path/generate）
  - [x] SubTask E3.4: 实现路径展示页面（Timeline 组件 + 详情）
  - [x] SubTask E3.5: 实现行动项状态切换（点击复选框更新状态）
  - [x] SubTask E3.6: 实现路径保存到 localStorage
  - [x] SubTask E3.7: 在 Header 添加"成长路径"导航链接
  - [x] SubTask E3.8: 测试路径生成和展示

## Phase F: 集成测试和优化（优先级：高）

- [x] Task F1: 端到端流程测试
  - [x] SubTask F1.1: 测试完整用户流程（注册 → 自我认知 → 测评 → 推荐 → 路径）
  - [x] SubTask F1.2: 测试移动端全流程（iOS Safari, Android Chrome）
  - [x] SubTask F1.3: 测试桌面端全流程（Chrome, Firefox, Safari）
  - [x] SubTask F1.4: 修复发现的 UI/UX 问题

- [x] Task F2: 构建验证
  - [x] SubTask F2.1: 运行 npm run build 确保无错误
  - [x] SubTask F2.2: 验证所有路由可访问
  - [x] SubTask F2.3: 验证所有 API 接口正常工作
  - [x] SubTask F2.4: 更新 tasks.md 标记所有任务完成

# 任务依赖关系

- Task A1/A2/A3 可并行执行（移动端适配三个独立部分）
- Task B1 依赖 Task A1/A2/A3（需要稳定的页面布局后优化加载）
- Task B2 可以并行执行
- Task C1 → C2 → C3 顺序执行（数据结构 → 页面 → 结果展示）
- Task D1 → D2 → D3 顺序执行（数据结构 → 算法 → 展示）
- Task E1 → E2 → E3 顺序执行（数据结构 → 组件 → 页面）
- Task C/D/E 可以并行执行（三个独立功能模块）
- Task F1/F2 最后执行（所有功能完成后集成测试）
