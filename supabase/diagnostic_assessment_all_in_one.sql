-- =========================================================
-- 진단 평가 데이터 통합 적재 스크립트
-- 
-- 목적: 학년군별 진단 평가와 문항을 Supabase에 적재
-- 사용법: Supabase SQL Editor에서 이 파일 전체를 실행
-- 
-- 실행 순서:
--   1. elemlow_items_seed.sql   (초등 저학년 문항)
--   2. elemhigh_items_seed.sql  (초등 고학년 문항) - 이미 존재
--   3. midlow_items_seed_corrected.sql (중등 저학년 문항) - 이미 존재
--   4. midhigh_items_seed.sql   (중등 고학년 문항) - 이미 존재
--   5. diagnostic_assessment_seed.sql (진단 평가 및 연결)
-- 
-- 생성되는 진단 평가:
--   - 2025학년도 초등 저학년 문해력 진단 평가 (40분, 15문항)
--   - 2025학년도 초등 고학년 문해력 진단 평가 (50분, 14문항)
--   - 2025학년도 중등 저학년 문해력 진단 평가 (60분, 14문항)
--   - 2025학년도 중등 고학년 문해력 진단 평가 (70분, 15문항)
-- =========================================================

-- 시작 알림
DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '진단 평가 데이터 통합 적재 시작';
  RAISE NOTICE '========================================';
END $$;

-- =========================================================
-- STEP 1: 초등 저학년 문항 적재
-- =========================================================

