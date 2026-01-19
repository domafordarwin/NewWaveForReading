-- =====================================================
-- Reading PRO 진단 평가 시드 데이터
-- assessment_schema.sql 테이블용 테스트 데이터
-- =====================================================
-- 실행 전 필수: schema.sql, seed.sql, item_bank_schema.sql 실행 완료
-- 
-- 사용자 ID 참조:
-- 1: 김민준 (학생)
-- 2: 이서연 (학생)
-- 3: 박지훈 (학생)
-- 4: 김민준 학부모 (학부모)
-- 5: 이서연 학부모 (학부모)
-- 6: 박교장 (학교관리자)
-- 7: 김선생 (진단담당교사)
-- 8: 최문항 (문항개발교사)
-- 9: 시스템관리자
-- =====================================================

-- 기존 데이터 삭제 (CASCADE로 연결 테이블 자동 삭제)
TRUNCATE TABLE public.assessment_sessions RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.student_parent_relations RESTART IDENTITY CASCADE;
TRUNCATE TABLE public.classes RESTART IDENTITY CASCADE;

-- =====================================================
-- 1) 테스트용 지문 데이터 (stimuli 테이블 데이터가 없을 경우)
-- =====================================================
INSERT INTO public.stimuli (title, content_type, content_text, grade_band, genre, word_count, created_by)
SELECT * FROM (VALUES
  ('환경 보호의 중요성', 'text', 
   '오늘날 환경 오염은 전 세계적인 문제가 되었습니다. 대기 오염, 수질 오염, 토양 오염 등 다양한 형태의 오염이 우리의 삶을 위협하고 있습니다. 

환경 오염의 주요 원인은 산업화와 도시화입니다. 공장에서 배출되는 폐수와 매연, 자동차의 배기가스, 무분별한 쓰레기 투기 등이 환경을 오염시키고 있습니다. 이러한 오염은 생태계를 파괴하고 인간의 건강에도 심각한 영향을 미칩니다.

환경을 보호하기 위해서는 개인과 사회 모두의 노력이 필요합니다. 일회용품 사용을 줄이고, 분리수거를 철저히 하며, 대중교통을 이용하는 것이 좋습니다. 또한 정부와 기업도 환경 친화적인 정책과 기술 개발에 힘써야 합니다.

우리 모두가 환경 보호에 동참한다면, 깨끗한 지구를 후손에게 물려줄 수 있을 것입니다.', 
   '중저', '비문학', 350, 8),
   
  ('우정의 의미', 'text',
   '민수는 새 학기 첫날 전학을 왔습니다. 낯선 교실에서 민수는 긴장한 채 자리에 앉았습니다. 쉬는 시간이 되었지만 아무도 민수에게 말을 걸지 않았습니다.

그때 옆자리의 지호가 다가왔습니다. "안녕, 나는 지호야. 같이 놀래?" 민수의 얼굴에 웃음이 번졌습니다. 지호는 민수에게 학교를 구석구석 안내해 주었고, 친구들도 소개해 주었습니다.

시간이 흐르면서 민수와 지호는 가장 친한 친구가 되었습니다. 함께 숙제도 하고, 운동도 하고, 고민도 나누었습니다. 민수가 힘들 때 지호는 항상 곁에 있어 주었습니다.

민수는 깨달았습니다. 진정한 친구란 함께 웃고 울 수 있는 사람이라는 것을. 우정은 서로를 이해하고 배려하는 마음에서 시작된다는 것을.',
   '초고', '문학', 280, 8),
   
  ('과학 기술의 발전', 'text',
   '21세기는 과학 기술이 급속히 발전하는 시대입니다. 스마트폰, 인공지능, 로봇 등 새로운 기술이 우리 생활을 크게 변화시키고 있습니다.

인공지능(AI)은 특히 주목받는 기술입니다. AI는 대량의 데이터를 분석하고 패턴을 찾아내어 인간보다 빠르고 정확한 판단을 내릴 수 있습니다. 의료, 교육, 금융 등 다양한 분야에서 AI가 활용되고 있습니다.

그러나 과학 기술의 발전에는 그림자도 있습니다. 일자리 감소, 개인정보 침해, 환경 파괴 등의 문제가 발생할 수 있습니다. 또한 기술의 혜택이 모든 사람에게 고르게 돌아가지 않는 불평등 문제도 있습니다.

따라서 우리는 과학 기술을 올바르게 사용하는 방법을 고민해야 합니다. 기술 발전의 혜택은 극대화하고 부작용은 최소화하는 지혜가 필요합니다.',
   '중고', '비문학', 380, 8)
) AS t(title, content_type, content_text, grade_band, genre, word_count, created_by)
WHERE NOT EXISTS (SELECT 1 FROM public.stimuli LIMIT 1);

