# PRD: 진단 평가 및 피드백 시스템

## 1. 개요

### 1.1 목적
업로드된 지문과 문항 데이터를 활용하여 학생의 독서 능력을 진단하고, 객관식/서술형 문항을 자동 채점하며, 개인별 맞춤 피드백 보고서를 생성하는 시스템을 구축한다.

### 1.2 목표
- 진단 평가 문항 세트 자동 생성
- 객관식 문항 자동 채점
- 서술형 문항 루브릭 기반 AI 채점
- 영역별 점수 분석 및 시각화
- 개인별 맞춤 피드백 보고서 생성

### 1.3 사용자
- **교사**: 진단 평가 생성 및 배포, 결과 분석
- **학생**: 진단 평가 응시
- **학부모**: 자녀의 진단 결과 열람

---

## 2. 주요 기능

### 2.1 진단 평가 생성
**기능 설명**: 문항 은행에서 문항을 선택하여 진단 평가 세트를 생성

#### 2.1.1 평가 구성 요소
- **평가 기본 정보**
  - 평가명
  - 대상 학년군 (초저/초고/중저/중고)
  - 평가 목적 (진단/형성/총괄)
  - 제한 시간

- **문항 선택 방식**
  1. **수동 선택**: 문항 은행에서 직접 선택
  2. **자동 선택**: 평가 영역별 문항 수와 난이도 설정 시 자동 추천

- **문항 구성**
  - 객관식 문항 (mcq)
  - 서술형 문항 (essay)
  - 평가 영역별 균형 있는 분포

#### 2.1.2 데이터 구조
```typescript
interface DiagnosticAssessment {
  assessment_id: number;
  title: string;
  description: string;
  grade_band: string;  // 초저, 초고, 중저, 중고
  assessment_type: 'diagnostic' | 'formative' | 'summative';
  time_limit_minutes: number | null;
  created_by_user_id: number;
  status: 'draft' | 'published' | 'archived';
  created_at: timestamp;
  updated_at: timestamp;
}

interface AssessmentItem {
  assessment_item_id: number;
  assessment_id: number;
  item_id: number;  // items 테이블 참조
  sequence_number: number;  // 문항 순서
  points: number;  // 배점
}
```

---

### 2.2 학생 평가 응시

#### 2.2.1 평가 응시 화면
- 지문 표시 영역 (좌측/상단)
- 문항 표시 영역 (우측/하단)
- 진행률 표시
- 임시 저장 기능
- 제출 전 검토 화면

#### 2.2.2 답안 저장
```typescript
interface StudentResponse {
  response_id: number;
  assessment_id: number;
  student_id: number;
  item_id: number;
  response_type: 'mcq' | 'essay';

  // 객관식 응답
  selected_option_id?: number;

  // 서술형 응답
  essay_text?: string;

  submitted_at: timestamp;
  is_correct?: boolean;  // 객관식은 즉시 채점
  score?: number;  // 서술형은 AI 채점 후 저장
}

interface AssessmentAttempt {
  attempt_id: number;
  assessment_id: number;
  student_id: number;
  started_at: timestamp;
  submitted_at: timestamp | null;
  status: 'in_progress' | 'submitted' | 'graded';
  total_score?: number;
  max_score: number;
}
```

---

### 2.3 자동 채점 시스템

#### 2.3.1 객관식 채점
- 제출 즉시 자동 채점
- 정답 여부 판정 (is_correct)
- 점수 부여 (배점에 따라)

#### 2.3.2 서술형 AI 채점
**루브릭 기반 채점 로직**:

```typescript
interface EssayGrading {
  response_id: number;
  item_id: number;
  essay_text: string;
  rubric: RubricCriterion[];  // 문항의 루브릭

  // AI 채점 결과
  grading_result: {
    criteria_scores: {
      area: string;
      weight: number;
      level: 'high' | 'middle' | 'low';
      score: number;  // weight 기반 점수
      feedback: string;  // 해당 영역 피드백
    }[];
    total_score: number;
    overall_feedback: string;
  };

  graded_at: timestamp;
  graded_by: 'ai' | 'teacher';
}
```

