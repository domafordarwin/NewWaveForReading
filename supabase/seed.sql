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

insert into public.assessments (assessment_id, student_id, topic_id, assessment_type, status, started_at, submitted_at, time_limit_minutes, word_count_min, word_count_max)
values
  (1, 1, 1, 'ESSAY', 'EVALUATED', '2024-12-20T10:00:00Z', '2024-12-20T11:25:00Z', 90, 800, 2000),
  (2, 1, 2, 'ESSAY', 'IN_PROGRESS', '2024-12-27T09:30:00Z', null, 90, 800, 2000),
  (3, 1, 3, 'ESSAY', 'NOT_STARTED', null, null, 90, 800, 2000),
  (4, 2, 1, 'ESSAY', 'EVALUATED', '2024-12-18T10:00:00Z', '2024-12-18T11:10:00Z', 90, 800, 2000),
  (5, 3, 2, 'ESSAY', 'EVALUATED', '2024-12-17T10:00:00Z', '2024-12-17T11:05:00Z', 90, 800, 2000),
  (6, 4, 3, 'ESSAY', 'EVALUATED', '2024-12-16T10:00:00Z', '2024-12-16T11:15:00Z', 90, 800, 2000),
  (7, 5, 1, 'ESSAY', 'EVALUATED', '2024-12-15T10:00:00Z', '2024-12-15T11:08:00Z', 90, 800, 2000),
  (8, 6, 2, 'ESSAY', 'EVALUATED', '2024-12-14T10:00:00Z', '2024-12-14T11:12:00Z', 90, 800, 2000),
  (9, 7, 3, 'ESSAY', 'EVALUATED', '2024-12-13T10:00:00Z', '2024-12-13T11:02:00Z', 90, 800, 2000),
  (10, 8, 1, 'ESSAY', 'EVALUATED', '2024-12-12T10:00:00Z', '2024-12-12T11:18:00Z', 90, 800, 2000),
  (11, 9, 2, 'ESSAY', 'EVALUATED', '2024-12-11T10:00:00Z', '2024-12-11T11:22:00Z', 90, 800, 2000),
  (12, 10, 3, 'ESSAY', 'EVALUATED', '2024-12-10T10:00:00Z', '2024-12-10T11:06:00Z', 90, 800, 2000);

insert into public.answers (answer_id, assessment_id, content, word_count, char_count, paragraph_count, submitted_at, version)
values
  (1, 1, '동물농장에서 권력이 어떻게 변화하는지 요약하고, 그 변화가 오늘날 사회에 주는 의미를 설명했습니다.', 120, 620, 3, '2024-12-20T11:20:00Z', 1),
  (2, 4, '동물농장의 규칙 변화 과정을 통해 권력의 부패를 설명했습니다.', 110, 580, 3, '2024-12-18T11:05:00Z', 1),
  (3, 5, '어린왕자의 메시지를 현대 생활과 연결해 의미를 정리했습니다.', 130, 700, 3, '2024-12-17T11:00:00Z', 1),
  (4, 6, '사피엔스의 핵심 요소가 미래 사회에 미칠 영향에 대해 서술했습니다.', 140, 720, 4, '2024-12-16T11:10:00Z', 1),
  (5, 7, '동물농장을 통해 권력의 변질을 비판했습니다.', 115, 600, 3, '2024-12-15T11:00:00Z', 1),
  (6, 8, '어린왕자 속 관계의 의미를 사례와 함께 제시했습니다.', 125, 650, 3, '2024-12-14T11:05:00Z', 1),
  (7, 9, '사피엔스의 기술 발전이 사회에 미칠 영향을 분석했습니다.', 150, 780, 4, '2024-12-13T10:55:00Z', 1),
  (8, 10, '동물농장 권력 구조의 변화와 교훈을 정리했습니다.', 135, 710, 3, '2024-12-12T11:10:00Z', 1),
  (9, 11, '어린왕자의 본질적 메시지를 개인 경험과 연결했습니다.', 145, 760, 4, '2024-12-11T11:15:00Z', 1),
  (10, 12, '사피엔스의 핵심 요소를 미래 전망과 함께 설명했습니다.', 155, 820, 4, '2024-12-10T11:00:00Z', 1);

