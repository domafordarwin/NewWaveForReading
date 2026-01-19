-- authoring_projects 테이블 스키마 정리
-- primary_stimulus_id 제거하고 primary_project_stimulus_id만 사용

-- 1. 기존 primary_stimulus_id 관련 제약조건 및 인덱스 제거
DROP INDEX IF EXISTS public.idx_authoring_projects_stimulus;

-- 2. primary_stimulus_id 컬럼 제거
ALTER TABLE public.authoring_projects
DROP COLUMN IF EXISTS primary_stimulus_id;

-- 3. 현재 테이블 구조 확인을 위한 쿼리 (실행 후 결과 확인용)
-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_schema = 'public'
-- AND table_name = 'authoring_projects'
-- ORDER BY ordinal_position;
