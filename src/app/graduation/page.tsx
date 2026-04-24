import Link from 'next/link';
import {
  Compass,
  Users,
  FileText,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const graduationFeatures = [
  {
    icon: Compass,
    title: '人生罗盘',
    desc: '基于 AI 画像推荐最适合的城市，从行业匹配、生活成本、发展潜力等多维度分析',
    href: '/graduation/compass/city-match',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: '家庭沟通桥',
    desc: '生成给爸妈看的职业说明书，用他们能理解的方式解释你的工作',
    href: '/graduation/family-bridge',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: FileText,
    title: 'JD 翻译器',
    desc: '招聘描述深度解析，看穿岗位要求背后的真实需求',
    href: '/graduation/career/jd-analyzer',
    color: 'from-amber-500 to-orange-500',
  },
];

export default function GraduationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            毕业决策专区
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            毕业不迷茫
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            城市选择、家庭沟通、职位解析——陪你走好毕业前的每一步
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {graduationFeatures.map((item, index) => (
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

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            返回首页
          </Link>
        </div>
      </div>
    </main>
  );
}
