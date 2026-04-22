'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TagList } from '@/components/analysis/TagList';

interface TransferableSkill {
  skill: string;
  description: string;
  applicableRoles: string[];
  transferDifficulty: string;
}

interface CareerPath {
  direction: string;
  matchScore: number;
  why: string;
  gaps: string[];
  actionPlan: string[];
}

interface MajorAnalysisResult {
  majorOverview: {
    name: string;
    category: string;
    coreSkills: string[];
    employmentRate: string;
    commonDirections: string[];
  };
  transferableSkills: TransferableSkill[];
  careerPaths: CareerPath[];
  coldMajorAdvice: {
    mindset: string;
    strategies: string[];
    successCases: string[];
  };
}

export default function MajorAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MajorAnalysisResult | null>(null);
  const [form, setForm] = useState({
    major: '',
    grade: '大三',
    concerns: '',
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analysis/major', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      setResult(data);
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

      <h1 className="mb-8 text-3xl font-bold">📚 学业自救 · 专业分析</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>输入专业信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">你的专业</label>
              <Input
                value={form.major}
                onChange={(e) => setForm({ ...form, major: e.target.value })}
                placeholder="如：哲学"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">当前年级</label>
              <div className="flex gap-2">
                {['大一', '大二', '大三', '大四'].map((g) => (
                  <Button
                    key={g}
                    variant={form.grade === g ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setForm({ ...form, grade: g })}
                  >
                    {g}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">你目前最大的困惑</label>
              <Textarea
                value={form.concerns}
                onChange={(e) => setForm({ ...form, concerns: e.target.value })}
                placeholder="不知道毕业后能做什么..."
              />
            </div>
            <Button onClick={handleAnalyze} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? '分析中...' : '开始分析 →'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-6">
            {result.majorOverview && (
              <Card>
                <CardHeader>
                  <CardTitle>📊 专业全景</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm">
                    <span className="font-medium">专业:</span> {result.majorOverview.name} | {result.majorOverview.category}
                  </p>
                  <p className="text-sm"><span className="font-medium">就业率:</span> {result.majorOverview.employmentRate}</p>
                  <div>
                    <p className="mb-1 text-sm font-medium">核心能力:</p>
                    <TagList tags={result.majorOverview.coreSkills} variant="info" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium">常见方向:</p>
                    <TagList tags={result.majorOverview.commonDirections} />
                  </div>
                </CardContent>
              </Card>
            )}

            {result.transferableSkills && (
              <Card>
                <CardHeader>
                  <CardTitle>🔄 可迁移技能分析</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {result.transferableSkills.map((skill, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="font-medium">{skill.skill}</p>
                      <p className="mt-1 text-sm text-slate-600">{skill.description}</p>
                      <p className="mt-1 text-sm">适用: <TagList tags={skill.applicableRoles} variant="success" /></p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.careerPaths && (
              <Card>
                <CardHeader>
                  <CardTitle>🛤️ 推荐职业路径</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.careerPaths.map((path, i) => (
                    <div key={i} className="rounded-lg border p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-semibold">{path.direction}</p>
                        <Badge>{path.matchScore}/10</Badge>
                      </div>
                      <p className="text-sm text-slate-600">{path.why}</p>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-amber-600">差距: {path.gaps.join('、')}</p>
                      </div>
                      <div className="mt-2">
                        <p className="text-sm font-medium text-emerald-600">行动: {path.actionPlan.join(' → ')}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {result.coldMajorAdvice && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle>💡 冷门专业破局建议</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm italic">{result.coldMajorAdvice.mindset}</p>
                  <div>
                    <p className="mb-1 text-sm font-medium">策略:</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm">
                      {result.coldMajorAdvice.strategies.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium">成功案例:</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-emerald-700">
                      {result.coldMajorAdvice.successCases.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