-- =====================================================
-- 2) 학급 데이터 (classes)
-- =====================================================
INSERT INTO public.classes (school_id, class_name, grade, academic_year, teacher_id, is_active)
VALUES
  (1, '2학년 1반', 2, 2026, 7, true),
  (1, '2학년 2반', 2, 2026, 7, true),
  (1, '3학년 1반', 3, 2026, 7, true);

-- =====================================================
-- 3) 학급-학생 관계 (class_students)
-- =====================================================
INSERT INTO public.class_students (class_id, student_id)
VALUES
  (1, 1),  -- 김민준 -> 2학년 1반
  (1, 2),  -- 이서연 -> 2학년 1반
  (3, 3);  -- 박지훈 -> 3학년 1반

-- =====================================================
-- 4) 학생-학부모 관계 (student_parent_relations)
-- =====================================================
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
VALUES
  (1, 4, 'parent', true),   -- 김민준 - 김민준 학부모
  (2, 5, 'parent', true);   -- 이서연 - 이서연 학부모

-- =====================================================
-- 5) 진단 세션 데이터 (assessment_sessions)
-- =====================================================
-- 다양한 상태의 세션 생성
INSERT INTO public.assessment_sessions (
  student_id, assigned_by, grade_band, stimulus_id, status, 
  time_limit_minutes, started_at, submitted_at, created_at
)
VALUES
  -- 김민준 (학생1): 완료된 세션 2개, 진행 중 1개
  (1, 7, '중저', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '환경 보호의 중요성' LIMIT 1), 
   'completed', 60, 
   now() - interval '7 days', 
   now() - interval '7 days' + interval '45 minutes',
   now() - interval '7 days'),
   
  (1, 7, '중저', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '과학 기술의 발전' LIMIT 1), 
   'teacher_reviewed', 60, 
   now() - interval '3 days', 
   now() - interval '3 days' + interval '50 minutes',
   now() - interval '3 days'),
   
  (1, 7, '중저', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '우정의 의미' LIMIT 1), 
   'in_progress', 60, 
   now() - interval '30 minutes', 
   NULL,
   now() - interval '1 hour'),

  -- 이서연 (학생2): 완료된 세션 1개, AI 평가 완료 1개
  (2, 7, '초고', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '우정의 의미' LIMIT 1), 
   'completed', 60, 
   now() - interval '5 days', 
   now() - interval '5 days' + interval '40 minutes',
   now() - interval '5 days'),
   
  (2, 7, '초고', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '환경 보호의 중요성' LIMIT 1), 
   'ai_evaluated', 60, 
   now() - interval '1 day', 
   now() - interval '1 day' + interval '55 minutes',
   now() - interval '1 day'),

  -- 박지훈 (학생3): 배정됨 1개, 제출됨 1개
  (3, 7, '중고', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '과학 기술의 발전' LIMIT 1), 
   'assigned', 60, 
   NULL, 
   NULL,
   now() - interval '2 days'),
   
  (3, 7, '중고', 
   (SELECT stimulus_id FROM public.stimuli WHERE title = '환경 보호의 중요성' LIMIT 1), 
   'submitted', 60, 
   now() - interval '4 hours', 
   now() - interval '3 hours',
   now() - interval '5 hours');

