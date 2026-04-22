'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Edit, Trash2, Copy, BookOpen, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { migrateExistingPrompts } from '@/lib/ai/prompt-manager/migrate';
import { PromptManager } from '@/lib/ai/prompt-manager/manager';
import type { PromptCategory } from '@/lib/ai/prompt-manager/types';

interface PromptTemplateData {
  id: string;
  name: string;
  category: string;
  status: string;
  description: string;
  systemPrompt: string;
  variables: Array<{ key: string; label: string; type: string; defaultValue: string }>;
  tags: string[];
  usageCount: number;
  currentVersion: number;
  updatedAt: string;
}

export default function PromptManagerPage() {
  const router = useRouter();
  const { success } = useToast();
  const [templates, setTemplates] = useState<PromptTemplateData[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplateData | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'custom',
    description: '',
    systemPrompt: '',
    tags: '',
  });
  const [activeTab, setActiveTab] = useState<'templates' | 'knowledge'>('templates');
  const [knowledge, setKnowledge] = useState<Array<{ id: string; title: string; category: string; tags: string[] }>>([]);

  useEffect(() => {
    migrateExistingPrompts();
    loadTemplates();
    loadKnowledge();
  }, []);

  const loadTemplates = () => {
    const all = PromptManager.listTemplates();
    setTemplates(all as PromptTemplateData[]);
  };

  const loadKnowledge = () => {
    const entries = PromptManager.searchKnowledge('');
    setKnowledge(entries);
  };

  const handleCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', category: 'custom', description: '', systemPrompt: '', tags: '' });
    setShowForm(true);
  };

  const handleEdit = (template: PromptTemplateData) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      category: template.category,
      description: template.description,
      systemPrompt: template.systemPrompt,
      tags: template.tags.join(', '),
    });
    setShowForm(true);
  };

  const handleSave = () => {
    if (editingTemplate) {
      PromptManager.updateTemplate(editingTemplate.id, {
        name: formData.name,
        category: formData.category as PromptCategory,
        description: formData.description,
        systemPrompt: formData.systemPrompt,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    } else {
      PromptManager.createTemplate({
        name: formData.name,
        category: formData.category as PromptCategory,
        description: formData.description,
        systemPrompt: formData.systemPrompt,
        variables: [],
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
    }
    setShowForm(false);
    loadTemplates();
  };

  const handleDelete = (id: string) => {
    if (confirm('确定删除此提示词？')) {
      PromptManager.deleteTemplate(id);
      loadTemplates();
    }
  };

  const handleCopy = (template: PromptTemplateData) => {
    navigator.clipboard.writeText(template.systemPrompt);
    success('复制成功', '提示词已复制到剪贴板');
  };

  const filteredTemplates = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredKnowledge = knowledge.filter(
    (k) =>
      k.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      k.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusMap: Record<string, { label: string; color: string }> = {
    draft: { label: '草稿', color: 'bg-gray-200 text-gray-700' },
    active: { label: '启用', color: 'bg-emerald-100 text-emerald-700' },
    archived: { label: '归档', color: 'bg-amber-100 text-amber-700' },
    testing: { label: '测试中', color: 'bg-sky-100 text-sky-700' },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">提示词管理系统</h1>
        <div className="flex gap-2">
          <Button variant={activeTab === 'templates' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('templates')}>
            提示词模板
          </Button>
          <Button variant={activeTab === 'knowledge' ? 'default' : 'outline'} size="sm" onClick={() => setActiveTab('knowledge')}>
            <BookOpen className="mr-2 h-4 w-4" />
            知识库
          </Button>
          {activeTab === 'templates' && (
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              新建提示词
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索提示词..."
            className="pl-10"
          />
        </div>
      </div>

      {activeTab === 'templates' && (
        <>
          {showForm && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{editingTemplate ? '编辑提示词' : '新建提示词'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">名称</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="提示词名称"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">分类</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="flex h-10 w-full rounded-md border bg-background px-3 py-2"
                    >
                      <option value="self-exploration">自我认知</option>
                      <option value="city-match">城市匹配</option>
                      <option value="major-analysis">专业分析</option>
                      <option value="jd-parser">JD 解析</option>
                      <option value="family-bridge">家庭沟通桥</option>
                      <option value="custom">自定义</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">描述</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="提示词用途描述"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">提示词内容</label>
                  <Textarea
                    value={formData.systemPrompt}
                    onChange={(e) => setFormData({ ...formData, systemPrompt: e.target.value })}
                    placeholder="输入提示词内容，使用 {{variable}} 表示变量"
                    className="min-h-[200px] font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">标签（逗号分隔）</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="如：career, analysis"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave}>保存</Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>取消</Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {filteredTemplates.map((template) => {
              const statusInfo = statusMap[template.status] || statusMap.draft;
              return (
                <Card key={template.id} className="transition-all hover:shadow-md">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-2 flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{template.name}</h3>
                          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                          <Badge variant="outline">v{template.currentVersion}</Badge>
                        </div>
                        <p className="mb-2 text-sm text-slate-600">{template.description}</p>
                        <div className="flex flex-wrap gap-2 text-xs text-slate-500">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                          ))}
                          <span className="ml-auto">
                            使用次数: {template.usageCount} | 更新: {new Date(template.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(template)} title="复制提示词">
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(template)} title="编辑">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(template.id)} title="删除">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredTemplates.length === 0 && (
              <Card>
                <CardContent className="py-12 text-center text-slate-500">
                  暂无提示词，点击 &quot;新建提示词&quot; 开始创建
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}

      {activeTab === 'knowledge' && (
        <div className="space-y-4">
          {filteredKnowledge.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{entry.title}</h3>
                    <p className="text-sm text-slate-500 capitalize">{entry.category}</p>
                    <div className="mt-2 flex gap-1">
                      {entry.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredKnowledge.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-slate-500">
                暂无知识库条目
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