insert into public.evaluations (
  evaluation_id, answer_id, assessment_id, student_id, evaluator_type,
  book_analysis_score, creative_thinking_score, problem_solving_score, language_expression_score, expression_score,
  total_score, grade, percentile,
  spelling_errors, spacing_errors, grammar_errors, vocabulary_level,
  overall_comment, comprehensive_feedback, detailed_feedback,
  strengths, weaknesses, improvements, evaluated_at
)
values
  (1, 1, 1, 1, 'ai', 18, 20, 16, 21, 21, 75, 'B', 65, 3, 8, 2, 3.6,
    '논제를 이해하고 핵심 내용을 정리하려는 시도가 좋습니다.',
    '전반적으로 논제 이해가 적절하며, 핵심 개념 연결이 좋습니다.',
    '근거 다양성이 부족하므로 반례나 구체 사례를 추가하면 설득력이 높아집니다.',
    array['논제 이해', '핵심 개념 연결', '기본 구조'],
    array['근거 다양성 부족', '표현력 보강 필요', '논리 전개 보강'],
    array['반례 1개 추가', '사례 2개 보강', '접속어 활용'],
    '2024-12-20T12:00:00Z'),
  (2, 2, 4, 2, 'ai', 17, 18, 16, 20, 20, 71, 'B', 62, 2, 6, 2, 3.4,
    '핵심을 잘 요약했으나 근거가 더 필요합니다.',
    '논제 이해는 좋으나 구체 사례가 부족합니다.',
    '핵심 사례를 2개 보강하면 설득력이 높아집니다.',
    array['핵심 요약', '논제 이해'],
    array['근거 부족', '표현력 보강 필요'],
    array['사례 보강', '문장 연결 개선'],
    '2024-12-18T12:00:00Z'),
  (3, 3, 5, 3, 'ai', 19, 21, 17, 22, 22, 79, 'B', 68, 2, 5, 1, 3.7,
    '메시지 해석이 좋고 논리 전개가 안정적입니다.',
    '논제 핵심을 잘 짚었고 근거가 비교적 충실합니다.',
    '반례를 추가하면 더 설득력 있는 글이 됩니다.',
    array['해석력', '논리 전개', '구성'],
    array['반례 부족', '표현 다양성 부족'],
    array['반례 추가', '어휘 다양화'],
    '2024-12-17T12:00:00Z'),
  (4, 4, 6, 4, 'ai', 20, 22, 18, 23, 23, 83, 'A', 72, 1, 4, 1, 3.9,
    '미래 전망이 구체적이며 창의성이 돋보입니다.',
    '핵심 개념을 잘 활용했고 흐름이 좋습니다.',
    '근거를 한 단계 더 구체화하면 완성도가 높아집니다.',
    array['창의성', '개념 활용', '흐름'],
    array['근거 구체성 부족'],
    array['사례 구체화'],
    '2024-12-16T12:00:00Z'),
  (5, 5, 7, 5, 'ai', 18, 19, 16, 21, 21, 74, 'B', 64, 2, 6, 2, 3.5,
    '핵심 내용 요약이 명확합니다.',
    '논제 이해가 좋으나 사례가 부족합니다.',
    '사례 2개를 보강하면 설득력이 강화됩니다.',
    array['요약력', '논제 이해'],
    array['사례 부족'],
    array['사례 보강'],
    '2024-12-15T12:00:00Z'),
  (6, 6, 8, 6, 'ai', 19, 20, 17, 22, 22, 78, 'B', 67, 2, 5, 1, 3.7,
    '관계의 의미를 잘 정리했습니다.',
    '근거가 충실하며 구조가 명확합니다.',
    '어휘 다양성을 높이면 더 좋은 글이 됩니다.',
    array['구조', '근거 활용'],
    array['어휘 다양성 부족'],
    array['어휘 확장'],
    '2024-12-14T12:00:00Z'),
  (7, 7, 9, 7, 'ai', 21, 22, 19, 23, 23, 85, 'A', 75, 1, 3, 1, 4.0,
    '기술 발전의 영향 분석이 뛰어납니다.',
    '창의성과 근거가 좋고 흐름이 안정적입니다.',
    '구체 사례를 추가하면 완성도가 높아집니다.',
    array['분석력', '창의성', '흐름'],
    array['사례 구체성 부족'],
    array['사례 추가'],
    '2024-12-13T12:00:00Z'),
  (8, 8, 10, 8, 'ai', 18, 19, 17, 21, 21, 75, 'B', 66, 2, 6, 2, 3.5,
    '권력 구조 변화에 대한 이해가 좋습니다.',
    '핵심 개념 연결이 적절합니다.',
    '근거 다양성을 높이면 좋습니다.',
    array['개념 이해', '구성'],
    array['근거 다양성 부족'],
    array['반례 추가'],
    '2024-12-12T12:00:00Z'),
  (9, 9, 11, 9, 'ai', 20, 21, 18, 22, 22, 81, 'A', 71, 1, 4, 1, 3.8,
    '본질적 메시지를 잘 연결했습니다.',
    '근거와 흐름이 안정적입니다.',
    '개인 경험을 조금 더 구체화하면 좋습니다.',
    array['해석력', '흐름'],
    array['구체성 부족'],
    array['경험 구체화'],
    '2024-12-11T12:00:00Z'),
  (10, 10, 12, 10, 'ai', 21, 23, 20, 24, 24, 88, 'A', 78, 1, 3, 1, 4.1,
    '미래 전망이 구체적이고 설득력이 높습니다.',
    '논리 전개가 매우 안정적입니다.',
    '표현을 조금 더 간결하게 다듬으면 좋습니다.',
    array['분석력', '논리 전개', '창의성'],
    array['문장 길이 과다'],
    array['문장 간결화'],
    '2024-12-10T12:00:00Z');

