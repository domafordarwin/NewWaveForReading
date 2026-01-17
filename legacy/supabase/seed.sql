-- Seed sample data for testing

-- 새로 추가된 테이블들 포함하여 truncate
truncate table
  public.student_grade_history,
  public.user_permissions,
  public.role_permissions,
  public.permissions,
  public.consultations,
  public.consents,
  public.consent_templates,
  public.student_parents,
  public.class_students,
  public.feedbacks,
  public.progress_history,
  public.evaluations,
  public.answers,
  public.assessments,
  public.topics,
  public.books,
  public.classes,
  public.users,
  public.schools
restart identity cascade;

-- =====================================================
-- 학교 데이터
-- =====================================================
insert into public.schools (school_name, school_code, address, phone, region, school_type, is_active)
values
  ('서울중학교', 'SEOUL001', '서울특별시 강남구 테헤란로 123', '02-1234-5678', '서울', '중학교', true),
  ('한국고등학교', 'KOREA001', '서울특별시 서초구 반포대로 456', '02-2345-6789', '서울', '고등학교', true);

-- =====================================================
-- 사용자 데이터 (6가지 유형)
-- user_type: STUDENT, PARENT, SCHOOL_ADMIN, ASSESSMENT_TEACHER, QUESTION_DEVELOPER, SYSTEM_ADMIN
-- student_grade_level: GRADE_A (70점 이상), GRADE_B (70점 미만)
-- =====================================================
insert into public.users (email, name, user_type, birth_date, school_name, school_id, grade, student_grade_level, is_active, password_hash)
values
  -- 학생 10명
  ('student1@example.com', '김민준', 'STUDENT', '2010-03-15', '서울중학교', 1, 2, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student2@example.com', '이서연', 'STUDENT', '2010-05-21', '서울중학교', 1, 2, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student3@example.com', '박지훈', 'STUDENT', '2009-11-02', '서울중학교', 1, 3, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student4@example.com', '최유나', 'STUDENT', '2009-01-12', '서울중학교', 1, 3, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student5@example.com', '정하늘', 'STUDENT', '2008-07-18', '서울중학교', 1, 4, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student6@example.com', '오도윤', 'STUDENT', '2008-10-09', '서울중학교', 1, 4, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student7@example.com', '강서준', 'STUDENT', '2007-02-26', '서울중학교', 1, 5, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student8@example.com', '조예린', 'STUDENT', '2007-09-30', '서울중학교', 1, 5, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student9@example.com', '윤태양', 'STUDENT', '2006-04-14', '서울중학교', 1, 6, 'GRADE_A', true, 'ehrtjtoanfruf'),
  ('student10@example.com', '한지우', 'STUDENT', '2006-12-07', '서울중학교', 1, 6, 'GRADE_A', true, 'ehrtjtoanfruf'),
  -- 학부모 10명
  ('parent1@example.com', '김민준 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent2@example.com', '이서연 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent3@example.com', '박지훈 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent4@example.com', '최유나 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent5@example.com', '정하늘 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent6@example.com', '오도윤 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent7@example.com', '강서준 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent8@example.com', '조예린 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent9@example.com', '윤태양 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  ('parent10@example.com', '한지우 학부모', 'PARENT', null, null, null, null, null, true, 'ehrtjtoanfruf'),
  -- 학교 관리자 1명
  ('schooladmin1@example.com', '박교장', 'SCHOOL_ADMIN', null, '서울중학교', 1, null, null, true, 'ehrtjtoanfruf'),
  -- 진단 담당 교사 2명
  ('teacher1@example.com', '김선생', 'ASSESSMENT_TEACHER', null, '서울중학교', 1, null, null, true, 'ehrtjtoanfruf'),
  ('teacher2@example.com', '이선생', 'ASSESSMENT_TEACHER', null, '서울중학교', 1, null, null, true, 'ehrtjtoanfruf'),
  -- 문항 개발 교사 1명
  ('questiondev1@example.com', '최문항', 'QUESTION_DEVELOPER', null, '서울중학교', 1, null, null, true, 'ehrtjtoanfruf'),
  -- 시스템 관리자 1명
  ('admin1@example.com', '시스템관리자', 'SYSTEM_ADMIN', null, null, null, null, null, true, 'ehrtjtoanfruf');

-- 학교 관리자 연결
update public.schools set admin_user_id = 21 where school_id = 1;

-- =====================================================
-- 반 편성 데이터
-- =====================================================
insert into public.classes (school_id, class_name, grade_year, class_number, academic_year, teacher_id, max_students, is_active)
values
  (1, '2학년 1반', 2, 1, 2024, 22, 30, true),
  (1, '2학년 2반', 2, 2, 2024, 23, 30, true),
  (1, '3학년 1반', 3, 1, 2024, 22, 30, true);

-- =====================================================
-- 반-학생 연결 데이터
-- =====================================================
insert into public.class_students (class_id, student_id, student_number, is_active)
values
  (1, 1, 1, true),
  (1, 2, 2, true),
  (2, 3, 1, true),
  (2, 4, 2, true);

-- =====================================================
-- 학생-학부모 연결 데이터
-- =====================================================
insert into public.student_parents (student_id, parent_id, relationship, is_primary)
values
  (1, 11, '부', true),
  (2, 12, '모', true),
  (3, 13, '부', true),
  (4, 14, '모', true),
  (5, 15, '부', true),
  (6, 16, '모', true),
  (7, 17, '부', true),
  (8, 18, '모', true),
  (9, 19, '부', true),
  (10, 20, '모', true);

-- =====================================================
-- 동의서 템플릿 데이터
-- =====================================================
insert into public.consent_templates (consent_type, version, title, content, is_required, is_active)
values
  ('STUDENT_PRIVACY', 'v1.0', '학생 개인정보 수집 및 이용 동의서',
   '## 개인정보 수집 및 이용 동의서

### 1. 수집하는 개인정보 항목
- 필수항목: 이름, 이메일, 학교명, 학년
- 선택항목: 생년월일, 연락처

### 2. 개인정보의 수집 및 이용 목적
- 문해력 진단 서비스 제공
- 학습 결과 분석 및 피드백 제공
- 서비스 개선을 위한 통계 분석

### 3. 개인정보의 보유 및 이용 기간
- 회원 탈퇴 시까지 또는 법령에 따른 보존 기간

위 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.',
   true, true),

  ('PARENT_CONSENT', 'v1.0', '학부모 동의서',
   '## 학부모 동의서

### 1. 동의 내용
본인은 자녀의 문해력 진단 서비스 이용에 동의합니다.

### 2. 동의 범위
- 자녀의 진단 결과 열람
- 자녀의 학습 이력 조회
- 상담 서비스 이용

위 내용을 확인하였으며, 자녀의 서비스 이용에 동의합니다.',
   true, true),

  ('ASSESSMENT_CONSENT', 'v1.0', '진단 참여 동의서',
   '## 진단 참여 동의서

### 1. 진단 목적
본 진단은 학생의 독서 문해력 수준을 파악하고 맞춤형 학습 방향을 제시하기 위한 것입니다.

### 2. 진단 방법
- 독서 후 작문 과제 수행
- AI 기반 자동 평가
- 전문 교사의 피드백 제공

위 내용을 확인하였으며, 진단 참여에 동의합니다.',
   true, true);

-- =====================================================
-- 권한 정의 데이터
-- =====================================================
insert into public.permissions (permission_code, permission_name, description, resource, action)
values
  -- 학생 권한
  ('assessment.take', '평가 응시', '평가를 응시할 수 있음', 'assessment', 'take'),
  ('assessment.view_own', '본인 평가 조회', '본인의 평가 결과를 조회할 수 있음', 'assessment', 'read'),
  ('feedback.view_own', '본인 피드백 조회', '본인에 대한 피드백을 조회할 수 있음', 'feedback', 'read'),
  ('profile.edit_own', '본인 프로필 수정', '본인의 프로필 정보를 수정할 수 있음', 'profile', 'update'),
  ('consent.manage_own', '본인 동의서 관리', '본인의 동의서를 관리할 수 있음', 'consent', 'manage'),
  -- 학부모 권한
  ('student.view_child', '자녀 정보 조회', '자녀의 평가 결과와 보고서를 조회할 수 있음', 'student', 'read'),
  ('consultation.request', '상담 신청', '상담을 신청할 수 있음', 'consultation', 'create'),
  ('report.view_child', '자녀 보고서 조회', '자녀의 보고서를 조회할 수 있음', 'report', 'read'),
  -- 학교 관리자 권한
  ('school.manage', '학교 관리', '학교 정보를 관리할 수 있음', 'school', 'manage'),
  ('class.manage', '반 관리', '반 편성 및 관리를 할 수 있음', 'class', 'manage'),
  ('student.manage_school', '학교 학생 관리', '학교 소속 학생을 관리할 수 있음', 'student', 'manage'),
  ('user.create_school', '학교 사용자 생성', '학교 내 사용자 계정을 생성할 수 있음', 'user', 'create'),
  ('report.view_school', '학교 보고서 조회', '학교 전체 보고서를 조회할 수 있음', 'report', 'read'),
  ('report.print', '보고서 출력', '보고서를 출력할 수 있음', 'report', 'print'),
  -- 평가 담당 교사 권한
  ('assessment.assign', '평가 배정', '학생에게 평가를 배정할 수 있음', 'assessment', 'assign'),
  ('assessment.manage', '평가 관리', '평가를 관리할 수 있음', 'assessment', 'manage'),
  ('feedback.create', '피드백 작성', '학생에게 피드백을 작성할 수 있음', 'feedback', 'create'),
  ('feedback.manage', '피드백 관리', '피드백을 관리할 수 있음', 'feedback', 'manage'),
  ('report.generate', '보고서 생성', '학생 보고서를 생성할 수 있음', 'report', 'create'),
  ('question.match', '문항 매칭', '학생에게 적절한 문항을 매칭할 수 있음', 'question', 'match'),
  -- 문항 개발 교사 권한
  ('question.create', '문항 생성', '평가 문항을 생성할 수 있음', 'question', 'create'),
  ('question.edit', '문항 수정', '평가 문항을 수정할 수 있음', 'question', 'update'),
  ('question.delete', '문항 삭제', '평가 문항을 삭제할 수 있음', 'question', 'delete'),
  ('question.manage', '문항 관리', '문항을 전체적으로 관리할 수 있음', 'question', 'manage'),
  ('book.manage', '도서 관리', '도서 정보를 관리할 수 있음', 'book', 'manage'),
  -- 시스템 관리자 권한
  ('user.manage_all', '전체 사용자 관리', '모든 사용자를 관리할 수 있음', 'user', 'manage'),
  ('permission.manage', '권한 관리', '권한을 관리할 수 있음', 'permission', 'manage'),
  ('database.manage', '데이터베이스 관리', '데이터베이스를 관리할 수 있음', 'database', 'manage'),
  ('system.configure', '시스템 설정', '시스템 설정을 변경할 수 있음', 'system', 'configure');

-- =====================================================
-- 역할별 권한 매핑 데이터
-- =====================================================
-- 학생 권한
insert into public.role_permissions (user_type, permission_id)
select 'STUDENT', permission_id from public.permissions
where permission_code in ('assessment.take', 'assessment.view_own', 'feedback.view_own', 'profile.edit_own', 'consent.manage_own');

-- 학부모 권한
insert into public.role_permissions (user_type, permission_id)
select 'PARENT', permission_id from public.permissions
where permission_code in ('student.view_child', 'consultation.request', 'report.view_child', 'profile.edit_own', 'consent.manage_own');

-- 학교 관리자 권한
insert into public.role_permissions (user_type, permission_id)
select 'SCHOOL_ADMIN', permission_id from public.permissions
where permission_code in ('school.manage', 'class.manage', 'student.manage_school', 'user.create_school',
                          'report.view_school', 'report.print', 'profile.edit_own');

-- 진단 담당 교사 권한
insert into public.role_permissions (user_type, permission_id)
select 'ASSESSMENT_TEACHER', permission_id from public.permissions
where permission_code in ('assessment.assign', 'assessment.manage', 'feedback.create', 'feedback.manage',
                          'report.generate', 'question.match', 'assessment.view_own', 'profile.edit_own');

-- 문항 개발 교사 권한
insert into public.role_permissions (user_type, permission_id)
select 'QUESTION_DEVELOPER', permission_id from public.permissions
where permission_code in ('question.create', 'question.edit', 'question.delete', 'question.manage',
                          'book.manage', 'profile.edit_own');

-- 시스템 관리자 권한 (모든 권한)
insert into public.role_permissions (user_type, permission_id)
select 'SYSTEM_ADMIN', permission_id from public.permissions;

-- =====================================================
-- 도서 데이터
-- =====================================================
insert into public.books (title, author, publisher, published_year, isbn, category, description, cover_image_url, difficulty_level)
values
  ('동물농장', '조지 오웰', '민음사', 2003, '9788937460449', '고전문학', '권력의 부패와 전체주의를 비판한 우화 소설.', 'https://image.yes24.com/goods/9172/XL', 'MIDDLE'),
  ('어린왕자', '생텍쥐페리', '문학동네', 2015, '9788954635950', '고전문학', '사랑과 관계, 삶의 본질을 다룬 철학적 동화.', 'https://image.yes24.com/goods/24906982/XL', 'ELEMENTARY'),
  ('사피엔스', '유발 하라리', '김영사', 2015, '9788934972464', '인문학', '인류의 역사와 미래를 조망하는 통찰력 있는 책.', 'https://image.yes24.com/goods/23030284/XL', 'HIGH');

-- =====================================================
-- 주제 데이터
-- =====================================================
insert into public.topics (book_id, topic_text, topic_type, difficulty_level, keywords)
values
  (1, '동물농장에서 권력의 부패가 전개되는 과정을 분석하시오.', 'ANALYTICAL', 4, array['권력','부패','우화']),
  (2, '"진짜 중요한 것은 눈에 보이지 않아"의 의미를 설명하시오.', 'CRITICAL', 3, array['가치','관계','의미']),
  (3, '사피엔스의 핵심 요소 중 하나를 선택해 미래에 미칠 영향을 예측하시오.', 'CREATIVE', 5, array['진화','사회','미래']);

-- =====================================================
-- 평가 데이터
-- =====================================================
insert into public.assessments (student_id, topic_id, assessment_type, status, started_at, submitted_at, time_limit_minutes, word_count_min, word_count_max)
values
  (1, 1, 'ESSAY', 'EVALUATED', '2024-12-20T10:00:00Z', '2024-12-20T11:25:00Z', 90, 800, 2000),
  (1, 2, 'ESSAY', 'IN_PROGRESS', '2024-12-27T09:30:00Z', null, 90, 800, 2000),
  (1, 3, 'ESSAY', 'NOT_STARTED', null, null, 90, 800, 2000),
  (2, 1, 'ESSAY', 'EVALUATED', '2024-12-18T10:00:00Z', '2024-12-18T11:10:00Z', 90, 800, 2000),
  (3, 2, 'ESSAY', 'EVALUATED', '2024-12-17T10:00:00Z', '2024-12-17T11:05:00Z', 90, 800, 2000),
  (4, 3, 'ESSAY', 'EVALUATED', '2024-12-16T10:00:00Z', '2024-12-16T11:15:00Z', 90, 800, 2000),
  (5, 1, 'ESSAY', 'EVALUATED', '2024-12-15T10:00:00Z', '2024-12-15T11:08:00Z', 90, 800, 2000),
  (6, 2, 'ESSAY', 'EVALUATED', '2024-12-14T10:00:00Z', '2024-12-14T11:12:00Z', 90, 800, 2000),
  (7, 3, 'ESSAY', 'EVALUATED', '2024-12-13T10:00:00Z', '2024-12-13T11:02:00Z', 90, 800, 2000),
  (8, 1, 'ESSAY', 'EVALUATED', '2024-12-12T10:00:00Z', '2024-12-12T11:18:00Z', 90, 800, 2000),
  (9, 2, 'ESSAY', 'EVALUATED', '2024-12-11T10:00:00Z', '2024-12-11T11:22:00Z', 90, 800, 2000),
  (10, 3, 'ESSAY', 'EVALUATED', '2024-12-10T10:00:00Z', '2024-12-10T11:06:00Z', 90, 800, 2000);

-- =====================================================
-- 답변 데이터
-- =====================================================
insert into public.answers (assessment_id, content, word_count, char_count, paragraph_count, submitted_at, version)
values
  (1, '동물농장에서 권력이 어떻게 변화하는지 요약하고, 그 변화가 오늘날 사회에 주는 의미를 설명했습니다.', 120, 620, 3, '2024-12-20T11:20:00Z', 1),
  (4, '동물농장의 규칙 변화 과정을 통해 권력의 부패를 설명했습니다.', 110, 580, 3, '2024-12-18T11:05:00Z', 1),
  (5, '어린왕자의 메시지를 현대 생활과 연결해 의미를 정리했습니다.', 130, 700, 3, '2024-12-17T11:00:00Z', 1),
  (6, '사피엔스의 핵심 요소가 미래 사회에 미칠 영향에 대해 서술했습니다.', 140, 720, 4, '2024-12-16T11:10:00Z', 1),
  (7, '동물농장을 통해 권력의 변질을 비판했습니다.', 115, 600, 3, '2024-12-15T11:00:00Z', 1),
  (8, '어린왕자 속 관계의 의미를 사례와 함께 제시했습니다.', 125, 650, 3, '2024-12-14T11:05:00Z', 1),
  (9, '사피엔스의 기술 발전이 사회에 미칠 영향을 분석했습니다.', 150, 780, 4, '2024-12-13T10:55:00Z', 1),
  (10, '동물농장 권력 구조의 변화와 교훈을 정리했습니다.', 135, 710, 3, '2024-12-12T11:10:00Z', 1),
  (11, '어린왕자의 본질적 메시지를 개인 경험과 연결했습니다.', 145, 760, 4, '2024-12-11T11:15:00Z', 1),
  (12, '사피엔스의 핵심 요소를 미래 전망과 함께 설명했습니다.', 155, 820, 4, '2024-12-10T11:00:00Z', 1);

-- =====================================================
-- 평가 결과 데이터
-- =====================================================
insert into public.evaluations (
  answer_id, assessment_id, student_id, evaluator_type,
  book_analysis_score, creative_thinking_score, problem_solving_score, language_expression_score, expression_score,
  total_score, grade, percentile,
  spelling_errors, spacing_errors, grammar_errors, vocabulary_level,
  overall_comment, comprehensive_feedback, detailed_feedback,
  strengths, weaknesses, improvements, evaluated_at
)
values
  (1, 1, 1, 'ai', 18, 20, 16, 21, 21, 75, 'B', 65, 3, 8, 2, 3.6,
    '논제를 이해하고 핵심 내용을 정리하려는 시도가 좋습니다.',
    '전반적으로 논제 이해가 적절하며, 핵심 개념 연결이 좋습니다.',
    '근거 다양성이 부족하므로 반례나 구체 사례를 추가하면 설득력이 높아집니다.',
    array['논제 이해', '핵심 개념 연결', '기본 구조'],
    array['근거 다양성 부족', '표현력 보강 필요', '논리 전개 보강'],
    array['반례 1개 추가', '사례 2개 보강', '접속어 활용'],
    '2024-12-20T12:00:00Z'),
  (2, 4, 2, 'ai', 17, 18, 16, 20, 20, 71, 'B', 62, 2, 6, 2, 3.4,
    '핵심을 잘 요약했으나 근거가 더 필요합니다.',
    '논제 이해는 좋으나 구체 사례가 부족합니다.',
    '핵심 사례를 2개 보강하면 설득력이 높아집니다.',
    array['핵심 요약', '논제 이해'],
    array['근거 부족', '표현력 보강 필요'],
    array['사례 보강', '문장 연결 개선'],
    '2024-12-18T12:00:00Z'),
  (3, 5, 3, 'ai', 19, 21, 17, 22, 22, 79, 'B', 68, 2, 5, 1, 3.7,
    '메시지 해석이 좋고 논리 전개가 안정적입니다.',
    '논제 핵심을 잘 짚었고 근거가 비교적 충실합니다.',
    '반례를 추가하면 더 설득력 있는 글이 됩니다.',
    array['해석력', '논리 전개', '구성'],
    array['반례 부족', '표현 다양성 부족'],
    array['반례 추가', '어휘 다양화'],
    '2024-12-17T12:00:00Z'),
  (4, 6, 4, 'ai', 20, 22, 18, 23, 23, 83, 'A', 72, 1, 4, 1, 3.9,
    '미래 전망이 구체적이며 창의성이 돋보입니다.',
    '핵심 개념을 잘 활용했고 흐름이 좋습니다.',
    '근거를 한 단계 더 구체화하면 완성도가 높아집니다.',
    array['창의성', '개념 활용', '흐름'],
    array['근거 구체성 부족'],
    array['사례 구체화'],
    '2024-12-16T12:00:00Z'),
  (5, 7, 5, 'ai', 18, 19, 16, 21, 21, 74, 'B', 64, 2, 6, 2, 3.5,
    '핵심 내용 요약이 명확합니다.',
    '논제 이해가 좋으나 사례가 부족합니다.',
    '사례 2개를 보강하면 설득력이 강화됩니다.',
    array['요약력', '논제 이해'],
    array['사례 부족'],
    array['사례 보강'],
    '2024-12-15T12:00:00Z'),
  (6, 8, 6, 'ai', 19, 20, 17, 22, 22, 78, 'B', 67, 2, 5, 1, 3.7,
    '관계의 의미를 잘 정리했습니다.',
    '근거가 충실하며 구조가 명확합니다.',
    '어휘 다양성을 높이면 더 좋은 글이 됩니다.',
    array['구조', '근거 활용'],
    array['어휘 다양성 부족'],
    array['어휘 확장'],
    '2024-12-14T12:00:00Z'),
  (7, 9, 7, 'ai', 21, 22, 19, 23, 23, 85, 'A', 75, 1, 3, 1, 4.0,
    '기술 발전의 영향 분석이 뛰어납니다.',
    '창의성과 근거가 좋고 흐름이 안정적입니다.',
    '구체 사례를 추가하면 완성도가 높아집니다.',
    array['분석력', '창의성', '흐름'],
    array['사례 구체성 부족'],
    array['사례 추가'],
    '2024-12-13T12:00:00Z'),
  (8, 10, 8, 'ai', 18, 19, 17, 21, 21, 75, 'B', 66, 2, 6, 2, 3.5,
    '권력 구조 변화에 대한 이해가 좋습니다.',
    '핵심 개념 연결이 적절합니다.',
    '근거 다양성을 높이면 좋습니다.',
    array['개념 이해', '구성'],
    array['근거 다양성 부족'],
    array['반례 추가'],
    '2024-12-12T12:00:00Z'),
  (9, 11, 9, 'ai', 20, 21, 18, 22, 22, 81, 'A', 71, 1, 4, 1, 3.8,
    '본질적 메시지를 잘 연결했습니다.',
    '근거와 흐름이 안정적입니다.',
    '개인 경험을 조금 더 구체화하면 좋습니다.',
    array['해석력', '흐름'],
    array['구체성 부족'],
    array['경험 구체화'],
    '2024-12-11T12:00:00Z'),
  (10, 12, 10, 'ai', 21, 23, 20, 24, 24, 88, 'A', 78, 1, 3, 1, 4.1,
    '미래 전망이 구체적이고 설득력이 높습니다.',
    '논리 전개가 매우 안정적입니다.',
    '표현을 조금 더 간결하게 다듬으면 좋습니다.',
    array['분석력', '논리 전개', '창의성'],
    array['문장 길이 과다'],
    array['문장 간결화'],
    '2024-12-10T12:00:00Z');

-- =====================================================
-- 피드백 데이터
-- =====================================================
insert into public.feedbacks (
  evaluation_id, teacher_id, student_id, assessment_id, answer_id,
  summary_intro, summary_body, summary_conclusion,
  rubric, line_edits, strengths, weaknesses, improvements, teacher_note, feedback_status, submitted_at
)
values
  (1, 22, 1, 1, 1,
    '입장을 제시했으나 근거가 부족합니다. 주장을 더 선명하게 정리해보세요.',
    '도서 내용을 근거로 전개하려는 시도가 보입니다. 사례를 2개 이상 추가해보세요.',
    '결론의 요약은 자연스럽습니다. 다음 글에서는 개선 목표를 명시해보세요.',
    jsonb_build_array(
      jsonb_build_object('criterion','논제 충실성/입장 명료성','level','중','evidence','주장 문장이 다소 약함','next_action','첫 문장에 핵심 주장 제시'),
      jsonb_build_object('criterion','대상도서 이해/활용','level','중','evidence','도서 개념 연결이 제한적','next_action','핵심 개념 2개 추가'),
      jsonb_build_object('criterion','논거 다양성/타당성','level','하','evidence','근거 다양성 부족','next_action','반례나 사례 추가')
    ),
    jsonb_build_array(
      jsonb_build_object('original','우리시대의','suggested','우리 시대의','reason','띄어쓰기','category','띄어쓰기'),
      jsonb_build_object('original','말할수있다','suggested','말할 수 있다','reason','띄어쓰기','category','띄어쓰기')
    ),
    array['논제 이해', '기본 구조'],
    array['근거 다양성 부족', '표현력 보강 필요'],
    array['사례 2개 추가', '접속어 활용'],
    '도서 요약이 추가되면 더 정밀한 피드백이 가능합니다.',
    'COMPLETED', '2024-12-20T12:10:00Z'),
  (2, 22, 2, 4, 2,
    '요약은 명확하지만 주장이 약합니다.',
    '근거가 부족해 설득력이 낮습니다. 사례를 보강하세요.',
    '결론에 개선 목표를 명시하면 좋습니다.',
    jsonb_build_array(
      jsonb_build_object('criterion','논제 충실성/입장 명료성','level','중','evidence','주장 약함','next_action','핵심 주장 강화')
    ),
    jsonb_build_array(),
    array['요약력'],
    array['근거 부족'],
    array['사례 보강'],
    '근거 보강 후 재검토 필요.',
    'COMPLETED', '2024-12-18T12:10:00Z');

-- =====================================================
-- 진행 이력 데이터
-- =====================================================
insert into public.progress_history (
  student_id, assessment_id, total_score,
  book_analysis_score, creative_thinking_score, problem_solving_score, language_expression_score, recorded_at
)
values
  (1, 1, 75, 18, 20, 16, 21, '2024-12-20T12:00:00Z'),
  (2, 4, 71, 17, 18, 16, 20, '2024-12-18T12:00:00Z'),
  (3, 5, 79, 19, 21, 17, 22, '2024-12-17T12:00:00Z'),
  (4, 6, 83, 20, 22, 18, 23, '2024-12-16T12:00:00Z'),
  (5, 7, 74, 18, 19, 16, 21, '2024-12-15T12:00:00Z'),
  (6, 8, 78, 19, 20, 17, 22, '2024-12-14T12:00:00Z'),
  (7, 9, 85, 21, 22, 19, 23, '2024-12-13T12:00:00Z'),
  (8, 10, 75, 18, 19, 17, 21, '2024-12-12T12:00:00Z'),
  (9, 11, 81, 20, 21, 18, 22, '2024-12-11T12:00:00Z'),
  (10, 12, 88, 21, 23, 20, 24, '2024-12-10T12:00:00Z');
