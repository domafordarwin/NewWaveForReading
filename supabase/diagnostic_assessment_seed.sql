-- =========================================================
-- 진단 평가 시드 데이터 (학년군별)
-- 목적: 각 학년군(초저, 초고, 중저, 중고)에 맞는 진단 평가 생성
-- 참고: 기존 item_bank의 문항을 활용하여 진단 평가 구성
-- =========================================================

-- =========================================================
-- 1. 진단 평가 생성 (4개 학년군)
-- =========================================================

-- 1.1 초등 저학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, 
  description, 
  grade_band, 
  assessment_type, 
  time_limit_minutes, 
  created_by_user_id, 
  status
)
SELECT 
  '2025학년도 초등 저학년 문해력 진단 평가',
  '초등학교 1~2학년 학생을 대상으로 한 문해력 진단 평가입니다. 읽기 이해력, 어휘력, 추론 능력을 종합적으로 평가합니다.',
  '초저',
  'diagnostic',
  40,
  1,
  'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 저학년 문해력 진단 평가'
);

-- 1.2 초등 고학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, 
  description, 
  grade_band, 
  assessment_type, 
  time_limit_minutes, 
  created_by_user_id, 
  status
)
SELECT 
  '2025학년도 초등 고학년 문해력 진단 평가',
  '초등학교 5~6학년 학생을 대상으로 한 문해력 진단 평가입니다. 사실적 이해, 추론적 이해, 비판적 이해, 창의적 적용 능력을 평가합니다.',
  '초고',
  'diagnostic',
  50,
  1,
  'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 고학년 문해력 진단 평가'
);

-- 1.3 중등 저학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, 
  description, 
  grade_band, 
  assessment_type, 
  time_limit_minutes, 
  created_by_user_id, 
  status
)
SELECT 
  '2025학년도 중등 저학년 문해력 진단 평가',
  '중학교 1~2학년 학생을 대상으로 한 문해력 진단 평가입니다. 비문학(설명문, 논설문)과 문학(소설, 시) 텍스트에 대한 이해력을 종합적으로 평가합니다.',
  '중저',
  'diagnostic',
  60,
  1,
  'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 저학년 문해력 진단 평가'
);

-- 1.4 중등 고학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, 
  description, 
  grade_band, 
  assessment_type, 
  time_limit_minutes, 
  created_by_user_id, 
  status
)
SELECT 
  '2025학년도 중등 고학년 문해력 진단 평가',
  '중학교 3학년 및 고등학교 1학년 학생을 대상으로 한 문해력 진단 평가입니다. 고급 텍스트 분석 능력, 비판적 사고력, 논증 능력을 평가합니다.',
  '중고',
  'diagnostic',
  70,
  1,
  'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 고학년 문해력 진단 평가'
);

-- =========================================================
-- 2. authoring_items에 문항 추가 (item_bank 기반)
-- =========================================================

-- authoring_items 테이블에 기존 item_bank 문항을 authoring_items로 복제
-- (diagnostic_assessments의 assessment_items가 authoring_items를 참조하므로)

DO $OUTER$
DECLARE
  v_item RECORD;
  v_draft_item_id INTEGER;
  v_project_id INTEGER := 1;  -- 기본 프로젝트 ID