DO $OUTER$
DECLARE
  v_sections jsonb := $JSON$[
    {
      "title": "ELEMLOW_STIM_S01",
      "stimulus": "안전하게 실험하기\n\n과학 시간에 실험을 하면 무척 재미있습니다. 안전하게 실험하는 방법을 알면 더 즐겁게 과학을 배울 수 있습니다.\n\n실험을 시작하기 전에 준비물을 확인합니다. 모두 있는지, 위험한 것은 없는지 살펴봅니다. 필요한 것만 꺼내 놓고 정리된 상태에서 실험을 하면 실수로 물건을 떨어뜨리거나 다치는 일을 줄일 수 있습니다.\n\n실험복, 고글, 장갑을 착용하면 좋습니다. 액체가 튀거나 뜨거운 물건을 만질 때 우리 몸을 보호해 줍니다. 가위나 칼처럼 날카로운 물건은 조심히 다루고, 사용법을 미리 배워야 합니다.\n\n실험이 끝나면 사용한 물건을 제자리에 두고, 손을 깨끗이 씻습니다. 안전한 실험이 즐거운 과학 시간을 만들어 줍니다.",
      "items": [
        {
          "item_code": "ELEMLOW_Q01",
          "item_type": "mcq_single",
          "stem": "실험을 시작하기 전에 해야 할 일로 가장 중요한 것은 무엇인가요?",
          "max_score": "1",
          "options": ["실험복을 예쁘게 입기", "실험을 재미있게 하기", "위험한 것이 없는지 살펴보기", "준비물을 많이 꺼내 놓기", "재미있는 실험을 생각하기"]
        },
        {
          "item_code": "ELEMLOW_Q02",
          "item_type": "mcq_single",
          "stem": "실험할 때 물건을 정리해야 하는 가장 중요한 이유는 무엇인가요?",
          "max_score": "1",
          "options": ["정리를 잘하면 상을 받아서", "깔끔하게 보여서", "빨리 정리할 수 있어서", "다치는 일을 줄일 수 있어서", "집중을 잘 할 수 있어서"]
        },
        {
          "item_code": "ELEMLOW_Q03",
          "item_type": "mcq_multi",
          "stem": "글의 내용으로 알 수 있는 것을 모두 고르세요. (2개)",
          "max_score": "2",
          "options": ["날카로운 물건의 사용법은 알 필요가 없다.", "실험 전에 모든 도구를 꺼내 놓아야 한다.", "고글은 패션을 위해 착용한다.", "실험이 끝나면 손을 씻어야 한다.", "안전하게 실험하면 과학이 더 재미있다."]
        },
        {
          "item_code": "ELEMLOW_E01",
          "item_type": "essay",
          "stem": "친구가 실험복을 입지 않으려고 합니다. 친구에게 실험복을 입어야 하는 이유를 설명하는 대화를 써 보세요.",
          "max_score": "5",
          "options": []
        }
      ]
    },
    {
      "title": "ELEMLOW_STIM_S02",
      "stimulus": "햇살이 된 흙덩이\n\n작은 흙덩이가 있었습니다.\n흙덩이는 늘 혼자였습니다.\n\n\"난 왜 이렇게 까맣고 더러울까?\"\n흙덩이는 슬펐습니다.\n\n어느 날, 따뜻한 햇살이 비쳤습니다.\n\"안녕! 넌 참 좋은 색이야.\"\n햇살이 말했습니다.\n\n흙덩이의 마음이 따뜻해졌습니다.\n\"정말? 나도 좋은 게 있니?\"\n\n\"그럼! 넌 씨앗이 자라는 집이잖아.\n넌 정말 소중해.\"\n\n흙덩이는 웃었습니다.\n작은 씨앗이 흙덩이 위에서 싹을 틔웠습니다.\n\n이제 흙덩이는 알았습니다.\n자신도 햇살처럼 따뜻한 마음을 가질 수 있다는 것을.",
      "items": [
        {
          "item_code": "ELEMLOW_Q04",
          "item_type": "mcq_single",
          "stem": "흙덩이가 처음에 슬펐던 이유는 무엇인가요?",
          "max_score": "1",
          "options": ["햇살이 비추지 않아서", "씨앗이 자라지 않아서", "친구가 없어서", "자신이 까맣고 더럽다고 생각해서", "비가 많이 와서"]
        },
        {
          "item_code": "ELEMLOW_Q05",
          "item_type": "mcq_single",
          "stem": "햇살이 흙덩이에게 해 준 말의 의미로 가장 알맞은 것은 무엇인가요?",
          "max_score": "1",
          "options": ["모든 것에는 소중한 가치가 있다.", "햇살은 모든 것을 밝게 한다.", "흙덩이는 검은색이 예쁘다.", "씨앗은 흙에서 자란다.", "혼자 있으면 슬프다."]
        },
        {
          "item_code": "ELEMLOW_Q06",
          "item_type": "mcq_single",
          "stem": "이 글에서 '햇살'은 어떤 역할을 하나요?",
          "max_score": "1",
          "options": ["흙덩이를 따뜻하게 해 주는 역할", "씨앗을 키우는 역할", "비를 막아주는 역할", "흙덩이를 예쁘게 만드는 역할", "흙덩이의 가치를 알려주는 역할"]
        },
        {
          "item_code": "ELEMLOW_Q07",
          "item_type": "mcq_single",
          "stem": "글의 마지막 부분에서 흙덩이가 알게 된 것은 무엇인가요?",
          "max_score": "1",
          "options": ["자신도 따뜻한 마음을 가질 수 있다.", "햇살이 매일 비춘다.", "씨앗은 흙에서만 자란다.", "검은색이 나쁜 색이 아니다.", "혼자 있어도 괜찮다."]
        },
        {
          "item_code": "ELEMLOW_E02",
          "item_type": "essay",
          "stem": "흙덩이가 슬퍼할 때 햇살이 해 준 일은 무엇인가요? 흙덩이의 마음이 어떻게 변했는지 함께 써 보세요.",
          "max_score": "5",
          "options": []
        }
      ]
    },
    {
      "title": "ELEMLOW_STIM_S03",
      "stimulus": "우리 동네 탐험\n\n오늘은 동네를 탐험하는 날입니다. 엄마, 아빠와 함께 걸으며 동네 구석구석을 살펴봅니다.\n\n먼저 놀이터에 갔습니다. 미끄럼틀과 그네가 있고, 친구들이 뛰어놉니다. 벤치에는 할머니, 할아버지가 앉아 계십니다.\n\n다음으로 가게에 들렀습니다. 과일 가게에는 빨간 사과와 노란 바나나가 있습니다. 빵집에서는 맛있는 냄새가 납니다.\n\n길을 걷다가 예쁜 꽃밭을 발견했습니다. 노란 꽃, 빨간 꽃, 하얀 꽃이 피어 있습니다. 나비 한 마리가 꽃 위를 날아다닙니다.\n\n우리 동네에는 재미있는 곳이 많습니다. 다음에는 또 어디를 탐험할까요?",
      "items": [
        {
          "item_code": "ELEMLOW_Q08",
          "item_type": "mcq_single",
          "stem": "글쓴이가 동네를 탐험할 때 함께 한 사람은 누구인가요?",
          "max_score": "1",
          "options": ["친구", "엄마, 아빠", "할머니, 할아버지", "선생님", "동생"]
        },
        {
          "item_code": "ELEMLOW_Q09",
          "item_type": "mcq_single",
          "stem": "글에서 나온 장소가 아닌 것은 무엇인가요?",
          "max_score": "1",
          "options": ["놀이터", "과일 가게", "빵집", "도서관", "꽃밭"]
        },
        {
          "item_code": "ELEMLOW_Q10",
          "item_type": "mcq_single",
          "stem": "글쓴이가 꽃밭에서 본 것은 무엇인가요?",
          "max_score": "1",
          "options": ["강아지", "나비", "새", "고양이", "개미"]
        },
        {
          "item_code": "ELEMLOW_Q11",
          "item_type": "mcq_single",
          "stem": "이 글의 분위기로 알맞은 것은 무엇인가요?",
          "max_score": "1",
          "options": ["무섭다", "슬프다", "즐겁고 따뜻하다", "화가 난다", "조용하다"]
        },
        {
          "item_code": "ELEMLOW_Q12",
          "item_type": "mcq_single",
          "stem": "글쓴이가 글의 마지막에 한 질문의 의도는 무엇인가요?",
          "max_score": "1",
          "options": ["동네가 싫다는 것", "탐험이 끝났다는 것", "동네에 갈 곳이 없다는 것", "집으로 가고 싶다는 것", "앞으로도 탐험을 계속하고 싶다는 것"]
        },
        {
          "item_code": "ELEMLOW_E03",
          "item_type": "essay",
          "stem": "여러분이 살고 있는 동네에 새로운 이름을 지어준다면 어떤 이름이 좋을까요? 이름을 짓고, 그 이유를 써 보세요.",
          "max_score": "5",
          "options": []
        }
      ]
    }
  ]$JSON$;
  v_section jsonb;
  v_item jsonb;
  v_stimulus_id bigint;
  v_item_id bigint;
  v_option text;
  v_option_label text;
  v_option_order int;
