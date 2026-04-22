"use client"

import { useState } from "react"
import { Loader2, FileText, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import type { ConversationSummary } from "@/types/chat"

interface SummaryButtonProps {
  conversationId: string
  userId: string
  messageCount: number
  onSummaryComplete?: (summary: ConversationSummary) => void
  disabled?: boolean
}

export function SummaryButton({
  conversationId,
  userId,
  messageCount,
  onSummaryComplete,
  disabled = false,
}: SummaryButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const { success, error: showError, warning } = useToast()

  const handleGenerateSummary = async () => {
    if (isGenerating || disabled) return

    if (messageCount < 2) {
      warning("对话内容不足", "至少需要2条消息才能生成总结")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/conversations/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId, userId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "总结生成失败")
      }

      const data = await response.json()

      if (data.success && data.summary) {
        success("总结生成成功", "对话已生成结构化总结")
        onSummaryComplete?.(data.summary)
      } else {
        throw new Error(data.error || "总结生成失败")
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "未知错误"
      showError("总结生成失败", message)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleGenerateSummary}
      disabled={isGenerating || disabled}
      variant="outline"
      size="sm"
      className="gap-2"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          生成总结中...
        </>
      ) : (
        <>
          <FileText className="h-4 w-4" />
          生成对话总结
          <Sparkles className="h-3 w-3 text-amber-500" />
        </>
      )}
    </Button>
  )
}
