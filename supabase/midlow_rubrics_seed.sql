-- =========================================================
-- 리딩 PRO 문해력 진단 평가 [중등 저] 서술형 루브릭 적재 스크립트
-- 대상 테이블: rubrics, rubric_criteria, rubric_levels
-- =========================================================

DO $$
DECLARE
  v_rubric_id bigint;
  v_item_id bigint;
  v_criterion_id bigint;
BEGIN
  -- =====================================================
  -- MIDLOW_E01: 아프리카 마을에 제공하고 싶은 기술
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E01';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 1 채점 기준', '아프리카 마을 적정기술 제안', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 기술 제안의 구체성
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '기술 제안의 구체성', '제안한 기술이 구체적이고 실현 가능한가', 50, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '구체적인 기술명과 작동 원리를 명확히 설명함', 3),
    (v_criterion_id, 2, '보통', '기술은 제시했으나 구체성이 부족함', 2),
    (v_criterion_id, 1, '미흡', '기술 제안이 모호하거나 불명확함', 1),
    (v_criterion_id, 0, '부족', '기술을 제안하지 않음', 0);

    -- 기준 2: 문제 해결 연결성
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '문제 해결 연결성', '마을의 부족한 요소와 기술의 연결이 논리적인가', 50, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '부족한 요소를 명확히 파악하고 기술과의 연결을 논리적으로 설명함', 2),
    (v_criterion_id, 1, '보통', '부족한 요소는 언급했으나 연결이 불충분함', 1),
    (v_criterion_id, 0, '미흡', '부족한 요소를 언급하지 않았거나 연결이 없음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E02: R=VD 공식 활용하여 목표 설명
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E02';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 2 채점 기준', 'R=VD 공식 활용 목표 설명', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: R=VD 공식 이해
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, 'R=VD 공식 이해', '공식의 의미를 올바르게 이해하고 적용했는가', 40, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '꿈(D), 비전(V), 현실화(R)의 관계를 정확히 이해하고 적용함', 2),
    (v_criterion_id, 1, '보통', '공식은 언급했으나 적용이 불충분함', 1),
    (v_criterion_id, 0, '미흡', '공식을 이해하지 못함', 0);

    -- 기준 2: 목표의 구체성
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '목표의 구체성', '자신의 목표가 구체적으로 제시되었는가', 60, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '꿈과 비전이 구체적이며 실현 가능한 계획이 포함됨', 3),
    (v_criterion_id, 2, '보통', '목표는 있으나 구체적 계획이 부족함', 2),
    (v_criterion_id, 1, '미흡', '목표가 모호함', 1),
    (v_criterion_id, 0, '부족', '목표를 제시하지 않음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E03: 동물농장 - 우리 사회에 주는 교훈
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E03';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 3 채점 기준', '동물농장 사회적 교훈', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 이야기 내용 이해
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '이야기 내용 이해', '동물들의 경험을 정확히 파악했는가', 40, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '권력의 부패, 이상과 현실의 괴리 등 핵심 내용을 정확히 이해함', 2),
    (v_criterion_id, 1, '보통', '이야기 내용은 언급했으나 핵심 파악이 부족함', 1),
    (v_criterion_id, 0, '미흡', '이야기 내용을 잘못 이해함', 0);

    -- 기준 2: 현대 사회 적용
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '현대 사회 적용', '오늘날 사회에 적용 가능한 교훈을 도출했는가', 60, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '구체적인 현대 사회 사례와 연결하여 교훈을 제시함', 3),
    (v_criterion_id, 2, '보통', '교훈은 제시했으나 현대 사회 연결이 불충분함', 2),
    (v_criterion_id, 1, '미흡', '교훈이 피상적임', 1),
    (v_criterion_id, 0, '부족', '교훈을 제시하지 않음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E04: 미래사회 모습 요약 및 필요 역량
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E04';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 4 채점 기준', '미래사회 요약 및 역량', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 미래사회 요약
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '미래사회 요약', '글에서 예측하는 미래사회를 정확히 요약했는가', 40, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', 'AI와 협력, 창의적 직업의 중요성 등 핵심 내용을 정확히 요약함', 2),
    (v_criterion_id, 1, '보통', '일부 내용만 요약함', 1),
    (v_criterion_id, 0, '미흡', '요약이 부정확하거나 없음', 0);

    -- 기준 2: 필요 역량 제시
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '필요 역량 제시', '학생이 갖추어야 할 역량을 적절히 제시했는가', 60, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '창의력, 비판적 사고력, 협업능력 등 구체적 역량과 이유를 제시함', 3),
    (v_criterion_id, 2, '보통', '역량은 나열했으나 이유가 부족함', 2),
    (v_criterion_id, 1, '미흡', '역량 제시가 불충분함', 1),
    (v_criterion_id, 0, '부족', '역량을 제시하지 않음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E05: 일자리 잃은 사람에게 위로하는 글
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E05';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 5 채점 기준', '위로하는 글 작성', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 공감 표현
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '공감 표현', '상대방의 입장을 공감하는 표현이 있는가', 50, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '상대방의 감정을 이해하고 진심어린 공감을 표현함', 3),
    (v_criterion_id, 2, '보통', '공감 표현이 있으나 형식적임', 2),
    (v_criterion_id, 1, '미흡', '공감 표현이 부족함', 1),
    (v_criterion_id, 0, '부족', '공감이 없음', 0);

    -- 기준 2: 위로와 격려
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '위로와 격려', '적절한 위로와 격려가 포함되었는가', 50, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '미래에 대한 희망적 메시지와 구체적 격려가 포함됨', 2),
    (v_criterion_id, 1, '보통', '위로는 있으나 구체성이 부족함', 1),
    (v_criterion_id, 0, '미흡', '위로나 격려가 없음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E06: 신체 부위 주장 인용 및 반박
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E06';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 6 채점 기준', '인용 및 반박', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 인용의 정확성
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '인용의 정확성', '신체 부위 2개의 주장을 정확히 인용했는가', 40, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '2개의 신체 부위 주장을 정확히 인용함', 2),
    (v_criterion_id, 1, '보통', '1개만 정확히 인용하거나 인용이 부정확함', 1),
    (v_criterion_id, 0, '미흡', '인용이 없거나 완전히 틀림', 0);

    -- 기준 2: 반박의 논리성
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '반박의 논리성', '각 주장에 대한 반박이 논리적인가', 60, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '2개 모두 논리적이고 타당한 반박을 제시함', 3),
    (v_criterion_id, 2, '보통', '반박은 있으나 논리성이 부족함', 2),
    (v_criterion_id, 1, '미흡', '1개만 반박하거나 반박이 약함', 1),
    (v_criterion_id, 0, '부족', '반박이 없음', 0);
  END IF;

  -- =====================================================
  -- MIDLOW_E07: 효과적 설득 방법 서술
  -- =====================================================
  SELECT item_id INTO v_item_id FROM public.item_bank WHERE item_code = 'MIDLOW_E07';

  IF v_item_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM public.rubrics WHERE item_id = v_item_id) THEN
    INSERT INTO public.rubrics (item_id, name, description, total_points, rubric_type)
    VALUES (v_item_id, '서술형 7 채점 기준', '효과적 설득 방법', 5, 'analytic')
    RETURNING rubric_id INTO v_rubric_id;

    -- 기준 1: 내용 인용
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '내용 인용', '글의 내용을 적절히 인용했는가', 40, 1)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 2, '우수', '혀의 행동이나 교훈을 적절히 인용함', 2),
    (v_criterion_id, 1, '보통', '인용은 있으나 연결이 약함', 1),
    (v_criterion_id, 0, '미흡', '인용이 없거나 부적절함', 0);

    -- 기준 2: 설득 방법 제시
    INSERT INTO public.rubric_criteria (rubric_id, name, description, weight, display_order)
    VALUES (v_rubric_id, '설득 방법 제시', '효과적인 설득 방법을 제시했는가', 60, 2)
    RETURNING criterion_id INTO v_criterion_id;

    INSERT INTO public.rubric_levels (criterion_id, level_value, label, description, points) VALUES
    (v_criterion_id, 3, '우수', '실천을 통한 증명, 행동으로 보여주기 등 구체적 방법 제시', 3),
    (v_criterion_id, 2, '보통', '설득 방법은 있으나 구체성이 부족함', 2),
    (v_criterion_id, 1, '미흡', '설득 방법이 피상적임', 1),
    (v_criterion_id, 0, '부족', '설득 방법을 제시하지 않음', 0);
  END IF;

END $$;
