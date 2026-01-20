# NewWaveForReading RPD (프로젝트 시작용)

## 1. 문서 목적

- 기존 개발 결과(프론트 화면/ERD/seed 데이터)를 기준으로 Supabase + Vercel + OpenAI API 기반 신규 프로젝트 착수 계획을 정의한다.
- 단계별 실행 가능한 스텝과 산출물을 제공한다.

## 2. 비전 및 목표

- 학생의 독서 기반 서술 답안을 AI가 평가/첨삭하고, 성장 지표를 시각화한다.
- 교사는 검사 배정과 결과 관리를 통해 학습 피드백을 제공한다.

## 3. 범위 정의

- 포함: 사용자 인증, 검사 배정/응시, 자동 저장, AI 평가 및 피드백, 결과 리포트, 통계 대시보드
- 제외(1차): 결제/과금, LMS 연동, 학부모 포털 고도화

## 4. 역할 및 사용자 유형

- 학생: 검사 응시, 결과 확인, 학습 이력
- 교사: 검사 배정, 결과 리뷰, 반 통계
- 관리자: 사용자/콘텐츠 관리
- 학부모(선택): 자녀 결과 열람

## 5. 시스템 구성

- Frontend: React + Vite + TypeScript + MUI
- Backend: Vercel API Routes (AI 평가, 민감 처리)
- DB/Auth/Storage: Supabase (Postgres, Auth, Storage)
- AI: OpenAI API
- Deployment: Vercel

## 6. 데이터 모델 요약 (seed.sql 기준)

- users: 학생/교사/학부모/관리자
- books: 도서 메타 정보
- topics: 도서 기반 논제 및 키워드
- assessments: 검사(상태, 시간 제한 등)
- answers: 답안 본문 및 통계
- evaluations: 점수/등급/피드백 요약
- feedbacks: 루브릭/첨삭/교사노트
- progress_history: 학습 이력 스냅샷

## 7. 핵심 기능 요구사항

### 학생

- 검사 목록/상태 조회
- 검사 응시 (타이머, 자동 저장, 글자 수 체크)
- 제출 후 AI 평가 결과 조회
- 성장 그래프/영역별 분석

### 교사

- 검사 배정/관리
- 결과 리스트 및 상세 리뷰
- 코멘트 작성
- 반 단위 통계

### 관리자

- 사용자/도서/논제 관리

## 8. AI 평가 요건

- 입력: 답안 텍스트, 논제/도서 정보, 평가 기준
- 출력:
  - 영역별 점수 (예: 분석/창의/문제해결/표현)
  - 오류 유형 및 수정 제안
  - 강점/약점/개선 제안
  - 총점/등급/백분위

## 8.1 OpenAI 프롬프트 초안

아래 프롬프트는 서버 사이드에서 사용하며, 출력은 반드시 JSON으로 제한한다.

System:
You are an evaluation engine for Korean writing assessments. Return only JSON that matches the provided schema. Do not include any extra text.

User:
평가 대상 답안을 아래 기준으로 분석하고 JSON으로 결과를 반환하세요.

[평가기준]

- 논제 충실성/입장 명료성
- 대상도서 이해/활용
- 논거 다양성/타당성
- 구성/일관성(서론-본론-결론)
- 창의적 사고력
- 표현/문장력

[제공 정보]

- 책 제목: {book_title}
- 논제: {topic_text}
- 난이도: {difficulty_level}
- 학생 답안: {answer_text}

[요구사항]

- 각 영역 점수는 0~25 정수
- 총점은 0~100 정수
- 등급은 A+, A, B+, B, C
- 오류 유형은 spelling, spacing, grammar, expression, logic, structure 중 선택
- strengths, weaknesses, improvements는 한국어로 2~4개 배열
- corrections는 가능한 경우 위치/원문/수정안을 포함
- feedback_summary는 2~3문장

## 8.2 JSON 스키마 초안

아래 스키마는 평가 결과 저장을 위한 기준이다.

