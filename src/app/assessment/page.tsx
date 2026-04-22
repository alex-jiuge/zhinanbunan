"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import {
  ASSESSMENT_QUESTIONS,
  calculateHollandScores,
  getDominantType,
  HOLLAND_DIMENSION_LABELS,
  HOLLAND_DIMENSION_CAREERS,
  HOLLAND_DIMENSION_DESCRIPTIONS,
  type AssessmentAnswer,
  type HollandScore,
  type HollandDimension,
} from "@/types/assessment";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "compass:assessment-progress";

export default function AssessmentPage() {
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);
  const [scores, setScores] = useState<HollandScore[]>([]);
  const [userId, setUserId] = useState<string>("");
  const { success } = useToast();

  useEffect(() => {
    const storedId = localStorage.getItem("compass:userId");
    if (storedId) setUserId(storedId);

    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        if (progress.answers && progress.answers.length > 0) {
          setAnswers(progress.answers);
          setCurrentIndex(progress.currentIndex || 0);
          setStarted(true);
        }
      } catch {
        // Invalid saved progress, start fresh
      }
    }
  }, []);

  const saveProgress = useCallback(
    (currentAnswers: AssessmentAnswer[], currentIdex: number) => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ answers: currentAnswers, currentIndex: currentIdex })
      );
    },
    []
  );

  const handleAnswer = (value: number) => {
    const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
    const newAnswers = answers.filter((a) => a.questionId !== currentQuestion.id);
    newAnswers.push({ questionId: currentQuestion.id, value });
    setAnswers(newAnswers);
    saveProgress(newAnswers, currentIndex);

    if (currentIndex < ASSESSMENT_QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const calculatedScores = calculateHollandScores(answers);
    setScores(calculatedScores);
    setCompleted(true);

    localStorage.removeItem(STORAGE_KEY);

    const result = {
      id: `assessment_${Date.now()}`,
      userId,
      answers,
      scores: calculatedScores,
      dominantType: getDominantType(calculatedScores),
      completedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const existingResults = JSON.parse(localStorage.getItem("compass:assessments") || "[]");
    existingResults.push(result);
    localStorage.setItem("compass:assessments", JSON.stringify(existingResults));

    success("测评完成", "你的职业性格测评结果已保存");
  };

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Holland 职业兴趣测评</CardTitle>
              <CardDescription className="text-base">
                基于 Holland RIASEC 职业兴趣理论，帮你发现最适合的职业方向
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted/50 p-4 space-y-3">
                <h3 className="font-semibold">测评说明</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• 共 24 道题目，预计用时 8-10 分钟</li>
                  <li>• 每道题请根据第一直觉选择符合程度</li>
                  <li>• 进度自动保存，刷新页面可恢复</li>
                  <li>• 结果将用于个性化推荐和成长路径规划</li>
                </ul>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {Object.entries(HOLLAND_DIMENSION_LABELS).map(([key, label]) => (
                  <div key={key} className="flex items-start gap-2 text-sm">
                    <span className="font-medium">{label.split(" ")[0]}</span>
                    <span className="text-muted-foreground">
                      {HOLLAND_DIMENSION_DESCRIPTIONS[key as HollandDimension]}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                onClick={() => setStarted(true)}
                className="w-full h-11"
                size="lg"
              >
                开始测评
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/" className="block text-center text-sm text-muted-foreground hover:text-foreground">
                返回首页
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (completed) {
    const dominantType = getDominantType(scores);
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold mb-2">测评完成！</h1>
              <p className="text-muted-foreground">
                你的主导职业类型是：
                <span className="font-semibold text-primary">
                  {" "}
                  {HOLLAND_DIMENSION_LABELS[dominantType].split(" ")[0]}
                </span>
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>六维度得分</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {scores
                  .sort((a, b) => b.score - a.score)
                  .map((score) => (
                    <div key={score.dimension} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{score.label}</span>
                        <span>{score.score}%</span>
                      </div>
                      <Progress value={score.score} className="h-2" />
                    </div>
                  ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>适合职业方向</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {HOLLAND_DIMENSION_CAREERS[dominantType].map((career) => (
                    <span
                      key={career}
                      className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full h-11">返回首页</Button>
              </Link>
              <Button className="flex-1 h-11">查看成长路径</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentQuestion = ASSESSMENT_QUESTIONS[currentIndex];
  const progress = ((currentIndex + 1) / ASSESSMENT_QUESTIONS.length) * 100;
  const likertOptions = [
    { value: 1, label: "非常不符合" },
    { value: 2, label: "不太符合" },
    { value: 3, label: "一般" },
    { value: 4, label: "比较符合" },
    { value: 5, label: "非常符合" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={handlePrevious} disabled={currentIndex === 0}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              上一题
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {ASSESSMENT_QUESTIONS.length}
            </span>
          </div>

          <Progress value={progress} className="h-2" />

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-lg">{currentQuestion.text}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {likertOptions.map((option) => {
                const isSelected = answers.find(
                  (a) => a.questionId === currentQuestion.id && a.value === option.value
                );
                return (
                  <Button
                    key={option.value}
                    variant={isSelected ? "default" : "outline"}
                    className="w-full h-11 justify-start text-left"
                    onClick={() => handleAnswer(option.value)}
                  >
                    <span className="flex-1">{option.label}</span>
                    <span className="text-sm opacity-60">{option.value}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          {currentIndex === ASSESSMENT_QUESTIONS.length - 1 && answers.length === ASSESSMENT_QUESTIONS.length && (
            <Button onClick={handleSubmit} className="w-full h-11" size="lg">
              提交测评
              <CheckCircle className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
