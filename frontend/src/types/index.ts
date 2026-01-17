// 사용자 타입 (6가지)
export type UserType =
  | 'STUDENT'           // 학생 회원
  | 'PARENT'            // 학부모
  | 'SCHOOL_ADMIN'      // 학교 관리자
  | 'ASSESSMENT_TEACHER' // 독서 진단 담당 교사
  | 'QUESTION_DEVELOPER' // 독서 진단 문항 개발 교사
  | 'SYSTEM_ADMIN';     // 시스템 관리자

// 학생 등급 (2단계)
export type StudentGradeLevel = 'GRADE_A' | 'GRADE_B';

// 사용자 인터페이스
export interface User {
  user_id: number;
  email: string;
  name: string;
  user_type: UserType;
  birth_date?: string;
  phone?: string;
  school_name?: string;
  school_id?: number;
  grade?: number;
  student_grade_level?: StudentGradeLevel;
  profile_image_url?: string;
  is_active: boolean;
  password_hash?: string;
  created_at?: string;
  updated_at?: string;
}

// 사용자 타입별 라벨
export const UserTypeLabels: Record<UserType, string> = {
  STUDENT: '학생 회원',
  PARENT: '학부모',
  SCHOOL_ADMIN: '학교 관리자',
  ASSESSMENT_TEACHER: '독서 진단 담당 교사',
  QUESTION_DEVELOPER: '독서 진단 문항 개발 교사',
  SYSTEM_ADMIN: '시스템 관리자',
};

// 학생 등급 라벨
export const StudentGradeLevelLabels: Record<StudentGradeLevel, string> = {
  GRADE_A: 'A 등급',
  GRADE_B: 'B 등급',
};
