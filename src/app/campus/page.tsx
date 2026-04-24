import Link from 'next/link';
import {
  BookOpen,
  BarChart3,
  ArrowRight,
  GraduationCap,
  Compass,
  Sparkles,
} from 'lucide-react';

const campusFeatures = [
  {
    icon: BookOpen,
    title: '学业自救',
    desc: '专业真相揭秘 + 冷门专业破局，了解你的专业真实就业前景',
    href: '/campus/academic/major-analysis',
    color: 'from-purple-500 to-violet-500',
  },
  {
    icon: BarChart3,
    title: '能力雷达',
    desc: '五维能力可视化评估，发现你的优势与成长空间',
    href: '/campus/navigator/radar',
    color: 'from-green-500 to-emerald-500',
  },
];

const graduationFeatures = [
  {
    icon: Compass,
    title: '人生罗盘',
    desc: '基于 AI 画像推荐最适合的城市',
    href: '/graduation/compass/city-match',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: GraduationCap,
    title: '家庭沟通桥',
    desc: '生成给爸妈看的职业说明书',
    href: '/graduation/family-bridge',
    color: 'from-pink-500 to-rose-500',
  },
];

export default function CampusPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            功能导航中心
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight mb-4">
            探索全部功能
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            无论你是大一大二探索自我，还是大三大四规划未来，这里都有适合你的工具
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-12">
          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">在校</span>
              校园成长阶段
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
              {campusFeatures.map((item, index) => (
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
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">毕业</span>
              毕业决策阶段
            </h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
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
          </section>
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
