import { Compass } from 'lucide-react';

interface WelcomeMessageProps {
  title?: string;
  description?: string;
}

export function WelcomeMessage({ title = '你好，我是你的 AI 伙伴小航', description = '我将陪你一起探索自己，找到人生的方向。准备好了吗？' }: WelcomeMessageProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <Compass size={20} />
      </div>
      <div className="rounded-xl bg-sky-50 px-4 py-3 text-slate-800">
        <p className="font-medium">{title}</p>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}