-- =====================================================
-- 6) 학생 답안 데이터 (student_answers)
-- =====================================================
INSERT INTO public.student_answers (session_id, answer_content, word_count, char_count, submitted_at)
VALUES
  -- 김민준 세션1 (completed)
  (1, 
   '환경 보호는 우리 모두에게 중요한 문제입니다. 이 글에서 말하듯이 환경 오염은 산업화와 도시화 때문에 발생합니다.

저도 환경 보호를 위해 노력하고 있습니다. 일회용품 대신 텀블러를 사용하고, 분리수거를 꼼꼼히 합니다. 그리고 학교에 갈 때는 버스를 이용합니다.

글쓴이의 의견에 동의합니다. 개인의 작은 실천이 모여서 큰 변화를 만들 수 있다고 생각합니다. 정부와 기업도 환경을 위한 정책을 만들어야 합니다.

우리가 지금 노력하면 미래 세대에게 깨끗한 지구를 물려줄 수 있을 것입니다.',
   180, 420, now() - interval '7 days' + interval '45 minutes'),

  -- 김민준 세션2 (teacher_reviewed)
  (2,
   '과학 기술의 발전은 우리 생활을 편리하게 만들었습니다. 스마트폰으로 언제 어디서나 정보를 찾을 수 있고, 인공지능이 많은 일을 도와줍니다.

하지만 글에서 말한 것처럼 부작용도 있습니다. 로봇이 사람의 일자리를 빼앗을 수 있고, 개인정보가 유출될 위험도 있습니다.

저는 과학 기술을 현명하게 사용해야 한다고 생각합니다. 기술의 좋은 점은 활용하되, 나쁜 점은 조심해야 합니다. 예를 들어 스마트폰을 너무 오래 사용하지 않고, 인터넷에 개인정보를 함부로 올리지 않아야 합니다.

결론적으로, 과학 기술과 함께 살아가는 지혜를 기르는 것이 중요합니다.',
   200, 480, now() - interval '3 days' + interval '50 minutes'),

  -- 이서연 세션1 (completed)
  (4,
   '이 이야기에서 지호는 정말 좋은 친구입니다. 민수가 전학 와서 외로웠을 때 먼저 다가가서 말을 걸어주었습니다.

저도 비슷한 경험이 있습니다. 작년에 새 반이 되었을 때 긴장했는데, 옆자리 친구가 먼저 말을 걸어줘서 학교생활이 즐거워졌습니다.

진정한 친구란 함께 기쁠 때도, 슬플 때도 곁에 있어주는 사람인 것 같습니다. 서로 도와주고 이해해주는 것이 우정이라고 생각합니다.

앞으로 저도 지호처럼 다른 친구들에게 먼저 다가가고 싶습니다.',
   150, 350, now() - interval '5 days' + interval '40 minutes'),

  -- 이서연 세션2 (ai_evaluated)
  (5,
   '환경을 보호하는 것은 매우 중요합니다. 글에서 환경 오염의 원인과 해결 방법을 잘 설명해 주었습니다.

저희 가족도 환경 보호를 실천하고 있습니다. 마트에 갈 때 장바구니를 가져가고, 음식을 남기지 않으려고 노력합니다.

글쓴이 말처럼 정부와 기업도 노력해야 합니다. 회사들이 친환경 제품을 많이 만들고, 정부가 환경 보호 법을 만들면 좋겠습니다.

환경 문제는 혼자 해결할 수 없습니다. 모두가 함께 노력해야 깨끗한 지구를 만들 수 있습니다.',
   140, 330, now() - interval '1 day' + interval '55 minutes'),

  -- 박지훈 세션2 (submitted)
  (7,
   '환경오염은 심각한 문제다. 공장에서 나오는 연기와 자동차 매연이 공기를 오염시킨다.

환경을 보호하려면 쓰레기를 잘 버리고 분리수거를 해야한다. 일회용품도 줄여야 한다.

나도 환경보호에 동참하겠다.',
   60, 140, now() - interval '3 hours');

