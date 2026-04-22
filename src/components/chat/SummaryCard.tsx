"use client"

import { formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  MessageSquare,
  Clock,
  ArrowRight,
  Star,
  CheckCircle,
  ListTodo,
  Lightbulb,
} from "lucide-react"
import type { ConversationSummary } from "@/types/chat"

interface SummaryCardProps {
  summary: ConversationSummary
  onClick?: () => void
  onSelect?: () => void
  selected?: boolean
  showActions?: boolean
}

export function SummaryCard({
  summary,
  onClick,
  onSelect,
  selected = false,
  showActions = false,
}: SummaryCardProps) {
  const formattedTime = formatDistanceToNow(new Date(summary.createdAt), {
    addSuffix: true,
    locale: zhCN,
  })

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-primary" : ""
      }`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{summary.title}</CardTitle>
          {showActions && onSelect && (
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect()
              }}
            >
              {selected ? "取消选择" : "选择"}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formattedTime}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            {summary.messageCount} 条消息
          </span>
        </div>
        <Badge variant="secondary">{summary.featureKey}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.coreConclusions.length > 0 && (
          <div>
            <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              核心结论
            </h4>
            <ul className="space-y-1">
              {summary.coreConclusions.slice(0, 3).map((item, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <ArrowRight className="h-3 w-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {summary.keyQuestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Star className="h-4 w-4 text-amber-500" />
                关键问题
              </h4>
              <ul className="space-y-1">
                {summary.keyQuestions.slice(0, 2).map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {summary.importantSteps.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <ListTodo className="h-4 w-4 text-blue-500" />
                重要步骤
              </h4>
              <ul className="space-y-1">
                {summary.importantSteps.slice(0, 2).map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-xs font-medium text-primary">{index + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {summary.suggestions.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="flex items-center gap-2 text-sm font-semibold mb-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                建议
              </h4>
              <ul className="space-y-1">
                {summary.suggestions.slice(0, 2).map((item, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    • {item}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