**AI 채점 프롬프트**:
```
시스템 프롬프트:
당신은 학생의 서술형 답안을 채점하는 전문 평가자입니다.
제공된 루브릭에 따라 답안을 평가하고, 각 영역별로 상/중/하 수준을 판정하세요.

사용자 프롬프트:
## 문항
{stem}

## 학생 답안
{essay_text}

## 평가 루브릭
{rubric을 영역별로 상/중/하 기준 제시}

## 요청사항
1. 각 평가 영역별로 상/중/하 수준을 판정하세요
2. 각 영역별 점수를 계산하세요 (상=100%, 중=70%, 하=40%)
3. 각 영역별로 구체적인 피드백을 20-30자로 작성하세요
4. 전체적인 종합 피드백을 50자 이내로 작성하세요

응답 형식: JSON
{
  "criteria_scores": [
    {
      "area": "내용 이해",
      "level": "high",
      "score": 40,
      "feedback": "지문의 핵심 주제를 정확히 파악하였습니다"
    },
    ...
  ],
  "total_score": 85,
  "overall_feedback": "전반적으로 우수한 답안입니다. 논리적 전개력을 더 강화하면 좋겠습니다."
}
```

---

### 2.4 피드백 보고서 생성

#### 2.4.1 보고서 구성 요소
**Legacy 보고서 양식 기반**:

1. **종합 평가 헤더**
   - 총점 및 등급 (A+, A, B+, B, C+, C, D, F)
   - 종합 평가 코멘트

2. **영역별 점수 분석**
   - 평가 영역별 점수 (막대 그래프)
   - 평가 영역별 점수 (레이더 차트)
   - 영역: 사실적 이해, 추론적 이해, 비판적 이해, 창의적 사고, 어휘력

3. **강점 및 약점**
   - 강점 항목 (체크 아이콘)
   - 개선 필요 항목 (경고 아이콘)

4. **상세 피드백**
   - 문항별 채점 결과
   - 서술형 문항별 루브릭 기반 피드백
   - 개선 제안사항

5. **학습 추천**
   - 약점 영역 보완을 위한 학습 자료 추천
   - 추천 도서 목록

#### 2.4.2 보고서 데이터 구조
```typescript
interface DiagnosticReport {
  report_id: number;
  attempt_id: number;
  student_id: number;
  assessment_id: number;

  // 종합 점수
  total_score: number;
  max_score: number;
  grade: string;  // A+, A, B+, B, C+, C, D, F

  // 영역별 점수
  area_scores: {
    area_name: string;
    score: number;
    max_score: number;
    percentage: number;
  }[];

  // 강점 및 약점
  strengths: string[];
  weaknesses: string[];

  // 종합 피드백
  comprehensive_feedback: string;
  detailed_feedback: string;

  // 학습 추천
  recommended_books: number[];  // books 테이블 참조
  improvement_suggestions: string[];

  generated_at: timestamp;
}
```

---

## 3. 데이터베이스 스키마

### 3.1 신규 테이블