-- =====================================================
-- 7) AI 평가 결과 데이터 (ai_evaluations)
-- =====================================================
INSERT INTO public.ai_evaluations (
  session_id, answer_id, 
  comprehension_score, inference_score, critical_score, expression_score, total_score,
  grade_level, percentile,
  rubric_scores, strengths, weaknesses,
  student_feedback, line_edits,
  spelling_errors, grammar_errors, model_used
)
VALUES
  -- 김민준 세션1 (completed) - A등급
  (1, 1, 
   22, 20, 21, 22, 85, 
   'A', 85,
   '[
     {"criterion": "주제 이해", "level": "상", "score": 22, "maxScore": 25, "evidence": "지문의 핵심 내용을 정확히 파악함", "nextAction": "더 깊은 분석 시도"},
     {"criterion": "근거 활용", "level": "상", "score": 20, "maxScore": 25, "evidence": "개인 경험을 적절히 연결함", "nextAction": "다양한 사례 추가"},
     {"criterion": "논리적 전개", "level": "상", "score": 21, "maxScore": 25, "evidence": "서론-본론-결론 구조가 명확함", "nextAction": "연결어 다양화"},
     {"criterion": "표현력", "level": "상", "score": 22, "maxScore": 25, "evidence": "문장이 명확하고 어휘 선택이 적절함", "nextAction": "고급 어휘 활용"}
   ]'::jsonb,
   '["지문 내용을 정확히 이해함", "자신의 경험과 잘 연결함", "글의 구조가 잘 짜여있음"]'::jsonb,
   '["더 다양한 사례 제시 필요", "결론 부분 보강 필요"]'::jsonb,
   '{
     "intro": "서론에서 주제를 명확하게 제시했어요. 환경 보호의 중요성을 잘 인식하고 있네요.",
     "body": "본론에서 자신의 실천 사례를 구체적으로 설명한 점이 좋았어요. 텀블러 사용, 분리수거, 대중교통 이용 등 실제로 할 수 있는 일들을 잘 제시했어요.",
     "conclusion": "결론에서 미래 세대를 언급한 점이 인상적이에요. 환경 보호의 의미를 잘 전달했어요.",
     "overall": "민준이의 글은 전체적으로 잘 짜여있어요. 지문의 내용을 정확히 이해하고, 자신의 생각과 경험을 잘 연결했어요. 다음에는 좀 더 다양한 사례나 통계를 활용하면 더 설득력 있는 글이 될 거예요. 잘 했어요!"
   }'::jsonb,
   '[]'::jsonb,
   0, 0, 'gpt-4o-mini'),

  -- 김민준 세션2 (teacher_reviewed) - B등급
  (2, 2, 
   20, 18, 19, 18, 75, 
   'B', 72,
   '[
     {"criterion": "주제 이해", "level": "상", "score": 20, "maxScore": 25, "evidence": "과학 기술의 장단점을 파악함", "nextAction": "비판적 시각 강화"},
     {"criterion": "근거 활용", "level": "중", "score": 18, "maxScore": 25, "evidence": "글의 내용을 인용함", "nextAction": "구체적 사례 추가"},
     {"criterion": "논리적 전개", "level": "중", "score": 19, "maxScore": 25, "evidence": "논리적 흐름이 있음", "nextAction": "단락 연결 강화"},
     {"criterion": "표현력", "level": "중", "score": 18, "maxScore": 25, "evidence": "적절한 어휘 사용", "nextAction": "문장 다양화"}
   ]'::jsonb,
   '["장단점을 균형있게 설명함", "자신의 의견을 명확히 제시함"]'::jsonb,
   '["구체적인 사례 부족", "결론이 다소 약함"]'::jsonb,
   '{
     "intro": "서론에서 과학 기술의 편리함을 잘 언급했어요.",
     "body": "본론에서 장점과 단점을 모두 다룬 점이 좋아요. 스마트폰 사용 시간 조절 같은 구체적인 제안도 있네요.",
     "conclusion": "결론에서 ''지혜''라는 단어를 사용한 점이 인상적이에요. 하지만 조금 더 구체적으로 마무리하면 좋겠어요.",
     "overall": "민준이는 과학 기술의 양면성을 잘 이해하고 있어요. 다음에는 실제 뉴스나 통계를 인용하면 더 설득력 있는 글이 될 거예요. 계속 노력하면 더 좋은 글을 쓸 수 있을 거예요!"
   }'::jsonb,
   '[
     {"original": "기술의 좋은 점은 활용하되, 나쁜 점은 조심해야 합니다.", "suggested": "기술의 장점은 적극 활용하되, 단점은 주의해야 합니다.", "reason": "더 명확한 표현으로 수정", "category": "expression"}
   ]'::jsonb,
   0, 1, 'gpt-4o-mini'),

  -- 이서연 세션1 (completed) - A등급
  (4, 3, 
   23, 21, 20, 22, 86, 
   'A', 88,
   '[
     {"criterion": "주제 이해", "level": "상", "score": 23, "maxScore": 25, "evidence": "우정의 의미를 정확히 파악함", "nextAction": "더 깊은 분석"},
     {"criterion": "근거 활용", "level": "상", "score": 21, "maxScore": 25, "evidence": "자신의 경험을 효과적으로 활용함", "nextAction": "다양한 관점 추가"},
     {"criterion": "논리적 전개", "level": "상", "score": 20, "maxScore": 25, "evidence": "글의 흐름이 자연스러움", "nextAction": "단락 구성 강화"},
     {"criterion": "표현력", "level": "상", "score": 22, "maxScore": 25, "evidence": "감정 표현이 풍부함", "nextAction": "비유적 표현 시도"}
   ]'::jsonb,
   '["이야기의 핵심 메시지를 잘 파악함", "자신의 경험과 자연스럽게 연결함", "따뜻한 감정이 잘 전달됨"]'::jsonb,
   '["결론 부분을 더 발전시키면 좋겠음"]'::jsonb,
   '{
     "intro": "지호의 행동에 대해 정확하게 이해했어요. 좋은 친구의 모습을 잘 포착했네요.",
     "body": "자신의 비슷한 경험을 이야기한 점이 글을 더 생생하게 만들었어요.",
     "conclusion": "앞으로의 다짐이 진심 어린 것 같아요. 정말 좋은 친구가 될 수 있을 거예요.",
     "overall": "서연이의 글에서 따뜻한 마음이 느껴져요. 이야기를 잘 이해하고, 자신의 생각을 솔직하게 표현했어요. 우정의 의미를 깊이 생각해본 것 같아서 기뻐요. 다음에는 우정에 대한 다른 사람들의 생각도 함께 담아보면 어떨까요?"
   }'::jsonb,
   '[]'::jsonb,
   0, 0, 'gpt-4o-mini'),

  -- 이서연 세션2 (ai_evaluated) - B등급
  (5, 4, 
   19, 18, 18, 17, 72, 
   'B', 68,
   '[
     {"criterion": "주제 이해", "level": "중", "score": 19, "maxScore": 25, "evidence": "환경 보호의 필요성을 이해함", "nextAction": "원인 분석 심화"},
     {"criterion": "근거 활용", "level": "중", "score": 18, "maxScore": 25, "evidence": "가족의 실천 사례 제시", "nextAction": "지문 내용 더 활용"},
     {"criterion": "논리적 전개", "level": "중", "score": 18, "maxScore": 25, "evidence": "단락 구분이 명확함", "nextAction": "연결어 사용"},
     {"criterion": "표현력", "level": "중", "score": 17, "maxScore": 25, "evidence": "적절한 문장 구성", "nextAction": "어휘 다양화"}
   ]'::jsonb,
   '["가족의 실천 사례를 구체적으로 제시함", "환경 문제의 해결 방안을 생각함"]'::jsonb,
   '["지문의 내용을 더 활용하면 좋겠음", "결론이 다소 짧음"]'::jsonb,
   '{
     "intro": "환경 보호의 중요성을 잘 인식하고 있어요.",
     "body": "가족과 함께 환경 보호를 실천하는 모습이 보기 좋아요. 장바구니 사용과 음식 남기지 않기는 좋은 습관이에요.",
     "conclusion": "모두가 함께 노력해야 한다는 점을 잘 강조했어요.",
     "overall": "서연이의 글은 진심이 느껴져요. 다음에는 지문에서 말한 환경 오염의 원인에 대해서도 더 자세히 다루고, 자신만의 생각을 더 풍부하게 표현해보세요. 잘 하고 있어요!"
   }'::jsonb,
   '[]'::jsonb,
   0, 0, 'gpt-4o-mini'),

  -- 박지훈 세션2 (submitted) - C등급 (아직 제출만 된 상태이지만 AI 평가 진행)
  (7, 5, 
   14, 12, 13, 11, 50, 
   'C', 35,
   '[
     {"criterion": "주제 이해", "level": "하", "score": 14, "maxScore": 25, "evidence": "기본적인 내용 파악", "nextAction": "지문 꼼꼼히 읽기"},
     {"criterion": "근거 활용", "level": "하", "score": 12, "maxScore": 25, "evidence": "근거 제시 부족", "nextAction": "지문 내용 인용"},
     {"criterion": "논리적 전개", "level": "하", "score": 13, "maxScore": 25, "evidence": "글이 짧고 간략함", "nextAction": "단락별 내용 확장"},
     {"criterion": "표현력", "level": "하", "score": 11, "maxScore": 25, "evidence": "문장이 단조로움", "nextAction": "다양한 문장 구조 연습"}
   ]'::jsonb,
   '["환경 오염의 원인을 알고 있음"]'::jsonb,
   '["글의 분량이 매우 적음", "자신의 생각 표현 부족", "구체적인 사례나 근거 없음"]'::jsonb,
   '{
     "intro": "환경오염이 심각한 문제라는 점을 알고 있네요.",
     "body": "환경 보호 방법을 간단히 언급했어요. 하지만 조금 더 자세하게 쓰면 좋겠어요.",
     "conclusion": "환경보호에 동참하겠다는 다짐은 좋아요!",
     "overall": "지훈이, 글을 쓰는 것에 대해 조금 어렵게 느끼는 것 같아요. 괜찮아요! 처음부터 완벽할 필요 없어요. 다음에는 ''왜'' 환경 보호가 중요한지, ''어떻게'' 실천할 것인지를 더 자세히 적어보세요. 지문에 나온 내용도 활용하면 도움이 될 거예요. 조금씩 연습하면 분명 좋아질 거예요!"
   }'::jsonb,
   '[
     {"original": "환경오염은 심각한 문제다.", "suggested": "환경 오염은 심각한 문제입니다.", "reason": "띄어쓰기와 문체 통일", "category": "spelling"},
     {"original": "분리수거를 해야한다.", "suggested": "분리수거를 해야 합니다.", "reason": "띄어쓰기 수정", "category": "spelling"}
   ]'::jsonb,
   2, 0, 'gpt-4o-mini');

