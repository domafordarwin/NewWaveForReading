-- =====================================================
-- 모든 테이블 삭제 (초기화용)
-- Supabase SQL Editor에서 실행
-- =====================================================

-- public 스키마의 모든 테이블 삭제
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 권한 복원
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
GRANT ALL ON SCHEMA public TO anon;
GRANT ALL ON SCHEMA public TO authenticated;
GRANT ALL ON SCHEMA public TO service_role;

-- 완료 메시지
SELECT 'All tables dropped. Run schema.sql to recreate.' as message;
