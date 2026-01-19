-- =====================================================
-- authoring_projects 테이블에 primary_stimulus_id 컬럼 추가
-- 실행 전: Supabase SQL Editor에서 실행
-- =====================================================

-- 1. primary_stimulus_id 컬럼 추가 (이미 있으면 무시)
ALTER TABLE public.authoring_projects
ADD COLUMN IF NOT EXISTS primary_stimulus_id bigint 
REFERENCES public.stimuli(stimulus_id) ON DELETE SET NULL;

-- 2. 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_authoring_projects_stimulus 
ON public.authoring_projects(primary_stimulus_id);

-- 3. 확인
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'authoring_projects'
  AND column_name = 'primary_stimulus_id';