insert into public.feedbacks (
  feedback_id, evaluation_id, student_id, assessment_id, answer_id,
  summary_intro, summary_body, summary_conclusion,
  rubric, line_edits, strengths, weaknesses, improvements, teacher_note
)
values
  (1, 1, 1, 1, 1,
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
    '도서 요약이 추가되면 더 정밀한 피드백이 가능합니다.'),
  (2, 2, 2, 4, 2,
    '요약은 명확하지만 주장이 약합니다.',
    '근거가 부족해 설득력이 낮습니다. 사례를 보강하세요.',
    '결론에 개선 목표를 명시하면 좋습니다.',
    jsonb_build_array(
      jsonb_build_object('criterion','논제 충실성/입장 명료성','level','중','evidence','주장 약함','next_action','핵심 주장 강화'),
      jsonb_build_object('criterion','대상도서 이해/활용','level','중','evidence','개념 연결 제한','next_action','핵심 개념 추가'),
      jsonb_build_object('criterion','논거 다양성/타당성','level','하','evidence','사례 부족','next_action','사례 2개 추가')
    ),
    jsonb_build_array(
      jsonb_build_object('original','말할수있다','suggested','말할 수 있다','reason','띄어쓰기','category','띄어쓰기')
    ),
    array['요약력'],
    array['근거 부족'],
    array['사례 보강'],
    '근거 보강 후 재검토 필요.'),
  (3, 3, 3, 5, 3,
    '입장과 논제 연결이 좋습니다.',
    '근거가 비교적 충실합니다. 반례를 추가하면 더 좋습니다.',
    '결론의 강조 문장을 보강하세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','논제 충실성/입장 명료성','level','상','evidence','입장 명확','next_action','강조 문장 추가'),
      jsonb_build_object('criterion','논거 다양성/타당성','level','중','evidence','반례 부족','next_action','반례 추가')
    ),
    jsonb_build_array(
      jsonb_build_object('original','중요하다고한다','suggested','중요하다고 한다','reason','띄어쓰기','category','띄어쓰기')
    ),
    array['논리 전개', '해석력'],
    array['반례 부족'],
    array['반례 추가'],
    '근거 다양성 보강 필요.'),
  (4, 4, 4, 6, 4,
    '창의적 관점이 돋보입니다.',
    '근거가 비교적 충실합니다. 사례를 더 구체화하세요.',
    '결론을 한 문장으로 요약해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','창의적 사고력','level','상','evidence','관점 독창적','next_action','사례 구체화')
    ),
    jsonb_build_array(),
    array['창의성', '논리 전개'],
    array['사례 구체성 부족'],
    array['사례 구체화'],
    '강점 유지 권장.'),
  (5, 5, 5, 7, 5,
    '핵심 요약이 좋습니다.',
    '근거가 부족합니다. 사례를 보강하세요.',
    '마무리를 더 명확히 해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','논거 다양성/타당성','level','하','evidence','사례 부족','next_action','사례 보강')
    ),
    jsonb_build_array(),
    array['요약력'],
    array['사례 부족'],
    array['사례 보강'],
    '근거 보강 필요.'),
  (6, 6, 6, 8, 6,
    '관계의 의미를 잘 설명했습니다.',
    '근거 흐름이 안정적입니다.',
    '어휘 다양성을 높여보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','표현/문장력','level','중','evidence','어휘 다양성 부족','next_action','어휘 확장')
    ),
    jsonb_build_array(),
    array['구성', '근거 활용'],
    array['어휘 다양성 부족'],
    array['어휘 확장'],
    '표현력 보강 필요.'),
  (7, 7, 7, 9, 7,
    '분석력이 뛰어납니다.',
    '근거와 흐름이 매우 좋습니다.',
    '사례를 조금 더 구체화하면 좋습니다.',
    jsonb_build_array(
      jsonb_build_object('criterion','논거 다양성/타당성','level','상','evidence','근거 충실','next_action','사례 구체화')
    ),
    jsonb_build_array(),
    array['분석력', '창의성'],
    array['사례 구체성 부족'],
    array['사례 구체화'],
    '강점 유지 권장.'),
  (8, 8, 8, 10, 8,
    '핵심 개념 연결이 적절합니다.',
    '근거 다양성이 부족합니다.',
    '반례를 추가해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','논거 다양성/타당성','level','하','evidence','근거 다양성 부족','next_action','반례 추가')
    ),
    jsonb_build_array(),
    array['개념 이해'],
    array['근거 부족'],
    array['반례 추가'],
    '근거 보강 필요.'),
  (9, 9, 9, 11, 9,
    '본질적 메시지를 잘 연결했습니다.',
    '근거 흐름이 안정적입니다.',
    '경험을 조금 더 구체화해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','창의적 사고력','level','중','evidence','개인 관점 부족','next_action','경험 구체화')
    ),
    jsonb_build_array(),
    array['해석력'],
    array['구체성 부족'],
    array['경험 구체화'],
    '표현 보강 권장.'),
  (10, 10, 10, 12, 10,
    '논리 전개가 매우 안정적입니다.',
    '근거와 흐름이 좋습니다.',
    '문장을 조금 더 간결하게 다듬어보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','표현/문장력','level','중','evidence','문장 길이 과다','next_action','문장 간결화')
    ),
    jsonb_build_array(),
    array['분석력', '논리 전개'],
    array['문장 길이 과다'],
    array['문장 간결화'],
    '간결한 표현 연습 필요.');

insert into public.progress_history (
  history_id, student_id, assessment_id, total_score,
  book_analysis_score, creative_thinking_score, problem_solving_score, language_expression_score, recorded_at
)
values
  (1, 1, 1, 75, 18, 20, 16, 21, '2024-12-20T12:00:00Z'),
  (2, 2, 4, 71, 17, 18, 16, 20, '2024-12-18T12:00:00Z'),
  (3, 3, 5, 79, 19, 21, 17, 22, '2024-12-17T12:00:00Z'),
  (4, 4, 6, 83, 20, 22, 18, 23, '2024-12-16T12:00:00Z'),
  (5, 5, 7, 74, 18, 19, 16, 21, '2024-12-15T12:00:00Z'),
  (6, 6, 8, 78, 19, 20, 17, 22, '2024-12-14T12:00:00Z'),
  (7, 7, 9, 85, 21, 22, 19, 23, '2024-12-13T12:00:00Z'),
  (8, 8, 10, 75, 18, 19, 17, 21, '2024-12-12T12:00:00Z'),
  (9, 9, 11, 81, 20, 21, 18, 22, '2024-12-11T12:00:00Z'),
  (10, 10, 12, 88, 21, 23, 20, 24, '2024-12-10T12:00:00Z');
