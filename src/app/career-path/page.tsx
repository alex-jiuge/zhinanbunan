"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckSquare, Clock, Square, Target, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import {
  DEFAULT_CAREER_PATHS,
  type CareerPath,
  type PathStage,
  type PathActionItem,
  type ActionItemStatus,
} from "@/types/career-path";

const STORAGE_KEY = "compass:career-path-progress";

const STATUS_CONFIG: Record<ActionItemStatus, { label: string; color: string; next: ActionItemStatus }> = {
  "not-started": { label: "未开始", color: "bg-gray-400", next: "in-progress" },
  "in-progress": { label: "进行中", color: "bg-blue-500", next: "completed" },
  completed: { label: "已完成", color: "bg-green-500", next: "not-started" },
};

function getStatusIcon(status: ActionItemStatus) {
  switch (status) {
    case "not-started":
      return <Square className="h-5 w-5 text-gray-400" />;
    case "in-progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    case "completed":
      return <CheckSquare className="h-5 w-5 text-green-500" />;
  }
}

function StageTimeline({ stage, index, total }: { stage: PathStage; index: number; total: number }) {
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const completedCount = stage.actionItems.filter((item) => item.status === "completed").length;
  const progressPercent = stage.actionItems.length > 0 ? (completedCount / stage.actionItems.length) * 100 : 0;

  return (
    <div className="relative">
      {index < total - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-border" />
      )}
      
      <Card className="shadow-md hover:shadow-lg transition-shadow">
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">{index + 1}</span>
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <button
                className="w-full text-left"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-semibold">{stage.name}</h3>
                    <p className="text-sm text-muted-foreground">{stage.timeline}</p>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                </div>
              </button>
              
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">进度</span>
                  <span className="font-medium">{completedCount}/{stage.actionItems.length}</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
              </div>
              
              {isExpanded && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      阶段目标
                    </h4>
                    <ul className="space-y-1">
                      {stage.goals.map((goal, goalIndex) => (
                        <li key={goalIndex} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {goal}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">行动项</h4>
                    <div className="space-y-2">
                      {stage.actionItems.map((item) => (
                        <ActionItemRow key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActionItemRow({ item }: { item: PathActionItem }) {
  const [status, setStatus] = useState<ActionItemStatus>(item.status);

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.actionItems && progress.actionItems[item.id]) {
          setStatus(progress.actionItems[item.id]);
        }
      } catch {
        // Invalid saved data, use default
      }
    }
  }, [item.id]);

  const toggleStatus = () => {
    const nextStatus = STATUS_CONFIG[status].next;
    setStatus(nextStatus);

    const savedProgress = localStorage.getItem(STORAGE_KEY);
    let progress: { actionItems: Record<string, ActionItemStatus> } = { actionItems: {} };
    if (savedProgress) {
      try {
        progress = JSON.parse(savedProgress);
      } catch {
        // Invalid saved data, start fresh
      }
    }
    progress.actionItems[item.id] = nextStatus;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  };

  const config = STATUS_CONFIG[status];

  return (
    <div
      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={toggleStatus}
    >
      <div className="flex-shrink-0 mt-0.5">
        {getStatusIcon(status)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`font-medium ${status === "completed" ? "line-through text-muted-foreground" : ""}`}>
            {item.title}
          </span>
          <Badge variant="secondary" className={`${config.color} text-white text-xs`}>
            {config.label}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        {item.estimatedHours && (
          <p className="text-xs text-muted-foreground mt-1">
            预计耗时: {item.estimatedHours} 小时
          </p>
        )}
      </div>
    </div>
  );
}

export default function CareerPathPage() {
  const [careerPath, setCareerPath] = useState<CareerPath | null>(null);

  useEffect(() => {
    setCareerPath(DEFAULT_CAREER_PATHS[0]);
  }, []);

  if (!careerPath) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">加载中...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const totalItems = careerPath.stages.reduce(
    (sum, stage) => sum + stage.actionItems.length,
    0
  );
  const completedItems = careerPath.stages.reduce(
    (sum, stage) => sum + stage.actionItems.filter((item) => item.status === "completed").length,
    0
  );
  const overallProgress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">{careerPath.title}</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{careerPath.description}</p>
          </div>

          <Card className="shadow-md">
            <CardContent className="p-4 sm:p-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">目标职位</p>
                  <p className="font-semibold text-lg">{careerPath.targetRole}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">预计时长</p>
                  <p className="font-semibold text-lg">{careerPath.estimatedDuration}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">总体进度</p>
                  <p className="font-semibold text-lg">{completedItems}/{totalItems}</p>
                </div>
              </div>
              <div className="mt-4">
                <Progress value={overallProgress} className="h-3" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {careerPath.stages.map((stage, index) => (
              <StageTimeline
                key={stage.id}
                stage={stage}
                index={index}
                total={careerPath.stages.length}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
