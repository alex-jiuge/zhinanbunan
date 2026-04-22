'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TagList } from '@/components/analysis/TagList';

interface JDAnalysisResult {
  roleOverview: { title: string; reality: string; seniority: string };
  dailyWork: { task: string; frequency: string; description: string }[];
  skillRequirements: { mustHave: string[]; niceToHave: string[]; hiddenRequirements: string[] };
  salaryRange: { entry: string; mid: string; senior: string };
  redFlags: string[];
  matchAnalysis: { overallMatch: number; matchedSkills: string[]; gapSkills: string[]; suggestions: string[] };
}

export default function JDAnalyzerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<JDAnalysisResult | null>(null);
  const [form, setForm] = useState({
    jdText: '',
    targetRole: '',
  });

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analysis/jd', {
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

      <h1 className="mb-8 text-3xl font-bold">📝 JD 智能翻译器</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>粘贴 JD</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">目标岗位（选填）</label>
              <Input
                value={form.targetRole}
                onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
                placeholder="如：产品经理"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">粘贴招聘描述</label>
              <Textarea
                value={form.jdText}
                onChange={(e) => setForm({ ...form, jdText: e.target.value })}
                placeholder="岗位职责：...\n任职要求：..."
                className="min-h-[200px]"
              />
              <p className="mt-1 text-xs text-slate-500">{form.jdText.length}/5000 字</p>
            </div>
            <Button onClick={handleAnalyze} disabled={loading || !form.jdText.trim()} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? '翻译中...' : '开始翻译 →'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <div className="space-y-4">
            {result.roleOverview && (
              <Card>
                <CardHeader>
                  <CardTitle>📋 岗位真相</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-lg font-semibold">{result.roleOverview.title} ({result.roleOverview.seniority})</p>
                  <p className="text-sm text-slate-600">{result.roleOverview.reality}</p>
                </CardContent>
              </Card>
            )}

            {result.skillRequirements && (
              <Card>
                <CardHeader>
                  <CardTitle>🎯 能力要求拆解</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="mb-1 text-sm font-medium text-emerald-600">必备:</p>
                    <TagList tags={result.skillRequirements.mustHave} variant="success" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-sky-600">加分:</p>
                    <TagList tags={result.skillRequirements.niceToHave} variant="info" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-amber-600">⚠️ 隐性要求:</p>
                    <TagList tags={result.skillRequirements.hiddenRequirements} variant="warning" />
                  </div>
                </CardContent>
              </Card>
            )}

            {result.salaryRange && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-600">
                    💰 薪资参考: 应届 {result.salaryRange.entry} | 3年 {result.salaryRange.mid} | 5年+ {result.salaryRange.senior}
                  </p>
                </CardContent>
              </Card>
            )}

            {result.redFlags && result.redFlags.length > 0 && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="pt-6">
                  <h3 className="mb-2 font-semibold text-red-600">🚩 红旗警告</h3>
                  <ul className="list-disc space-y-1 pl-5 text-sm text-red-600">
                    {result.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {result.matchAnalysis && (
              <Card>
                <CardHeader>
                  <CardTitle>📊 与你的匹配度</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${result.matchAnalysis.overallMatch}%` }}
                    />
                  </div>
                  <p className="text-sm font-medium">综合匹配度 {result.matchAnalysis.overallMatch}%</p>
                  <div>
                    <p className="mb-1 text-sm font-medium text-emerald-600">✅ 匹配技能:</p>
                    <TagList tags={result.matchAnalysis.matchedSkills} variant="success" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium text-amber-600">❌ 差距技能:</p>
                    <TagList tags={result.matchAnalysis.gapSkills} variant="warning" />
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium">💡 建议:</p>
                    <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                      {result.matchAnalysis.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
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
