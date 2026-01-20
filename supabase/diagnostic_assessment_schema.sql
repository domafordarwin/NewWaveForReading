-- ============================================
-- 진단 평가 시스템 데이터베이스 스키마
-- ============================================

-- 1. 진단 평가 테이블
CREATE TABLE IF NOT EXISTS public.diagnostic_assessments (
  assessment_id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  grade_band VARCHAR(10) NOT NULL CHECK (grade_band IN ('초저', '초고', '중저', '중고')),
  assessment_type VARCHAR(20) DEFAULT 'diagnostic' CHECK (assessment_type IN ('diagnostic', 'formative', 'summative')),
  time_limit_minutes INTEGER,
  created_by_user_id INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

COMMENT ON TABLE public.diagnostic_assessments IS '진단 평가 기본 정보';
COMMENT ON COLUMN public.diagnostic_assessments.assessment_type IS '평가 유형: diagnostic(진단), formative(형성), summative(총괄)';
COMMENT ON COLUMN public.diagnostic_assessments.status IS '상태: draft(초안), published(배포), archived(보관)';

-- 2. 평가-문항 연결 테이블
CREATE TABLE IF NOT EXISTS public.assessment_items (
  assessment_item_id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL REFERENCES public.diagnostic_assessments(assessment_id) ON DELETE CASCADE,
  draft_item_id INTEGER NOT NULL REFERENCES public.authoring_items(draft_item_id) ON DELETE CASCADE,
  sequence_number INTEGER NOT NULL,
  points DECIMAL(5,2) NOT NULL DEFAULT 10.00,
  UNIQUE(assessment_id, sequence_number),
  CHECK (points > 0)
);

COMMENT ON TABLE public.assessment_items IS '진단 평가에 포함된 문항 목록';
COMMENT ON COLUMN public.assessment_items.draft_item_id IS 'authoring_items 테이블의 문항 ID';
COMMENT ON COLUMN public.assessment_items.sequence_number IS '문항 순서 (1부터 시작)';
COMMENT ON COLUMN public.assessment_items.points IS '문항별 배점';

-- 3. 학생 평가 응시 테이블
CREATE TABLE IF NOT EXISTS public.assessment_attempts (
  attempt_id SERIAL PRIMARY KEY,
  assessment_id INTEGER NOT NULL REFERENCES public.diagnostic_assessments(assessment_id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  submitted_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  total_score DECIMAL(6,2),
  max_score DECIMAL(6,2) NOT NULL,
  UNIQUE(assessment_id, student_id),
  CHECK (total_score IS NULL OR total_score >= 0),
  CHECK (total_score IS NULL OR total_score <= max_score)
);

COMMENT ON TABLE public.assessment_attempts IS '학생의 평가 응시 기록';
COMMENT ON COLUMN public.assessment_attempts.status IS '상태: in_progress(진행중), submitted(제출), graded(채점완료)';

-- 4. 학생 응답 테이블
CREATE TABLE IF NOT EXISTS public.student_responses (
  response_id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL REFERENCES public.assessment_attempts(attempt_id) ON DELETE CASCADE,
  assessment_item_id INTEGER NOT NULL REFERENCES public.assessment_items(assessment_item_id) ON DELETE CASCADE,
  response_type VARCHAR(10) NOT NULL CHECK (response_type IN ('mcq', 'essay')),

  -- 객관식 응답
  selected_option_index INTEGER,

  -- 서술형 응답
  essay_text TEXT,

  -- 채점 결과
  is_correct BOOLEAN,
  score DECIMAL(5,2),

  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- 제약 조건: 객관식은 selected_option_index 필수, 서술형은 essay_text 필수
  CHECK (
    (response_type = 'mcq' AND selected_option_index IS NOT NULL) OR
    (response_type = 'essay' AND essay_text IS NOT NULL)
  ),
  CHECK (score IS NULL OR score >= 0)
);

COMMENT ON TABLE public.student_responses IS '학생의 문항별 응답';
COMMENT ON COLUMN public.student_responses.selected_option_index IS '객관식 선택 답안 인덱스 (0부터 시작)';
COMMENT ON COLUMN public.student_responses.essay_text IS '서술형 답안 텍스트';

-- 5. 서술형 채점 상세 테이블
CREATE TABLE IF NOT EXISTS public.essay_gradings (
  grading_id SERIAL PRIMARY KEY,
  response_id INTEGER NOT NULL UNIQUE REFERENCES public.student_responses(response_id) ON DELETE CASCADE,

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
    {
      "area": "논리적 전개",
      "weight": 30,
      "level": "middle",
      "score": 21,
      "feedback": "주장과 근거가 있으나 연결이 다소 부족합니다"
    },
    {
      "area": "표현력",
      "weight": 30,
      "level": "high",
      "score": 30,
      "feedback": "정확하고 다양한 어휘로 명료하게 표현하였습니다"
    }
  ]
  */

  total_score DECIMAL(5,2) NOT NULL,
  overall_feedback TEXT,

  graded_by VARCHAR(20) DEFAULT 'ai' CHECK (graded_by IN ('ai', 'teacher')),
  graded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CHECK (total_score >= 0)
);

COMMENT ON TABLE public.essay_gradings IS '서술형 문항 채점 상세 정보';
COMMENT ON COLUMN public.essay_gradings.criteria_scores IS '루브릭 영역별 채점 결과 (JSON 배열)';
COMMENT ON COLUMN public.essay_gradings.graded_by IS '채점 주체: ai(AI 자동), teacher(교사 수동)';

-- 6. 진단 보고서 테이블
CREATE TABLE IF NOT EXISTS public.diagnostic_reports (
  report_id SERIAL PRIMARY KEY,
  attempt_id INTEGER NOT NULL UNIQUE REFERENCES public.assessment_attempts(attempt_id) ON DELETE CASCADE,
  student_id INTEGER NOT NULL,
  assessment_id INTEGER NOT NULL REFERENCES public.diagnostic_assessments(assessment_id) ON DELETE CASCADE,

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
    {
      "area_name": "추론적 이해",
      "score": 35,
      "max_score": 50,
      "percentage": 70
    },
    {
      "area_name": "비판적 이해",
      "score": 30,
      "max_score": 50,
      "percentage": 60
    }
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

  CHECK (total_score >= 0),
  CHECK (total_score <= max_score),
  CHECK (percentage >= 0 AND percentage <= 100)
);

COMMENT ON TABLE public.diagnostic_reports IS '진단 평가 보고서';
COMMENT ON COLUMN public.diagnostic_reports.grade IS '등급: A+, A, B+, B, C+, C, D, F';
COMMENT ON COLUMN public.diagnostic_reports.area_scores IS '평가 영역별 점수 (JSON 배열)';

-- ============================================
-- 인덱스 생성
-- ============================================

CREATE INDEX IF NOT EXISTS idx_diagnostic_assessments_status ON public.diagnostic_assessments(status);
CREATE INDEX IF NOT EXISTS idx_diagnostic_assessments_grade_band ON public.diagnostic_assessments(grade_band);
CREATE INDEX IF NOT EXISTS idx_diagnostic_assessments_created_by ON public.diagnostic_assessments(created_by_user_id);

CREATE INDEX IF NOT EXISTS idx_assessment_items_assessment ON public.assessment_items(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_items_draft_item ON public.assessment_items(draft_item_id);

CREATE INDEX IF NOT EXISTS idx_assessment_attempts_student ON public.assessment_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_assessment ON public.assessment_attempts(assessment_id);
CREATE INDEX IF NOT EXISTS idx_assessment_attempts_status ON public.assessment_attempts(status);

CREATE INDEX IF NOT EXISTS idx_student_responses_attempt ON public.student_responses(attempt_id);
CREATE INDEX IF NOT EXISTS idx_student_responses_assessment_item ON public.student_responses(assessment_item_id);

CREATE INDEX IF NOT EXISTS idx_essay_gradings_response ON public.essay_gradings(response_id);

CREATE INDEX IF NOT EXISTS idx_diagnostic_reports_student ON public.diagnostic_reports(student_id);
CREATE INDEX IF NOT EXISTS idx_diagnostic_reports_assessment ON public.diagnostic_reports(assessment_id);

-- ============================================
-- 트리거 함수: updated_at 자동 업데이트
-- ============================================

CREATE OR REPLACE FUNCTION public.update_diagnostic_assessments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_diagnostic_assessments_updated_at ON public.diagnostic_assessments;

CREATE TRIGGER trigger_update_diagnostic_assessments_updated_at
BEFORE UPDATE ON public.diagnostic_assessments
FOR EACH ROW
EXECUTE FUNCTION public.update_diagnostic_assessments_updated_at();

-- ============================================
-- RLS (Row Level Security) 정책
-- ============================================

-- RLS 활성화
ALTER TABLE public.diagnostic_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.essay_gradings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_reports ENABLE ROW LEVEL SECURITY;

-- diagnostic_assessments 정책
DROP POLICY IF EXISTS "Anyone can read published assessments" ON public.diagnostic_assessments;
CREATE POLICY "Anyone can read published assessments"
  ON public.diagnostic_assessments FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Teachers can manage their own assessments" ON public.diagnostic_assessments;
CREATE POLICY "Teachers can manage their own assessments"
  ON public.diagnostic_assessments FOR ALL
  USING (true);  -- 일단 모든 사용자 허용 (추후 role 기반으로 수정)

-- assessment_items 정책
DROP POLICY IF EXISTS "Anyone can read assessment items" ON public.assessment_items;
CREATE POLICY "Anyone can read assessment items"
  ON public.assessment_items FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can manage assessment items" ON public.assessment_items;
CREATE POLICY "Anyone can manage assessment items"
  ON public.assessment_items FOR ALL
  USING (true);

-- assessment_attempts 정책
DROP POLICY IF EXISTS "Students can read their own attempts" ON public.assessment_attempts;
CREATE POLICY "Students can read their own attempts"
  ON public.assessment_attempts FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Students can create attempts" ON public.assessment_attempts;
CREATE POLICY "Students can create attempts"
  ON public.assessment_attempts FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Students can update their own attempts" ON public.assessment_attempts;
CREATE POLICY "Students can update their own attempts"
  ON public.assessment_attempts FOR UPDATE
  USING (true);

-- student_responses 정책
DROP POLICY IF EXISTS "Anyone can manage responses" ON public.student_responses;
CREATE POLICY "Anyone can manage responses"
  ON public.student_responses FOR ALL
  USING (true);

-- essay_gradings 정책
DROP POLICY IF EXISTS "Anyone can manage essay gradings" ON public.essay_gradings;
CREATE POLICY "Anyone can manage essay gradings"
  ON public.essay_gradings FOR ALL
  USING (true);

-- diagnostic_reports 정책
DROP POLICY IF EXISTS "Anyone can read reports" ON public.diagnostic_reports;
CREATE POLICY "Anyone can read reports"
  ON public.diagnostic_reports FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Anyone can create reports" ON public.diagnostic_reports;
CREATE POLICY "Anyone can create reports"
  ON public.diagnostic_reports FOR INSERT
  WITH CHECK (true);

-- ============================================
-- 권한 부여
-- ============================================

GRANT ALL ON public.diagnostic_assessments TO anon, authenticated;
GRANT ALL ON public.assessment_items TO anon, authenticated;
GRANT ALL ON public.assessment_attempts TO anon, authenticated;
GRANT ALL ON public.student_responses TO anon, authenticated;
GRANT ALL ON public.essay_gradings TO anon, authenticated;
GRANT ALL ON public.diagnostic_reports TO anon, authenticated;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
