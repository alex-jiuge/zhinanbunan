import { NextResponse } from 'next/server';
import { UserInfoManager } from '@/lib/user-info/manager';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category') || undefined;

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    const changes = UserInfoManager.getChangeHistory(userId, category);
    return NextResponse.json({ success: true, data: changes });
  } catch {
    return NextResponse.json({ success: false, error: '获取变更历史失败' }, { status: 500 });
  }
}