-- =====================================================
-- 8) 교사 피드백 데이터 (teacher_feedbacks)
-- =====================================================
INSERT INTO public.teacher_feedbacks (
  evaluation_id, teacher_id, 
  adjusted_total_score, adjusted_grade,
  summary_intro, summary_body, summary_conclusion,
  topic_understanding, example_analysis, logical_flow, expression_quality,
  overall_comment, feedback_status
)
VALUES
  -- 김민준 세션1에 대한 교사 피드백 (completed)
  (1, 7, 
   NULL, NULL,
   '주제를 잘 파악하고 서론에서 명확하게 제시했습니다.',
   '자신의 실천 경험을 구체적으로 설명한 점이 좋습니다. 텀블러, 분리수거, 대중교통 이용 등 실제적인 예시가 설득력을 높였습니다.',
   '미래 세대에 대한 언급으로 글의 의미를 확장시켰습니다.',
   '환경 오염의 원인과 해결책을 정확히 이해하고 있습니다.',
   '개인 경험을 적절히 활용했으나, 사회적 차원의 예시도 추가하면 좋겠습니다.',
   '서론-본론-결론의 구조가 명확하고 연결이 자연스럽습니다.',
   '문장력이 좋고 어휘 선택이 적절합니다.',
   '민준이가 환경 문제에 대해 진지하게 생각하고 있다는 것이 느껴집니다. 앞으로 더 넓은 시야로 사회 문제를 바라보는 글을 쓸 수 있을 것이라 기대합니다. 훌륭해요!',
   'completed'),

  -- 김민준 세션2에 대한 교사 피드백 (teacher_reviewed)
  (2, 7, 
   78, 'B',
   '과학 기술의 편리함을 적절히 언급했습니다.',
   '장단점을 균형있게 다루었고, 스마트폰 사용 조절 같은 실천 방안도 제시했습니다.',
   '''지혜''라는 단어 선택이 좋았으나, 조금 더 구체적인 마무리가 필요합니다.',
   '과학 기술의 양면성을 잘 이해하고 있습니다.',
   '일반적인 예시는 있으나 구체적인 사례가 부족합니다.',
   '논리적이지만 단락 간 연결을 강화하면 좋겠습니다.',
   '전반적으로 무난하지만 문장의 다양성이 필요합니다.',
   '민준이의 비판적 사고력이 발전하고 있습니다. AI와 관련된 구체적인 사례(예: 챗봇, 자율주행차 등)를 다음에 활용해보세요. 계속 성장하는 모습이 보여서 기쁩니다.',
   'completed'),

  -- 이서연 세션1에 대한 교사 피드백 (completed)
  (3, 7, 
   88, 'A',
   '지호의 행동이 왜 좋은지 잘 설명했습니다.',
   '자신의 경험을 자연스럽게 연결한 점이 매우 좋습니다.',
   '앞으로의 다짐이 진심 어려 보입니다.',
   '우정의 의미를 깊이 있게 파악했습니다.',
   '개인 경험을 효과적으로 활용했습니다.',
   '글의 흐름이 자연스럽고 읽기 편합니다.',
   '감정 표현이 풍부하고 문장이 세련되었습니다.',
   '서연이의 따뜻한 마음이 글에서 잘 느껴집니다. 친구를 생각하는 마음이 참 예쁘네요. 다음에는 다른 작품의 우정 이야기와 비교해보는 것도 좋을 것 같아요. 정말 잘 썼어요!',
   'completed');

-- =====================================================
-- 9) 세션 상태 업데이트 (AI 평가 완료된 세션)
-- =====================================================
-- 박지훈 세션2를 ai_evaluated로 업데이트 (위에서 AI 평가 데이터 삽입했으므로)
UPDATE public.assessment_sessions 
SET status = 'ai_evaluated', updated_at = now()
WHERE session_id = 7;

-- =====================================================
-- 확인용 쿼리 (주석 해제하여 실행 가능)
-- =====================================================
-- SELECT '--- 학급 ---' as info;
-- SELECT * FROM public.classes;

-- SELECT '--- 학급-학생 ---' as info;
-- SELECT cs.*, c.class_name, u.name as student_name 
-- FROM public.class_students cs
-- JOIN public.classes c ON cs.class_id = c.class_id
-- JOIN public.users u ON cs.student_id = u.user_id;

-- SELECT '--- 학부모-학생 관계 ---' as info;
-- SELECT spr.*, 
--        s.name as student_name, 
--        p.name as parent_name
-- FROM public.student_parent_relations spr
-- JOIN public.users s ON spr.student_id = s.user_id
-- JOIN public.users p ON spr.parent_id = p.user_id;

-- SELECT '--- 진단 세션 ---' as info;
-- SELECT ass.session_id, u.name as student_name, ass.status, ass.grade_band, st.title as stimulus_title
-- FROM public.assessment_sessions ass
-- JOIN public.users u ON ass.student_id = u.user_id
-- LEFT JOIN public.stimuli st ON ass.stimulus_id = st.stimulus_id;

-- SELECT '--- AI 평가 결과 ---' as info;
-- SELECT ae.evaluation_id, ae.session_id, ae.total_score, ae.grade_level, ae.percentile
-- FROM public.ai_evaluations ae;

-- SELECT '--- 교사 피드백 ---' as info;
-- SELECT tf.feedback_id, tf.evaluation_id, tf.feedback_status, tf.overall_comment
-- FROM public.teacher_feedbacks tf;
