import type {
  UserBasicInfo,
  UserEducation,
  UserCareer,
  UserLifeStatus,
  UserInfoChangeRecord,
} from '@/types/user-info';

const STORAGE_KEYS = {
  BASIC: 'user-info:basic',
  EDUCATION: 'user-info:education',
  CAREER: 'user-info:career',
  LIFE: 'user-info:life',
  CHANGES: 'user-info:changes',
} as const;

function safeGet<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function safeSet(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

export function saveBasicInfo(info: UserBasicInfo): void {
  safeSet(STORAGE_KEYS.BASIC, info);
}

export function loadBasicInfo(userId: string): UserBasicInfo | null {
  const all = safeGet<Record<string, UserBasicInfo>>(STORAGE_KEYS.BASIC) || {};
  return all[userId] || null;
}

export function saveEducation(info: UserEducation): void {
  safeSet(STORAGE_KEYS.EDUCATION, info);
}

export function loadEducation(userId: string): UserEducation | null {
  const all = safeGet<Record<string, UserEducation>>(STORAGE_KEYS.EDUCATION) || {};
  return all[userId] || null;
}

export function saveCareer(info: UserCareer): void {
  safeSet(STORAGE_KEYS.CAREER, info);
}

export function loadCareer(userId: string): UserCareer | null {
  const all = safeGet<Record<string, UserCareer>>(STORAGE_KEYS.CAREER) || {};
  return all[userId] || null;
}

export function saveLifeStatus(info: UserLifeStatus): void {
  safeSet(STORAGE_KEYS.LIFE, info);
}

export function loadLifeStatus(userId: string): UserLifeStatus | null {
  const all = safeGet<Record<string, UserLifeStatus>>(STORAGE_KEYS.LIFE) || {};
  return all[userId] || null;
}

export function addChangeRecord(record: UserInfoChangeRecord): void {
  const records = loadAllChangeRecords();
  records.unshift(record);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEYS.CHANGES, JSON.stringify(records));
    } catch {
      // Storage full - keep only recent 100 records
      localStorage.setItem(STORAGE_KEYS.CHANGES, JSON.stringify(records.slice(0, 100)));
    }
  }
}

export function loadChangeHistory(userId: string, category?: string): UserInfoChangeRecord[] {
  const all = loadAllChangeRecords();
  return all.filter((r) => {
    if (r.userId !== userId) return false;
    if (category && r.category !== category) return false;
    return true;
  });
}

function loadAllChangeRecords(): UserInfoChangeRecord[] {
  return safeGet<UserInfoChangeRecord[]>(STORAGE_KEYS.CHANGES) || [];
}

export function clearUserInfo(userId: string): void {
  if (typeof window === 'undefined') return;
  try {
    // Remove changes for this user
    const records = loadAllChangeRecords().filter((r) => r.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.CHANGES, JSON.stringify(records));
  } catch {
    // Ignore errors on clear
  }
}
