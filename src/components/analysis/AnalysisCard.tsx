import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AnalysisCardProps {
  title: string;
  score?: number;
  highlights?: string[];
  concerns?: string[];
  details?: Record<string, string>;
  className?: string;
}

export function AnalysisCard({ title, score, highlights = [], concerns = [], details, className }: AnalysisCardProps) {
  return (
    <Card className={cn('transition-all duration-300 hover:shadow-lg', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {score !== undefined && (
            <Badge variant={score >= 7 ? 'default' : score >= 5 ? 'secondary' : 'destructive'}>
              {score}/10
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {highlights.length > 0 && (
          <div className="mb-3">
            {highlights.map((item, index) => (
              <p key={index} className="text-sm text-emerald-600">✅ {item}</p>
            ))}
          </div>
        )}
        {concerns.length > 0 && (
          <div className="mb-3">
            {concerns.map((item, index) => (
              <p key={index} className="text-sm text-amber-600">⚠️ {item}</p>
            ))}
          </div>
        )}
        {details && (
          <div className="space-y-2">
            {Object.entries(details).map(([key, value]) => (
              <p key={key} className="text-sm">
                <span className="font-medium">{key}:</span> {value}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
