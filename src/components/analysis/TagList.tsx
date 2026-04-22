import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface TagListProps {
  tags: string[];
  variant?: 'default' | 'success' | 'warning' | 'info';
  className?: string;
}

export function TagList({ tags, variant = 'default', className }: TagListProps) {
  const variantMap = {
    default: '',
    success: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
    warning: 'bg-amber-100 text-amber-700 hover:bg-amber-100',
    info: 'bg-sky-100 text-sky-700 hover:bg-sky-100',
  };

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {tags.map((tag, index) => (
        <Badge
          key={index}
          variant="secondary"
          className={cn(variant !== 'default' && variantMap[variant])}
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}
