-- =========================================================
-- 기출 문항 DB 뷰 (Past Exam Items View)
-- 문항, 지문, 채점기준, 루브릭을 통합하여 조회하기 위한 뷰
-- 목적: 기출문항을 웹페이지에서 쉽게 조회하고 채점/평가에 활용
-- =========================================================

-- =========================================================
-- 1. 기출문항 종합 뷰 (메인 조회용)
-- =========================================================
DROP VIEW IF EXISTS public.v_past_exam_items CASCADE;

CREATE OR REPLACE VIEW public.v_past_exam_items AS
SELECT
  ib.item_id,
  ib.item_code,
  ib.grade_band,
  ib.item_type,
  ib.stem AS question_text,
  ib.max_score,
  ib.difficulty_level,
  ib.is_active,
  ib.created_at,
  ib.updated_at,
  
  -- 지문(자극) 정보
  s.stimulus_id,
  s.title AS stimulus_title,
  s.content_text AS stimulus_content,
  s.content_type AS stimulus_content_type,
  s.assets_json AS stimulus_assets,
  s.source_meta_json AS stimulus_source,
  s.genre AS stimulus_genre,
  s.word_count AS stimulus_word_count,
  
  -- 학년군 레이블
  CASE ib.grade_band
    WHEN '초저' THEN '초등 저학년'
    WHEN '초고' THEN '초등 고학년'
    WHEN '중저' THEN '중등 저학년'
    WHEN '중고' THEN '중등 고학년'
    ELSE ib.grade_band
  END AS grade_band_label,
  
  -- 문항 유형 레이블
  CASE ib.item_type
    WHEN 'mcq_single' THEN '객관식 (단일)'
    WHEN 'mcq_multi' THEN '객관식 (복수)'
    WHEN 'short_text' THEN '단답형'
    WHEN 'essay' THEN '서술형'
    WHEN 'fill_blank' THEN '빈칸 채우기'
    WHEN 'composite' THEN '복합문항'
    WHEN 'survey' THEN '설문'
    ELSE ib.item_type
  END AS item_type_label,
  
  -- 난이도 레이블
  CASE ib.difficulty_level
    WHEN 1 THEN '하'
    WHEN 2 THEN '중하'
    WHEN 3 THEN '중'
    WHEN 4 THEN '중상'
    WHEN 5 THEN '상'
    ELSE '미지정'
  END AS difficulty_label
  
FROM public.item_bank ib
LEFT JOIN public.stimuli s ON s.stimulus_id = ib.stimulus_id
WHERE ib.is_active = true
ORDER BY ib.grade_band, ib.item_code;

COMMENT ON VIEW public.v_past_exam_items IS '기출문항 종합 뷰 - 문항과 지문 정보를 통합하여 조회';

-- =========================================================
-- 2. 객관식 보기 뷰 (옵션 + 채점정보 통합)
-- =========================================================
DROP VIEW IF EXISTS public.v_item_options_with_scoring CASCADE;

CREATE OR REPLACE VIEW public.v_item_options_with_scoring AS
SELECT
  io.option_id,
  io.item_id,
  io.label,
  io.option_text,
  io.display_order,
  COALESCE(ios.is_correct, false) AS is_correct,
  COALESCE(ios.partial_score, 0) AS partial_score,
  ios.rationale_text AS feedback,
  ios.misconception_tag
FROM public.item_options io
LEFT JOIN public.item_option_scoring ios ON ios.option_id = io.option_id
ORDER BY io.item_id, io.display_order;

COMMENT ON VIEW public.v_item_options_with_scoring IS '객관식 보기와 채점 정보 통합 뷰';

-- =========================================================
-- 3. 루브릭 상세 뷰 (서술형 채점기준)
-- =========================================================
DROP VIEW IF EXISTS public.v_rubric_details CASCADE;

