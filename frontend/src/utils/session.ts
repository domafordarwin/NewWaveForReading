import type { UserType, StudentGradeLevel } from '../types';

export interface StoredUser {
  userId: number;
  name: string;
  email: string;
  userType: UserType;
  schoolId?: number;
  schoolName?: string;
  grade?: number;
  studentGradeLevel?: StudentGradeLevel;
  isActive?: boolean;
}

// 사용자 타입별 기본 경로
export const getDefaultPathByUserType = (userType: UserType): string => {
  switch (userType) {
    case 'STUDENT':
      return '/student/dashboard';
    case 'PARENT':
      return '/parent/dashboard';
    case 'SCHOOL_ADMIN':
      return '/school-admin/dashboard';
    case 'ASSESSMENT_TEACHER':
      return '/teacher/dashboard';
    case 'QUESTION_DEVELOPER':
      return '/question-dev/dashboard';
    case 'SYSTEM_ADMIN':
      return '/admin/dashboard';
    default:
      return '/';
  }
};

const STORAGE_KEY = 'currentUser';

export const setCurrentUser = (user: StoredUser) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const getCurrentUser = (): StoredUser | null => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
};

export const clearCurrentUser = () => {
  localStorage.removeItem(STORAGE_KEY);
};
