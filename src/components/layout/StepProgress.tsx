import { cn } from '@/lib/utils';

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function StepProgress({ currentStep, totalSteps, className }: StepProgressProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'h-2 w-8 rounded-full transition-all duration-300',
            index + 1 <= currentStep ? 'bg-primary' : 'bg-slate-200'
          )}
        />
      ))}
      <span className="ml-2 text-xs text-slate-500">
        {currentStep}/{totalSteps}
      </span>
    </div>
  );
}
