-- =========================================================
-- 리딩 PRO 평가 영역 확장 시드 데이터
-- 초등 고학년 정답지에서 추출한 영역 체계 반영
-- =========================================================

-- 기존 domains 테이블에 추가 영역 삽입 (없는 경우에만)

-- =====================================================
-- 1. 이해력 소분류 확장
-- =====================================================
INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'literacy_factual', '사실적 이해', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_comprehension'),
       '글에 명시적으로 드러난 정보를 파악하는 능력', 11
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'literacy_factual');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'literacy_inferential', '추론적 이해', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_comprehension'),
       '글에 직접 드러나지 않은 의미를 추론하는 능력', 12
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'literacy_inferential');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'literacy_critical', '비판적 이해', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_comprehension'),
       '글의 내용이나 형식을 비판적으로 평가하는 능력', 13
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'literacy_critical');

-- =====================================================
-- 2. 심미적 감수성 소분류
-- =====================================================
INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'disposition_emotional', '정서적 공감', 'disposition_factor',
       NULL,
       '등장인물의 감정을 이해하고 공감하는 능력', 21
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'disposition_emotional');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'disposition_literary_expression', '문학적 표현', 'disposition_factor',
       NULL,
       '문학 작품의 표현 기법을 감상하는 능력', 22
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'disposition_literary_expression');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'disposition_literary_value', '문학적 가치', 'disposition_factor',
       NULL,
       '문학 작품의 가치를 인식하는 능력', 23
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'disposition_literary_value');

-- =====================================================
-- 3. 의사소통능력 소분류
-- =====================================================
INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'communication_expression', '표현과 전달', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_communication'),
       '자신의 생각을 효과적으로 표현하고 전달하는 능력', 31
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'communication_expression');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'communication_social', '사회적 상호작용', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_communication'),
       '타인과 효과적으로 소통하는 능력', 32
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'communication_social');

INSERT INTO public.domains (code, name, domain_type, parent_domain_id, description, display_order)
SELECT 'communication_creative', '창의적 문제해결', 'literacy_sub',
       (SELECT domain_id FROM public.domains WHERE code = 'literacy_communication'),
       '창의적 사고를 통해 문제를 해결하는 능력', 33
WHERE NOT EXISTS (SELECT 1 FROM public.domains WHERE code = 'communication_creative');

-- =====================================================
-- 4. 영역별 문항 수 요약 (초등 고학년 기준)
-- 이해력: 사실적이해 4문항, 비판적이해 3문항, 추론적이해 4문항
-- 심미적감수성: 문학적표현 2문항, 정서적공감 3문항, 문학적가치 미정
-- 의사소통능력: 표현과전달 2문항, 사회적상호작용 2문항, 창의적문제해결 3문항
-- =====================================================
