'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { callZhipuAI } from '@/lib/ai/client-call';
import { ArrowLeft, Loader2, Copy } from 'lucide-react';

const CONCERNS_OPTIONS = ['工作不稳定', '不是铁饭碗', '加班太多', '离家太远', '薪资不高', '发展受限'];

interface FamilyBridgeResult {
  parentFriendlyDescription: {
    title: string;
    analogy: string;
    stability: string;
    income: string;
    development: string;
  };
  dataPoints: { claim: string; counterData: string }[];
  conversationGuide: { parentSays: string; suggestedReply: string }[];
  compromiseSuggestions: string[];
}

export default function FamilyBridgePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<FamilyBridgeResult | null>(null);
  const [form, setForm] = useState({
    targetCareer: '',
    targetCity: '',
    parentConcerns: [] as string[],
    childArguments: '',
  });

  const toggleConcern = (concern: string) => {
    setForm((prev) => ({
      ...prev,
      parentConcerns: prev.parentConcerns.includes(concern)
        ? prev.parentConcerns.filter((c) => c !== concern)
        : [...prev.parentConcerns, concern],
    }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const systemPrompt = `You are a psychology consultant and career planner specializing in family communication.

## Output Format
Must return strictly valid JSON:

{
  "parentFriendlyDescription": {
    "title": "Introduction title for parents",
    "analogy": "Use real-life analogy to explain this career",
    "stability": "Objective analysis of stability",
    "income": "Objective analysis of income (with specific numbers)",
    "development": "Objective analysis of development prospects"
  },
  "dataPoints": [
    {
      "claim": "Possible parent concern",
      "counterData": "Specific data to address it"
    }
  ],
  "conversationGuide": [
    {
      "parentSays": "What parents might say",
      "suggestedReply": "Suggested reply"
    }
  ],
  "compromiseSuggestions": [
    "Compromise suggestion 1",
    "Compromise suggestion 2"
  ]
}`;

      const concernsText = form.parentConcerns?.join(', ') || '';
      const childText = form.childArguments ? `Child's thoughts: ${form.childArguments}` : '';
      const taskPrompt = `Target Career: ${form.targetCareer}\nTarget City: ${form.targetCity}\nParent Concerns: ${concernsText}\n${childText}\n\nPlease generate a communication plan and return JSON results.`;

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
          parentFriendlyDescription: {
            title: `What is a ${form.targetCareer}?`,
            analogy: 'Like a core coordinator of a team',
            stability: 'Although not a government job, industry demand is high',
            income: 'Starting salary is generally 8000-15000 RMB',
            development: 'Can progress to management roles',
          },
          dataPoints: [{ claim: 'Is it stable?', counterData: 'Industry demand continues to grow' }],
          conversationGuide: [{ parentSays: 'Is this job stable?', suggestedReply: 'The industry has large demand, it is easy to find another job' }],
          compromiseSuggestions: ['Try for 1-2 years first', 'Prefer large companies, relatively more stable'],
        };
      }
      setResult(analysisResult);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const desc = result.parentFriendlyDescription;
    const text = `${desc.title}\n\n${desc.analogy}\n\n稳定性: ${desc.stability}\n收入: ${desc.income}\n发展: ${desc.development}`;
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <h1 className="mb-8 text-3xl font-bold">👨‍👩‍👧 家庭沟通桥</h1>

      <div className="mx-auto max-w-3xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>填写信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">你想从事的职业/行业</label>
              <Input
                value={form.targetCareer}
                onChange={(e) => setForm({ ...form, targetCareer: e.target.value })}
                placeholder="如：互联网产品经理"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">目标城市</label>
              <Input
                value={form.targetCity}
                onChange={(e) => setForm({ ...form, targetCity: e.target.value })}
                placeholder="如：杭州"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">爸妈的主要担忧（多选）</label>
              <div className="flex flex-wrap gap-2">
                {CONCERNS_OPTIONS.map((concern) => (
                  <Badge
                    key={concern}
                    variant={form.parentConcerns.includes(concern) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => toggleConcern(concern)}
                  >
                    {concern}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">你想对爸妈说的话（选填）</label>
              <Textarea
                value={form.childArguments}
                onChange={(e) => setForm({ ...form, childArguments: e.target.value })}
                placeholder="我喜欢这个方向..."
              />
            </div>
            <Button onClick={handleGenerate} disabled={loading} className="w-full">
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? '生成中...' : '生成沟通方案 →'}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>📄 给爸妈看的一分钟介绍</CardTitle>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                复制全文
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 rounded-lg bg-sky-50 p-4">
                <p className="font-semibold">{result.parentFriendlyDescription.title}</p>
                <p className="text-sm text-slate-600">{result.parentFriendlyDescription.analogy}</p>
                <p className="text-sm"><span className="font-medium">稳定性:</span> {result.parentFriendlyDescription.stability}</p>
                <p className="text-sm"><span className="font-medium">收入:</span> {result.parentFriendlyDescription.income}</p>
                <p className="text-sm"><span className="font-medium">发展:</span> {result.parentFriendlyDescription.development}</p>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">💬 模拟对话指南</h3>
                <div className="space-y-3">
                  {result.conversationGuide.map((item, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="text-sm font-medium text-amber-600">爸妈: {item.parentSays}</p>
                      <p className="mt-1 text-sm text-emerald-600">建议: {item.suggestedReply}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">🤝 折中方案</h3>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {result.compromiseSuggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
