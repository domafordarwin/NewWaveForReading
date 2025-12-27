import {
  UserType,
  DifficultyLevel,
  TopicType,
  AssessmentStatus,
  AssessmentType,
} from '../types/index.js';

import type {
  User,
  Book,
  Topic,
  Assessment,
  Evaluation,
  ProgressHistory,
  Statistics
} from '../types/index.js';

// Mock 사용자 데이터
export const mockUsers: User[] = [
  {
    userId: 1,
    email: 'student1@example.com',
    userType: UserType.STUDENT,
    name: '김학생',
    birthDate: '2010-03-15',
    schoolName: '서울중학교',
    grade: 2,
  },
  {
    userId: 2,
    email: 'teacher1@example.com',
    userType: UserType.TEACHER,
    name: '이선생',
    schoolName: '서울중학교',
  }
];

// Mock 도서 데이터
export const mockBooks: Book[] = [
  {
    bookId: 1,
    title: '동물농장',
    author: '조지 오웰',
    publisher: '민음사',
    publishedYear: 2003,
    isbn: '9788937460449',
    category: '고전문학',
    description: '권력의 부패와 전체주의를 비판한 우화 소설',
    coverImageUrl: 'https://image.yes24.com/goods/9172/XL',
    difficultyLevel: DifficultyLevel.MIDDLE
  },
  {
    bookId: 2,
    title: '어린왕자',
    author: '생텍쥐페리',
    publisher: '문학동네',
    publishedYear: 2015,
    isbn: '9788954635950',
    category: '고전문학',
    description: '사랑과 우정, 삶의 본질에 대한 철학적 동화',
    coverImageUrl: 'https://image.yes24.com/goods/24906982/XL',
    difficultyLevel: DifficultyLevel.ELEMENTARY
  },
  {
    bookId: 3,
    title: '사피엔스',
    author: '유발 하라리',
    publisher: '김영사',
    publishedYear: 2015,
    isbn: '9788934972464',
    category: '인문학',
    description: '인류의 역사와 미래를 조망하는 통찰력 있는 책',
    coverImageUrl: 'https://image.yes24.com/goods/23030284/XL',
    difficultyLevel: DifficultyLevel.HIGH
  }
];

// Mock 논제 데이터
export const mockTopics: Topic[] = [
  {
    topicId: 1,
    bookId: 1,
    topicText: '『동물농장』에서 나타난 권력의 부패 과정을 분석하고, 현대 사회에서 이와 유사한 사례를 찾아 설명하시오.',
    topicType: TopicType.ANALYTICAL,
    difficultyLevel: 4,
    keywords: ['권력', '부패', '전체주의', '우화', '비판']
  },
  {
    topicId: 2,
    bookId: 2,
    topicText: '『어린왕자』에서 "진짜 중요한 것은 눈에 보이지 않아"라는 메시지가 담긴 장면을 찾아 설명하고, 이것이 현대를 살아가는 우리에게 주는 의미를 논하시오.',
    topicType: TopicType.CRITICAL,
    difficultyLevel: 3,
    keywords: ['본질', '사랑', '관계', '가치']
  },
  {
    topicId: 3,
    bookId: 3,
    topicText: '『사피엔스』에서 제시한 인류 발전의 핵심 요소 중 하나를 선택하여, 미래 사회에 미칠 영향을 창의적으로 예측하시오.',
    topicType: TopicType.CREATIVE,
    difficultyLevel: 5,
    keywords: ['인류', '진화', '문명', '미래', '기술']
  }
];

// Mock 검사 데이터
export const mockAssessments: Assessment[] = [
  {
    assessmentId: 1,
    studentId: 1,
    topic: mockTopics[0],
    assessmentType: AssessmentType.ESSAY,
    status: AssessmentStatus.EVALUATED,
    startedAt: '2024-12-20T10:00:00',
    submittedAt: '2024-12-20T11:25:00',
    timeLimitMinutes: 90,
    wordCountMin: 800,
    wordCountMax: 2000,
    createdAt: '2024-12-20T09:00:00'
  },
  {
    assessmentId: 2,
    studentId: 1,
    topic: mockTopics[1],
    assessmentType: AssessmentType.ESSAY,
    status: AssessmentStatus.IN_PROGRESS,
    startedAt: '2024-12-27T09:30:00',
    timeLimitMinutes: 90,
    wordCountMin: 800,
    wordCountMax: 2000,
    createdAt: '2024-12-27T09:00:00'
  },
  {
    assessmentId: 3,
    studentId: 1,
    topic: mockTopics[2],
    assessmentType: AssessmentType.ESSAY,
    status: AssessmentStatus.NOT_STARTED,
    timeLimitMinutes: 90,
    wordCountMin: 800,
    wordCountMax: 2000,
    createdAt: '2024-12-25T10:00:00'
  }
];

// Mock 평가 결과 데이터
export const mockEvaluations: Evaluation[] = [
  {
    evaluationId: 1,
    answerId: 1,
    evaluatorType: 'ai',
    bookAnalysisScore: 18,
    creativeThinkingScore: 20,
    problemSolvingScore: 16,
    languageExpressionScore: 24,
    totalScore: 78,
    grade: 'B+',
    percentile: 65,
    spellingErrors: 3,
    spacingErrors: 8,
    grammarErrors: 2,
    vocabularyLevel: 3.8,
    overallComment: '논제를 잘 이해하고 있으며, 도서의 내용을 적절히 활용하였습니다. 문장력이 뛰어나지만, 논리적 구조를 더 강화할 필요가 있습니다.',
    strengths: [
      '풍부한 어휘력과 유려한 문장 표현',
      '도서 내용에 대한 깊이 있는 이해',
      '현대 사회 사례 제시의 적절성'
    ],
    weaknesses: [
      '단락 간 논리적 연결성 부족',
      '주장에 대한 구체적 근거 미흡',
      '맞춤법과 띄어쓰기 실수'
    ],
    evaluatedAt: '2024-12-20T12:00:00'
  }
];

// Mock 학습 이력 데이터
export const mockProgressHistory: ProgressHistory[] = [
  {
    historyId: 1,
    studentId: 1,
    assessmentId: 1,
    totalScore: 65,
    bookAnalysisScore: 15,
    creativeThinkingScore: 16,
    problemSolvingScore: 14,
    languageExpressionScore: 20,
    recordedAt: '2024-11-15T10:00:00'
  },
  {
    historyId: 2,
    studentId: 1,
    assessmentId: 2,
    totalScore: 70,
    bookAnalysisScore: 16,
    creativeThinkingScore: 18,
    problemSolvingScore: 15,
    languageExpressionScore: 21,
    recordedAt: '2024-11-28T10:00:00'
  },
  {
    historyId: 3,
    studentId: 1,
    assessmentId: 3,
    totalScore: 78,
    bookAnalysisScore: 18,
    creativeThinkingScore: 20,
    problemSolvingScore: 16,
    languageExpressionScore: 24,
    recordedAt: '2024-12-20T10:00:00'
  }
];

// Mock 통계 데이터
export const mockStatistics: Statistics = {
  studentId: 1,
  averageScore: 71,
  assessmentCount: 3,
  recentScores: [65, 70, 78],
  scoresByArea: {
    bookAnalysis: [15, 16, 18],
    creativeThinking: [16, 18, 20],
    problemSolving: [14, 15, 16],
    languageExpression: [20, 21, 24]
  },
  percentileRank: 65
};

// 현재 로그인한 사용자 (Mock)
export const currentUser: User = mockUsers[0];
