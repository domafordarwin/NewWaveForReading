-- Seed sample data for testing (users only)

-- 기존 데이터 삭제
truncate table public.users restart identity cascade;

-- =====================================================
-- 사용자 데이터 (6가지 유형)
-- user_type: STUDENT, PARENT, SCHOOL_ADMIN, ASSESSMENT_TEACHER, QUESTION_DEVELOPER, SYSTEM_ADMIN
-- student_grade_level: GRADE_A (70점 이상), GRADE_B (70점 미만)
-- =====================================================
insert into public.users (email, name, user_type, birth_date, school_name, school_id, grade, student_grade_level, is_active, password_hash)
values
  -- 학생 3명
  ('student1@example.com', '김민준', 'STUDENT', '2010-03-15', '서울중학교', 1, 2, 'GRADE_A', true, 'test1234'),
  ('student2@example.com', '이서연', 'STUDENT', '2010-05-21', '서울중학교', 1, 2, 'GRADE_A', true, 'test1234'),
  ('student3@example.com', '박지훈', 'STUDENT', '2009-11-02', '서울중학교', 1, 3, 'GRADE_B', true, 'test1234'),

  -- 학부모 2명
  ('parent1@example.com', '김민준 학부모', 'PARENT', null, null, null, null, null, true, 'test1234'),
  ('parent2@example.com', '이서연 학부모', 'PARENT', null, null, null, null, null, true, 'test1234'),

  -- 학교 관리자 1명
  ('schooladmin1@example.com', '박교장', 'SCHOOL_ADMIN', null, '서울중학교', 1, null, null, true, 'test1234'),

  -- 진단 담당 교사 1명
  ('teacher1@example.com', '김선생', 'ASSESSMENT_TEACHER', null, '서울중학교', 1, null, null, true, 'test1234'),

  -- 문항 개발 교사 1명
  ('questiondev1@example.com', '최문항', 'QUESTION_DEVELOPER', null, '서울중학교', 1, null, null, true, 'test1234'),

  -- 시스템 관리자 1명
  ('admin1@example.com', '시스템관리자', 'SYSTEM_ADMIN', null, null, null, null, null, true, 'test1234');
