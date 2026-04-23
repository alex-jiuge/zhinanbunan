import { NextResponse } from 'next/server';
import { UserInfoManager } from '@/lib/user-info/manager';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, error: 'Missing userId parameter' }, { status: 400 });
    }

    const info = UserInfoManager.getCompleteInfo(userId);
    return NextResponse.json({ success: true, data: info });
  } catch {
    return NextResponse.json({ success: false, error: '获取用户信息失败' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, category, data, changeType = 'user_provided' } = body;

    if (!userId || !category) {
      return NextResponse.json({ success: false, error: 'Missing userId or category' }, { status: 400 });
    }

    let result;
    switch (category) {
      case 'basic':
        result = UserInfoManager.updateBasicInfo(userId, data, changeType);
        break;
      case 'education':
        result = UserInfoManager.updateEducation(userId, data, changeType);
        break;
      case 'career':
        result = UserInfoManager.updateCareer(userId, data, changeType);
        break;
      case 'life':
        result = UserInfoManager.updateLifeStatus(userId, data, changeType);
        break;
      default:
        return NextResponse.json({ success: false, error: 'Invalid category' }, { status: 400 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch {
    return NextResponse.json({ success: false, error: '更新用户信息失败' }, { status: 500 });
  }
}
