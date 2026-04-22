import { NextResponse } from 'next/server';
import { PromptManager } from '@/lib/ai/prompt-manager/manager';

// GET: 搜索知识库 / 获取分类知识
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const category = searchParams.get('category');

    let results;
    if (query) {
      results = PromptManager.searchKnowledge(query);
    } else if (category) {
      results = PromptManager.getKnowledgeByCategory(category);
    } else {
      results = PromptManager.searchKnowledge('');
    }

    return NextResponse.json({ success: true, data: results });
  } catch {
    return NextResponse.json({ success: false, error: '获取知识库失败' }, { status: 500 });
  }
}

// POST: 创建知识库条目
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const entry = PromptManager.addKnowledge({
      title: body.title,
      content: body.content,
      category: body.category || 'general',
      tags: body.tags || [],
      references: body.references || [],
    });

    return NextResponse.json({ success: true, data: entry });
  } catch {
    return NextResponse.json({ success: false, error: '创建知识库条目失败' }, { status: 500 });
  }
}
