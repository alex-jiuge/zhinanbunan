import Link from "next/link";
import { Compass, Heart, ExternalLink } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "产品功能",
      links: [
        { href: "/onboarding", label: "自我认知" },
        { href: "/campus", label: "在校成长" },
        { href: "/graduation", label: "毕业决策" },
        { href: "/chat-history", label: "对话历史" },
      ],
    },
    {
      title: "管理工具",
      links: [
        { href: "/admin/prompt-manager", label: "提示词管理" },
        { href: "/admin/model-config", label: "模型配置" },
      ],
    },
    {
      title: "关于项目",
      links: [
        { href: "/profile", label: "我的信息" },
        { href: "/", label: "返回首页" },
      ],
    },
  ];

  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Compass className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg gradient-text">指南不南</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
              AI 全周期人生决策伴侣，陪伴大学生走过每一个关键决策时刻。从{"\u201c"}不知道自己是谁{"\u201d"}到{"\u201c"}找到自己的人生方向{"\u201d"}。
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Heart className="h-4 w-4 text-red-500" />
              <span>TRAE × 脉脉「AI 无限职场」SOLO 挑战赛</span>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm mb-3">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} 指南不南. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <ExternalLink className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
