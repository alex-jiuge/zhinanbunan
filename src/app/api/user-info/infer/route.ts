import { NextResponse } from 'next/server';
import { generateAIResponse } from '@/lib/ai/generate';
import { UserInfoManager } from '@/lib/user-info/manager';

export const dynamic = 'force-static';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, conversationText } = body;

    if (!userId || !conversationText) {
      return NextResponse.json({ success: false, error: 'Missing userId or conversationText' }, { status: 400 });
    }

    const systemPrompt = `你是一个用户信息提取助手。请分析以下对话内容，提取用户的个人信息。

## 输出格式
必须返回严格合法的 JSON：

{
  "basic": {
    "birthYear": 2000,
    "major": "专业名称",
    "majorCategory": "专业大类"
  },
  "education": {
    "graduationStatus": "pending|graduated|postgraduate",
    "graduationDate": "2027-06",
    "currentGrade": "大一|大二|大三|大四|已毕业",
    "school": "学校名称",
    "schoolType": "985|211|普通本科|专科|其他"
  },
  "career": {
    "workStatus": "studying|interning|employed|unemployed|freelance",
    "currentRole": "岗位名称",
    "workDescription": "工作内容描述"
  },
  "lifeStatus": {
    "maritalStatus": "single|dating|married|divorced",
    "relationshipStatus": "关系描述",
    "livingCity": "城市",
    "hobbies": ["爱好1", "爱好2"]
  },
  "confidence": 0.8
}

## 规则
- 只提取对话中明确提到或强烈暗示的信息
- 未提到的字段保持 null 或空
- confidence 表示提取信息的可信度（0-1）
- birthYear 根据年龄推算（如用户说"我 22 岁"，则 birthYear = 当前年份 - 22）`;

    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `对话内容：\n${conversationText}\n\n请提取用户信息并返回 JSON。` },
    ], 'chat-general', userId);

    let extractedInfo;
    try {
      const jsonStart = response.indexOf('{');
      const jsonEnd = response.lastIndexOf('}');
      extractedInfo = JSON.parse(response.slice(jsonStart, jsonEnd + 1));
    } catch {
      return NextResponse.json({ success: false, error: '信息提取失败' }, { status: 500 });
    }

    if (!extractedInfo.confidence || extractedInfo.confidence < 0.5) {
      return NextResponse.json({ success: true, data: null, message: '置信度低，未更新信息' });
    }

    const updates: { category: string; data: Record<string, unknown> }[] = [];

    if (extractedInfo.basic && Object.values(extractedInfo.basic).some((v) => v)) {
      updates.push({ category: 'basic', data: extractedInfo.basic });
    }
    if (extractedInfo.education && Object.values(extractedInfo.education).some((v) => v)) {
      updates.push({ category: 'education', data: extractedInfo.education });
    }
    if (extractedInfo.career && Object.values(extractedInfo.career).some((v) => v)) {
      updates.push({ category: 'career', data: extractedInfo.career });
    }
    if (extractedInfo.lifeStatus && Object.values(extractedInfo.lifeStatus).some((v) => v)) {
      updates.push({ category: 'life', data: extractedInfo.lifeStatus });
    }

    updates.forEach(({ category, data }) => {
      switch (category) {
        case 'basic':
          UserInfoManager.updateBasicInfo(userId, data, 'ai_inferred');
          break;
        case 'education':
          UserInfoManager.updateEducation(userId, data, 'ai_inferred');
          break;
        case 'career':
          UserInfoManager.updateCareer(userId, data, 'ai_inferred');
          break;
        case 'life':
          UserInfoManager.updateLifeStatus(userId, data, 'ai_inferred');
          break;
      }
    });

    return NextResponse.json({ success: true, data: { updatedCount: updates.length } });
  } catch {
    return NextResponse.json({ success: false, error: '智能推断失败' }, { status: 500 });
  }
}
