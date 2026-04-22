# 指南不南 MVP 开发检查清单

## 项目基础

* [x] Next.js 15 项目成功初始化（npm run dev 正常运行）

* [x] Tailwind CSS 4 配置正确，全局样式生效

* [x] shadcn/ui 组件正常导入和使用

* [x] TypeScript 严格模式开启，无 any 类型

* [x] 环境变量配置正确（.env.local 存在）

* [x] 项目目录结构完整（app/, components/, lib/, store/, types/, hooks/, data/）

* [ ] Git 仓库初始化

## 类型系统

* [x] types/user.ts 包含 User, UserProfile, Grade 类型定义

* [x] types/chat.ts 包含 Message, Conversation, ChatRole 类型定义

* [x] types/analysis.ts 包含所有分析结果类型（CityAnalysis, MajorAnalysis, JDAnalysis, FamilyBridgeResult）

* [x] types/city.ts 包含 CityData, CityScores, CityPreferences 类型定义

* [x] 所有类型导出并在项目中使用

## AI 基础设施

* [x] lib/ai/client.ts 正确配置 DeepSeek API 客户端

* [x] 环境变量正确读取（DEEPSEEK\_API\_KEY, DEEPSEEK\_BASE\_URL, DEEPSEEK\_MODEL）

* [ ] API 连通性测试通过

* [x] 所有 Prompt 模板文件存在（self-exploration, city-match, major-analysis, jd-parser, family-bridge）

* [x] Prompt 注册表（index.ts）正确导出所有 Prompt

* [x] use-chat Hook 支持流式输出

* [x] use-chat Hook 支持自定义 systemPrompt

* [x] 对话历史保存/恢复功能正常

## 数据存储

* [x] use-local-storage Hook 实现类型安全的读写

* [x] localStorage 错误处理完善（存储空间不足、浏览器不支持）

* [x] Zustand user-store 管理用户状态

* [x] Zustand chat-store 管理对话状态

* [x] userId 自动生成并持久化

## 对话 UI 组件

* [x] ChatWindow 组件正确管理消息列表和滚动

* [x] MessageBubble 区分用户和 AI 样式（AI 左对齐浅蓝背景，用户右对齐主色背景）

* [x] ChatInput 支持文本输入和发送

* [x] TypingIndicator 显示 AI 思考动画

* [x] WelcomeMessage 显示欢迎语

* [x] 消息出现动画生效（淡入 + 上滑）

## 分析和图表组件

* [x] RadarChart 正确渲染五维雷达图

* [x] CityCompareChart 正确渲染城市对比柱状图

* [x] ScoreBar 正确显示分数进度条

* [x] AnalysisCard 正确展示分析结果

* [x] StructuredOutput 正确渲染 AI 结构化 JSON 输出

* [x] TagList 正确展示标签列表

## 布局组件

* [x] Header 显示 Logo 和导航

* [x] Footer 显示比赛信息和版权

* [ ] AppSidebar 区分 campus 和 graduation 路由

* [ ] MobileNav 在移动端正确显示底部导航

* [x] StepProgress 正确显示步骤进度

## 自我认知引擎

* [x] /onboarding 页面正确加载

* [x] 8 步对话流程完整实现

* [x] 每步快捷回复按钮显示正确

* [x] 进度自动保存（刷新页面可恢复）

* [x] 跳过功能正常（至少 5 步才能生成画像）

* [x] 用户画像生成逻辑正确

* [x] 画像保存到 localStorage 成功

* [x] 画像各维度完整（性格、价值观、兴趣、能力、生活方式、雷达分数）

## 首页仪表盘

* [x] / 页面正确加载

* [x] HeroSection 显示主视觉和 CTA 按钮

* [x] FeatureGrid 显示 6 个功能模块卡片

* [x] 未完成自我认知：CTA 跳转到 /onboarding

* [x] 已完成自我认知：显示"欢迎回来"和画像摘要

* [x] 功能卡片点击跳转正确

* [x] UserStory 展示小明的故事

## 城市匹配模块

* [x] /graduation/compass/city-match 页面正确加载

* [x] 偏好选择表单完整（行业、城市、节奏、预算、社交、距离）

* [x] 城市多选功能正常

* [x] 分析结果正确渲染

* [x] 城市对比柱状图正确显示

* [x] 各城市详情卡片完整（亮点、顾虑、薪资、租金、推荐区域）

* [x] AI 综合建议显示

* [ ] 保存/重新分析功能正常

* [ ] /api/analysis/city 接口正常工作

## 家庭沟通桥模块

* [x] /graduation/family-bridge 页面正确加载

* [x] 信息填写表单完整（职业、城市、父母担忧、想说的话）

* [x] 父母担忧多选功能正常

* [x] 结果展示完整（职业说明书、对话指南、折中方案）

* [x] 复制全文功能正常（Clipboard API）

* [ ] /api/analysis/family-bridge 接口正常工作

## 专业分析模块

* [x] /campus/academic/major-analysis 页面正确加载

* [x] 专业信息输入表单完整（专业、年级、困惑）

* [x] 冷门专业破局建议显示

* [x] 可迁移技能展示正确

* [x] 职业路径推荐完整（匹配度、差距、行动建议）

* [ ] /api/analysis/major 接口正常工作

## JD 翻译器模块

* [x] /graduation/career/jd-analyzer 页面正确加载

* [x] JD 粘贴输入框正常工作（限制 5000 字）

* [x] 岗位真相展示（真实工作内容、典型一天）

* [x] 能力要求拆解完整（必备、加分、隐性）

* [x] 薪资参考显示

* [x] 红旗警告显示

* [x] 匹配度分析显示（已完成自我认知的用户）

* [ ] /api/analysis/jd 接口正常工作

## 能力雷达图

* [x] /campus/navigator/radar 页面正确加载

* [x] 雷达图正确渲染五维数据

* [x] 各维度详情展示（分数、评价、描述）

* [x] AI 成长建议显示

* [x] 数据来源于用户画像

## 响应式适配

* [x] 移动端（< 640px）单列布局，底部导航显示

* [x] 平板（640-1024px）布局合理

* [x] 桌面端（> 1024px）双列布局（侧边栏 + 内容区）

* [x] 所有组件在移动端显示正常

* [ ] 触摸交互正常

## 错误处理

* [x] AI API 超时处理（10 秒超时）

* [x] AI API 限流错误处理（429）

* [x] AI 返回格式错误处理（JSON 解析失败）

* [x] 网络断开错误提示

* [x] localStorage 空间不足错误处理

* [x] 表单验证错误提示

## 动画和交互

* [x] AI 消息出现动画生效

* [x] 页面切换动画生效

* [x] 卡片展开/收起动画生效

* [x] 进度条平滑过渡

* [x] AI 思考动画（跳动圆点）

* [x] 按钮点击反馈

* [x] Loading 状态显示正确

## 性能

* [x] npm run build 无错误

* [ ] Lighthouse 性能评分 > 80

* [ ] AI 首字响应时间 < 3 秒

* [x] 页面切换无明显延迟

* [x] 图片/SVG 优化

## 部署

* [ ] Git 仓库推送到 GitHub

* [ ] Vercel 项目创建成功

* [ ] 环境变量在 Vercel 配置正确

* [ ] 部署成功，可通过链接访问

* [ ] 线上版本全流程测试通过

