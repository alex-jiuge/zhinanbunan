import { NextResponse } from 'next/server';
import { PromptManager } from '@/lib/ai/prompt-manager/manager';

export const dynamic = 'force-static';

// 为静态导出生成参数
export function generateStaticParams() {
  return [{ id: 'default' }];
}

// GET: 获取版本历史
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const promptId = searchParams.get('promptId');

    if (!promptId) {
      return NextResponse.json({ success: false, error: '缺少 promptId 参数' }, { status: 400 });
    }

    const versions = PromptManager.getVersionHistory(promptId);
    return NextResponse.json({ success: true, data: versions });
  } catch {
    return NextResponse.json({ success: false, error: '获取版本历史失败' }, { status: 500 });
  }
}

// POST: 回滚到指定版本
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { promptId, version } = body;

    if (!promptId || version === undefined) {
      return NextResponse.json({ success: false, error: '缺少必要参数' }, { status: 400 });
    }

    const success = PromptManager.rollbackVersion(promptId, version);
    if (!success) {
      return NextResponse.json({ success: false, error: '版本不存在或回滚失败' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: '版本回滚失败' }, { status: 500 });
  }
}
