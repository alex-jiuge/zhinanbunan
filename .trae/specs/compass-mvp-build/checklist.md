# 指南不南 MVP 开发检查清单

## 项目基础
- [ ] Next.js 15 项目成功初始化（npm run dev 正常运行）
- [ ] Tailwind CSS 4 配置正确，全局样式生效
- [ ] shadcn/ui 组件正常导入和使用
- [ ] TypeScript 严格模式开启，无 any 类型
- [ ] 环境变量配置正确（.env.local 存在）
- [ ] 项目目录结构完整（app/, components/, lib/, store/, types/, hooks/, data/）
- [ ] Git 仓库初始化

## 类型系统
- [ ] types/user.ts 包含 User, UserProfile, Grade 类型定义
- [ ] types/chat.ts 包含 Message, Conversation, ChatRole 类型定义
- [ ] types/analysis.ts 包含所有分析结果类型（CityAnalysis, MajorAnalysis, JDAnalysis, FamilyBridgeResult）
- [ ] types/city.ts 包含 CityData, CityScores, CityPreferences 类型定义
- [ ] 所有类型导出并在项目中使用

## AI 基础设施
- [ ] lib/ai/client.ts 正确配置 DeepSeek API 客户端
- [ ] 环境变量正确读取（DEEPSEEK_API_KEY, DEEPSEEK_BASE_URL, DEEPSEEK_MODEL）
- [ ] API 连通性测试通过
- [ ] 所有 Prompt 模板文件存在（self-exploration, city-match, major-analysis, jd-parser, family-bridge）
- [ ] Prompt 注册表（index.ts）正确导出所有 Prompt
- [ ] use-chat Hook 支持流式输出
- [ ] use-chat Hook 支持自定义 systemPrompt
- [ ] 对话历史保存/恢复功能正常

## 数据存储
- [ ] use-local-storage Hook 实现类型安全的读写
- [ ] localStorage 错误处理完善（存储空间不足、浏览器不支持）
- [ ] Zustand user-store 管理用户状态
- [ ] Zustand chat-store 管理对话状态
- [ ] userId 自动生成并持久化

## 对话 UI 组件
- [ ] ChatWindow 组件正确管理消息列表和滚动
- [ ] MessageBubble 区分用户和 AI 样式（AI 左对齐浅蓝背景，用户右对齐主色背景）
- [ ] ChatInput 支持文本输入和发送
- [ ] TypingIndicator 显示 AI 思考动画
- [ ] WelcomeMessage 显示欢迎语
- [ ] 消息出现动画生效（淡入 + 上滑）

## 分析和图表组件
- [ ] RadarChart 正确渲染五维雷达图
- [ ] CityCompareChart 正确渲染城市对比柱状图
- [ ] ScoreBar 正确显示分数进度条
- [ ] AnalysisCard 正确展示分析结果
- [ ] StructuredOutput 正确渲染 AI 结构化 JSON 输出
- [ ] TagList 正确展示标签列表

## 布局组件
- [ ] Header 显示 Logo 和导航
- [ ] Footer 显示比赛信息和版权
- [ ] AppSidebar 区分 campus 和 graduation 路由
- [ ] MobileNav 在移动端正确显示底部导航
- [ ] StepProgress 正确显示步骤进度

## 自我认知引擎
- [ ] /onboarding 页面正确加载
- [ ] 8 步对话流程完整实现
- [ ] 每步快捷回复按钮显示正确
- [ ] 进度自动保存（刷新页面可恢复）
- [ ] 跳过功能正常（至少 5 步才能生成画像）
- [ ] 用户画像生成逻辑正确
- [ ] 画像保存到 localStorage 成功
- [ ] 画像各维度完整（性格、价值观、兴趣、能力、生活方式、雷达分数）

## 首页仪表盘
- [ ] / 页面正确加载
- [ ] HeroSection 显示主视觉和 CTA 按钮
- [ ] FeatureGrid 显示 6 个功能模块卡片
- [ ] 未完成自我认知：CTA 跳转到 /onboarding
- [ ] 已完成自我认知：显示"欢迎回来"和画像摘要
- [ ] 功能卡片点击跳转正确
- [ ] UserStory 展示小明的故事

## 城市匹配模块
- [ ] /graduation/compass/city-match 页面正确加载
- [ ] 偏好选择表单完整（行业、城市、节奏、预算、社交、距离）
- [ ] 城市多选功能正常
- [ ] 分析结果正确渲染
- [ ] 城市对比柱状图正确显示
- [ ] 各城市详情卡片完整（亮点、顾虑、薪资、租金、推荐区域）
- [ ] AI 综合建议显示
- [ ] 保存/重新分析功能正常
- [ ] /api/analysis/city 接口正常工作

## 家庭沟通桥模块
- [ ] /graduation/family-bridge 页面正确加载
- [ ] 信息填写表单完整（职业、城市、父母担忧、想说的话）
- [ ] 父母担忧多选功能正常
- [ ] 结果展示完整（职业说明书、对话指南、折中方案）
- [ ] 复制全文功能正常（Clipboard API）
- [ ] /api/analysis/family-bridge 接口正常工作

## 专业分析模块
- [ ] /campus/academic/major-analysis 页面正确加载
- [ ] 专业信息输入表单完整（专业、年级、困惑）
- [ ] 冷门专业破局建议显示
- [ ] 可迁移技能展示正确
- [ ] 职业路径推荐完整（匹配度、差距、行动建议）
- [ ] /api/analysis/major 接口正常工作

## JD 翻译器模块
- [ ] /graduation/career/jd-analyzer 页面正确加载
- [ ] JD 粘贴输入框正常工作（限制 5000 字）
- [ ] 岗位真相展示（真实工作内容、典型一天）
- [ ] 能力要求拆解完整（必备、加分、隐性）
- [ ] 薪资参考显示
- [ ] 红旗警告显示
- [ ] 匹配度分析显示（已完成自我认知的用户）
- [ ] /api/analysis/jd 接口正常工作

## 能力雷达图
- [ ] /campus/navigator/radar 页面正确加载
- [ ] 雷达图正确渲染五维数据
- [ ] 各维度详情展示（分数、评价、描述）
- [ ] AI 成长建议显示
- [ ] 数据来源于用户画像

## 响应式适配
- [ ] 移动端（< 640px）单列布局，底部导航显示
- [ ] 平板（640-1024px）布局合理
- [ ] 桌面端（> 1024px）双列布局（侧边栏 + 内容区）
- [ ] 所有组件在移动端显示正常
- [ ] 触摸交互正常

## 错误处理
- [ ] AI API 超时处理（10 秒超时）
- [ ] AI API 限流错误处理（429）
- [ ] AI 返回格式错误处理（JSON 解析失败）
- [ ] 网络断开错误提示
- [ ] localStorage 空间不足错误处理
- [ ] 表单验证错误提示

## 动画和交互
- [ ] AI 消息出现动画生效
- [ ] 页面切换动画生效
- [ ] 卡片展开/收起动画生效
- [ ] 进度条平滑过渡
- [ ] AI 思考动画（跳动圆点）
- [ ] 按钮点击反馈
- [ ] Loading 状态显示正确

## 性能
- [ ] npm run build 无错误
- [ ] Lighthouse 性能评分 > 80
- [ ] AI 首字响应时间 < 3 秒
- [ ] 页面切换无明显延迟
- [ ] 图片/SVG 优化

## 部署
- [ ] Git 仓库推送到 GitHub
- [ ] Vercel 项目创建成功
- [ ] 环境变量在 Vercel 配置正确
- [ ] 部署成功，可通过链接访问
- [ ] 线上版本全流程测试通过