```json
{
  "scores": {
    "book_analysis": 0,
    "creative_thinking": 0,
    "problem_solving": 0,
    "language_expression": 0
  },
  "total_score": 0,
  "grade": "A+",
  "percentile": 0,
  "errors": {
    "spelling": 0,
    "spacing": 0,
    "grammar": 0
  },
  "vocabulary_level": 0.0,
  "feedback_summary": "",
  "strengths": ["", ""],
  "weaknesses": ["", ""],
  "improvements": ["", ""],
  "corrections": [
    {
      "error_type": "spelling",
      "position": { "start": 0, "end": 0 },
      "original": "",
      "suggested": "",
      "reason": ""
    }
  ]
}
```

## 8.3 Supabase 컬럼 매핑 (초안)

아래는 JSON 결과를 Supabase 테이블에 저장하기 위한 1:1 매핑 기준이다.

| JSON 필드                     | Supabase 테이블.컬럼                  | 비고                   |
| ----------------------------- | ------------------------------------- | ---------------------- |
| scores.book_analysis          | evaluations.book_analysis_score       | 0~25 정수              |
| scores.creative_thinking      | evaluations.creative_thinking_score   | 0~25 정수              |
| scores.problem_solving        | evaluations.problem_solving_score     | 0~25 정수              |
| scores.language_expression    | evaluations.language_expression_score | 0~25 정수              |
| total_score                   | evaluations.total_score               | 0~100 정수             |
| grade                         | evaluations.grade                     | A+, A, B+, B, C        |
| percentile                    | evaluations.percentile                | 0~100                  |
| errors.spelling               | evaluations.spelling_errors           | 건수                   |
| errors.spacing                | evaluations.spacing_errors            | 건수                   |
| errors.grammar                | evaluations.grammar_errors            | 건수                   |
| vocabulary_level              | evaluations.vocabulary_level          | 0.0~5.0                |
| feedback_summary              | evaluations.overall_comment           | 요약 코멘트            |
| strengths                     | evaluations.strengths                 | text[]                 |
| weaknesses                    | evaluations.weaknesses                | text[]                 |
| improvements                  | evaluations.improvements              | text[]                 |
| corrections[*].error_type     | corrections.error_type                | enum/text              |
| corrections[*].position.start | corrections.start_index               | 필요 시 컬럼 추가      |
| corrections[*].position.end   | corrections.end_index                 | 필요 시 컬럼 추가      |
| corrections[*].original       | corrections.original_text             | 필요 시 컬럼 추가      |
| corrections[*].suggested      | corrections.suggested_text            | 필요 시 컬럼 추가      |
| corrections[*].reason         | corrections.reason                    | 필요 시 컬럼 추가      |
| feedback_summary              | feedbacks.summary_intro               | 요약 1문단로 분리 시   |
| strengths                     | feedbacks.strengths                   | text[]                 |
| weaknesses                    | feedbacks.weaknesses                  | text[]                 |
| improvements                  | feedbacks.improvements                | text[]                 |
| corrections                   | feedbacks.line_edits                  | jsonb 배열로 저장 가능 |

## 8.4 Vercel API 요청 형식 (초안)

서버 사이드에서 OpenAI 호출 전, API Route 입력 형식을 아래처럼 고정한다.

요청 예시 (클라이언트 -> Vercel):

```json
{
  "assessment_id": 1,
  "student_id": 1,
  "book_title": "동물농장",
  "topic_text": "동물농장에서 권력의 부패가 전개되는 과정을 분석하시오.",
  "difficulty_level": "MIDDLE",
  "answer_text": "답안 텍스트...",
  "rubric_version": "v1",
  "locale": "ko-KR"
}
```

OpenAI 요청 예시 (Vercel -> OpenAI):

