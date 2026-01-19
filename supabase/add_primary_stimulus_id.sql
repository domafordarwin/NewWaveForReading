-- authoring_projects 테이블에 primary_stimulus_id 컬럼 추가
-- 프로젝트에 연결된 주요 지문을 저장하기 위한 컬럼

-- 컬럼 추가
ALTER TABLE public.authoring_projects 
ADD COLUMN IF NOT EXISTS primary_stimulus_id bigint 
REFERENCES public.stimuli(stimulus_id) ON DELETE SET NULL;

-- 인덱스 추가 (선택적)
CREATE INDEX IF NOT EXISTS idx_authoring_projects_stimulus 
ON public.authoring_projects(primary_stimulus_id);

-- 코멘트 추가
COMMENT ON COLUMN public.authoring_projects.primary_stimulus_id 
IS '프로젝트에 연결된 주요 지문 ID';
