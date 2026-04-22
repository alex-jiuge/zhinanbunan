"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/campus", label: "在校成长" },
  { href: "/graduation", label: "毕业决策" },
  { href: "/internships", label: "实习推荐" },
  { href: "/onboarding", label: "自我认知" },
  { href: "/assessment", label: "职业测评" },
  { href: "/career-path", label: "成长路径" },
  { href: "/profile", label: "我的信息" },
  { href: "/chat-history", label: "对话历史" },
  { href: "/admin/prompt-manager", label: "提示词管理" },
  { href: "/admin/model-config", label: "模型配置" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative">
            <Compass className="h-7 w-7 text-primary transition-transform group-hover:rotate-12" />
            <div className="absolute inset-0 h-7 w-7 rounded-full bg-primary/10 blur-sm -z-10" />
          </div>
          <span className="font-bold text-lg gradient-text">指南不南</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-foreground/70 transition-all hover:text-foreground hover:bg-primary/5 rounded-md"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "关闭菜单" : "打开菜单"}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {isOpen && (
        <nav className="md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2.5 text-sm text-foreground/70 transition-all hover:text-foreground hover:bg-primary/5 rounded-md"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
