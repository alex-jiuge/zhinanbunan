import { cn } from '@/lib/utils';
import { Message } from '@/types';
import { Bot, User } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
  animationDelay?: number;
}

export function MessageBubble({ message, animationDelay = 0 }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-300',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <div
        className={cn(
          'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-sky-100 text-sky-600'
        )}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={cn(
          'max-w-[85%] sm:max-w-[75%] rounded-xl px-4 py-3 text-sm',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-sky-50 text-slate-800'
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}
