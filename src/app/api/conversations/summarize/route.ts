import { NextResponse } from "next/server"
import { ConversationManager } from "@/lib/conversation/manager"

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { conversationId, userId } = body

    if (!conversationId) {
      return NextResponse.json(
        { success: false, error: "conversationId is required" },
        { status: 400 }
      )
    }

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      )
    }

    const summary = await ConversationManager.summarizeConversation(
      userId,
      conversationId
    )

    if (!summary) {
      return NextResponse.json(
        { success: false, error: "Failed to generate summary" },
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

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId is required" },
        { status: 400 }
      )
    }

    const conversations = ConversationManager.getConversations(userId)

    return NextResponse.json({
      success: true,
      conversations,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
