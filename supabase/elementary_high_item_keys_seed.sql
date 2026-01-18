-- =========================================================
-- 리딩 PRO 문해력 진단 평가 [초등 고학년] 정답 키 및 영역 매핑 스크립트
-- 대상 테이블: item_keys, item_option_scoring, item_domain_map
-- 출처: 25-문해력진단-최종-초고-교사용 정답및루브릭 (1020).pdf
-- =========================================================

-- =====================================================
-- 1. 정답 키 삽입 (item_keys)
-- =====================================================
INSERT INTO public.item_keys (item_id, key_type, answer_value, score_value)
SELECT
  ib.item_id,
  'exact',
  v.answer_value,
  ib.max_score
FROM (VALUES
  -- 문항 1: 심미적 감수성 - 정서적 공감 (중) 정답: 5
  ('ELEMHIGH_Q01', '⑤'),
  -- 문항 2: 이해력 - 사실적 이해 (상) 정답: 2
  ('ELEMHIGH_Q02', '②'),
  -- 문항 3: 심미적 감수성 - 정서적 공감 (중) 정답: 3
  ('ELEMHIGH_Q03', '③'),
  -- 문항 4: 심미적 감수성 - 정서적 공감 (중) 정답: 3,5 (복수정답)
  ('ELEMHIGH_Q04', '③'),  -- 주정답
  -- 문항 5: 이해력 - 사실적 이해 (중) 정답: 1,5 (복수정답)
  ('ELEMHIGH_Q05', '①'),  -- 주정답
  -- 문항 6: 이해력 - 사실적 이해 (중) 정답: 3
  ('ELEMHIGH_Q06', '③'),
  -- 문항 7: 이해력 - 추론적 이해 (상) 정답: 2
  ('ELEMHIGH_Q07', '②'),
  -- 문항 8: 이해력 - 사실적 이해 (중) 정답: 2
  ('ELEMHIGH_Q08', '②'),
  -- 문항 9: 이해력 - 추론적 이해 (중) 정답: 1
  ('ELEMHIGH_Q09', '①'),
  -- 문항 10: 이해력 - 추론적 이해 (중) 정답: 3
  ('ELEMHIGH_Q10', '③'),
  -- 문항 11: 이해력 - 비판적 이해 (상) 정답: 3
  ('ELEMHIGH_Q11', '③'),
  -- 문항 12: 이해력 - 추론적 이해 (상) 정답: 3
  ('ELEMHIGH_Q12', '③'),
  -- 문항 13: 이해력 - 비판적 이해 (중) 정답: 1
  ('ELEMHIGH_Q13', '①'),
  -- 문항 14: 이해력 - 비판적 이해 (중) 정답: 2,5 (복수정답)
  ('ELEMHIGH_Q14', '②')   -- 주정답
) AS v(item_code, answer_value)
JOIN public.item_bank ib ON ib.item_code = v.item_code
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_keys ik WHERE ik.item_id = ib.item_id
);

