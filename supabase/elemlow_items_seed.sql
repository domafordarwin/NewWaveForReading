-- =========================================================
-- 리딩 PRO 문해력 진단 평가 [초등 저학년] 문항지 적재 스크립트
-- 대상 테이블: stimuli, item_bank, item_options
-- 참고: 25-문해력진단-최종-초저-문항개발.pdf
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
  -- 각 지문 섹션 처리
  FOR v_section IN SELECT * FROM jsonb_array_elements(v_sections)
  LOOP
    -- 지문 삽입 (이미 존재하지 않는 경우에만)
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

    -- 지문 ID 가져오기
    SELECT stimulus_id INTO v_stimulus_id FROM public.stimuli WHERE title = v_section->>'title';

    -- 각 문항 처리
    FOR v_item IN SELECT * FROM jsonb_array_elements(v_section->'items')
    LOOP
      -- 문항 삽입
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

      -- 문항 ID 가져오기
      SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = v_item->>'item_code';

      -- 선택지가 있는 경우 (객관식)
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

  RAISE NOTICE '초등 저학년 문항 데이터 적재 완료';
END $OUTER$;
