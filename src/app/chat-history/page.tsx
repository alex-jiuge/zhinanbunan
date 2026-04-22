"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SummaryCard } from "@/components/chat/SummaryCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Search, Filter, Merge, Eye, Trash2, ArrowLeft } from "lucide-react"
import type { ConversationSummary } from "@/types/chat"
import { useToast } from "@/hooks/use-toast"

export default function ChatHistoryPage() {
  const [summaries, setSummaries] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [featureFilter, setFeatureFilter] = useState("all")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [selectedSummaries, setSelectedSummaries] = useState<Set<string>>(new Set())
  const [viewingSummary, setViewingSummary] = useState<ConversationSummary | null>(null)
  const [userId, setUserId] = useState<string>("")

  const { success, error: showError, warning } = useToast()

  useEffect(() => {
    const storedId = localStorage.getItem("compass:userId")
    if (storedId) {
      setUserId(storedId)
    }
  }, [])

  const loadSummaries = useCallback(async () => {
    if (!userId) return

    try {
      const response = await fetch(
        `/api/conversations/summaries?userId=${userId}&featureKey=${featureFilter === "all" ? "" : featureFilter}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      )

      if (!response.ok) throw new Error("Failed to load summaries")

      const data = await response.json()
      if (data.success) {
        setSummaries(data.summaries)
      }
    } catch {
      showError("加载失败", "无法加载对话历史")
    } finally {
      setLoading(false)
    }
  }, [userId, featureFilter, sortBy, sortOrder, showError])

  useEffect(() => {
    loadSummaries()
  }, [loadSummaries])

  const handleSelectSummary = (id: string) => {
    const newSelected = new Set(selectedSummaries)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedSummaries(newSelected)
  }

  const handleMergeSelected = async () => {
    if (selectedSummaries.size < 2) {
      warning("选择不足", "请至少选择2个对话进行合并")
      return
    }

    try {
      const response = await fetch("/api/conversations/merge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationIds: Array.from(selectedSummaries),
          userId,
        }),
      })

      if (!response.ok) throw new Error("Merge failed")

      const data = await response.json()
      if (data.success) {
        success("合并成功", "已生成合并总结")
        setSelectedSummaries(new Set())
        loadSummaries()
      }
    } catch {
      showError("合并失败", "无法合并对话")
    }
  }

  const handleDeleteSummary = async (id: string) => {
    if (!confirm("确定删除此对话总结吗？")) return

    try {
      const response = await fetch(`/api/conversations/summaries?id=${id}&userId=${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Delete failed")

      const data = await response.json()
      if (data.success) {
        success("删除成功", "已删除对话总结")
        loadSummaries()
      }
    } catch {
      showError("删除失败", "无法删除对话")
    }
  }

  const filteredSummaries = summaries.filter((s) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      s.title.toLowerCase().includes(query) ||
      s.content.toLowerCase().includes(query) ||
      s.keyQuestions.some((q) => q.toLowerCase().includes(query)) ||
      s.coreConclusions.some((c) => c.toLowerCase().includes(query))
    )
  })

  const featureKeys = Array.from(new Set(summaries.map((s) => s.featureKey)))

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">对话历史</h1>
              <p className="text-muted-foreground mt-1">查看和管理您的所有对话总结</p>
            </div>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              返回
            </Button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="搜索对话总结..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={featureFilter} onValueChange={(value) => value && setFeatureFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="功能筛选" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">全部功能</SelectItem>
                {featureKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={(value) => value && setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">按时间</SelectItem>
                <SelectItem value="title">按标题</SelectItem>
                <SelectItem value="messages">按消息数</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(value) => value && setSortOrder(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="排序顺序" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">降序</SelectItem>
                <SelectItem value="asc">升序</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {selectedSummaries.size >= 2 && (
            <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-lg">
              <Badge variant="secondary">已选择 {selectedSummaries.size} 个对话</Badge>
              <Button onClick={handleMergeSelected} size="sm">
                <Merge className="h-4 w-4 mr-2" />
                合并总结
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedSummaries(new Set())}>
                取消选择
              </Button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">加载中...</p>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-xl text-muted-foreground mb-2">暂无对话历史</p>
            <p className="text-sm text-muted-foreground">完成对话后点击{"生成对话总结"}即可在此查看</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSummaries.map((summary) => (
              <div key={summary.id} className="relative">
                <SummaryCard
                  summary={summary}
                  onClick={() => setViewingSummary(summary)}
                  onSelect={() => handleSelectSummary(summary.id)}
                  selected={selectedSummaries.has(summary.id)}
                  showActions
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      setViewingSummary(summary)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteSummary(summary.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Dialog open={!!viewingSummary} onOpenChange={() => setViewingSummary(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {viewingSummary && (
              <>
                <DialogHeader>
                  <DialogTitle>{viewingSummary.title}</DialogTitle>
                  <DialogDescription>
                    {viewingSummary.featureKey} · {viewingSummary.messageCount} 条消息
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  <div>
                    <h3 className="font-semibold mb-2">总结内容</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {viewingSummary.content}
                    </p>
                  </div>

                  <Separator />

                  {viewingSummary.keyQuestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">关键问题</h3>
                      <ul className="space-y-2">
                        {viewingSummary.keyQuestions.map((q, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {q}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {viewingSummary.coreConclusions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">核心结论</h3>
                      <ul className="space-y-2">
                        {viewingSummary.coreConclusions.map((c, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            ✓ {c}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {viewingSummary.importantSteps.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">重要步骤</h3>
                      <ol className="space-y-2">
                        {viewingSummary.importantSteps.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            {i + 1}. {s}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {viewingSummary.suggestions.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2">建议</h3>
                      <ul className="space-y-2">
                        {viewingSummary.suggestions.map((s, i) => (
                          <li key={i} className="text-sm text-muted-foreground">
                            • {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  )
}
