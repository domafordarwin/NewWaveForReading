-- 프로젝트별 지문 복사본 테이블
-- 원본 지문(stimuli)은 읽기 전용으로 유지하고,
-- 각 프로젝트에서 사용할 때는 편집 가능한 복사본을 생성

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

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_project_stimuli_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거가 있다면 삭제
DROP TRIGGER IF EXISTS trigger_update_project_stimuli_updated_at ON public.project_stimuli;

CREATE TRIGGER trigger_update_project_stimuli_updated_at
  BEFORE UPDATE ON public.project_stimuli
  FOR EACH ROW
  EXECUTE FUNCTION update_project_stimuli_updated_at();

-- authoring_projects 테이블의 primary_stimulus_id를 project_stimuli로 변경
-- (기존 컬럼을 주석 처리하고 새 컬럼 추가)
ALTER TABLE public.authoring_projects
DROP COLUMN IF EXISTS primary_stimulus_id;

ALTER TABLE public.authoring_projects
ADD COLUMN IF NOT EXISTS primary_project_stimulus_id bigint
REFERENCES public.project_stimuli(project_stimulus_id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_authoring_projects_project_stimulus
ON public.authoring_projects(primary_project_stimulus_id);

COMMENT ON COLUMN public.authoring_projects.primary_project_stimulus_id
IS '프로젝트에 연결된 주요 지문 (project_stimuli 테이블의 복사본)';
