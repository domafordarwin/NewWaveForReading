-- =====================================================
-- Books 테이블 스키마 수정 및 권한 설정
-- =====================================================

-- updated_at 컬럼 추가 (없는 경우)
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- created_at 컬럼 추가 (없는 경우)
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 기존 레코드의 updated_at과 created_at을 현재 시간으로 설정
UPDATE public.books
SET updated_at = NOW()
WHERE updated_at IS NULL;

UPDATE public.books
SET created_at = NOW()
WHERE created_at IS NULL;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books(author);
CREATE INDEX IF NOT EXISTS idx_books_difficulty ON public.books(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);

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

-- Updated_at 자동 갱신 트리거 함수
CREATE OR REPLACE FUNCTION public.update_books_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 기존 트리거 삭제 후 재생성
DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_books_updated_at();
