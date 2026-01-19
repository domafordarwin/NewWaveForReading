-- =====================================================
-- Books 테이블 스키마 및 권한 설정
-- =====================================================

-- Books 테이블 생성 (이미 존재할 경우 건너뜀)
CREATE TABLE IF NOT EXISTS public.books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  author VARCHAR(200) NOT NULL,
  publisher VARCHAR(200),
  category VARCHAR(100),
  difficulty_level VARCHAR(20) NOT NULL DEFAULT 'ELEM_HIGH',
  published_year INTEGER,
  isbn VARCHAR(50),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_books_title ON public.books(title);
CREATE INDEX IF NOT EXISTS idx_books_author ON public.books(author);
CREATE INDEX IF NOT EXISTS idx_books_difficulty ON public.books(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_books_category ON public.books(category);

-- RLS(Row Level Security) 활성화
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (있는 경우)
DROP POLICY IF EXISTS "Anyone can read books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can insert books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can update books" ON public.books;
DROP POLICY IF EXISTS "Authenticated users can delete books" ON public.books;
DROP POLICY IF EXISTS "Allow anon read access" ON public.books;
DROP POLICY IF EXISTS "Allow anon insert access" ON public.books;
DROP POLICY IF EXISTS "Allow anon update access" ON public.books;
DROP POLICY IF EXISTS "Allow anon delete access" ON public.books;

-- RLS 정책: 모든 사용자가 읽기 가능
CREATE POLICY "Anyone can read books" ON public.books
  FOR SELECT
  USING (true);

-- RLS 정책: 인증된 사용자만 삽입 가능
CREATE POLICY "Authenticated users can insert books" ON public.books
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- RLS 정책: 인증된 사용자만 업데이트 가능
CREATE POLICY "Authenticated users can update books" ON public.books
  FOR UPDATE
  USING (auth.role() = 'authenticated');

-- RLS 정책: 인증된 사용자만 삭제 가능
CREATE POLICY "Authenticated users can delete books" ON public.books
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- 익명 사용자를 위한 추가 정책 (개발 환경용)
-- 프로덕션에서는 제거하는 것을 권장합니다
CREATE POLICY "Allow anon read access" ON public.books
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anon insert access" ON public.books
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon update access" ON public.books
  FOR UPDATE
  TO anon
  USING (true);

CREATE POLICY "Allow anon delete access" ON public.books
  FOR DELETE
  TO anon
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

-- Updated_at 트리거
DROP TRIGGER IF EXISTS set_books_updated_at ON public.books;
CREATE TRIGGER set_books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_books_updated_at();
