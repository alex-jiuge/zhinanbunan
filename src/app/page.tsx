import { Metadata } from 'next';
import Link from 'next/link';
import {
  Compass,
  BookOpen,
  FileText,
  BarChart3,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Users,
  Target,
  Lightbulb,
} from 'lucide-react';

export const metadata: Metadata = {
  title: '指南不南 - AI 全周期人生决策伴侣',
  description: '从\u201c不知道自己是谁\u201d到\u201c找到自己的人生方向\u201d\u2014\u2014指南不南，陪伴大学生走过每一个关键决策',
};

const features = [
  {
    icon: Compass,
    title: '人生罗盘',
    desc: '基于 AI 画像推荐最适合的城市',
    href: '/graduation/compass/city-match',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: '家庭沟通桥',
    desc: '生成给爸妈看的职业说明书',
    href: '/graduation/family-bridge',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: BookOpen,
    title: '学业自救',
    desc: '专业真相揭秘 + 冷门专业破局',
    href: '/campus/academic/major-analysis',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: FileText,
    title: 'JD 翻译器',
    desc: '招聘描述深度解析',
    href: '/graduation/career/jd-analyzer',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: '能力雷达',
    desc: '五维能力可视化评估',
    href: '/campus/navigator/radar',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: MessageSquare,
    title: 'AI 对话',
    desc: '自我认知探索',
    href: '/onboarding',
    color: 'from-indigo-500 to-blue-500',
  },
];

const stats = [
  { icon: Target, label: '精准定位', desc: '找到最适合你的方向' },
  { icon: Lightbulb, label: 'AI 驱动', desc: '智能分析与建议' },
  { icon: Users, label: '全程陪伴', desc: '大学四年不断线' },
  { icon: Sparkles, label: '个性定制', desc: '专属你的成长路径' },
];

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-200/30 via-transparent to-transparent" />
        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <div className="mx-auto max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="h-4 w-4" />
              AI 全周期人生决策伴侣
            </div>
            <h1 className="mb-6 text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              从不知道自己是谁
              <br />
              <span className="gradient-text">到找到自己的人生方向</span>
            </h1>
            <p className="mb-10 text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              AI 陪伴你走过大学每一个关键决策，从自我认知到职业规划，让选择不再困难
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
              <Link
                href="/onboarding"
                className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-primary px-8 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                开始探索
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/campus"
                className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center rounded-xl border bg-white px-8 font-medium text-foreground shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">核心功能</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              六大功能模块，覆盖大学全周期成长路径
            </p>
          </div>
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="group relative rounded-2xl border bg-white p-6 shadow-sm hover-lift transition-all overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${item.color} text-white mb-4`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                  <div className="mt-4 flex items-center text-sm text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    开始使用 <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-white to-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-2xl bg-white shadow-sm">
                <div className="inline-flex p-3 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-1">{stat.label}</h3>
                <p className="text-sm text-muted-foreground">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-indigo-50 p-6 sm:p-8 md:p-12 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <Compass className="h-6 w-6 text-primary" />
                <h2 className="text-xl sm:text-2xl font-bold">小明的故事</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  小明，大三，冷门专业（哲学），不知道毕业后能做什么。爸妈让他考公，但他想去大城市闯一闯。
                  同时和女朋友面临毕业异地。
                </p>
                <p>
                  通过指南不南的三层引导，小明第一次真正了解了自己的优势和价值观，
                  发现了哲学专业的可迁移技能，找到了适合的城市，生成了给爸妈看的职业说明书，
                  评估了异地关系的可行性。
                </p>
                <p className="font-medium text-foreground">
                  最终带着清晰的方向和家人的理解，自信地迈向社会。
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">准备好开始了吗？</h2>
          <p className="mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            让 AI 成为你的成长伙伴，一起探索无限可能
          </p>
          <Link
            href="/onboarding"
            className="inline-flex h-11 sm:h-12 w-full sm:w-auto items-center justify-center rounded-xl bg-white text-primary px-8 font-medium shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            立即开始探索
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