CREATE OR REPLACE VIEW public.v_rubric_details AS
SELECT
  r.rubric_id,
  r.item_id,
  r.part_id,
  r.rubric_type,
  r.target_type,
  r.rubric_json,
  r.version,
  r.created_at,
  
  -- 문항 정보 조인
  ib.item_code,
  ib.grade_band,
  ib.item_type,
  ib.stem AS question_text,
  ib.max_score,
  
  -- 루브릭 유형 레이블
  CASE r.rubric_type
    WHEN 'level_descriptors' THEN '수준 기술형'
    WHEN 'analytic' THEN '분석적 채점'
    WHEN 'checklist_rules' THEN '체크리스트'
    WHEN 'exemplar_only' THEN '예시답안형'
    WHEN 'mixed' THEN '혼합형'
    ELSE r.rubric_type
  END AS rubric_type_label
  
FROM public.rubrics r
LEFT JOIN public.item_bank ib ON ib.item_id = r.item_id
ORDER BY ib.grade_band, ib.item_code;

COMMENT ON VIEW public.v_rubric_details IS '루브릭 상세 뷰 - 서술형 문항의 채점 기준 조회';

-- =========================================================
-- 4. 루브릭 기준/수준 통합 뷰
-- =========================================================
DROP VIEW IF EXISTS public.v_rubric_criteria_levels CASCADE;

CREATE OR REPLACE VIEW public.v_rubric_criteria_levels AS
SELECT
  rc.criterion_id,
  rc.rubric_id,
  rc.name AS criterion_name,
  rc.weight AS criterion_weight,
  rc.max_points AS criterion_max_points,
  rc.display_order AS criterion_order,
  
  rl.level_id,
  rl.level_value,
  rl.descriptor AS level_descriptor,
  rl.points AS level_points,
  
  -- 루브릭 기본 정보
  r.rubric_type,
  r.item_id,
  
  -- 문항 정보
  ib.item_code,
  ib.grade_band
  
FROM public.rubric_criteria rc
LEFT JOIN public.rubric_levels rl ON rl.criterion_id = rc.criterion_id
LEFT JOIN public.rubrics r ON r.rubric_id = rc.rubric_id
LEFT JOIN public.item_bank ib ON ib.item_id = r.item_id
ORDER BY rc.rubric_id, rc.display_order, rl.level_value DESC;

COMMENT ON VIEW public.v_rubric_criteria_levels IS '루브릭 채점 기준과 수준 통합 뷰';

-- =========================================================
-- 5. 정답 키 뷰 (객관식/단답형 정답)
-- =========================================================
DROP VIEW IF EXISTS public.v_item_answer_keys CASCADE;

CREATE OR REPLACE VIEW public.v_item_answer_keys AS
SELECT
  ik.key_id,
  ik.target_type,
  ik.target_item_id AS item_id,
  ik.target_part_id AS part_id,
  ik.answer_type,
  ik.correct_option_ids,
  ik.correct_text,
  ik.scoring_rules_json,
  ik.created_at,
  
  -- 문항 정보
  ib.item_code,
  ib.grade_band,
  ib.item_type,
  ib.stem AS question_text,
  ib.max_score,
  
  -- 정답 유형 레이블
  CASE ik.answer_type
    WHEN 'single_option' THEN '단일 선택'
    WHEN 'multi_option' THEN '복수 선택'
    WHEN 'text_exact' THEN '정확한 텍스트'
    WHEN 'regex' THEN '정규식 매칭'
    WHEN 'keyword_set' THEN '키워드 세트'
    WHEN 'rubric_only' THEN '루브릭 채점'
    WHEN 'manual_only' THEN '수동 채점'
    ELSE ik.answer_type
  END AS answer_type_label
  
FROM public.item_keys ik
LEFT JOIN public.item_bank ib ON ib.item_id = ik.target_item_id
ORDER BY ib.grade_band, ib.item_code;

