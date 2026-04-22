import { UserInfoManager } from './manager';

export function buildContextForFeature(userId: string, featureKey: string): string {
  const info = UserInfoManager.getCompleteInfo(userId);
  if (!info) return '';

  const age = new Date().getFullYear() - info.basic.birthYear;
  const parts: string[] = [];

  parts.push(`用户是一名 ${age} 岁的 ${info.basic.major} 专业学生`);

  if (info.basic.majorCategory) {
    parts.push(`，属于 ${info.basic.majorCategory} 大类`);
  }

  if (info.education && info.education.school !== '未设置') {
    parts.push(`，就读于 ${info.education.school}`);
    if (info.education.schoolType) {
      parts.push(`（${info.education.schoolType}）`);
    }
    parts.push(`，当前 ${info.education.currentGrade}`);
    if (info.education.graduationStatus === 'pending') {
      parts.push(`，预计 ${info.education.graduationDate} 毕业`);
    }
  }

  parts.push('。\n');

  switch (featureKey) {
    case 'self-exploration':
      if (info.profile?.summary) {
        parts.push(`用户画像：${info.profile.summary}\n`);
      }
      if (info.profile?.personalityType) {
        parts.push(`性格类型：${info.profile.personalityType}\n`);
      }
      if (info.profile?.values?.length) {
        parts.push(`价值观：${info.profile.values.join('、')}\n`);
      }
      break;

    case 'city-match':
      if (info.lifeStatus?.livingCity) {
        parts.push(`当前居住：${info.lifeStatus.livingCity}\n`);
      }
      if (info.lifeStatus?.livingArrangement) {
        parts.push(`居住安排：${info.lifeStatus.livingArrangement}\n`);
      }
      break;

    case 'family-bridge':
      if (info.career?.workStatus) {
        parts.push(`当前状态：${getWorkStatusText(info.career.workStatus)}\n`);
      }
      if (info.career?.currentRole) {
        parts.push(`目标岗位：${info.career.currentRole}\n`);
      }
      if (info.career?.workDescription) {
        parts.push(`工作内容：${info.career.workDescription}\n`);
      }
      break;

    case 'major-analysis':
      if (info.education?.school) {
        parts.push(`学校：${info.education.school}\n`);
      }
      parts.push(`专业：${info.basic.major}\n`);
      parts.push(`年级：${info.education?.currentGrade || '未知'}\n`);
      break;

    case 'jd-parser':
      if (info.career?.currentRole) {
        parts.push(`目标岗位：${info.career.currentRole}\n`);
      }
      if (info.career?.workTimeline?.length) {
        parts.push(`工作经历：${info.career.workTimeline.length} 段\n`);
      }
      break;

    case 'chat-general':
    default:
      break;
  }

  return parts.join('');
}

function getWorkStatusText(status: string): string {
  const map: Record<string, string> = {
    studying: '在校学习',
    interning: '实习中',
    employed: '已就业',
    unemployed: '待业',
    freelance: '自由职业',
  };
  return map[status] || status;
}
