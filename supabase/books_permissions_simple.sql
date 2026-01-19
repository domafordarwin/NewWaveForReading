-- =====================================================
-- Books 테이블 간단한 권한 설정 (개발용)
-- =====================================================

-- RLS 활성화
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 기존 모든 정책 삭제
DROP POLICY IF EXISTS "Anyone can read books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can update books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can delete books" ON public.books;
DROP POLICY IF EXISTS "Allow anon read access" ON public.books;
DROP POLICY IF EXISTS "Allow anon insert access" ON public.books;
DROP POLICY IF EXISTS "Allow anon update access" ON public.books;
DROP POLICY IF EXISTS "Allow anon delete access" ON public.books;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.books;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.books;
DROP POLICY IF EXISTS "Enable update for all users" ON public.books;
DROP POLICY IF EXISTS "Enable delete for all users" ON public.books;

-- 모든 사용자에게 모든 권한 부여 (개발 환경)
CREATE POLICY "Enable read access for all users" ON public.books
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users" ON public.books
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON public.books
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users" ON public.books
  FOR DELETE
  USING (true);

-- 권한 부여
GRANT ALL ON public.books TO postgres;
GRANT ALL ON public.books TO authenticated;
GRANT ALL ON public.books TO anon;
GRANT ALL ON public.books TO service_role;

-- 시퀀스 권한 부여
GRANT USAGE, SELECT ON SEQUENCE public.books_book_id_seq TO postgres;
GRANT USAGE, SELECT ON SEQUENCE public.books_book_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.books_book_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.books_book_id_seq TO service_role;