```sql
-- 진단 평가 테이블
CREATE TABLE diagnostic_assessments (
  assessment_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  grade_band VARCHAR(10) NOT NULL CHECK (grade_band IN ('초저', '초고', '중저', '중고')),
  assessment_type VARCHAR(20) DEFAULT 'diagnostic' CHECK (assessment_type IN ('diagnostic', 'formative', 'summative')),
  time_limit_minutes INTEGER,
  created_by_user_id INTEGER REFERENCES users(user_id),
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 평가-문항 연결 테이블
CREATE TABLE assessment_items (
  assessment_item_id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES diagnostic_assessments(assessment_id) ON DELETE CASCADE,
  item_id INTEGER REFERENCES items(item_id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  points DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  UNIQUE(assessment_id, sequence_number)
);

-- 학생 평가 응시 테이블
CREATE TABLE assessment_attempts (
  attempt_id SERIAL PRIMARY KEY,
  assessment_id INTEGER REFERENCES diagnostic_assessments(assessment_id),
  student_id INTEGER REFERENCES users(user_id),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  total_score DECIMAL(6,2),
  max_score DECIMAL(6,2) NOT NULL,
  UNIQUE(assessment_id, student_id)
);

-- 학생 응답 테이블
CREATE TABLE student_responses (
  response_id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES assessment_attempts(attempt_id) ON DELETE CASCADE,
  assessment_item_id INTEGER REFERENCES assessment_items(assessment_item_id),
  response_type VARCHAR(10) NOT NULL CHECK (response_type IN ('mcq', 'essay')),

  -- 객관식 응답
  selected_option_index INTEGER,

  -- 서술형 응답
  essay_text TEXT,

  -- 채점 결과
  is_correct BOOLEAN,
  score DECIMAL(5,2),

  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 서술형 채점 상세 테이블
CREATE TABLE essay_gradings (
  grading_id SERIAL PRIMARY KEY,
  response_id INTEGER REFERENCES student_responses(response_id) ON DELETE CASCADE,

  -- 루브릭 기반 채점 결과 (JSON)
  criteria_scores JSONB NOT NULL,
  /*
  예시:
  [
    {
      "area": "내용 이해",
      "weight": 40,
      "level": "high",
      "score": 40,
      "feedback": "지문의 핵심 주제를 정확히 파악하였습니다"
    },
    ...
  ]
  */

  total_score DECIMAL(5,2) NOT NULL,
  overall_feedback TEXT,

  graded_by VARCHAR(20) DEFAULT 'ai' CHECK (graded_by IN ('ai', 'teacher')),
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 진단 보고서 테이블
CREATE TABLE diagnostic_reports (
  report_id SERIAL PRIMARY KEY,
  attempt_id INTEGER REFERENCES assessment_attempts(attempt_id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(user_id),
  assessment_id INTEGER REFERENCES diagnostic_assessments(assessment_id),

  -- 종합 점수
  total_score DECIMAL(6,2) NOT NULL,
  max_score DECIMAL(6,2) NOT NULL,
  percentage DECIMAL(5,2) NOT NULL,
  grade VARCHAR(5) NOT NULL,  -- A+, A, B+, B, C+, C, D, F

  -- 영역별 점수 (JSON)
  area_scores JSONB NOT NULL,
  /*
  예시:
  [
    {
      "area_name": "사실적 이해",
      "score": 45,
      "max_score": 50,
      "percentage": 90
    },
    ...
  ]
  */

  -- 강점 및 약점
  strengths TEXT[],
  weaknesses TEXT[],

  -- 종합 피드백
  comprehensive_feedback TEXT NOT NULL,
  detailed_feedback TEXT,

  -- 학습 추천
  recommended_books INTEGER[],  -- books 테이블의 book_id 배열
  improvement_suggestions TEXT[],

  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  UNIQUE(attempt_id)
);

-- 인덱스 생성
CREATE INDEX idx_assessment_items_assessment ON assessment_items(assessment_id);
CREATE INDEX idx_assessment_attempts_student ON assessment_attempts(student_id);
CREATE INDEX idx_student_responses_attempt ON student_responses(attempt_id);
CREATE INDEX idx_diagnostic_reports_student ON diagnostic_reports(student_id);
```

---

## 4. API 엔드포인트

### 4.1 진단 평가 관리
```
POST   /api/assessments/diagnostic          # 진단 평가 생성
GET    /api/assessments/diagnostic          # 진단 평가 목록 조회
GET    /api/assessments/diagnostic/:id      # 진단 평가 상세 조회
PUT    /api/assessments/diagnostic/:id      # 진단 평가 수정
DELETE /api/assessments/diagnostic/:id      # 진단 평가 삭제
POST   /api/assessments/diagnostic/:id/publish  # 진단 평가 배포
```

### 4.2 문항 선택 및 추천
```
GET    /api/items/available                 # 사용 가능한 문항 목록
POST   /api/assessments/recommend-items     # AI 기반 문항 자동 추천
```

### 4.3 학생 응시
```
POST   /api/assessments/:id/start           # 평가 시작
POST   /api/assessments/:id/responses       # 답안 임시 저장
POST   /api/assessments/:id/submit          # 평가 제출
GET    /api/assessments/attempts/:attemptId # 응시 현황 조회
```

### 4.4 채점
```
POST   /api/grading/auto                    # 자동 채점 (객관식 + 서술형)
POST   /api/grading/essay/:responseId       # 서술형 개별 재채점
```

### 4.5 보고서
```
GET    /api/reports/diagnostic/:attemptId   # 진단 보고서 조회
POST   /api/reports/diagnostic/:attemptId/generate  # 보고서 생성
GET    /api/reports/student/:studentId      # 학생별 보고서 목록
```

---

## 5. UI/UX 설계

### 5.1 교사 화면