BEGIN
  -- 초등 고학년 문항 복제
  FOR v_item IN 
    SELECT ib.item_id, ib.item_code, ib.stimulus_id, ib.grade_band, ib.item_type, 
           ib.stem, ib.max_score, s.content_text as stimulus_text
    FROM public.item_bank ib
    LEFT JOIN public.stimuli s ON s.stimulus_id = ib.stimulus_id
    WHERE ib.grade_band = '초고' AND ib.is_active = true
    ORDER BY ib.item_code
    LIMIT 14  -- 초등 고학년 14문항
  LOOP
    -- authoring_items에 이미 있는지 확인
    SELECT draft_item_id INTO v_draft_item_id 
    FROM public.authoring_items 
    WHERE item_code = v_item.item_code;
    
    IF v_draft_item_id IS NULL THEN
      INSERT INTO public.authoring_items (
        project_id,
        item_code,
        primary_stimulus_id,
        item_type,
        stem,
        max_score,
        status,
        grade_band
      ) VALUES (
        v_project_id,
        v_item.item_code,
        v_item.stimulus_id,
        v_item.item_type,
        v_item.stem,
        v_item.max_score,
        'approved',
        v_item.grade_band
      );
    END IF;
  END LOOP;

  -- 중등 저학년 문항 복제
  FOR v_item IN 
    SELECT ib.item_id, ib.item_code, ib.stimulus_id, ib.grade_band, ib.item_type, 
           ib.stem, ib.max_score, s.content_text as stimulus_text
    FROM public.item_bank ib
    LEFT JOIN public.stimuli s ON s.stimulus_id = ib.stimulus_id
    WHERE ib.grade_band = '중저' AND ib.is_active = true
    ORDER BY ib.item_code
    LIMIT 14
  LOOP
    SELECT draft_item_id INTO v_draft_item_id 
    FROM public.authoring_items 
    WHERE item_code = v_item.item_code;
    
    IF v_draft_item_id IS NULL THEN
      INSERT INTO public.authoring_items (
        project_id,
        item_code,
        primary_stimulus_id,
        item_type,
        stem,
        max_score,
        status,
        grade_band
      ) VALUES (
        v_project_id,
        v_item.item_code,
        v_item.stimulus_id,
        v_item.item_type,
        v_item.stem,
        v_item.max_score,
        'approved',
        v_item.grade_band
      );
    END IF;
  END LOOP;

  -- 중등 고학년 문항 복제
  FOR v_item IN 
    SELECT ib.item_id, ib.item_code, ib.stimulus_id, ib.grade_band, ib.item_type, 
           ib.stem, ib.max_score, s.content_text as stimulus_text
    FROM public.item_bank ib
    LEFT JOIN public.stimuli s ON s.stimulus_id = ib.stimulus_id
    WHERE ib.grade_band = '중고' AND ib.is_active = true
    ORDER BY ib.item_code
    LIMIT 15
  LOOP
    SELECT draft_item_id INTO v_draft_item_id 
    FROM public.authoring_items 
    WHERE item_code = v_item.item_code;
    
    IF v_draft_item_id IS NULL THEN
      INSERT INTO public.authoring_items (
        project_id,
        item_code,
        primary_stimulus_id,
        item_type,
        stem,
        max_score,
        status,
        grade_band
      ) VALUES (
        v_project_id,
        v_item.item_code,
        v_item.stimulus_id,
        v_item.item_type,
        v_item.stem,
        v_item.max_score,
        'approved',
        v_item.grade_band
      );
    END IF;
  END LOOP;

  RAISE NOTICE 'authoring_items에 문항 복제 완료';
END $OUTER$;

-- =========================================================
-- 3. 진단 평가에 문항 연결 (assessment_items)
-- =========================================================

-- 3.1 초등 고학년 진단 평가 문항 연결
DO $$
DECLARE
  v_assessment_id INTEGER;
  v_draft_item RECORD;
  v_seq INTEGER := 1;
BEGIN
  -- 평가 ID 가져오기
  SELECT assessment_id INTO v_assessment_id 
  FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 고학년 문해력 진단 평가';
  
  IF v_assessment_id IS NOT NULL THEN
    -- 기존 연결 삭제
    DELETE FROM public.assessment_items WHERE assessment_id = v_assessment_id;
    
    -- 문항 연결
    FOR v_draft_item IN 
      SELECT ai.draft_item_id, ai.item_code, ai.max_score
      FROM public.authoring_items ai
      WHERE ai.item_code LIKE 'ELEMHIGH_%'
      ORDER BY ai.item_code
      LIMIT 14
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '초등 고학년 진단 평가에 % 개 문항 연결됨', v_seq - 1;
  END IF;
END $$;

-- 3.2 중등 저학년 진단 평가 문항 연결
DO $$
DECLARE
  v_assessment_id INTEGER;
  v_draft_item RECORD;
  v_seq INTEGER := 1;
BEGIN
  SELECT assessment_id INTO v_assessment_id 
  FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 저학년 문해력 진단 평가';
  
  IF v_assessment_id IS NOT NULL THEN
    DELETE FROM public.assessment_items WHERE assessment_id = v_assessment_id;
    
    FOR v_draft_item IN 
      SELECT ai.draft_item_id, ai.item_code, ai.max_score
      FROM public.authoring_items ai
      WHERE ai.item_code LIKE 'MIDLOW_%'
      ORDER BY ai.item_code
      LIMIT 14
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '중등 저학년 진단 평가에 % 개 문항 연결됨', v_seq - 1;
  END IF;
END $$;

-- 3.3 중등 고학년 진단 평가 문항 연결
DO $$
DECLARE
  v_assessment_id INTEGER;
  v_draft_item RECORD;
  v_seq INTEGER := 1;
BEGIN
  SELECT assessment_id INTO v_assessment_id 
  FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 고학년 문해력 진단 평가';
  
  IF v_assessment_id IS NOT NULL THEN
    DELETE FROM public.assessment_items WHERE assessment_id = v_assessment_id;
    
    FOR v_draft_item IN 
      SELECT ai.draft_item_id, ai.item_code, ai.max_score
      FROM public.authoring_items ai
      WHERE ai.item_code LIKE 'MIDHIGH_%'
      ORDER BY ai.item_code
      LIMIT 15
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '중등 고학년 진단 평가에 % 개 문항 연결됨', v_seq - 1;
  END IF;
END $$;

-- =========================================================
-- 4. 진단 평가 확인용 뷰 생성
-- =========================================================

DROP VIEW IF EXISTS public.v_diagnostic_assessment_items CASCADE;

