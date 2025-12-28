-- Seed sample data for testing

insert into public.users (email, name, user_type, birth_date, school_name, grade, is_active, password_hash)
values
  ('student1@example.com', '김민준', 'STUDENT', '2010-03-15', '서울중학교', 2, true, 'ehrtjtoanfruf'),
  ('student2@example.com', '이서연', 'STUDENT', '2010-05-21', '서울중학교', 2, true, 'ehrtjtoanfruf'),
  ('student3@example.com', '박지훈', 'STUDENT', '2009-11-02', '서울중학교', 3, true, 'ehrtjtoanfruf'),
  ('student4@example.com', '최유나', 'STUDENT', '2009-01-12', '서울중학교', 3, true, 'ehrtjtoanfruf'),
  ('student5@example.com', '정하늘', 'STUDENT', '2008-07-18', '서울중학교', 4, true, 'ehrtjtoanfruf'),
  ('student6@example.com', '오도윤', 'STUDENT', '2008-10-09', '서울중학교', 4, true, 'ehrtjtoanfruf'),
  ('student7@example.com', '강서준', 'STUDENT', '2007-02-26', '서울중학교', 5, true, 'ehrtjtoanfruf'),
  ('student8@example.com', '조예린', 'STUDENT', '2007-09-30', '서울중학교', 5, true, 'ehrtjtoanfruf'),
  ('student9@example.com', '윤태양', 'STUDENT', '2006-04-14', '서울중학교', 6, true, 'ehrtjtoanfruf'),
  ('student10@example.com', '한지우', 'STUDENT', '2006-12-07', '서울중학교', 6, true, 'ehrtjtoanfruf'),
  ('teacher1@example.com', '김선생', 'TEACHER', null, '서울중학교', null, true, 'ehrtjtoanfruf'),
  ('teacher2@example.com', '이선생', 'TEACHER', null, '서울중학교', null, true, 'ehrtjtoanfruf'),
  ('parent1@example.com', '박학부모', 'PARENT', null, null, null, true, 'ehrtjtoanfruf'),
  ('parent2@example.com', '최학부모', 'PARENT', null, null, null, true, 'ehrtjtoanfruf'),
  ('admin1@example.com', '관리자', 'ADMIN', null, null, null, true, 'ehrtjtoanfruf');

insert into public.books (title, author, publisher, published_year, isbn, category, description, cover_image_url, difficulty_level)
values
  ('동물농장', '조지 오웰', '민음사', 2003, '9788937460449', '고전문학', '권력의 부패와 전체주의를 비판한 우화 소설.', 'https://image.yes24.com/goods/9172/XL', 'MIDDLE'),
  ('어린왕자', '생텍쥐페리', '문학동네', 2015, '9788954635950', '고전문학', '사랑과 관계, 삶의 본질을 다룬 철학적 동화.', 'https://image.yes24.com/goods/24906982/XL', 'ELEMENTARY'),
  ('사피엔스', '유발 하라리', '김영사', 2015, '9788934972464', '인문학', '인류의 역사와 미래를 조망하는 통찰력 있는 책.', 'https://image.yes24.com/goods/23030284/XL', 'HIGH');

insert into public.topics (book_id, topic_text, topic_type, difficulty_level, keywords)
values
  (1, '동물농장에서 권력의 부패가 전개되는 과정을 분석하시오.', 'ANALYTICAL', 4, array['권력','부패','우화']),
  (2, '"진짜 중요한 것은 눈에 보이지 않아"의 의미를 설명하시오.', 'CRITICAL', 3, array['가치','관계','의미']),
  (3, '사피엔스의 핵심 요소 중 하나를 선택해 미래에 미칠 영향을 예측하시오.', 'CREATIVE', 5, array['진화','사회','미래']);

insert into public.assessments (student_id, topic_id, assessment_type, status, started_at, submitted_at, time_limit_minutes, word_count_min, word_count_max)
values
  (1, 1, 'ESSAY', 'EVALUATED', '2024-12-20T10:00:00Z', '2024-12-20T11:25:00Z', 90, 800, 2000),
  (1, 2, 'ESSAY', 'IN_PROGRESS', '2024-12-27T09:30:00Z', null, 90, 800, 2000),
  (1, 3, 'ESSAY', 'NOT_STARTED', null, null, 90, 800, 2000);

