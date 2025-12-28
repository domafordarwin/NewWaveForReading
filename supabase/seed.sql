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