-- =====================================================
-- 2. 보기별 근접 점수 (item_option_scoring)
-- 각 보기가 정답에 얼마나 가까운지 점수 (100=정답, 낮을수록 오답)
-- =====================================================
-- 문항 1: 정답 5번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q01', '①', 10, '시 속에 집이 덥다는 단서가 없음'),
  ('ELEMHIGH_Q01', '②', 50, '따가운 햇살이란 시어가 있으나 지은이는 햇살 때문에 머리가 뜨거운 것이 아님'),
  ('ELEMHIGH_Q01', '③', 70, '동생이 얼굴을 찌푸린 것으로 보아 갈등이 있으나 그것 때문에 머리가 뜨거운 것은 아님'),
  ('ELEMHIGH_Q01', '④', 80, '외식하고 싶은 메뉴가 많아서 갈등이 생겼다고 명시되어 있지 않으며 가족 구성원간의 의견 충돌이 있었음'),
  ('ELEMHIGH_Q01', '⑤', 100, '정확히 일치하는 정답')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 2: 정답 2번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q02', '①', 50, '발표를 치르다: 어떤 일을 겪어 내다'),
  ('ELEMHIGH_Q02', '②', 100, '물건값을 지불하다 또는 돈을 내다의 의미로 사용함'),
  ('ELEMHIGH_Q02', '③', 50, '프로젝트를 치르다: 어떤 일을 해내다'),
  ('ELEMHIGH_Q02', '④', 50, '경사를 치르다: 큰일을 겪어 내다'),
  ('ELEMHIGH_Q02', '⑤', 50, '수술을 치르다: 어려운 일을 겪다')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 3: 정답 3번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q03', '①', 20, '메뉴 선정으로 형과 의견 충돌로 만족스럽지 않은 상황이므로 성품을 배워야지라고 생각하기는 어려움'),
  ('ELEMHIGH_Q03', '②', 50, '메뉴 전쟁을 벌인 것으로 보아 나가지 않으려고 한 것으로 생각하기는 어려움'),
  ('ELEMHIGH_Q03', '③', 100, '가족끼리 메뉴로 갈등하다가 오늘도 형이 먹고 싶은 갈비를 먹게 되므로 동생은 속상함'),
  ('ELEMHIGH_Q03', '④', 70, '갈비를 먹기로 한 것은 맞으나 그건 동생이 먹고 싶어한 것은 아님'),
  ('ELEMHIGH_Q03', '⑤', 60, '엄마, 아빠가 먹고 싶은 게 아니라 형이 먹고 싶은 곳으로 가고 있는 것으로 유추 가능')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 4: 정답 3,5번 (복수정답)
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q04', '①', 80, '자기만 먹고 싶은 것으로만 결정되어 곤란함이 있을 수 있으나 미안함이 더 적확한 표현임'),
  ('ELEMHIGH_Q04', '②', 80, '외식하러 가는 것에 흥분되긴 하나 그 마음보다 미안함이 큼'),
  ('ELEMHIGH_Q04', '③', 100, '동생이 얼굴을 찌푸린 것, 또 네가 이긴 것 등으로 미루어 늘 자기 고집대로 한 것에 대한 미안함'),
  ('ELEMHIGH_Q04', '④', 50, '형이 좋아하는 메뉴가 선정되어 설레고 기쁜 외식가는 길이므로 안타까움은 어울리지 않음'),
  ('ELEMHIGH_Q04', '⑤', 100, '형이 좋아하는 메뉴가 선정되어 승리에 대한 만족스러워함')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 5: 정답 1,5번 (복수정답)
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q05', '①', 100, '글의 내용과 일치함(인공지능의 개념과 역사가 글에 시작되고 있음)'),
  ('ELEMHIGH_Q05', '②', 90, '윤리적문제를 제기한 것이지 해결방법은 글에 나타나 있지 않음'),
  ('ELEMHIGH_Q05', '③', 80, '인간의 두뇌와 같다는 것에 오답을 할 수 있지만, 같은 것이 아니고 인간의 두뇌를 닮아가는 인공신경망 기술임'),
  ('ELEMHIGH_Q05', '④', 20, '은닉층이 많을수록 복잡한 문제를 해결할 수 있음'),
  ('ELEMHIGH_Q05', '⑤', 100, '비지도 학습을 바르게 설명하고 있음')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 6: 정답 3번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q06', '①', 50, '1956년, 다트머스 회의에서 인공지능이라는 용어가 처음 사용되었습니다라고 나와 있어 옳은 설명'),
  ('ELEMHIGH_Q06', '②', 50, '이 은닉층이 많을수록 복잡한 문제를 해결할 수 있어라고 나와 있어 옳은 설명'),
  ('ELEMHIGH_Q06', '③', 100, '비지도 학습은 정답 없이 데이터만으로 스스로 규칙을 찾게 하는 방식이며 보기 설명은 지도학습 설명임'),
  ('ELEMHIGH_Q06', '④', 50, '딥러닝은 여러 층의 신경망을 사용하여 복잡한 문제를 해결하는 기술이라고 나와 있어 옳은 설명'),
  ('ELEMHIGH_Q06', '⑤', 50, '강화 학습은 올바른 행동에 보상을 주고 잘못된 행동에 벌을 주며 학습하는 방식입니다라고 나와 있어 옳은 설명')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 7: 정답 2번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q07', '①', 50, '지도학습은 정답을 미리 알려주며 학습하는 방식이므로 상황과 맞지 않음'),
  ('ELEMHIGH_Q07', '②', 100, '운동장에서 찍은 사진과 교실에서 찍은 사진이라는 정답을 미리 알려주지 않았음에도 로봇이 스스로 사진들을 분류했습니다. 이는 비지도 학습의 특징과 일치'),
  ('ELEMHIGH_Q07', '③', 50, '올바른 행동에 보상을, 잘못된 행동에 벌을 주며 학습하는 방식이므로, 이 상황과 맞지 않습니다'),
  ('ELEMHIGH_Q07', '④', 30, '튜링 테스트는 AI의 지능을 평가하는 방법이므로 학습 방식 개념과 맞지 않음'),
  ('ELEMHIGH_Q07', '⑤', 30, '딥러닝은 인공신경망을 이용한 기술의 한 종류입니다. 둘 다 AI의 학습 방식을 설명하는 개념이 아니므로 오답')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 8: 정답 2번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q08', '①', 30, '글에 잘 나타나 있어서 쉽게 찾을 수 있음'),
  ('ELEMHIGH_Q08', '②', 100, '불평등한 공동체가 형성된 것은 신석기 초기 이후 시간이 지나면서 생긴 것임'),
  ('ELEMHIGH_Q08', '③', 50, '글에 잘 나타나 있어서 쉽게 찾을 수 있음'),
  ('ELEMHIGH_Q08', '④', 50, '글에 잘 나타나 있어서 쉽게 찾을 수 있음'),
  ('ELEMHIGH_Q08', '⑤', 50, '글에 잘 나타나 있어서 쉽게 찾을 수 있음')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 9: 정답 1번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q09', '①', 100, '정착생활을 통한 농업의 시작이 가장 역사적 배경으로 볼 수 있음'),
  ('ELEMHIGH_Q09', '②', 50, '정착과 수렵생활도 지속되었다는 것을 알 수 있음'),
  ('ELEMHIGH_Q09', '③', 80, '가족단위로 농사를 짓게 된 것은 사실이나 불평등 사회로의 근본적인 원인이라고 할 수 없음'),
  ('ELEMHIGH_Q09', '④', 50, '잉여 농산물이 생긴 것은 사실이나, 마을 전체의 공동 소유는 아님'),
  ('ELEMHIGH_Q09', '⑤', 50, '가족노동력으로 남아도는 식량은 사실이나 마을 단위 소유는 아님')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 10: 정답 3번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q10', '①', 20, '모두 재산이 많아지면서 인심이 변하고, 타인의 어려움을 외면하는 빈부 격차와 인심의 변화를 비유적으로 표현하는 속담'),
  ('ELEMHIGH_Q10', '②', 20, '모두 재산이 많아지면서 인심이 변하고, 타인의 어려움을 외면하는 빈부 격차와 인심의 변화를 비유적으로 표현하는 속담'),
  ('ELEMHIGH_Q10', '③', 100, '모두가 공평하게 나누는 공동체 생활을 의미. 이는 빈부 격차가 생기기 이전인 초기 신석기 시대의 평등한 사회를 나타내는 속담임'),
  ('ELEMHIGH_Q10', '④', 20, '모두 재산이 많아지면서 인심이 변하고, 타인의 어려움을 외면하는 빈부 격차와 인심의 변화를 비유적으로 표현하는 속담'),
  ('ELEMHIGH_Q10', '⑤', 20, '모두 재산이 많아지면서 인심이 변하고, 타인의 어려움을 외면하는 빈부 격차와 인심의 변화를 비유적으로 표현하는 속담')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 11: 정답 3번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q11', '①', 80, '정착 생활은 신석기 시대 사회 변화의 계기일 뿐, 전체 변화 과정을 요약했다고 보기는 어렵습니다'),
  ('ELEMHIGH_Q11', '②', 90, '농사 시작은 신석기 시대 사회 변화의 계기일 뿐, 전체 변화 과정을 요약했다고 보기는 어렵습니다'),
  ('ELEMHIGH_Q11', '③', 100, '신석기 시대 사회 변화의 원인(농업 기술 발전), 과정(잉여 생산물과 개인 소유 개념 발생), 그리고 결과(빈부 격차)를 모두 포괄적으로 설명하고 있음'),
  ('ELEMHIGH_Q11', '④', 50, '초기 신석기 시대의 모습만을 설명하고 있습니다'),
  ('ELEMHIGH_Q11', '⑤', 70, '빈부 격차로 인해 계급 사회가 시작되는 결과만을 설명하고 있어, 변화의 전체 과정을 담고 있지 않습니다')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 12: 정답 3번 (4번도 100점)
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q12', '①', 70, '아기 손이 후손에게 대물림된다는 것을 그림으로서 직관적으로 이해할 수 있음'),
  ('ELEMHIGH_Q12', '②', 50, '일회용품이 후손에게 영향을 미친다는 것은 문구 자체로 이해 가능함'),
  ('ELEMHIGH_Q12', '③', 80, '썩지 않는 쓰레기를 오랜기간 지구에 두어야 하므로 그 자체가 원치 않는 대물림이 된다는 의미로 매력적인 오답'),
  ('ELEMHIGH_Q12', '④', 100, '일회용품을 사용하는 습관이 아니라 일회용품 자체가 대물림된다는 의미임'),
  ('ELEMHIGH_Q12', '⑤', 50, '일회용품을 줄여서 아름다운 금수강산을 후손에게 물려주어야 한다는 것을 직접적으로 제시하고 있음')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 13: 정답 1번
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q13', '①', 100, '책 속에서 삶의 지혜를 얻을 수 있음을 의미하는 광고임'),
  ('ELEMHIGH_Q13', '②', 50, '일회용품을 줄이고 다회용품을 사용하자는 광고임'),
  ('ELEMHIGH_Q13', '③', 50, '쓰레기는 죽지않고 무한함을 의미하는 광고로 쓰레기 사용을 줄이자는 광고임'),
  ('ELEMHIGH_Q13', '④', 50, '택배상자와 비닐 테이프 사용을 자제하자는 광고임'),
  ('ELEMHIGH_Q13', '⑤', 50, '비닐 쓰레기가 아무렇게 버려져 있어 지구 생태계를 파괴하므로 비닐 쓰레기 사용을 줄이자는 광고임')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- 문항 14: 정답 2,5번 (복수정답)
