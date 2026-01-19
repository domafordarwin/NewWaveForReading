-- =====================================================
-- 프로젝트별 지문 복사본 시스템으로 마이그레이션
-- =====================================================
-- 실행 순서:
-- 1. 레거시 컬럼 및 제약조건 제거
-- 2. project_stimuli 테이블 생성
-- 3. authoring_projects에 새 컬럼 추가
-- =====================================================

-- =====================================================
-- STEP 1: 레거시 스키마 정리
-- =====================================================

-- 기존 primary_stimulus_id 관련 인덱스 제거
DROP INDEX IF EXISTS public.idx_authoring_projects_stimulus;

-- 기존 primary_stimulus_id 컬럼 제거
ALTER TABLE public.authoring_projects
DROP COLUMN IF EXISTS primary_stimulus_id;

-- =====================================================
-- STEP 2: project_stimuli 테이블 생성
-- =====================================================

-- 프로젝트-지문 연결 및 편집 가능한 복사본 테이블
CREATE TABLE IF NOT EXISTS public.project_stimuli (
  project_stimulus_id bigserial PRIMARY KEY,
  project_id bigint NOT NULL REFERENCES public.authoring_projects(project_id) ON DELETE CASCADE,
  original_stimulus_id bigint REFERENCES public.stimuli(stimulus_id) ON DELETE SET NULL,

  -- 편집 가능한 지문 내용 (원본에서 복사되어 프로젝트별로 수정 가능)
  title text NOT NULL,
  content_type text NOT NULL DEFAULT 'text',
  content_text text,
  grade_band text NOT NULL,
  genre text,
  word_count integer,

  -- 메타데이터
  source_title text,
  source_author text,
  source_year text,
  source_url text,

  -- 편집 이력
  is_modified boolean DEFAULT false, -- 원본에서 수정되었는지 여부
  modified_fields text[], -- 어떤 필드가 수정되었는지

  -- 타임스탬프
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_project_stimuli_project
ON public.project_stimuli(project_id);

CREATE INDEX IF NOT EXISTS idx_project_stimuli_original
ON public.project_stimuli(original_stimulus_id);

-- 코멘트
COMMENT ON TABLE public.project_stimuli IS '프로젝트별 지문 복사본 - 원본 지문을 프로젝트에 연결하면서 편집 가능한 복사본 생성';
COMMENT ON COLUMN public.project_stimuli.original_stimulus_id IS '원본 지문 ID (참조용, NULL 가능 - 프로젝트에서 직접 작성한 경우)';
COMMENT ON COLUMN public.project_stimuli.is_modified IS '원본에서 수정되었는지 여부';
COMMENT ON COLUMN public.project_stimuli.modified_fields IS '수정된 필드 목록 (예: {title, content_text})';

-- =====================================================
-- STEP 3: 트리거 설정
-- =====================================================

-- 기존 트리거 및 함수 삭제 (존재하는 경우)
DO $$
BEGIN
  DROP TRIGGER IF EXISTS trigger_update_project_stimuli_updated_at ON public.project_stimuli;
EXCEPTION
  WHEN undefined_table THEN NULL;
END $$;

DROP FUNCTION IF EXISTS update_project_stimuli_updated_at();

-- updated_at 자동 업데이트 함수
CREATE OR REPLACE FUNCTION update_project_stimuli_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- updated_at 자동 업데이트 트리거
CREATE TRIGGER trigger_update_project_stimuli_updated_at
  BEFORE UPDATE ON public.project_stimuli
  FOR EACH ROW
  EXECUTE FUNCTION update_project_stimuli_updated_at();

-- =====================================================
-- STEP 4: authoring_projects 테이블에 새 컬럼 추가
-- =====================================================

-- primary_project_stimulus_id 컬럼 추가
ALTER TABLE public.authoring_projects
ADD COLUMN IF NOT EXISTS primary_project_stimulus_id bigint
REFERENCES public.project_stimuli(project_stimulus_id) ON DELETE SET NULL;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_authoring_projects_project_stimulus
ON public.authoring_projects(primary_project_stimulus_id);

-- 코멘트 추가
COMMENT ON COLUMN public.authoring_projects.primary_project_stimulus_id
IS '프로젝트에 연결된 주요 지문 (project_stimuli 테이블의 복사본)';

-- =====================================================
-- 완료
-- =====================================================
-- 마이그레이션 완료. 다음 단계:
-- 1. 애플리케이션에서 useStimulusManagement 훅 사용
-- 2. 레거시 primary_stimulus_id 참조 제거 완료 확인
-- =====================================================
