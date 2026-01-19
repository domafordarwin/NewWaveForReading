# Books 테이블 권한 오류 해결 방법

## 문제
`permission denied for table books` 오류가 발생하는 경우

## 원인
books 테이블에 대한 RLS(Row Level Security) 정책과 권한이 설정되지 않았습니다.

## 해결 방법

### 1. Supabase 대시보드에서 SQL 실행

1. [Supabase Dashboard](https://supabase.com)에 로그인
2. 프로젝트 선택
3. 왼쪽 메뉴에서 **SQL Editor** 클릭
4. `books_schema.sql` 파일의 내용을 복사하여 붙여넣기
5. **Run** 버튼 클릭

### 2. 또는 Supabase CLI 사용 (설치되어 있는 경우)

```bash
# Supabase에 로그인
supabase login

# 프로젝트 링크
supabase link --project-ref your-project-ref

# SQL 파일 실행
supabase db push supabase/books_schema.sql
```

## books_schema.sql 파일 내용

이 파일은 다음을 수행합니다:

1. **테이블 생성**: books 테이블 생성 (이미 존재하면 건너뜀)
2. **인덱스 추가**: 제목, 저자, 난이도, 카테고리에 대한 인덱스
3. **RLS 활성화**: Row Level Security 활성화
4. **RLS 정책 설정**:
   - 모든 사용자 읽기 가능
   - 인증된 사용자만 삽입/수정/삭제 가능
   - 개발 환경: 익명 사용자도 모든 작업 가능
5. **권한 부여**: postgres, authenticated, anon, service_role에 권한 부여
6. **트리거**: updated_at 자동 갱신 트리거

## 프로덕션 환경 주의사항

프로덕션 환경에서는 익명 사용자 정책을 제거하는 것을 권장합니다:

```sql
-- 익명 사용자 정책 제거
DROP POLICY IF EXISTS "Allow anon read access" ON public.books;
DROP POLICY IF EXISTS "Allow anon insert access" ON public.books;
DROP POLICY IF EXISTS "Allow anon update access" ON public.books;
DROP POLICY IF EXISTS "Allow anon delete access" ON public.books;
```

## 확인 방법

SQL 실행 후 다음 쿼리로 확인:

```sql
-- RLS 활성화 여부 확인
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'books';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE tablename = 'books';

-- 권한 확인
SELECT grantee, privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'books';
```
