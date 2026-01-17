// 사용자 타입 (6가지)
export const UserType = {
  STUDENT: 'STUDENT',                    // 학생 회원
  PARENT: 'PARENT',                      // 학부모
  SCHOOL_ADMIN: 'SCHOOL_ADMIN',          // 학교 관리자
  ASSESSMENT_TEACHER: 'ASSESSMENT_TEACHER', // 독서 진단 담당 교사
  QUESTION_DEVELOPER: 'QUESTION_DEVELOPER', // 독서 진단 문항 개발 교사
  SYSTEM_ADMIN: 'SYSTEM_ADMIN',          // 시스템 관리자
} as const;

export type UserType = typeof UserType[keyof typeof UserType];

// 학생 등급 (2단계)
export const StudentGradeLevel = {
  GRADE_A: 'GRADE_A',  // A 등급
  GRADE_B: 'GRADE_B',  // B 등급
} as const;

export type StudentGradeLevel = typeof StudentGradeLevel[keyof typeof StudentGradeLevel];

// 동의 상태
export const ConsentStatus = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
} as const;

export type ConsentStatus = typeof ConsentStatus[keyof typeof ConsentStatus];

// 상담 상태
export const ConsultationStatus = {
  REQUESTED: 'REQUESTED',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export type ConsultationStatus = typeof ConsultationStatus[keyof typeof ConsultationStatus];

// 학교 인터페이스
export interface School {
  schoolId: number;
  schoolName: string;
  schoolCode?: string;
  address?: string;
  phone?: string;
  region?: string;
  schoolType?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 학급 인터페이스
export interface Class {
  classId: number;
  schoolId: number;
  className: string;
  grade: number;
  academicYear: number;
  teacherId?: number;
  isActive: boolean;
  createdAt: string;
}

// 사용자 인터페이스 (확장)
export interface User {
  userId: number;
  email: string;
  userType: UserType;
  name: string;
  birthDate?: string;
  phone?: string;
  schoolName?: string;
  schoolId?: number;
  grade?: number;
  studentGradeLevel?: StudentGradeLevel;
  profileImageUrl?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 학생-학부모 관계
export interface StudentParentRelation {
  relationId: number;
  studentId: number;
  parentId: number;
  relationship: string;
  isPrimaryContact: boolean;
  createdAt: string;
}

// 동의 템플릿
export interface ConsentTemplate {
  templateId: number;
  templateName: string;
  templateContent: string;
  isRequired: boolean;
  validFrom: string;
  validUntil?: string;
  createdAt: string;
}

// 동의 기록
export interface Consent {
  consentId: number;
  userId: number;
  templateId: number;
  consentGivenBy?: number;
  status: ConsentStatus;
  consentedAt?: string;
  ipAddress?: string;
  createdAt: string;
}

// 상담 요청
export interface Consultation {
  consultationId: number;
  parentId: number;
  teacherId?: number;
  studentId: number;
  requestedDate: string;
  requestedTime?: string;
  consultationType: string;
  topic?: string;
  status: ConsultationStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// 권한
export interface Permission {
  permissionId: number;
  permissionCode: string;
  permissionName: string;
  description?: string;
  category?: string;
}

// 사용자 권한
export interface UserPermission {
  userId: number;
  permissionId: number;
  grantedBy?: number;
  grantedAt: string;
}

// 학생 등급 이력
export interface StudentGradeHistory {
  historyId: number;
  studentId: number;
  previousGrade?: StudentGradeLevel;
  newGrade: StudentGradeLevel;
  changedBy?: number;
  changeReason?: string;
  changedAt: string;
}

// 사용자 타입별 라벨
export const UserTypeLabels: Record<UserType, string> = {
  [UserType.STUDENT]: '학생 회원',
  [UserType.PARENT]: '학부모',
  [UserType.SCHOOL_ADMIN]: '학교 관리자',
  [UserType.ASSESSMENT_TEACHER]: '독서 진단 담당 교사',
  [UserType.QUESTION_DEVELOPER]: '독서 진단 문항 개발 교사',
  [UserType.SYSTEM_ADMIN]: '시스템 관리자',
};

// 학생 등급 라벨
export const StudentGradeLevelLabels: Record<StudentGradeLevel, string> = {
  [StudentGradeLevel.GRADE_A]: 'A 등급',
  [StudentGradeLevel.GRADE_B]: 'B 등급',
};

// 도서 타입
export const DifficultyLevel = {
  ELEMENTARY: 'elementary',
  MIDDLE: 'middle',
  HIGH: 'high',
} as const;

export type DifficultyLevel = typeof DifficultyLevel[keyof typeof DifficultyLevel];

export interface Book {
  bookId: number;
  title: string;
  author: string;
  publisher?: string;
  publishedYear?: number;
  isbn?: string;
  category?: string;
  description?: string;
  coverImageUrl?: string;
  difficultyLevel: DifficultyLevel;
}

// 논제 타입
export const TopicType = {
  ANALYTICAL: 'analytical',
  CRITICAL: 'critical',
  CREATIVE: 'creative',
} as const;

export type TopicType = typeof TopicType[keyof typeof TopicType];

export interface Topic {
  topicId: number;
  bookId: number;
  topicText: string;
  topicType: TopicType;
  difficultyLevel: number;
  keywords?: string[];
  evaluationCriteria?: any;
}

// 검사 타입
export const AssessmentStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  EVALUATED: 'evaluated',
} as const;

export type AssessmentStatus = typeof AssessmentStatus[keyof typeof AssessmentStatus];

export const AssessmentType = {
  ESSAY: 'essay',
  GRAMMAR: 'grammar',
  READING: 'reading',
} as const;

export type AssessmentType = typeof AssessmentType[keyof typeof AssessmentType];

export interface Assessment {
  assessmentId: number;
  studentId: number;
  topic: Topic;
  assessmentType: AssessmentType;
  status: AssessmentStatus;
  startedAt?: string;
  submittedAt?: string;
  timeLimitMinutes: number;
  wordCountMin: number;
  wordCountMax: number;
  createdAt: string;
}

// 답안 타입
export interface Answer {
  answerId: number;
  assessmentId: number;
  content: string;
  wordCount: number;
  charCount: number;
  paragraphCount: number;
  autoSavedAt?: string;
  submittedAt?: string;
  version: number;
}

// 평가 결과 타입
export interface Evaluation {
  evaluationId: number;
  answerId: number;
  assessmentId?: number;
  studentId?: number;
  evaluatorType: 'ai' | 'teacher' | 'hybrid';
  
  // 영역별 점수
  bookAnalysisScore: number;
  creativeThinkingScore: number;
  problemSolvingScore: number;
  languageExpressionScore: number;
  
  totalScore: number;
  grade: string;
  percentile: number;
  
  // AI 분석 결과
  spellingErrors: number;
  spacingErrors: number;
  grammarErrors: number;
  vocabularyLevel: number;
  
  // 종합 평가
  overallComment: string;
  strengths: string[];
  weaknesses: string[];
  
  evaluatedAt: string;

  studentFeedback?: {
    서론?: string;
    본론?: string;
    결론?: string;
  };
  rubric?: Array<{
    criterion: string;
    level: string;
    evidence: string;
    next_action: string;
  }>;
  lineEdits?: Array<{
    original: string;
    suggested: string;
    reason: string;
    category: string;
  }>;
  teacherNote?: string;
}

// 첨삭 타입
export const ErrorType = {
  SPELLING: 'spelling',
  SPACING: 'spacing',
  GRAMMAR: 'grammar',
  EXPRESSION: 'expression',
  LOGIC: 'logic',
  STRUCTURE: 'structure',
} as const;

export type ErrorType = typeof ErrorType[keyof typeof ErrorType];

export const Severity = {
  CRITICAL: 'critical',
  MAJOR: 'major',
  MINOR: 'minor',
} as const;

export type Severity = typeof Severity[keyof typeof Severity];

export interface Correction {
  correctionId: number;
  evaluationId: number;
  errorType: ErrorType;
  originalText: string;
  correctedText?: string;
  positionStart: number;
  positionEnd: number;
  explanation: string;
  severity: Severity;
}

// 학습 이력 타입
export interface ProgressHistory {
  historyId: number;
  studentId: number;
  assessmentId: number;
  totalScore: number;
  bookAnalysisScore: number;
  creativeThinkingScore: number;
  problemSolvingScore: number;
  languageExpressionScore: number;
  recordedAt: string;
}

// 통계 타입
export interface Statistics {
  studentId: number;
  averageScore: number;
  assessmentCount: number;
  recentScores: number[];
  scoresByArea: {
    bookAnalysis: number[];
    creativeThinking: number[];
    problemSolving: number[];
    languageExpression: number[];
  };
  percentileRank: number;
}
