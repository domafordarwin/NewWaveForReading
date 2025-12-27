// 사용자 타입
export enum UserType {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMIN = 'admin'
}

export interface User {
  userId: number;
  email: string;
  userType: UserType;
  name: string;
  birthDate?: string;
  phone?: string;
  schoolName?: string;
  grade?: number;
  profileImageUrl?: string;
}

// 도서 타입
export enum DifficultyLevel {
  ELEMENTARY = 'elementary',
  MIDDLE = 'middle',
  HIGH = 'high'
}

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
export enum TopicType {
  ANALYTICAL = 'analytical',
  CRITICAL = 'critical',
  CREATIVE = 'creative'
}

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
export enum AssessmentStatus {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  SUBMITTED = 'submitted',
  EVALUATED = 'evaluated'
}

export enum AssessmentType {
  ESSAY = 'essay',
  GRAMMAR = 'grammar',
  READING = 'reading'
}

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
}

// 첨삭 타입
export enum ErrorType {
  SPELLING = 'spelling',
  SPACING = 'spacing',
  GRAMMAR = 'grammar',
  EXPRESSION = 'expression',
  LOGIC = 'logic',
  STRUCTURE = 'structure'
}

export enum Severity {
  CRITICAL = 'critical',
  MAJOR = 'major',
  MINOR = 'minor'
}

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
