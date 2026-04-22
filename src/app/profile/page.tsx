'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, GraduationCap, Briefcase, Heart, History } from 'lucide-react';
import { UserInfoManager } from '@/lib/user-info/manager';
import type { CompleteUserInfo, UserInfoChangeRecord } from '@/types/user-info';

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'basic' | 'education' | 'career' | 'life' | 'history'>('basic');
  const [userInfo, setUserInfo] = useState<CompleteUserInfo | null>(null);
  const [userId] = useState(() => {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem('compass:user-id') || '';
  });
  const [changes, setChanges] = useState<UserInfoChangeRecord[]>([]);

  useEffect(() => {
    if (!userId) return;
    const info = UserInfoManager.getCompleteInfo(userId);
    setUserInfo(info);
    const history = UserInfoManager.getChangeHistory(userId);
    setChanges(history);
  }, [userId]);

  if (!userId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回
        </Button>
        <Card>
          <CardContent className="py-12 text-center text-slate-500">
            请先完成自我认知探索
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = userInfo ? new Date().getFullYear() - userInfo.basic.birthYear : 0;

  const tabs = [
    { key: 'basic' as const, label: '基础信息', icon: User },
    { key: 'education' as const, label: '教育经历', icon: GraduationCap },
    { key: 'career' as const, label: '职业信息', icon: Briefcase },
    { key: 'life' as const, label: '生活状态', icon: Heart },
    { key: 'history' as const, label: '变更历史', icon: History },
  ];

  const getChangeTypeLabel = (type: string) => {
    const map: Record<string, { label: string; color: string }> = {
      user_provided: { label: '用户提供', color: 'bg-blue-100 text-blue-800' },
      ai_inferred: { label: 'AI 推断', color: 'bg-purple-100 text-purple-800' },
      system_updated: { label: '系统更新', color: 'bg-green-100 text-green-800' },
    };
    return map[type] || { label: type, color: 'bg-gray-100 text-gray-800' };
  };

  const getCategoryLabel = (cat: string) => {
    const map: Record<string, string> = {
      basic: '基础信息',
      education: '教育经历',
      career: '职业信息',
      life: '生活状态',
    };
    return map[cat] || cat;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">我的信息</h1>
        <p className="mt-2 text-slate-500">管理你的个人信息，AI 将基于这些信息提供更精准的建议</p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon className="mr-2 h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {activeTab === 'basic' && userInfo && (
        <Card>
          <CardHeader>
            <CardTitle>基础身份信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">年龄</label>
                <p className="text-lg">{age} 岁</p>
                <p className="text-xs text-slate-400">出生年份：{userInfo.basic.birthYear} 年（自动计算）</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">专业</label>
                <p className="text-lg">{userInfo.basic.major || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">专业大类</label>
                <p className="text-lg">{userInfo.basic.majorCategory || '未设置'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'education' && userInfo && (
        <Card>
          <CardHeader>
            <CardTitle>教育经历</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">学校</label>
                <p className="text-lg">{userInfo.education.school || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">学校类型</label>
                <p className="text-lg">{userInfo.education.schoolType || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">当前年级</label>
                <p className="text-lg">{userInfo.education.currentGrade || '未设置'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">毕业状态</label>
                <p className="text-lg">
                  {userInfo.education.graduationStatus === 'pending' ? '待毕业' : userInfo.education.graduationStatus === 'graduated' ? '已毕业' : '读研'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-500">预计毕业时间</label>
                <p className="text-lg">{userInfo.education.graduationDate || '未设置'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'career' && userInfo && (
        <Card>
          <CardHeader>
            <CardTitle>职业信息</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-500">当前状态</label>
              <p className="text-lg">
                {{ studying: '在校学习', interning: '实习中', employed: '已就业', unemployed: '待业', freelance: '自由职业' }[userInfo.career.workStatus] || '未设置'}
              </p>
            </div>
            {userInfo.career.currentRole && (
              <div>
                <label className="text-sm font-medium text-slate-500">当前岗位</label>
                <p className="text-lg">{userInfo.career.currentRole}</p>
              </div>
            )}
            {userInfo.career.workDescription && (
              <div>
                <label className="text-sm font-medium text-slate-500">工作内容</label>
                <p className="text-lg">{userInfo.career.workDescription}</p>
              </div>
            )}
            {userInfo.career.workTimeline && userInfo.career.workTimeline.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-500">工作经历</label>
                <div className="mt-2 space-y-2">
                  {userInfo.career.workTimeline.map((exp, idx) => (
                    <div key={idx} className="rounded-lg border p-3">
                      <p className="font-medium">{exp.role} @ {exp.company}</p>
                      <p className="text-sm text-slate-500">{exp.startDate} - {exp.endDate || '至今'}</p>
                      {exp.description && <p className="text-sm text-slate-600 mt-1">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'life' && userInfo && (
        <Card>
          <CardHeader>
            <CardTitle>个人生活状态</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-500">婚姻状况</label>
                <p className="text-lg">
                  {{ single: '单身', dating: '恋爱中', married: '已婚', divorced: '离异' }[userInfo.lifeStatus.maritalStatus] || '未设置'}
                </p>
              </div>
              {userInfo.lifeStatus.relationshipStatus && (
                <div>
                  <label className="text-sm font-medium text-slate-500">关系描述</label>
                  <p className="text-lg">{userInfo.lifeStatus.relationshipStatus}</p>
                </div>
              )}
              {userInfo.lifeStatus.livingCity && (
                <div>
                  <label className="text-sm font-medium text-slate-500">居住城市</label>
                  <p className="text-lg">{userInfo.lifeStatus.livingCity}</p>
                </div>
              )}
              {userInfo.lifeStatus.livingArrangement && (
                <div>
                  <label className="text-sm font-medium text-slate-500">居住安排</label>
                  <p className="text-lg">{userInfo.lifeStatus.livingArrangement}</p>
                </div>
              )}
            </div>
            {userInfo.lifeStatus.hobbies && userInfo.lifeStatus.hobbies.length > 0 && (
              <div>
                <label className="text-sm font-medium text-slate-500">兴趣爱好</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {userInfo.lifeStatus.hobbies.map((hobby, idx) => (
                    <Badge key={idx} variant="secondary">{hobby}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === 'history' && (
        <Card>
          <CardHeader>
            <CardTitle>信息变更历史</CardTitle>
          </CardHeader>
          <CardContent>
            {changes.length === 0 ? (
              <p className="py-8 text-center text-slate-500">暂无变更记录</p>
            ) : (
              <div className="space-y-3">
                {changes.map((record) => {
                  const typeInfo = getChangeTypeLabel(record.changeType);
                  return (
                    <div key={record.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{getCategoryLabel(record.category)}</Badge>
                        <Badge className={typeInfo.color}>{typeInfo.label}</Badge>
                      </div>
                      <p className="text-sm">
                        <span className="font-medium">{record.field}</span>: {String(record.oldValue)} → {String(record.newValue)}
                      </p>
                      {record.notes && <p className="text-xs text-slate-500 mt-1">{record.notes}</p>}
                      <p className="text-xs text-slate-400 mt-1">{new Date(record.timestamp).toLocaleString()}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