BEGIN
  RAISE NOTICE 'STEP 1: 초등 저학년 문항 적재 시작...';
  
  FOR v_section IN SELECT * FROM jsonb_array_elements(v_sections)
  LOOP
    INSERT INTO public.stimuli (title, content_type, content_text, grade_band, genre, word_count)
    SELECT
      v_section->>'title',
      'text',
      v_section->>'stimulus',
      '초저',
      'mixed',
      length(v_section->>'stimulus') / 3
    WHERE NOT EXISTS (
      SELECT 1 FROM public.stimuli WHERE title = v_section->>'title'
    );

    SELECT stimulus_id INTO v_stimulus_id FROM public.stimuli WHERE title = v_section->>'title';

    FOR v_item IN SELECT * FROM jsonb_array_elements(v_section->'items')
    LOOP
      INSERT INTO public.item_bank (
        item_code, stimulus_id, grade_band, item_type, stem, max_score, is_active
      )
      SELECT
        v_item->>'item_code',
        v_stimulus_id,
        '초저',
        v_item->>'item_type',
        v_item->>'stem',
        (v_item->>'max_score')::numeric,
        true
      WHERE NOT EXISTS (
        SELECT 1 FROM public.item_bank WHERE item_code = v_item->>'item_code'
      );

      SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = v_item->>'item_code';

      IF jsonb_array_length(v_item->'options') > 0 THEN
        v_option_order := 1;
        FOR v_option IN SELECT * FROM jsonb_array_elements_text(v_item->'options')
        LOOP
          v_option_label := CASE v_option_order
            WHEN 1 THEN '①'
            WHEN 2 THEN '②'
            WHEN 3 THEN '③'
            WHEN 4 THEN '④'
            WHEN 5 THEN '⑤'
          END;

          INSERT INTO public.item_options (item_id, label, option_text, display_order)
          SELECT v_item_id, v_option_label, v_option, v_option_order
          WHERE NOT EXISTS (
            SELECT 1 FROM public.item_options
            WHERE item_id = v_item_id AND label = v_option_label
          );

          v_option_order := v_option_order + 1;
        END LOOP;
      END IF;
    END LOOP;
  END LOOP;

  RAISE NOTICE 'STEP 1 완료: 초등 저학년 문항 적재 완료';
