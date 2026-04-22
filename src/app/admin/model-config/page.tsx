'use client';

import { ModelRegistry, UsageTracker, FEATURE_INFO_MAP } from '@/lib/ai/model-registry';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Settings, BarChart3, Plus, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import type { ModelConfig, FeatureModelBinding, ModelProvider } from '@/lib/ai/model-registry/types';

interface ModelStatsSummary {
  totalCalls: number;
  totalTokens: number;
  modelStats: Record<string, { calls: number; tokens: number; successRate: number }>;
}

export default function ModelConfigPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'config' | 'stats'>('config');
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [bindings, setBindings] = useState<FeatureModelBinding[]>([]);
  const [showAddModel, setShowAddModel] = useState(false);
  const [newModel, setNewModel] = useState<{ name: string; provider: ModelProvider; baseUrl: string; apiKey: string; modelId: string; temperature: number; maxTokens: number }>({ name: '', provider: 'custom', baseUrl: '', apiKey: '', modelId: '', temperature: 0.7, maxTokens: 4096 });
  const [stats, setStats] = useState<ModelStatsSummary | null>(null);
  const [featureStats, setFeatureStats] = useState<Record<string, { totalCalls: number; totalTokens: number; modelBreakdown: Record<string, number> }>>({});

  useEffect(() => {
    ModelRegistry.initialize();
    loadConfig();
    loadStats();
  }, []);

  const loadConfig = () => {
    setModels(ModelRegistry.getAllConfigs());
    setBindings(ModelRegistry.getAllBindings());
  };

  const loadStats = () => {
    setStats(UsageTracker.getSummary(24) as ModelStatsSummary);
    const fs: Record<string, { totalCalls: number; totalTokens: number; modelBreakdown: Record<string, number> }> = {};
    Object.keys(FEATURE_INFO_MAP).forEach(key => {
      fs[key] = UsageTracker.getFeatureUsage(key, 24);
    });
    setFeatureStats(fs);
  };

  const handleSaveBinding = (featureKey: string, primaryModelId: string) => {
    const binding = bindings.find(b => b.featureKey === featureKey);
    const fallbacks = binding?.fallbackModelIds || [];
    ModelRegistry.setBinding(featureKey, primaryModelId, fallbacks);
    loadConfig();
  };

  const handleAddModel = () => {
    ModelRegistry.createConfig({
      ...newModel,
      enabled: true,
      priority: models.length + 1,
      maxContextLength: 128000,
    });
    setShowAddModel(false);
    setNewModel({ name: '', provider: 'custom' as ModelProvider, baseUrl: '', apiKey: '', modelId: '', temperature: 0.7, maxTokens: 4096 });
    loadConfig();
  };

  const chartData = stats ? Object.entries(stats.modelStats).map(([id, s]) => ({
    name: models.find(m => m.id === id)?.name || id,
    calls: s.calls,
    tokens: Math.round(s.tokens / 1000),
  })) : [];

  const featureChartData = Object.entries(FEATURE_INFO_MAP).map(([key, info]) => ({
    name: info.name,
    calls: featureStats[key]?.totalCalls || 0,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI 模型配置</h1>
        <div className="flex gap-2">
          <Button variant={activeTab === 'config' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('config')}>
            <Settings className="mr-2 h-4 w-4" />
            模型配置
          </Button>
          <Button variant={activeTab === 'stats' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('stats')}>
            <BarChart3 className="mr-2 h-4 w-4" />
            使用统计
          </Button>
        </div>
      </div>

      {activeTab === 'config' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>功能模块模型绑定</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bindings.map((binding) => (
                <div key={binding.featureKey} className="flex items-center gap-4 rounded-lg border p-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{binding.featureName}</h3>
                    <p className="text-sm text-slate-500">{binding.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={binding.primaryModelId}
                      onChange={(e) => handleSaveBinding(binding.featureKey, e.target.value)}
                      className="rounded-md border px-3 py-2"
                    >
                      {models.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                    <Badge variant="outline">备选: {binding.fallbackModelIds.length}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>已配置模型</CardTitle>
              <Button size="sm" onClick={() => setShowAddModel(!showAddModel)}>
                <Plus className="mr-2 h-4 w-4" />
                添加模型
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showAddModel && (
                <div className="rounded-lg border p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="模型名称" value={newModel.name} onChange={e => setNewModel({...newModel, name: e.target.value})} />
                    <select
                      value={newModel.provider}
                      onChange={e => setNewModel({...newModel, provider: e.target.value as ModelProvider})}
                      className="rounded-md border px-3 py-2"
                    >
                      <option value="zhipu">智谱 AI</option>
                      <option value="longcat">LongCat</option>
                      <option value="openai-compatible">OpenAI 兼容</option>
                      <option value="custom">自定义</option>
                    </select>
                  </div>
                  <Input placeholder="Base URL" value={newModel.baseUrl} onChange={e => setNewModel({...newModel, baseUrl: e.target.value})} />
                  <Input placeholder="API Key" type="password" value={newModel.apiKey} onChange={e => setNewModel({...newModel, apiKey: e.target.value})} />
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder="Model ID" value={newModel.modelId} onChange={e => setNewModel({...newModel, modelId: e.target.value})} />
                    <Input type="number" placeholder="Temperature" value={newModel.temperature} onChange={e => setNewModel({...newModel, temperature: parseFloat(e.target.value) || 0.7})} />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleAddModel}>保存</Button>
                    <Button variant="outline" onClick={() => setShowAddModel(false)}>取消</Button>
                  </div>
                </div>
              )}
              {models.map(model => (
                <div key={model.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <h3 className="font-medium">{model.name}</h3>
                    <p className="text-sm text-slate-500">{model.modelId} · {model.provider}</p>
                  </div>
                  <Badge variant={model.enabled ? 'default' : 'secondary'}>{model.enabled ? '启用' : '禁用'}</Badge>
                </div>
              ))}
              {models.length === 0 && (
                <p className="py-8 text-center text-slate-500">暂无模型配置</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="space-y-6">
          {stats && (
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-500">总调用次数 (24h)</p>
                  <p className="text-3xl font-bold">{stats.totalCalls}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-500">总 Token 消耗 (24h)</p>
                  <p className="text-3xl font-bold">{(stats.totalTokens / 1000).toFixed(1)}K</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-sm text-slate-500">平均成功率</p>
                  <p className="text-3xl font-bold">
                    {stats.totalCalls > 0 ? Math.round(Object.values(stats.modelStats).reduce((sum, s) => sum + s.calls * s.successRate, 0) / stats.totalCalls * 100) : 0}%
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle>各模型调用次数</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能模块使用分布</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={featureChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="calls" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {!stats?.totalCalls && (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                暂无使用数据，开始使用 AI 功能后这里会显示统计信息
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
