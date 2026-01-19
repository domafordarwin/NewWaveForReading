-- =====================================================
-- books 테이블 데이터를 stimuli 테이블로 마이그레이션
-- =====================================================

-- books 테이블이 존재하고 데이터가 있다면 stimuli로 복사
INSERT INTO public.stimuli (
  title,
  content_type,
  content_text,
  grade_band,
  genre,
  word_count,
  source_meta_json,
  assets_json,
  created_at,
  updated_at
)
SELECT
  title,
  'text' as content_type,
  description as content_text,
  CASE difficulty_level
    WHEN 'ELEM_LOW' THEN '초저'
    WHEN 'ELEM_HIGH' THEN '초고'
    WHEN 'MIDDLE' THEN '중저'
    WHEN 'HIGH' THEN '중고'
    ELSE '초고'
  END as grade_band,
  CASE
    WHEN category LIKE '%문학%' THEN '문학'
    WHEN category LIKE '%인문%' OR category LIKE '%사회%' THEN '비문학-설명문'
    WHEN category LIKE '%과학%' THEN '비문학-설명문'
    ELSE NULL
  END as genre,
  LENGTH(REPLACE(COALESCE(description, ''), ' ', '')) as word_count,
  jsonb_build_object(
    'source', publisher,
    'author', author,
    'copyright', publisher,
    'note', CONCAT('ISBN: ', isbn, ' | 출판년도: ', published_year)
  ) as source_meta_json,
  '{}'::jsonb as assets_json,
  COALESCE(created_at, NOW()) as created_at,
  COALESCE(updated_at, NOW()) as updated_at
FROM public.books
WHERE NOT EXISTS (
  SELECT 1 FROM public.stimuli
  WHERE stimuli.title = books.title
  AND stimuli.source_meta_json->>'author' = books.author
)
ON CONFLICT DO NOTHING;

-- 마이그레이션 결과 확인
SELECT
  '마이그레이션 완료' as status,
  (SELECT COUNT(*) FROM public.books) as books_count,
  (SELECT COUNT(*) FROM public.stimuli) as stimuli_count,
  (SELECT COUNT(*) FROM public.stimuli WHERE source_meta_json->>'source' IS NOT NULL) as migrated_count;
