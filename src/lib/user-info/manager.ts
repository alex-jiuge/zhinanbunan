import { nanoid } from 'nanoid';
import type {
  UserBasicInfo,
  UserEducation,
  UserCareer,
  UserLifeStatus,
  UserInfoChangeRecord,
  CompleteUserInfo,
  WorkExperience,
} from '@/types/user-info';
import {
  saveBasicInfo,
  loadBasicInfo,
  saveEducation,
  loadEducation,
  saveCareer,
  loadCareer,
  saveLifeStatus,
  loadLifeStatus,
  addChangeRecord,
  loadChangeHistory,
  clearUserInfo,
} from './storage';
import { checkAgeUpdate } from './age-calculator';

function compareValues(oldVal: unknown, newVal: unknown): boolean {
  if (Array.isArray(oldVal) && Array.isArray(newVal)) {
    return JSON.stringify(oldVal.sort()) === JSON.stringify(newVal.sort());
  }
  return oldVal === newVal;
}

export class UserInfoManager {
  static getCompleteInfo(userId: string): CompleteUserInfo | null {
    const basic = loadBasicInfo(userId);
    const education = loadEducation(userId);
    const career = loadCareer(userId);
    const lifeStatus = loadLifeStatus(userId);

    if (!basic && !education && !career && !lifeStatus) {
      return null;
    }

    return {
      basic: basic || {
        userId,
        birthYear: 2000,
        major: '未设置',
        majorCategory: '未设置',
      },
      education: education || {
        userId,
        graduationStatus: 'pending',
        graduationDate: '2027-06',
        currentGrade: '大二',
        school: '未设置',
        schoolType: '普通本科',
      },
      career: career || {
        userId,
        workStatus: 'studying',
        workTimeline: [],
      },
      lifeStatus: lifeStatus || {
        userId,
        maritalStatus: 'single',
        hobbies: [],
      },
      lastUpdated: new Date().toISOString(),
      version: 1,
    };
  }

  static updateBasicInfo(
    userId: string,
    updates: Partial<UserBasicInfo>,
    changeType: 'user_provided' | 'ai_inferred' | 'system_updated' = 'user_provided'
  ): UserBasicInfo {
    const existing = loadBasicInfo(userId) || {
      userId,
      birthYear: 2000,
      major: '',
      majorCategory: '',
    };

    const updated: UserBasicInfo = { ...existing, ...updates };

    Object.entries(updates).forEach(([field, newValue]) => {
      const oldValue = (existing as unknown as Record<string, unknown>)[field];
      if (oldValue !== undefined && !compareValues(oldValue, newValue)) {
        addChangeRecord({
          id: `change_${nanoid()}`,
          userId,
          category: 'basic',
          field,
          oldValue: oldValue as string | number | string[],
          newValue: newValue as string | number | string[],
          changeType,
          timestamp: new Date().toISOString(),
        });
      }
    });

    saveBasicInfo(updated);
    return updated;
  }

  static updateEducation(
    userId: string,
    updates: Partial<UserEducation>,
    changeType: 'user_provided' | 'ai_inferred' = 'user_provided'
  ): UserEducation {
    const existing = loadEducation(userId) || {
      userId,
      graduationStatus: 'pending',
      graduationDate: '2027-06',
      currentGrade: '大二',
      school: '',
      schoolType: '普通本科',
    };

    const updated: UserEducation = { ...existing, ...updates };

    Object.entries(updates).forEach(([field, newValue]) => {
      const oldValue = (existing as unknown as Record<string, unknown>)[field];
      if (oldValue !== undefined && !compareValues(oldValue, newValue)) {
        addChangeRecord({
          id: `change_${nanoid()}`,
          userId,
          category: 'education',
          field,
          oldValue: oldValue as string | number | string[],
          newValue: newValue as string | number | string[],
          changeType,
          timestamp: new Date().toISOString(),
        });
      }
    });

    saveEducation(updated);
    return updated;
  }

  static updateCareer(
    userId: string,
    updates: Partial<UserCareer>,
    changeType: 'user_provided' | 'ai_inferred' = 'user_provided'
  ): UserCareer {
    const existing = loadCareer(userId) || {
      userId,
      workStatus: 'studying',
      workTimeline: [],
    };

    const updated: UserCareer = { ...existing, ...updates };

    Object.entries(updates).forEach(([field, newValue]) => {
      const oldValue = (existing as unknown as Record<string, unknown>)[field];
      if (field === 'workTimeline') {
        const oldTimeline = (oldValue as WorkExperience[]) || [];
        const newTimeline = (newValue as WorkExperience[]) || [];
        if (JSON.stringify(oldTimeline) !== JSON.stringify(newTimeline)) {
          addChangeRecord({
            id: `change_${nanoid()}`,
            userId,
            category: 'career',
            field: 'workTimeline',
            oldValue: JSON.stringify(oldTimeline),
            newValue: JSON.stringify(newTimeline),
            changeType,
            timestamp: new Date().toISOString(),
            notes: '工作经历更新',
          });
        }
      } else if (oldValue !== undefined && !compareValues(oldValue, newValue)) {
        addChangeRecord({
          id: `change_${nanoid()}`,
          userId,
          category: 'career',
          field,
          oldValue: oldValue as string | number | string[],
          newValue: newValue as string | number | string[],
          changeType,
          timestamp: new Date().toISOString(),
        });
      }
    });

    saveCareer(updated);
    return updated;
  }

  static updateLifeStatus(
    userId: string,
    updates: Partial<UserLifeStatus>,
    changeType: 'user_provided' | 'ai_inferred' = 'user_provided'
  ): UserLifeStatus {
    const existing = loadLifeStatus(userId) || {
      userId,
      maritalStatus: 'single',
      hobbies: [],
    };

    const updated: UserLifeStatus = { ...existing, ...updates };

    Object.entries(updates).forEach(([field, newValue]) => {
      const oldValue = (existing as unknown as Record<string, unknown>)[field];
      if (oldValue !== undefined && !compareValues(oldValue, newValue)) {
        addChangeRecord({
          id: `change_${nanoid()}`,
          userId,
          category: 'life',
          field,
          oldValue: oldValue as string | number | string[],
          newValue: newValue as string | number | string[],
          changeType,
          timestamp: new Date().toISOString(),
        });
      }
    });

    saveLifeStatus(updated);
    return updated;
  }

  static getChangeHistory(userId: string, category?: string): UserInfoChangeRecord[] {
    return loadChangeHistory(userId, category);
  }

  static checkAndAutoUpdateAge(userId: string): UserBasicInfo | null {
    const basic = loadBasicInfo(userId);
    if (!basic || !basic.birthYear) return null;

    const { needsUpdate, newAge } = checkAgeUpdate(0, basic.birthYear);
    if (needsUpdate) {
      const updated = this.updateBasicInfo(userId, { birthYear: basic.birthYear }, 'system_updated');
      addChangeRecord({
        id: `change_${nanoid()}`,
        userId,
        category: 'basic',
        field: 'age',
        oldValue: 0,
        newValue: newAge,
        changeType: 'system_updated',
        timestamp: new Date().toISOString(),
        notes: `年龄自动更新为 ${newAge} 岁`,
      });
      return updated;
    }
    return basic;
  }

  static deleteUser(userId: string): void {
    clearUserInfo(userId);
  }
}
