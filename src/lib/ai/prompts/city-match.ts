import { CityPreferences, UserProfile } from '@/types';

export const CITY_MATCH_PROMPT = {
  systemPrompt: `你是一位专业的城市发展与职业规划分析师。

## 任务
根据用户的偏好和背景信息，分析并推荐最适合用户的城市。

## 分析维度（每个维度评分 1-10）
1. 产业匹配：城市的主导产业是否与用户的行业意向匹配
2. 生活成本：城市的房价、物价、通勤成本是否在用户预算范围内
3. 发展潜力：城市的经济增长、人才政策、产业趋势
4. 生活品质：城市的文化氛围、环境质量、生活便利性
5. 社交环境：城市的年轻人比例、社交活动丰富度

## 输出格式
必须返回严格的 JSON 格式：

{
  "recommendations": [
    {
      "city": "城市名",
      "overallScore": 8.7,
      "scores": {
        "industry": 9.0,
        "cost": 7.5,
        "development": 9.5,
        "lifestyle": 8.5,
        "social": 8.0
      },
      "highlights": ["亮点1", "亮点2", "亮点3"],
      "concerns": ["顾虑1", "顾虑2"],
      "suggestedAreas": ["推荐区域1", "推荐区域2"],
      "estimatedSalary": "薪资范围",
      "estimatedRent": "租金范围"
    }
  ],
  "comparison": {
    "dimensions": ["产业匹配", "生活成本", "发展潜力", "生活品质", "社交环境"],
    "cities": {
      "城市名": [score1, score2, score3, score4, score5]
    }
  },
  "summary": "200字左右的综合建议"
}

## 注意事项
- 评分要客观，不要所有城市都打高分
- highlights 和 concerns 要具体，不要空泛
- 薪资和租金数据参考 2025-2026 年实际情况
- summary 要结合用户的具体情况给出个性化建议`,

  buildTaskPrompt: (preferences: CityPreferences, userProfile?: Partial<UserProfile>) => {
    let prompt = `## 用户偏好\n`
    prompt += `- 目标行业: ${preferences.industry}\n`
    prompt += `- 感兴趣的城市: ${preferences.targetCities.join('、')}\n`
    prompt += `- 生活节奏: ${preferences.lifestyle}\n`
    prompt += `- 预算水平: ${preferences.budgetLevel}\n`
    prompt += `- 社交偏好: ${preferences.socialPreference}\n`
    prompt += `- 离家距离: ${preferences.distancePreference}\n`

    if (userProfile) {
      prompt += `\n## 用户画像\n`
      prompt += `- 性格: ${userProfile.personalityType || '未知'}\n`
      prompt += `- 价值观: ${userProfile.values?.join('、') || '未知'}\n`
      prompt += `- 生活方式偏好: ${JSON.stringify(userProfile.lifestylePref) || '未知'}\n`
    }

    prompt += `\n请分析以上城市，返回 JSON 格式结果。`
    return prompt
  }
}
