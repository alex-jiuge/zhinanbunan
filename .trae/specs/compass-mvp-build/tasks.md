# 指南不南 MVP 开发任务列表

## Phase 1: 项目基础搭建（Day 1-2）

- [x] Task 1: 初始化 Next.js 15 项目
  - [x] 创建 Next.js 项目（App Router + TypeScript + Tailwind CSS 4）
  - [x] 配置 tsconfig.json（严格模式、路径别名 @/*）
  - [x] 配置 next.config.ts
  - [x] 创建 .env.local 和 .env.example 文件
  - [x] 配置 .gitignore
- [x] Task 2: 安装和配置依赖
  - [x] 安装生产依赖：ai, @ai-sdk/openai-compatible, zustand, recharts, lucide-react, nanoid, class-variance-authority, clsx, tailwind-merge
  - [x] 安装开发依赖：prisma（可选，MVP 阶段不强制）
  - [x] 初始化 shadcn/ui（npx shadcn@latest init）
- [x] Task 3: 安装 shadcn/ui 基础组件
  - [x] 安装 button, card, input, textarea, badge, tabs, dialog, progress, select, tooltip, separator, skeleton, scroll-area
- [x] Task 4: 配置全局样式和主题
  - [x] 在 globals.css 中配置 Tailwind CSS 4 主题变量（色彩系统、字体、间距、圆角）
  - [x] 配置 @layer base, @layer components, @layer utilities
  - [x] 添加全局字体（Inter, Noto Sans SC）
- [x] Task 5: 创建项目目录结构
  - [x] 创建 src/app/ 路由结构（/, /onboarding, /campus/*, /graduation/*, /api/*）
  - [x] 创建 src/components/ 组件目录（ui/, chat/, charts/, analysis/, layout/, home/）
  - [x] 创建 src/lib/ 工具目录（ai/, analysis/, db.ts, utils.ts）
  - [x] 创建 src/store/ 状态管理目录（user-store.ts, chat-store.ts）
  - [x] 创建 src/types/ 类型定义目录（user.ts, chat.ts, analysis.ts, city.ts）
  - [x] 创建 src/hooks/ 自定义 Hook 目录
  - [x] 创建 src/data/ 静态数据目录（cities.ts, majors.ts, careers.ts）
- [x] Task 6: 创建根布局和全局组件
  - [x] 创建 app/layout.tsx（根布局，包含全局 Provider）
  - [x] 创建 components/layout/Header.tsx（顶部导航栏）
  - [x] 创建 components/layout/Footer.tsx（页脚，含比赛信息）

## Phase 2: AI 对话基础设施（Day 3-4）

- [x] Task 7: 定义 TypeScript 类型系统
  - [x] 创建 types/user.ts（User, UserProfile, Grade, UserPreferences 类型）
  - [x] 创建 types/chat.ts（Message, Conversation, ChatRole, ChatResponse 类型）
  - [x] 创建 types/analysis.ts（AnalysisResult, CityAnalysis, MajorAnalysis, JDAnalysis, FamilyBridge 类型）
  - [x] 创建 types/city.ts（CityData, CityScores, CityPreferences 类型）
- [x] Task 8: 配置 AI SDK 和 DeepSeek 客户端
  - [x] 创建 lib/ai/client.ts（DeepSeek API 客户端封装，使用 @ai-sdk/openai-compatible）
  - [x] 配置环境变量读取（DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL）
- [x] Task 9: 搭建 Prompt 模板引擎
  - [x] 创建 lib/ai/prompts/types.ts（PromptTemplate, PromptStep 类型定义）
  - [x] 创建 lib/ai/prompts/index.ts（Prompt 注册表，统一导出）
  - [x] 创建 lib/ai/prompts/self-exploration.ts（自我认知 8 步 Prompt）
  - [x] 创建 lib/ai/prompts/city-match.ts（城市匹配 Prompt）
  - [x] 创建 lib/ai/prompts/major-analysis.ts（专业分析 Prompt）
  - [x] 创建 lib/ai/prompts/jd-parser.ts（JD 解析 Prompt）
  - [x] 创建 lib/ai/prompts/family-bridge.ts（家庭沟通桥 Prompt）
- [x] Task 10: 实现流式对话 Hook
  - [x] 创建 hooks/use-chat.ts（封装 Vercel AI SDK useChat，支持自定义 systemPrompt）
  - [x] 实现 SSE 流式输出处理
  - [x] 实现快捷回复功能
  - [x] 实现对话历史保存/恢复
- [x] Task 11: 创建 localStorage 存储工具
  - [x] 创建 hooks/use-local-storage.ts（通用 localStorage Hook）
  - [x] 实现序列化/反序列化
  - [x] 实现类型安全的读取/写入
  - [x] 添加错误处理（存储空间不足、浏览器不支持等）
- [x] Task 12: 创建 Zustand 状态管理
  - [x] 创建 store/user-store.ts（用户信息、画像、偏好状态）
  - [x] 创建 store/chat-store.ts（对话状态、当前步骤、消息历史）

## Phase 3: 对话 UI 组件开发（Day 4-5）

- [x] Task 13: 开发对话窗口组件
  - [x] 创建 components/chat/ChatWindow.tsx（对话容器，管理滚动、加载状态）
  - [x] 创建 components/chat/MessageBubble.tsx（单条消息气泡，区分用户/AI）
  - [x] 创建 components/chat/ChatInput.tsx（输入框 + 发送按钮）
  - [x] 创建 components/chat/TypingIndicator.tsx（AI 思考动画）
  - [x] 创建 components/chat/WelcomeMessage.tsx（对话欢迎消息）
- [x] Task 14: 开发分析和图表组件
  - [x] 创建 components/charts/RadarChart.tsx（能力雷达图，Recharts）
  - [x] 创建 components/charts/CityCompareChart.tsx（城市对比柱状图，Recharts）
  - [x] 创建 components/charts/ScoreBar.tsx（分数进度条）
  - [x] 创建 components/analysis/AnalysisCard.tsx（分析结果卡片）
  - [x] 创建 components/analysis/TagList.tsx（标签列表）
- [x] Task 15: 开发布局和导航组件
  - [x] 创建 components/layout/Header.tsx（顶部导航栏）
  - [x] 创建 components/layout/Footer.tsx（页脚，含比赛信息）
  - [x] 创建 components/layout/StepProgress.tsx（步骤进度指示器）

## Phase 4: 自我认知引擎（Day 5-7）

- [x] Task 16: 开发 Onboarding 页面
  - [x] 创建 app/onboarding/page.tsx（自我认知引擎页面）
  - [x] 实现 8 步对话流程控制（步骤切换、进度保存）
  - [x] 集成 use-chat Hook 和 Prompt 模板
  - [x] 实现快捷回复按钮（每步 2-3 个预设选项）
  - [x] 实现跳过功能（至少完成 5 步）
  - [x] 实现进度自动保存（每完成一步保存）
- [x] Task 17: 实现用户画像生成
  - [x] 创建 /api/profile/onboarding/route.ts（完成对话后生成画像 API）
  - [x] 实现画像数据结构组装（从对话历史提取各维度）
  - [x] 实现画像保存到 localStorage
  - [x] 实现画像读取 API（/api/profile GET）
  - [x] 实现画像更新 API（/api/profile POST）
- [x] Task 18: 开发能力雷达图页面
  - [x] 创建 app/campus/navigator/radar/page.tsx
  - [x] 渲染五维雷达图
  - [x] 展示各维度详情和评分
  - [x] 展示 AI 成长建议

## Phase 5: 首页仪表盘（Day 7-8）

- [x] Task 19: 开发首页组件
  - [x] 创建 app/page.tsx（首页仪表盘）
  - [x] 创建 HeroSection（主视觉区，含 CTA 按钮）
  - [x] 创建 FeatureGrid（6 功能模块网格）
  - [x] 创建 UserStory（小明的故事展示）
- [x] Task 20: 实现首页交互逻辑
  - [x] 判断用户是否完成自我认知（profile.isCompleted）
  - [x] 已完成：显示"欢迎回来" + 画像摘要
  - [x] 未完成：显示"开始探索"按钮
  - [x] 功能卡片点击跳转对应页面

## Phase 6: 城市匹配模块（Day 9-10）

- [x] Task 21: 准备城市静态数据
- [x] Task 22: 开发城市匹配页面
- [x] Task 23: 开发城市匹配 API

## Phase 7: 家庭沟通桥模块（Day 11-12）

- [x] Task 24: 开发家庭沟通桥页面
- [x] Task 25: 开发家庭沟通桥 API

## Phase 8: 专业分析模块（Day 12-13）

- [x] Task 26: 准备专业静态数据
- [x] Task 27: 开发专业分析页面
- [x] Task 28: 开发专业分析 API

## Phase 9: JD 翻译器模块（Day 14-15）

- [x] Task 29: 开发 JD 翻译器页面
- [x] Task 30: 开发 JD 解析 API

## Phase 10: 完善与优化（Day 16-18）

- [x] Task 31: 响应式适配
- [x] Task 32: 加载状态和错误处理
- [x] Task 33: 动画和过渡效果
- [x] Task 34: 工具函数和常量

## Phase 11: 测试和部署（Day 19-20）

- [x] Task 35: 功能测试
- [x] Task 36: 性能测试
- [x] Task 37: 部署到 Vercel

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