CREATE OR REPLACE VIEW public.v_diagnostic_assessment_items AS
SELECT
  da.assessment_id,
  da.title AS assessment_title,
  da.grade_band,
  da.assessment_type,
  da.time_limit_minutes,
  da.status AS assessment_status,
  
  ai.sequence_number,
  ai.points,
  
  ait.draft_item_id,
  ait.item_code,
  ait.item_type,
  ait.stem AS question_text,
  ait.max_score,
  
  s.title AS stimulus_title,
  s.content_text AS stimulus_content,
  
  -- 문항 유형 레이블
  CASE ait.item_type
    WHEN 'mcq_single' THEN '객관식 (단일)'
    WHEN 'mcq_multi' THEN '객관식 (복수)'
    WHEN 'short_text' THEN '단답형'
    WHEN 'essay' THEN '서술형'
    ELSE ait.item_type
  END AS item_type_label,
  
  -- 학년군 레이블
  CASE da.grade_band
    WHEN '초저' THEN '초등 저학년'
    WHEN '초고' THEN '초등 고학년'
    WHEN '중저' THEN '중등 저학년'
    WHEN '중고' THEN '중등 고학년'
    ELSE da.grade_band
  END AS grade_band_label

FROM public.diagnostic_assessments da
JOIN public.assessment_items ai ON ai.assessment_id = da.assessment_id
JOIN public.authoring_items ait ON ait.draft_item_id = ai.draft_item_id
LEFT JOIN public.stimuli s ON s.stimulus_id = ait.primary_stimulus_id
ORDER BY da.grade_band, ai.sequence_number;

COMMENT ON VIEW public.v_diagnostic_assessment_items IS '진단 평가와 연결된 문항 상세 뷰';

-- =========================================================
-- 5. 진단 평가 통계 뷰
-- =========================================================

DROP VIEW IF EXISTS public.v_diagnostic_assessment_stats CASCADE;

CREATE OR REPLACE VIEW public.v_diagnostic_assessment_stats AS
SELECT
  da.assessment_id,
  da.title,
  da.grade_band,
  CASE da.grade_band
    WHEN '초저' THEN '초등 저학년'
    WHEN '초고' THEN '초등 고학년'
    WHEN '중저' THEN '중등 저학년'
    WHEN '중고' THEN '중등 고학년'
    ELSE da.grade_band
  END AS grade_band_label,
  da.status,
  da.time_limit_minutes,
  da.created_at,
  
  -- 문항 통계
  COUNT(ai.assessment_item_id) AS total_items,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'mcq_single') AS mcq_single_count,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'mcq_multi') AS mcq_multi_count,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'essay') AS essay_count,
  SUM(ai.points) AS total_points,
  
  -- 응시 통계
  (SELECT COUNT(*) FROM public.assessment_attempts aa WHERE aa.assessment_id = da.assessment_id) AS attempt_count,
  (SELECT COUNT(*) FROM public.assessment_attempts aa WHERE aa.assessment_id = da.assessment_id AND aa.status = 'graded') AS graded_count

FROM public.diagnostic_assessments da
LEFT JOIN public.assessment_items ai ON ai.assessment_id = da.assessment_id
LEFT JOIN public.authoring_items ait ON ait.draft_item_id = ai.draft_item_id
GROUP BY da.assessment_id, da.title, da.grade_band, da.status, da.time_limit_minutes, da.created_at
ORDER BY 
  CASE da.grade_band
    WHEN '초저' THEN 1
    WHEN '초고' THEN 2
    WHEN '중저' THEN 3
    WHEN '중고' THEN 4
    ELSE 5
  END;

COMMENT ON VIEW public.v_diagnostic_assessment_stats IS '진단 평가 통계 뷰';

-- =========================================================
-- 6. 권한 부여
-- =========================================================

GRANT SELECT ON public.v_diagnostic_assessment_items TO anon, authenticated;
GRANT SELECT ON public.v_diagnostic_assessment_stats TO anon, authenticated;

-- =========================================================
-- 완료 메시지
-- =========================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '진단 평가 시드 데이터 적재 완료';
  RAISE NOTICE '========================================';
  RAISE NOTICE '생성된 진단 평가:';
  RAISE NOTICE '  - 2025학년도 초등 저학년 문해력 진단 평가';
  RAISE NOTICE '  - 2025학년도 초등 고학년 문해력 진단 평가';
  RAISE NOTICE '  - 2025학년도 중등 저학년 문해력 진단 평가';
  RAISE NOTICE '  - 2025학년도 중등 고학년 문해력 진단 평가';
  RAISE NOTICE '';
  RAISE NOTICE '생성된 뷰:';
  RAISE NOTICE '  - v_diagnostic_assessment_items (문항 상세)';
  RAISE NOTICE '  - v_diagnostic_assessment_stats (통계)';
  RAISE NOTICE '========================================';
END $$;