END $OUTER$;

-- =========================================================
-- STEP 2: 진단 평가 생성 (4개 학년군)
-- =========================================================

DO $$
BEGIN
  RAISE NOTICE 'STEP 2: 진단 평가 생성 시작...';
END $$;

-- 초등 저학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, description, grade_band, assessment_type, time_limit_minutes, created_by_user_id, status
)
SELECT 
  '2025학년도 초등 저학년 문해력 진단 평가',
  '초등학교 1~2학년 학생을 대상으로 한 문해력 진단 평가입니다. 읽기 이해력, 어휘력, 추론 능력을 종합적으로 평가합니다.',
  '초저', 'diagnostic', 40, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 저학년 문해력 진단 평가'
);

-- 초등 고학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, description, grade_band, assessment_type, time_limit_minutes, created_by_user_id, status
)
SELECT 
  '2025학년도 초등 고학년 문해력 진단 평가',
  '초등학교 5~6학년 학생을 대상으로 한 문해력 진단 평가입니다. 사실적 이해, 추론적 이해, 비판적 이해, 창의적 적용 능력을 평가합니다.',
  '초고', 'diagnostic', 50, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 고학년 문해력 진단 평가'
);

-- 중등 저학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, description, grade_band, assessment_type, time_limit_minutes, created_by_user_id, status
)
SELECT 
  '2025학년도 중등 저학년 문해력 진단 평가',
  '중학교 1~2학년 학생을 대상으로 한 문해력 진단 평가입니다. 비문학(설명문, 논설문)과 문학(소설, 시) 텍스트에 대한 이해력을 종합적으로 평가합니다.',
  '중저', 'diagnostic', 60, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 저학년 문해력 진단 평가'
);

-- 중등 고학년 진단 평가
INSERT INTO public.diagnostic_assessments (
  title, description, grade_band, assessment_type, time_limit_minutes, created_by_user_id, status
)
SELECT 
  '2025학년도 중등 고학년 문해력 진단 평가',
  '중학교 3학년 및 고등학교 1학년 학생을 대상으로 한 문해력 진단 평가입니다. 고급 텍스트 분석 능력, 비판적 사고력, 논증 능력을 평가합니다.',
  '중고', 'diagnostic', 70, 1, 'published'
WHERE NOT EXISTS (
  SELECT 1 FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 중등 고학년 문해력 진단 평가'
);

DO $$
BEGIN
  RAISE NOTICE 'STEP 2 완료: 4개 학년군 진단 평가 생성 완료';
END $$;

-- =========================================================
-- STEP 3: authoring_items에 문항 복제
-- =========================================================

DO $OUTER$
DECLARE
  v_item RECORD;
  v_draft_item_id INTEGER;
  v_project_id INTEGER := 1;
  v_count INTEGER := 0;
BEGIN
  RAISE NOTICE 'STEP 3: authoring_items에 문항 복제 시작...';
  
  -- 모든 학년군 문항 복제
  FOR v_item IN 
    SELECT ib.item_id, ib.item_code, ib.stimulus_id, ib.grade_band, ib.item_type, 
           ib.stem, ib.max_score
    FROM public.item_bank ib
    WHERE ib.is_active = true
      AND ib.item_code ~ '^(ELEMLOW|ELEMHIGH|MIDLOW|MIDHIGH)_'
    ORDER BY ib.grade_band, ib.item_code
  LOOP
    SELECT draft_item_id INTO v_draft_item_id 
    FROM public.authoring_items 
    WHERE item_code = v_item.item_code;
    
    IF v_draft_item_id IS NULL THEN
      INSERT INTO public.authoring_items (
        project_id, item_code, primary_stimulus_id, item_type, stem, max_score, status, grade_band
      ) VALUES (
        v_project_id, v_item.item_code, v_item.stimulus_id, v_item.item_type,
        v_item.stem, v_item.max_score, 'approved', v_item.grade_band
      );
      v_count := v_count + 1;
    END IF;
  END LOOP;

  RAISE NOTICE 'STEP 3 완료: % 개 문항 복제됨', v_count;
END $OUTER$;

-- =========================================================
-- STEP 4: 진단 평가에 문항 연결
-- =========================================================

-- 초등 저학년
DO $$
DECLARE
  v_assessment_id INTEGER;
  v_draft_item RECORD;
  v_seq INTEGER := 1;