```json
{
  "model": "gpt-4.1-mini",
  "temperature": 0.2,
  "response_format": { "type": "json_object" },
  "messages": [
    {
      "role": "system",
      "content": "You are an evaluation engine for Korean writing assessments. Return only JSON that matches the provided schema. Do not include any extra text."
    },
    {
      "role": "user",
      "content": "평가 대상 답안을 아래 기준으로 분석하고 JSON으로 결과를 반환하세요.\n\n[평가기준]\n- 논제 충실성/입장 명료성\n- 대상도서 이해/활용\n- 논거 다양성/타당성\n- 구성/일관성(서론-본론-결론)\n- 창의적 사고력\n- 표현/문장력\n\n[제공 정보]\n- 책 제목: 동물농장\n- 논제: 동물농장에서 권력의 부패가 전개되는 과정을 분석하시오.\n- 난이도: MIDDLE\n- 학생 답안: 답안 텍스트...\n\n[요구사항]\n- 각 영역 점수는 0~25 정수\n- 총점은 0~100 정수\n- 등급은 A+, A, B+, B, C\n- 오류 유형은 spelling, spacing, grammar, expression, logic, structure 중 선택\n- strengths, weaknesses, improvements는 한국어로 2~4개 배열\n- corrections는 가능한 경우 위치/원문/수정안을 포함\n- feedback_summary는 2~3문장"
    }
  ]
}
```

## 9. 보안 및 접근 정책 (Supabase RLS)

- 학생은 본인 데이터만 접근
- 교사는 소속 학생 데이터 접근
- 평가/피드백은 학생+교사+관리자만 조회
- OpenAI 키는 서버 사이드 보관

## 10. API 설계 (Vercel API Routes)

- POST /api/ai/evaluate
  - 요청: answer_text, topic_id, student_id
  - 응답: scores, corrections, feedback_summary
- POST /api/assessments/submit
  - 답안 저장 + AI 평가 트리거
- GET /api/assessments/:id/result
  - evaluation + feedbacks + corrections

## 11. 개발 단계 및 상세 스텝

### Phase 0: 프로젝트 준비 (1~2일)

1. Supabase 프로젝트 생성
2. env 설계
   - SUPABASE_URL
   - SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
3. Vercel 프로젝트 생성 및 환경 변수 등록
4. Git 브랜치/배포 구조 확정

### Phase 1: DB/인증 구축 (2~4일)

1. supabase 스키마 적용 (seed.sql 기반 테이블/샘플)
2. Supabase Auth 설정 (Email/OTP)
3. RLS 정책 설계 및 테스트
4. 샘플 데이터 시딩

### Phase 2: 프론트 데이터 연동 (3~5일)

1. supabase-js 클라이언트 초기화 모듈 작성
2. 기존 Mock 데이터 → 실제 데이터 전환
3. 학생 대시보드/응시/결과 화면 연동
4. Empty 상태 및 오류 처리

### Phase 3: AI 평가 파이프라인 (3~5일)

1. Vercel API Route에서 OpenAI 호출
2. 평가 결과 JSON 스키마 정의
3. evaluations/feedbacks/corrections 저장
4. 결과 화면 렌더링

### Phase 4: 교사용 기능 (4~6일)

1. 교사용 대시보드 구현
2. 검사 배정 UI + 로직
3. 결과 리스트/통계 페이지
4. 권한 정책 검증

### Phase 5: 배포 및 검증 (2~3일)

1. Vercel 배포
2. Supabase RLS 점검
3. QA 시나리오 테스트
4. 오류 로깅/모니터링 추가

## 12. 테스트 전략

- 기능 테스트: 로그인, 검사 응시, 제출, 결과 확인
- 보안 테스트: RLS 정책 검증
- AI 품질 테스트: 피드백 품질 샘플링
- 성능 테스트: 1000자 답안 기준 응답 속도 측정

## 13. 리스크 및 대응

- AI 응답 변동성: 프롬프트 버전 관리
- 비용 증가: 캐싱/요약 활용
- RLS 오류: 정책 자동 테스트 도입

## 14. 산출물

- DB 스키마 문서
- API 명세서
- 프론트 화면별 데이터 연동 문서
- 배포/운영 가이드

## 15. 다음 의사결정 항목

- 로그인 방식: Email/OTP vs 소셜
- 교사 기능 우선순위
- AI 피드백 제공 방식: 실시간 vs 비동기
