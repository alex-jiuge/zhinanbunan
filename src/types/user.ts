export type Grade = '大一' | '大二' | '大三' | '大四' | '已毕业';

export type GraduationStatus = 'pending' | 'graduated' | 'postgraduate';
export type SchoolType = '985' | '211' | '普通本科' | '专科' | '其他';
export type WorkStatus = 'studying' | 'interning' | 'employed' | 'unemployed' | 'freelance';
export type MaritalStatus = 'single' | 'dating' | 'married' | 'divorced';
export type ChangeType = 'user_provided' | 'ai_inferred' | 'system_updated';
export type InfoCategory = 'basic' | 'education' | 'career' | 'life';

export interface UserBasicInfo {
  userId: string;
  birthYear: number;
  major: string;
  majorCategory: string;
}

export interface UserEducation {
  userId: string;
  graduationStatus: GraduationStatus;
  graduationDate: string;
  currentGrade: Grade;
  school: string;
  schoolType: SchoolType;
}

export interface WorkExperience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface UserCareer {
  userId: string;
  workStatus: WorkStatus;
  currentRole?: string;
  workDescription?: string;
  workTimeline: WorkExperience[];
}

export interface UserLifeStatus {
  userId: string;
  maritalStatus: MaritalStatus;
  relationshipStatus?: string;
  livingCity?: string;
  livingArrangement?: string;
  hobbies: string[];
}

export interface UserInfoChangeRecord {
  id: string;
  userId: string;
  category: InfoCategory;
  field: string;
  oldValue: string | number | string[];
  newValue: string | number | string[];
  changeType: ChangeType;
  timestamp: string;
  notes?: string;
}

export interface UserProfile {
  id: string;
  userId: string;
  personalityType?: string;
  personalityDetail?: Record<string, unknown>;
  values?: string[];
  valuesDetail?: Record<string, string>;
  interests?: string[];
  interestsDetail?: Record<string, string>;
  strengths?: string[];
  weaknesses?: string[];
  lifestylePref?: {
    pace?: string;
    environment?: string;
    social?: string;
  };
  attachmentStyle?: string;
  academicScore?: number;
  practiceScore?: number;
  socialScore?: number;
  skillScore?: number;
  mentalScore?: number;
  summary?: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CompleteUserInfo {
  basic: UserBasicInfo;
  education: UserEducation;
  career: UserCareer;
  lifeStatus: UserLifeStatus;
  profile?: UserProfile;
  lastUpdated: string;
  version: number;
}

export interface UserPreferences {
  industry?: string;
  targetCities?: string[];
  lifestyle?: string;
  budgetLevel?: string;
  socialPreference?: string;
  distancePreference?: string;
}

export interface User {
  id: string;
  nickname?: string;
  grade?: Grade;
  major?: string;
  school?: string;
  createdAt: string;
  updatedAt: string;
}
