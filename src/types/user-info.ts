import type { Grade, UserProfile } from './user';

export type { Grade, UserProfile } from './user';

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

export interface CompleteUserInfo {
  basic: UserBasicInfo;
  education: UserEducation;
  career: UserCareer;
  lifeStatus: UserLifeStatus;
  profile?: UserProfile;
  lastUpdated: string;
  version: number;
}
