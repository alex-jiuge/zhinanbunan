# 指南不南 MVP 开发任务列表

## Phase 1: 项目基础搭建（Day 1-2）

- [ ] Task 1: 初始化 Next.js 15 项目
  - [ ] 创建 Next.js 项目（App Router + TypeScript + Tailwind CSS 4）
  - [ ] 配置 tsconfig.json（严格模式、路径别名 @/*）
  - [ ] 配置 next.config.ts
  - [ ] 创建 .env.local 和 .env.example 文件
  - [ ] 配置 .gitignore
- [ ] Task 2: 安装和配置依赖
  - [ ] 安装生产依赖：ai, @ai-sdk/openai-compatible, zustand, recharts, lucide-react, nanoid, class-variance-authority, clsx, tailwind-merge
  - [ ] 安装开发依赖：prisma（可选，MVP 阶段不强制）
  - [ ] 初始化 shadcn/ui（npx shadcn@latest init）
- [ ] Task 3: 安装 shadcn/ui 基础组件
  - [ ] 安装 button, card, input, textarea, badge, tabs, dialog, progress, select, tooltip, separator, skeleton, scroll-area
- [ ] Task 4: 配置全局样式和主题
  - [ ] 在 globals.css 中配置 Tailwind CSS 4 主题变量（色彩系统、字体、间距、圆角）
  - [ ] 配置 @layer base, @layer components, @layer utilities
  - [ ] 添加全局字体（Inter, Noto Sans SC）
- [ ] Task 5: 创建项目目录结构
  - [ ] 创建 src/app/ 路由结构（/, /onboarding, /campus/*, /graduation/*, /api/*）
  - [ ] 创建 src/components/ 组件目录（ui/, chat/, charts/, analysis/, layout/, home/）
  - [ ] 创建 src/lib/ 工具目录（ai/, analysis/, db.ts, utils.ts）
  - [ ] 创建 src/store/ 状态管理目录（user-store.ts, chat-store.ts）
  - [ ] 创建 src/types/ 类型定义目录（user.ts, chat.ts, analysis.ts, city.ts）
  - [ ] 创建 src/hooks/ 自定义 Hook 目录
  - [ ] 创建 src/data/ 静态数据目录（cities.ts, majors.ts, careers.ts）
- [ ] Task 6: 创建根布局和全局组件
  - [ ] 创建 app/layout.tsx（根布局，包含全局 Provider）
  - [ ] 创建 components/layout/Header.tsx（顶部导航栏）
  - [ ] 创建 components/layout/Footer.tsx（页脚，含比赛信息）

## Phase 2: AI 对话基础设施（Day 3-4）

- [ ] Task 7: 定义 TypeScript 类型系统
  - [ ] 创建 types/user.ts（User, UserProfile, Grade, UserPreferences 类型）
  - [ ] 创建 types/chat.ts（Message, Conversation, ChatRole, ChatResponse 类型）
  - [ ] 创建 types/analysis.ts（AnalysisResult, CityAnalysis, MajorAnalysis, JDAnalysis, FamilyBridge 类型）
  - [ ] 创建 types/city.ts（CityData, CityScores, CityPreferences 类型）
- [ ] Task 8: 配置 AI SDK 和 DeepSeek 客户端
  - [ ] 创建 lib/ai/client.ts（DeepSeek API 客户端封装，使用 @ai-sdk/openai-compatible）
  - [ ] 配置环境变量读取（DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL）
  - [ ] 测试 API 连通性
- [ ] Task 9: 搭建 Prompt 模板引擎
  - [ ] 创建 lib/ai/prompts/types.ts（PromptTemplate, PromptStep 类型定义）
  - [ ] 创建 lib/ai/prompts/index.ts（Prompt 注册表，统一导出）
  - [ ] 创建 lib/ai/prompts/self-exploration.ts（自我认知 8 步 Prompt）
  - [ ] 创建 lib/ai/prompts/city-match.ts（城市匹配 Prompt）
  - [ ] 创建 lib/ai/prompts/major-analysis.ts（专业分析 Prompt）
  - [ ] 创建 lib/ai/prompts/jd-parser.ts（JD 解析 Prompt）
  - [ ] 创建 lib/ai/prompts/family-bridge.ts（家庭沟通桥 Prompt）
- [ ] Task 10: 实现流式对话 Hook
  - [ ] 创建 hooks/use-chat.ts（封装 Vercel AI SDK useChat，支持自定义 systemPrompt）
  - [ ] 实现 SSE 流式输出处理
  - [ ] 实现快捷回复功能
  - [ ] 实现对话历史保存/恢复
- [ ] Task 11: 创建 localStorage 存储工具
  - [ ] 创建 hooks/use-local-storage.ts（通用 localStorage Hook）
  - [ ] 实现序列化/反序列化
  - [ ] 实现类型安全的读取/写入
  - [ ] 添加错误处理（存储空间不足、浏览器不支持等）
- [ ] Task 12: 创建 Zustand 状态管理
  - [ ] 创建 store/user-store.ts（用户信息、画像、偏好状态）
  - [ ] 创建 store/chat-store.ts（对话状态、当前步骤、消息历史）

## Phase 3: 对话 UI 组件开发（Day 4-5）

- [ ] Task 13: 开发对话窗口组件
  - [ ] 创建 components/chat/ChatWindow.tsx（对话容器，管理滚动、加载状态）
  - [ ] 创建 components/chat/MessageList.tsx（消息列表，虚拟滚动）
  - [ ] 创建 components/chat/MessageBubble.tsx（单条消息气泡，区分用户/AI）
  - [ ] 创建 components/chat/ChatInput.tsx（输入框 + 发送按钮）
  - [ ] 创建 components/chat/TypingIndicator.tsx（AI 思考动画）
  - [ ] 创建 components/chat/WelcomeMessage.tsx（对话欢迎消息）
- [ ] Task 14: 开发分析和图表组件
  - [ ] 创建 components/charts/RadarChart.tsx（能力雷达图，Recharts）
  - [ ] 创建 components/charts/CityCompareChart.tsx（城市对比柱状图，Recharts）
  - [ ] 创建 components/charts/ValuePyramid.tsx（价值观金字塔）
  - [ ] 创建 components/charts/ScoreBar.tsx（分数进度条）
  - [ ] 创建 components/analysis/AnalysisCard.tsx（分析结果卡片）
  - [ ] 创建 components/analysis/InsightItem.tsx（洞察条目）
  - [ ] 创建 components/analysis/ComparisonTable.tsx（对比表格）
  - [ ] 创建 components/analysis/TagList.tsx（标签列表）
  - [ ] 创建 components/analysis/StructuredOutput.tsx（AI 结构化输出渲染器）
- [ ] Task 15: 开发布局和导航组件
  - [ ] 创建 components/layout/AppSidebar.tsx（侧边导航栏，区分 campus/graduation）
  - [ ] 创建 components/layout/MobileNav.tsx（移动端底部导航）
  - [ ] 创建 components/layout/StepProgress.tsx（步骤进度指示器）

## Phase 4: 自我认知引擎（Day 5-7）

- [ ] Task 16: 开发 Onboarding 页面
  - [ ] 创建 app/onboarding/page.tsx（自我认知引擎页面）
  - [ ] 实现 8 步对话流程控制（步骤切换、进度保存）
  - [ ] 集成 use-chat Hook 和 Prompt 模板
  - [ ] 实现快捷回复按钮（每步 2-3 个预设选项）
  - [ ] 实现跳过功能（至少完成 5 步）
  - [ ] 实现进度自动保存（每完成一步保存）
- [ ] Task 17: 实现用户画像生成
  - [ ] 创建 /api/profile/onboarding/route.ts（完成对话后生成画像 API）
  - [ ] 实现画像数据结构组装（从对话历史提取各维度）
  - [ ] 实现画像保存到 localStorage
  - [ ] 实现画像读取 API（/api/profile GET）
  - [ ] 实现画像更新 API（/api/profile POST）
- [ ] Task 18: 开发能力雷达图页面
  - [ ] 创建 app/campus/navigator/radar/page.tsx
  - [ ] 渲染五维雷达图
  - [ ] 展示各维度详情和评分
  - [ ] 展示 AI 成长建议

## Phase 5: 首页仪表盘（Day 7-8）

- [ ] Task 19: 开发首页组件
  - [ ] 创建 app/page.tsx（首页仪表盘）
  - [ ] 创建 components/home/HeroSection.tsx（主视觉区，含 CTA 按钮）
  - [ ] 创建 components/home/FeatureGrid.tsx（6 功能模块网格）
  - [ ] 创建 components/home/FeatureCard.tsx（单个功能卡片）
  - [ ] 创建 components/home/UserStory.tsx（小明的故事展示）
  - [ ] 创建 components/home/QuickStart.tsx（快速开始引导）
- [ ] Task 20: 实现首页交互逻辑
  - [ ] 判断用户是否完成自我认知（profile.isCompleted）
  - [ ] 已完成：显示"欢迎回来" + 画像摘要
  - [ ] 未完成：显示"开始探索"按钮
  - [ ] 功能卡片点击跳转对应页面

## Phase 6: 城市匹配模块（Day 9-10）

- [ ] Task 21: 准备城市静态数据
  - [ ] 创建 data/cities.ts（至少 15 个城市完整数据）
  - [ ] 包含：产业、生活成本、人才政策、环境、年轻人指标
  - [ ] 数据格式符合 CityData 类型定义
- [ ] Task 22: 开发城市匹配页面
  - [ ] 创建 app/graduation/compass/city-match/page.tsx
  - [ ] 创建 app/graduation/layout.tsx（毕业决策布局，含侧边栏）
  - [ ] 实现偏好选择表单（行业、城市多选、生活节奏、预算、社交、距离）
  - [ ] 实现分析结果展示（推荐城市、对比图表、详情卡片、AI 建议）
- [ ] Task 23: 开发城市匹配 API
  - [ ] 创建 app/api/analysis/city/route.ts
  - [ ] 接收用户偏好参数
  - [ ] 调用 AI 服务（使用城市匹配 Prompt）
  - [ ] 返回结构化 JSON 结果（评分、亮点、顾虑、薪资、租金）
  - [ ] 保存分析结果到 localStorage

## Phase 7: 家庭沟通桥模块（Day 11-12）

- [ ] Task 24: 开发家庭沟通桥页面
  - [ ] 创建 app/graduation/family-bridge/page.tsx
  - [ ] 实现信息填写表单（职业、城市、父母担忧、想说的话）
  - [ ] 实现结果展示（职业说明书、对话指南、折中方案）
  - [ ] 实现复制全文功能（Clipboard API）
- [ ] Task 25: 开发家庭沟通桥 API
  - [ ] 创建 app/api/analysis/family-bridge/route.ts
  - [ ] 接收用户输入（职业、城市、父母担忧）
  - [ ] 调用 AI 服务（使用家庭沟通桥 Prompt）
  - [ ] 返回结构化 JSON（职业介绍、数据回应、对话话术、折中方案）

## Phase 8: 专业分析模块（Day 12-13）

- [ ] Task 26: 准备专业静态数据
  - [ ] 创建 data/majors.ts（专业大类数据，含冷门标记）
  - [ ] 创建 data/careers.ts（职业基础数据）
- [ ] Task 27: 开发专业分析页面
  - [ ] 创建 app/campus/academic/major-analysis/page.tsx
  - [ ] 创建 app/campus/layout.tsx（在校成长布局，含侧边栏）
  - [ ] 实现专业信息输入表单（专业选择/输入、年级、困惑描述）
  - [ ] 实现结果展示（专业全景、可迁移技能、职业路径、破局建议）
- [ ] Task 28: 开发专业分析 API
  - [ ] 创建 app/api/analysis/major/route.ts
  - [ ] 接收专业信息参数
  - [ ] 调用 AI 服务（使用专业分析 Prompt）
  - [ ] 返回结构化 JSON（专业概述、可迁移技能、职业路径、冷门建议）

## Phase 9: JD 翻译器模块（Day 14-15）

- [ ] Task 29: 开发 JD 翻译器页面
  - [ ] 创建 app/graduation/career/jd-analyzer/page.tsx
  - [ ] 实现 JD 粘贴输入框（最多 5000 字）
  - [ ] 实现结果展示（岗位真相、日常工作、能力拆解、薪资、红旗、匹配度）
  - [ ] 集成用户画像匹配分析
- [ ] Task 30: 开发 JD 解析 API
  - [ ] 创建 app/api/analysis/jd/route.ts
  - [ ] 接收 JD 文本和目标角色
  - [ ] 调用 AI 服务（使用 JD 解析 Prompt）
  - [ ] 返回结构化 JSON（岗位真相、能力要求、薪资、红旗、匹配分析）

## Phase 10: 完善与优化（Day 16-18）

- [ ] Task 31: 响应式适配
  - [ ] 移动端适配（< 640px 单列 + 底部导航）
  - [ ] 平板适配（640-1024px 侧边栏可收起）
  - [ ] 桌面端适配（> 1024px 双列布局）
- [ ] Task 32: 加载状态和错误处理
  - [ ] 全局 Skeleton 骨架屏组件
  - [ ] AI 加载动画（"AI 正在为你分析..."）
  - [ ] 网络错误重试机制
  - [ ] AI API 错误处理（超时、限流、返回格式错误）
  - [ ] localStorage 错误处理（存储空间不足）
- [ ] Task 33: 动画和过渡效果
  - [ ] AI 消息出现动画（淡入 + 上滑 300ms）
  - [ ] 页面切换动画（淡入淡出 200ms）
  - [ ] 卡片展开/收起动画（高度 300ms）
  - [ ] 进度条平滑过渡（500ms）
  - [ ] AI 思考动画（三个跳动圆点）
- [ ] Task 34: 工具函数和常量
  - [ ] 创建 lib/utils.ts（通用工具函数：cn, formatDate, truncate 等）
  - [ ] 创建常量文件（颜色、间距、断点配置）

## Phase 11: 测试和部署（Day 19-20）

- [ ] Task 35: 功能测试
  - [ ] 自我认知引擎全流程测试（8 步对话、画像生成、进度保存）
  - [ ] 城市匹配测试（偏好选择、分析、图表渲染、保存）
  - [ ] 家庭沟通桥测试（表单提交、结果展示、复制功能）
  - [ ] 专业分析测试（冷门/热门专业、结果完整性）
  - [ ] JD 翻译器测试（粘贴 JD、解析、匹配度分析）
  - [ ] 能力雷达图测试（数据渲染、建议展示）
- [ ] Task 36: 性能测试
  - [ ] Lighthouse 性能评分 > 80
  - [ ] AI 首字响应时间 < 3 秒
  - [ ] 页面切换流畅无卡顿
- [ ] Task 37: 部署到 Vercel
  - [ ] 初始化 Git 仓库并推送
  - [ ] 配置 Vercel 环境变量
  - [ ] 部署并验证
  - [ ] 全流程测试线上版本

## Task 依赖关系

- Task 1-6 → Task 7（基础搭建完成后才能定义类型）
- Task 7 → Task 8-9（类型定义完成后才能配置 AI）
- Task 8-9 → Task 10-12（AI 配置完成后才能实现 Hook 和 Store）
- Task 10-12 → Task 13-15（基础设施完成后才能开发 UI 组件）
- Task 13-15 → Task 16（UI 组件完成后才能开发 Onboarding 页面）
- Task 16 → Task 19（Onboarding 完成后才能开发首页交互逻辑）
- Task 19 → Task 22-29（首页完成后并行开发各功能模块）
- Task 21 → Task 22（城市数据完成后才能开发城市匹配页面）
- Task 26 → Task 27（专业数据完成后才能开发专业分析页面）
- Task 22-30 → Task 31-34（所有功能完成后进行优化）
- Task 31-34 → Task 35-37（优化完成后测试和部署）

## 可并行开发

- Task 8 和 Task 9 可并行（AI 客户端和 Prompt 模板互不依赖）
- Task 13、Task 14、Task 15 可并行（UI 组件开发互不依赖）
- Task 21 和 Task 26 可并行（静态数据准备互不依赖）
- Task 22-30 可并行开发（各功能模块独立）
