interface ScoreBarProps {
  score: number;
  maxScore?: number;
  label?: string;
  className?: string;
}

export function ScoreBar({ score, maxScore = 10, label, className }: ScoreBarProps) {
  const percentage = (score / maxScore) * 100;

  return (
    <div className={className}>
      {label && <p className="mb-1 text-sm font-medium">{label}</p>}
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div
          className="h-2 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-500">{score}/{maxScore}</p>
    </div>
  );
}
