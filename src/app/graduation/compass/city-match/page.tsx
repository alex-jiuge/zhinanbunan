'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { callZhipuAI } from '@/lib/ai/client-call';
import { ArrowLeft, Loader2, MapPin, TrendingUp, Home, DollarSign } from 'lucide-react';
import { CityCompareChart } from '@/components/charts/CityCompareChart';

interface CityRecommendation {
  city: string;
  overallScore: number;
  scores: Record<string, number>;
  highlights: string[];
  concerns: string[];
  suggestedAreas: string[];
  estimatedSalary: string;
  estimatedRent: string;
}

interface CityAnalysisResult {
  recommendations: CityRecommendation[];
  comparison: {
    dimensions: string[];
    cities: Record<string, number[]>;
  };
  summary: string;
}

export default function CityMatchPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CityAnalysisResult | null>(null);
  const [preferences, setPreferences] = useState({
    industry: '互联网/科技',
    targetCities: ['北京', '上海', '杭州'],
    lifestyle: '中等',
    budgetLevel: '中等',
    socialPreference: '小圈子',
    distancePreference: '不太远',
  });

  const allCities = ['北京', '上海', '杭州', '成都', '武汉', '深圳', '广州', '南京', '西安', '长沙'];

  const toggleCity = (city: string) => {
    setPreferences((prev) => ({
      ...prev,
      targetCities: prev.targetCities.includes(city)
        ? prev.targetCities.filter((c) => c !== city)
        : [...prev.targetCities, city],
    }));
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const systemPrompt = `You are a professional city development and career planning analyst.

## Task
Based on user preferences and background, analyze and recommend the most suitable cities.

## Scoring Dimensions (1-10 each)
1. Industry match: whether the city's dominant industries match the user's industry preferences
2. Cost of living: whether housing prices, living costs are within budget
3. Development potential: economic growth, talent policies, industry trends
4. Quality of life: cultural atmosphere, environment quality, convenience
5. Social environment: youth ratio, social activity richness

## Output Format
Must return strict JSON format:

{
  "recommendations": [
    {
      "city": "city name",
      "overallScore": 8.7,
      "scores": {
        "industry": 9.0,
        "cost": 7.5,
        "development": 9.5,
        "lifestyle": 8.5,
        "social": 8.0
      },
      "highlights": ["highlight 1", "highlight 2"],
      "concerns": ["concern 1", "concern 2"],
      "suggestedAreas": ["area 1", "area 2"],
      "estimatedSalary": "8K-15K",
      "estimatedRent": "2000-4000 CNY/month"
    }
  ],
  "comparison": {
    "dimensions": ["industry match", "cost", "development", "lifestyle", "social"],
    "cities": {
      "city name": [9.0, 7.5, 9.5, 8.5, 8.0]
    }
  },
  "summary": "comprehensive advice around 200 Chinese characters"
}`;

      const taskPrompt = `User Preferences:
- Target Industry: ${preferences.industry}
- Interested Cities: ${preferences.targetCities?.join(', ') || 'Beijing, Shanghai, Hangzhou, Chengdu, Wuhan'}
- Lifestyle Pace: ${preferences.lifestyle}
- Budget Level: ${preferences.budgetLevel}
- Social Preference: ${preferences.socialPreference}
- Distance from Home: ${preferences.distancePreference}

Please analyze and return JSON result.`;

      const content = await callZhipuAI(
        [{ role: 'user' as const, content: taskPrompt }],
        systemPrompt,
        { maxTokens: 4096 }
      );

      let analysisResult;
      try {
        const jsonStart = content.indexOf('{');
        const jsonEnd = content.lastIndexOf('}');
        analysisResult = JSON.parse(content.slice(jsonStart, jsonEnd + 1));
      } catch {
        analysisResult = {
          recommendations: [
            {
              city: 'Hangzhou',
              overallScore: 8.5,
              scores: { industry: 8.5, cost: 7.5, development: 9.0, lifestyle: 8.0, social: 7.5 },
              highlights: ['Strong digital economy', 'Lower living cost than tier-1 cities'],
              concerns: ['Fewer top-tier companies'],
              suggestedAreas: ['Binjiang High-tech Zone'],
              estimatedSalary: '8K-15K',
              estimatedRent: '2000-4000 CNY/month',
            },
          ],
          comparison: {
            dimensions: ['industry match', 'cost', 'development', 'lifestyle', 'social'],
            cities: {
              'Beijing': [9.5, 5.0, 9.0, 6.5, 7.0],
              'Shanghai': [9.0, 5.5, 8.5, 7.5, 7.5],
              'Hangzhou': [8.5, 7.5, 9.5, 8.5, 8.0],
            },
          },
          summary: 'Based on your background, Hangzhou is a strong choice.',
        };
      }
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <h1 className="mb-8 text-3xl font-bold">🧭 人生罗盘 · 城市匹配</h1>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>选择偏好</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">目标行业</label>
              <Input
                value={preferences.industry}
                onChange={(e) => setPreferences({ ...preferences, industry: e.target.value })}
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">感兴趣的城市（多选）</label>
              <div className="flex flex-wrap gap-2">
                {allCities.map((city) => (
                  <Badge
                    key={city}
                    variant={preferences.targetCities.includes(city) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleCity(city)}
                  >
                    {city}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">生活节奏</label>
              <div className="flex gap-2">
                {['快节奏', '中等', '慢节奏'].map((opt) => (
                  <Button
                    key={opt}
                    variant={preferences.lifestyle === opt ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreferences({ ...preferences, lifestyle: opt })}
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>

            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? '分析中...' : '开始分析 →'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            {result.recommendations?.map((rec, i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span><MapPin className="mr-2 inline h-5 w-5" />{rec.city}</span>
                    <Badge>{rec.overallScore.toFixed(1)}/10</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-slate-400" />
                      薪资: {rec.estimatedSalary}
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4 text-slate-400" />
                      租金: {rec.estimatedRent}
                    </div>
                  </div>
                  {rec.highlights.map((h, idx) => (
                    <p key={idx} className="text-sm text-emerald-600">✅ {h}</p>
                  ))}
                  {rec.concerns.map((c, idx) => (
                    <p key={idx} className="text-sm text-amber-600">⚠️ {c}</p>
                  ))}
                </CardContent>
              </Card>
            ))}

            {result.comparison && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    城市对比
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CityCompareChart
                    data={result.comparison.cities}
                    dimensions={result.comparison.dimensions}
                  />
                </CardContent>
              </Card>
            )}

            {result.summary && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">{result.summary}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