INSERT INTO public.item_option_scoring (item_id, option_id, score_ratio, feedback)
SELECT ib.item_id, io.option_id, v.score_ratio, v.feedback
FROM (VALUES
  ('ELEMHIGH_Q14', '①', 30, '일회용품을 줄이자는 광고와 같은 주장임'),
  ('ELEMHIGH_Q14', '②', 100, '일회용품 줄이는 것이 사회 분위기상 어렵다는 반대 의견으로 정답과 일치'),
  ('ELEMHIGH_Q14', '③', 50, '일회용품을 줄이기 위해 인식 개선의 필요성을 주장하므로 같은 의견임'),
  ('ELEMHIGH_Q14', '④', 50, '플라스틱 포장 용기를 줄이기 위한 국가적 정책이 필요함을 말하고 있으므로 같은 주장임'),
  ('ELEMHIGH_Q14', '⑤', 100, '일회용품 줄이기는 기업의 실천이 어렵다는 반대 의견으로 정답과 일치')
) AS v(item_code, label, score_ratio, feedback)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.item_options io ON io.item_id = ib.item_id AND io.label = v.label
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_option_scoring ios WHERE ios.item_id = ib.item_id AND ios.option_id = io.option_id
);

-- =====================================================
-- 3. 영역 매핑 (item_domain_map)
-- 대분류/소분류 연결
-- =====================================================
INSERT INTO public.item_domain_map (item_id, domain_id, is_primary)
SELECT ib.item_id, d.domain_id, true
FROM (VALUES
  -- 심미적 감수성 - 정서적 공감
  ('ELEMHIGH_Q01', 'disposition_emotional'),
  ('ELEMHIGH_Q03', 'disposition_emotional'),
  ('ELEMHIGH_Q04', 'disposition_emotional'),
  -- 이해력 - 사실적 이해
  ('ELEMHIGH_Q02', 'literacy_factual'),
  ('ELEMHIGH_Q05', 'literacy_factual'),
  ('ELEMHIGH_Q06', 'literacy_factual'),
  ('ELEMHIGH_Q08', 'literacy_factual'),
  -- 이해력 - 추론적 이해
  ('ELEMHIGH_Q07', 'literacy_inferential'),
  ('ELEMHIGH_Q09', 'literacy_inferential'),
  ('ELEMHIGH_Q10', 'literacy_inferential'),
  ('ELEMHIGH_Q12', 'literacy_inferential'),
  -- 이해력 - 비판적 이해
  ('ELEMHIGH_Q11', 'literacy_critical'),
  ('ELEMHIGH_Q13', 'literacy_critical'),
  ('ELEMHIGH_Q14', 'literacy_critical')
) AS v(item_code, domain_code)
JOIN public.item_bank ib ON ib.item_code = v.item_code
JOIN public.domains d ON d.code = v.domain_code
WHERE NOT EXISTS (
  SELECT 1 FROM public.item_domain_map idm WHERE idm.item_id = ib.item_id AND idm.domain_id = d.domain_id
);

-- =====================================================
-- 4. 문항별 난이도 업데이트
-- =====================================================
UPDATE public.item_bank
SET difficulty_level = v.difficulty
FROM (VALUES
  ('ELEMHIGH_Q01', 2),  -- 중
  ('ELEMHIGH_Q02', 3),  -- 상
  ('ELEMHIGH_Q03', 2),  -- 중
  ('ELEMHIGH_Q04', 2),  -- 중
  ('ELEMHIGH_Q05', 2),  -- 중
  ('ELEMHIGH_Q06', 2),  -- 중
  ('ELEMHIGH_Q07', 3),  -- 상
  ('ELEMHIGH_Q08', 2),  -- 중
  ('ELEMHIGH_Q09', 2),  -- 중
  ('ELEMHIGH_Q10', 2),  -- 중
  ('ELEMHIGH_Q11', 3),  -- 상
  ('ELEMHIGH_Q12', 3),  -- 상
  ('ELEMHIGH_Q13', 2),  -- 중
  ('ELEMHIGH_Q14', 2)   -- 중
) AS v(item_code, difficulty)
WHERE item_bank.item_code = v.item_code;
