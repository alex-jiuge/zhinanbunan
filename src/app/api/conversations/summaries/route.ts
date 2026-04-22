import { NextResponse } from "next/server"
import { conversationStorage } from "@/lib/conversation/storage"
import { ConversationManager } from "@/lib/conversation/manager"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const featureKey = searchParams.get("featureKey")
    const sortBy = searchParams.get("sortBy") || "date"
    const sortOrder = searchParams.get("sortOrder") || "desc"

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      )
    }

    const summaries = conversationStorage.loadSummaries(userId)

    let filtered = summaries

    if (featureKey) {
      filtered = filtered.filter((s) => s.featureKey === featureKey)
    }

    filtered.sort((a, b) => {
      const multiplier = sortOrder === "desc" ? -1 : 1
      if (sortBy === "date") {
        return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * multiplier
      }
      if (sortBy === "title") {
        return a.title.localeCompare(b.title) * multiplier
      }
      if (sortBy === "messages") {
        return (a.messageCount - b.messageCount) * multiplier
      }
      return 0
    })

    return NextResponse.json({
      success: true,
      summaries: filtered,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    const userId = searchParams.get("userId")

    if (!id) {
      return NextResponse.json(
        { success: false, error: "summary id is required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      )
    }

    const success = ConversationManager.deleteSummary(userId, id)

    if (!success) {
      return NextResponse.json(
        { success: false, error: "Summary not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