COMMENT ON VIEW public.v_item_answer_keys IS '정답 키 뷰 - 객관식/단답형 문항의 정답 정보';

-- =========================================================
-- 6. 영역 매핑 뷰 (문항별 평가 영역)
-- =========================================================
DROP VIEW IF EXISTS public.v_item_domains CASCADE;

CREATE OR REPLACE VIEW public.v_item_domains AS
SELECT
  idm.item_id,
  idm.domain_id,
  idm.weight,
  idm.primary_flag,
  
  d.code AS domain_code,
  d.name AS domain_name,
  d.domain_type,
  d.description AS domain_description,
  
  -- 상위 영역 정보
  pd.code AS parent_domain_code,
  pd.name AS parent_domain_name,
  
  -- 문항 정보
  ib.item_code,
  ib.grade_band,
  ib.item_type
  
FROM public.item_domain_map idm
LEFT JOIN public.domains d ON d.domain_id = idm.domain_id
LEFT JOIN public.domains pd ON pd.domain_id = d.parent_domain_id
LEFT JOIN public.item_bank ib ON ib.item_id = idm.item_id
ORDER BY ib.item_code, idm.primary_flag DESC, idm.weight DESC;

COMMENT ON VIEW public.v_item_domains IS '문항별 평가 영역 매핑 뷰';

-- =========================================================
-- 7. 기출문항 전체 통계 뷰
-- =========================================================
DROP VIEW IF EXISTS public.v_past_exam_statistics CASCADE;

CREATE OR REPLACE VIEW public.v_past_exam_statistics AS
SELECT
  grade_band,
  CASE grade_band
    WHEN '초저' THEN '초등 저학년'
    WHEN '초고' THEN '초등 고학년'
    WHEN '중저' THEN '중등 저학년'
    WHEN '중고' THEN '중등 고학년'
    ELSE grade_band
  END AS grade_band_label,
  COUNT(*) AS total_items,
  COUNT(*) FILTER (WHERE item_type = 'mcq_single') AS mcq_single_count,
  COUNT(*) FILTER (WHERE item_type = 'mcq_multi') AS mcq_multi_count,
  COUNT(*) FILTER (WHERE item_type = 'essay') AS essay_count,
  COUNT(*) FILTER (WHERE item_type = 'short_text') AS short_text_count,
  ROUND(AVG(max_score), 2) AS avg_max_score,
  ROUND(AVG(difficulty_level), 2) AS avg_difficulty
FROM public.item_bank
WHERE is_active = true
GROUP BY grade_band
ORDER BY 
  CASE grade_band
    WHEN '초저' THEN 1
    WHEN '초고' THEN 2
    WHEN '중저' THEN 3
    WHEN '중고' THEN 4
    ELSE 5
  END;

COMMENT ON VIEW public.v_past_exam_statistics IS '기출문항 학년군별 통계 뷰';

-- =========================================================
-- 8. 권한 부여
-- =========================================================
GRANT SELECT ON public.v_past_exam_items TO anon, authenticated;
GRANT SELECT ON public.v_item_options_with_scoring TO anon, authenticated;
GRANT SELECT ON public.v_rubric_details TO anon, authenticated;
GRANT SELECT ON public.v_rubric_criteria_levels TO anon, authenticated;
GRANT SELECT ON public.v_item_answer_keys TO anon, authenticated;
GRANT SELECT ON public.v_item_domains TO anon, authenticated;
GRANT SELECT ON public.v_past_exam_statistics TO anon, authenticated;

-- =========================================================
-- 완료 메시지
-- =========================================================
DO $$
BEGIN
  RAISE NOTICE '기출문항 DB 뷰가 성공적으로 생성되었습니다.';
  RAISE NOTICE '생성된 뷰: v_past_exam_items, v_item_options_with_scoring, v_rubric_details, v_rubric_criteria_levels, v_item_answer_keys, v_item_domains, v_past_exam_statistics';
END $$;