insert into public.answers (assessment_id, content, word_count, char_count, paragraph_count, submitted_at, version)
values
  (1, '동물농장에서 권력이 어떻게 변화하는지 요약하고, 그 변화가 오늘날 사회에 주는 의미를 설명했습니다.', 120, 620, 3, '2024-12-20T11:20:00Z', 1);

insert into public.evaluations (
  answer_id, assessment_id, student_id, evaluator_type,
  book_analysis_score, creative_thinking_score, problem_solving_score, language_expression_score, expression_score,
  total_score, grade, percentile,
  spelling_errors, spacing_errors, grammar_errors, vocabulary_level,
  overall_comment, comprehensive_feedback, detailed_feedback,
  strengths, weaknesses, improvements, evaluated_at
)
values
  (
    1, 1, 1, 'ai',
    18, 20, 16, 21, 21,
    75, 'B', 65,
    3, 8, 2, 3.6,
    '논제를 이해하고 핵심 내용을 정리하려는 시도가 좋습니다.',
    '전반적으로 논제 이해가 적절하며, 핵심 개념 연결이 좋습니다.',
    '근거 다양성이 부족하므로 반례나 구체 사례를 추가하면 설득력이 높아집니다.',
    array['논제 이해', '핵심 개념 연결', '기본 구조'],
    array['근거 다양성 부족', '표현력 보강 필요', '논리 전개 보강'],
    array['반례 1개 추가', '사례 2개 보강', '접속어 활용'],
    '2024-12-20T12:00:00Z'
  );

insert into public.feedbacks (
  evaluation_id, student_id, assessment_id, answer_id,
  summary_intro, summary_body, summary_conclusion,
  rubric, line_edits, strengths, weaknesses, improvements, teacher_note
)
values
  (
    1, 1, 1, 1,
    '입장을 제시했으나 근거가 부족합니다. 주장을 더 선명하게 정리해보세요.',
    '도서 내용을 근거로 전개하려는 시도가 보입니다. 사례를 2개 이상 추가해보세요.',
    '결론의 요약은 자연스럽습니다. 다음 글에서는 개선 목표를 명시해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','논제 충실성/입장 명료성','level','중','evidence','주장 문장이 다소 약함','next_action','첫 문장에 핵심 주장 제시'),
      jsonb_build_object('criterion','대상도서 이해/활용','level','중','evidence','도서 개념 연결이 제한적','next_action','핵심 개념 2개 추가'),
      jsonb_build_object('criterion','논거 다양성/타당성','level','하','evidence','근거 다양성 부족','next_action','반례나 사례 추가'),
      jsonb_build_object('criterion','구성/일관성(서론-본론-결론)','level','중','evidence','문단 흐름은 유지됨','next_action','문단 첫 문장 강화'),
      jsonb_build_object('criterion','창의적 사고력','level','중','evidence','개인 관점 제시 부족','next_action','개인 경험 한 문장 추가'),
      jsonb_build_object('criterion','표현/문장력','level','중','evidence','문장 호흡 정리 필요','next_action','접속어 추가')
    ),
    jsonb_build_array(
      jsonb_build_object('original','우리시대의','suggested','우리 시대의','reason','띄어쓰기','category','띄어쓰기'),
      jsonb_build_object('original','말할수있다','suggested','말할 수 있다','reason','띄어쓰기','category','띄어쓰기'),
      jsonb_build_object('original','그렇다면','suggested','그렇다면,','reason','문장 호흡 정리','category','문장다듬기')
    ),
    array['논제 이해', '기본 구조'],
    array['근거 다양성 부족', '표현력 보강 필요'],
    array['사례 2개 추가', '접속어 활용'],
    '도서 요약이 추가되면 더 정밀한 피드백이 가능합니다.'
  );
