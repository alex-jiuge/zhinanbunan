'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { RadarChartComponent } from '@/components/charts/RadarChart';
import { UserProfile } from '@/types';

export default function RadarPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem('compass-user-profile');
    if (storedProfile) {
      try {
        setProfile(JSON.parse(storedProfile));
      } catch {
        setProfile(null);
      }
    }
  }, []);

  const radarData = profile
    ? [
        { dimension: '学术', score: profile.academicScore || 0, fullMark: 10 },
        { dimension: '实践', score: profile.practiceScore || 0, fullMark: 10 },
        { dimension: '社交', score: profile.socialScore || 0, fullMark: 10 },
        { dimension: '技能', score: profile.skillScore || 0, fullMark: 10 },
        { dimension: '心理', score: profile.mentalScore || 0, fullMark: 10 },
      ]
    : [];

  const dimensions = [
    { name: '学术', key: 'academicScore', icon: '📚', label: '学术维度', desc: '逻辑分析、批判性思维' },
    { name: '实践', key: 'practiceScore', icon: '🛠️', label: '实践维度', desc: '项目经验、实习经历' },
    { name: '社交', key: 'socialScore', icon: '👥', label: '社交维度', desc: '人际沟通、团队协作' },
    { name: '技能', key: 'skillScore', icon: '🔧', label: '技能维度', desc: '工具使用、专业技能' },
    { name: '心理', key: 'mentalScore', icon: '🧠', label: '心理维度', desc: '抗压能力、自我认知' },
  ];

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <h1 className="mb-8 text-3xl font-bold">📊 能力雷达图</h1>
        <Card className="mx-auto max-w-2xl">
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-lg text-slate-600">请先完成自我认知探索</p>
            <Button onClick={() => router.push('/onboarding')}>
              开始探索 →
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <h1 className="mb-8 text-3xl font-bold">📊 能力雷达图</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>你的能力雷达图</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChartComponent data={radarData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>各维度详情</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dimensions.map((dim) => {
              const score = profile[dim.key as keyof UserProfile] as number || 0;
              return (
                <div key={dim.key} className="rounded-lg border p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-medium">
                      {dim.icon} {dim.label}
                    </p>
                    <span className="text-sm text-slate-500">
                      {score}/10 {score >= 7 ? '优势' : score >= 5 ? '良好' : '待提升'}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${(score / 10) * 100}%` }}
                    />
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{dim.desc}</p>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {profile.summary && (
          <Card>
            <CardHeader>
              <CardTitle>💡 AI 成长建议</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{profile.summary}</p>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={() => router.push('/onboarding')}>
            <RefreshCw className="mr-2 h-4 w-4" />
            重新评估
          </Button>
        </div>
      </div>
    </div>
  );
}
