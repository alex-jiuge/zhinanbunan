import { NextResponse } from "next/server"
import { ConversationManager } from "@/lib/conversation/manager"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { conversationIds, userId } = body

    if (!conversationIds || !Array.isArray(conversationIds)) {
      return NextResponse.json(
        { success: false, error: "conversationIds array is required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      )
    }

    if (conversationIds.length < 2) {
      return NextResponse.json(
        { success: false, error: "At least 2 conversations required for merge" },
        { status: 400 }
      )
    }

    const summary = await ConversationManager.mergeSummarizeConversations(
      userId,
      conversationIds
    )

    if (!summary) {
      return NextResponse.json(
        { success: false, error: "Failed to generate merge summary" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      summary,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