#### 5.1.1 진단 평가 생성 화면
- 평가 기본 정보 입력 폼
- 문항 은행에서 문항 검색 및 선택
- 선택된 문항 목록 (드래그 앤 드롭으로 순서 조정)
- 미리보기 기능

#### 5.1.2 평가 관리 화면
- 생성된 평가 목록 (카드 형태)
- 상태별 필터 (초안/배포/보관)
- 학년군별 필터
- 평가별 응시 현황 표시

#### 5.1.3 결과 분석 화면
- 전체 학생 점수 분포 차트
- 문항별 정답률 분석
- 영역별 평균 점수
- 개별 학생 보고서 조회

### 5.2 학생 화면

#### 5.2.1 평가 응시 화면
```
┌─────────────────────────────────────────────────────┐
│  진단 평가: 독서 능력 진단 (초등 고학년)              │
│  진행률: [████████░░] 8/10 문항                      │
└─────────────────────────────────────────────────────┘
┌────────────────────┬────────────────────────────────┐
│                    │  문항 8/10                      │
│  지문 영역         │                                 │
│                    │  다음 지문을 읽고 물음에 답하    │
│  [지문 내용 표시]   │  시오.                          │
│                    │                                 │
│  스크롤 가능       │  1. 이 글의 주제는?             │
│                    │  ○ 선택지 1                     │
│                    │  ○ 선택지 2                     │
│                    │  ○ 선택지 3                     │
│                    │  ○ 선택지 4                     │
│                    │                                 │
│                    │  [이전] [임시저장] [다음]       │
└────────────────────┴────────────────────────────────┘
```

#### 5.2.2 보고서 화면
Legacy의 EvaluationResult.tsx 양식 참고:
- 종합 점수 및 등급 (그라데이션 배경)
- 영역별 점수 (막대 그래프 + 레이더 차트)
- 강점 및 약점 (카드 형태)
- 상세 피드백
- 학습 추천

---

## 6. 기술 스택

### 6.1 Frontend
- React + TypeScript
- Material-UI
- Recharts (차트 시각화)
- React Router

### 6.2 Backend
- Supabase (PostgreSQL + Auth + Storage)
- OpenAI API (서술형 채점)

### 6.3 AI 채점
- OpenAI GPT-4 Turbo
- 루브릭 기반 구조화된 프롬프트
- JSON 모드로 일관된 응답 형식

---

## 7. 성공 지표

### 7.1 기능적 지표
- 진단 평가 생성 성공률: 100%
- 객관식 자동 채점 정확도: 100%
- 서술형 AI 채점 일관성: 90% 이상 (교사 평가 대비)
- 보고서 생성 시간: 30초 이내

### 7.2 사용성 지표
- 교사의 평가 생성 시간: 10분 이내
- 학생 평가 완료율: 95% 이상
- 보고서 만족도: 4.5/5.0 이상

---

## 8. 제약사항 및 고려사항

### 8.1 제약사항
- 서술형 채점은 AI 기반으로 완벽하지 않을 수 있음 → 교사의 재채점 기능 필요
- OpenAI API 비용 발생 → 캐싱 및 최적화 필요
- 동시 접속자 처리 → 응시 시간 분산 유도

### 8.2 고려사항
- 문항 은행의 품질이 진단 평가의 품질을 결정
- 루브릭의 명확성이 AI 채점 품질을 결정
- 개인정보 보호 (학생 답안 및 점수)
- 접근성 (웹 접근성 가이드라인 준수)

---

## 9. 향후 확장 가능성

### 9.1 단기 (3개월)
- 교사의 서술형 수동 채점 기능
- 학부모 보고서 열람 및 코멘트
- 보고서 PDF 내보내기

### 9.2 중기 (6개월)
- 학생별 성장 추적 (여러 진단 평가 비교)
- 학급 단위 분석 및 비교
- 맞춤형 학습 경로 추천

### 9.3 장기 (1년)
- 적응형 평가 (학생 수준에 따라 문항 난이도 조정)
- 음성 답변 지원 (저학년용)
- 학습 분석 대시보드

---

## 10. 참고 자료
- Legacy 보고서: `legacy/frontend/src/pages/EvaluationResult.tsx`
- 현재 문항 은행: `items`, `authoring_items` 테이블
- 현재 지문 관리: `stimuli` 테이블
- 루브릭 시스템: `frontend/src/services/openaiService.ts`
