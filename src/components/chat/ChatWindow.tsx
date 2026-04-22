import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Message } from '@/types';
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { SummaryButton } from './SummaryButton';
import type { ConversationSummary } from '@/types/chat';

interface ChatWindowProps {
  messages: Message[];
  isLoading?: boolean;
  className?: string;
  conversationId?: string;
  userId?: string;
  onSummaryComplete?: (summary: ConversationSummary) => void;
}

export function ChatWindow({
  messages,
  isLoading = false,
  className,
  conversationId,
  userId,
  onSummaryComplete,
}: ChatWindowProps) {
  return (
    <ScrollArea className={cn('h-full w-full rounded-lg flex-1 min-h-0', className)}>
      <div className="flex flex-col gap-3 px-3 py-3 sm:gap-4 sm:px-4 sm:py-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={message.id || index}
            message={message}
            animationDelay={index * 100}
          />
        ))}
        {isLoading && <TypingIndicator />}
        {!isLoading && conversationId && userId && messages.length >= 2 && (
          <div className="flex justify-end">
            <SummaryButton
              conversationId={conversationId}
              userId={userId}
              messageCount={messages.length}
              onSummaryComplete={onSummaryComplete}
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