BEGIN
  SELECT assessment_id INTO v_assessment_id 
  FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 저학년 문해력 진단 평가';
  
  IF v_assessment_id IS NOT NULL THEN
    DELETE FROM public.assessment_items WHERE assessment_id = v_assessment_id;
    
    FOR v_draft_item IN 
      SELECT ai.draft_item_id, ai.item_code, ai.max_score
      FROM public.authoring_items ai
      WHERE ai.item_code LIKE 'ELEMLOW_%'
      ORDER BY ai.item_code
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '초등 저학년 진단 평가: % 개 문항 연결', v_seq - 1;
  END IF;
END $$;

-- 초등 고학년
DO $$
DECLARE
  v_assessment_id INTEGER;
  v_draft_item RECORD;
  v_seq INTEGER := 1;
BEGIN
  SELECT assessment_id INTO v_assessment_id 
  FROM public.diagnostic_assessments 
  WHERE title = '2025학년도 초등 고학년 문해력 진단 평가';
  
  IF v_assessment_id IS NOT NULL THEN
    DELETE FROM public.assessment_items WHERE assessment_id = v_assessment_id;
    
    FOR v_draft_item IN 
      SELECT ai.draft_item_id, ai.item_code, ai.max_score
      FROM public.authoring_items ai
      WHERE ai.item_code LIKE 'ELEMHIGH_%'
      ORDER BY ai.item_code
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '초등 고학년 진단 평가: % 개 문항 연결', v_seq - 1;
  END IF;
END $$;

-- 중등 저학년
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
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '중등 저학년 진단 평가: % 개 문항 연결', v_seq - 1;
  END IF;
END $$;

-- 중등 고학년
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
    LOOP
      INSERT INTO public.assessment_items (assessment_id, draft_item_id, sequence_number, points)
      VALUES (v_assessment_id, v_draft_item.draft_item_id, v_seq, v_draft_item.max_score);
      v_seq := v_seq + 1;
    END LOOP;
    
    RAISE NOTICE '중등 고학년 진단 평가: % 개 문항 연결', v_seq - 1;
  END IF;
END $$;

-- =========================================================
-- STEP 5: 뷰 생성
-- =========================================================

-- 진단 평가 문항 상세 뷰
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
  
  CASE ait.item_type
    WHEN 'mcq_single' THEN '객관식 (단일)'
    WHEN 'mcq_multi' THEN '객관식 (복수)'
    WHEN 'short_text' THEN '단답형'
    WHEN 'essay' THEN '서술형'
    ELSE ait.item_type
  END AS item_type_label,
  
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

-- 진단 평가 통계 뷰
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
  
  COUNT(ai.assessment_item_id) AS total_items,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'mcq_single') AS mcq_single_count,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'mcq_multi') AS mcq_multi_count,
  COUNT(ai.assessment_item_id) FILTER (WHERE ait.item_type = 'essay') AS essay_count,
  COALESCE(SUM(ai.points), 0) AS total_points

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

-- 권한 부여
GRANT SELECT ON public.v_diagnostic_assessment_items TO anon, authenticated;
GRANT SELECT ON public.v_diagnostic_assessment_stats TO anon, authenticated;

-- =========================================================
-- 완료 메시지
-- =========================================================

DO $$
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE '진단 평가 데이터 적재 완료!';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '생성된 진단 평가:';
  RAISE NOTICE '  ✓ 2025학년도 초등 저학년 문해력 진단 평가 (40분)';
  RAISE NOTICE '  ✓ 2025학년도 초등 고학년 문해력 진단 평가 (50분)';
  RAISE NOTICE '  ✓ 2025학년도 중등 저학년 문해력 진단 평가 (60분)';
  RAISE NOTICE '  ✓ 2025학년도 중등 고학년 문해력 진단 평가 (70분)';
  RAISE NOTICE '';
  RAISE NOTICE '생성된 뷰:';
  RAISE NOTICE '  ✓ v_diagnostic_assessment_items (문항 상세)';
  RAISE NOTICE '  ✓ v_diagnostic_assessment_stats (통계)';
  RAISE NOTICE '';
  RAISE NOTICE '확인 쿼리:';
  RAISE NOTICE '  SELECT * FROM v_diagnostic_assessment_stats;';
  RAISE NOTICE '========================================';
END $$;
