-- Auto-generated diagnostic report samples
-- Source: docs/보고서 예시/*.pdf

BEGIN;

-- Ensure assessment exists
INSERT INTO public.diagnostic_assessments (title, description, grade_band, assessment_type, time_limit_minutes, created_by_user_id, status)
SELECT '2025학년도 중등 저학년 문해력 진단 평가', '중학교 1~2학년 대상 진단 평가', '중저', 'diagnostic', 60, 1, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.diagnostic_assessments WHERE title = '2025학년도 중등 저학년 문해력 진단 평가');

-- Users
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_000@readingpro.com', '강O랑', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_000@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_001@readingpro.com', '김O규', 'STUDENT', '신명중학교', 1, 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_001@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_002@readingpro.com', '김O준', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_002@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_003@readingpro.com', '김O수', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_003@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_004@readingpro.com', '김O현', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_004@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_005@readingpro.com', '김O우', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_005@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_006@readingpro.com', '김O영', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_006@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_007@readingpro.com', '김O혁', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_007@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_008@readingpro.com', '김O우', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_008@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_009@readingpro.com', '김O훈', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_009@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_010@readingpro.com', '김O람', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_010@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_011@readingpro.com', '김O영', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_011@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_012@readingpro.com', '김O윤', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_012@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_013@readingpro.com', '김O준', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_013@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_014@readingpro.com', '김O준', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_014@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_015@readingpro.com', '류O선', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_015@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_016@readingpro.com', '박O준', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_016@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_017@readingpro.com', '박O현', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_017@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_018@readingpro.com', '박O서', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_018@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_019@readingpro.com', '박O연', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_019@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_020@readingpro.com', '박O영', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_020@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_021@readingpro.com', '박O환', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_021@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_022@readingpro.com', '박O유', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_022@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_023@readingpro.com', '방O영', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_023@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_024@readingpro.com', '배O권', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_024@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_025@readingpro.com', '백O람', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_025@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_026@readingpro.com', '성O훈', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_026@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_027@readingpro.com', '성O나', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_027@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_028@readingpro.com', '소O환', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_028@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_029@readingpro.com', '신O원', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_029@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_030@readingpro.com', '신O진', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_030@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_031@readingpro.com', '신O웅', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_031@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_032@readingpro.com', '안O진', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_032@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_033@readingpro.com', '양O민', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_033@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_034@readingpro.com', '유O율', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_034@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_035@readingpro.com', '윤O혁', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_035@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_036@readingpro.com', '윤O수', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_036@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_037@readingpro.com', '이O우', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_037@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_038@readingpro.com', '이O민', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_038@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_039@readingpro.com', '이O후', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_039@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_040@readingpro.com', '이O음', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_040@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_041@readingpro.com', '이O진', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_041@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_042@readingpro.com', '이O엽', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_042@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_043@readingpro.com', '이O', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_043@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_044@readingpro.com', '이O우', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_044@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_045@readingpro.com', '이O영', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_045@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_046@readingpro.com', '임O찬', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_046@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_047@readingpro.com', '장O혜', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_047@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_048@readingpro.com', '정O음', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_048@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_049@readingpro.com', '정O현', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_049@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_050@readingpro.com', '정O나', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_050@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_051@readingpro.com', '조O형', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_051@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_052@readingpro.com', '조O광', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_052@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_053@readingpro.com', '조O봉', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_053@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_054@readingpro.com', '최O원', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_054@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_055@readingpro.com', '최O나', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_055@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_056@readingpro.com', '최O남', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_056@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_057@readingpro.com', '최O용', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_057@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_058@readingpro.com', '최O우', 'STUDENT', '신명중학교', 1, 3, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_058@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_059@readingpro.com', '표O민', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_059@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_060@readingpro.com', '함O영', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_060@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, grade, password_hash, is_active)
SELECT 'student_061@readingpro.com', '피O경', 'STUDENT', '신명중학교', 1, NULL, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'student_061@readingpro.com');

-- Parent users
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_000@readingpro.com', '강O랑 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_000@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_001@readingpro.com', '김O규 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_001@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_002@readingpro.com', '김O준 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_002@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_003@readingpro.com', '김O수 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_003@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_004@readingpro.com', '김O현 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_004@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_005@readingpro.com', '김O우 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_005@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_006@readingpro.com', '김O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_006@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_007@readingpro.com', '김O혁 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_007@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_008@readingpro.com', '김O우 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_008@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_009@readingpro.com', '김O훈 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_009@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_010@readingpro.com', '김O람 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_010@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_011@readingpro.com', '김O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_011@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_012@readingpro.com', '김O윤 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_012@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_013@readingpro.com', '김O준 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_013@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_014@readingpro.com', '김O준 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_014@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_015@readingpro.com', '류O선 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_015@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_016@readingpro.com', '박O준 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_016@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_017@readingpro.com', '박O현 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_017@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_018@readingpro.com', '박O서 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_018@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_019@readingpro.com', '박O연 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_019@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_020@readingpro.com', '박O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_020@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_021@readingpro.com', '박O환 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_021@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_022@readingpro.com', '박O유 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_022@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_023@readingpro.com', '방O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_023@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_024@readingpro.com', '배O권 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_024@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_025@readingpro.com', '백O람 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_025@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_026@readingpro.com', '성O훈 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_026@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_027@readingpro.com', '성O나 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_027@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_028@readingpro.com', '소O환 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_028@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_029@readingpro.com', '신O원 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_029@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_030@readingpro.com', '신O진 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_030@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_031@readingpro.com', '신O웅 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_031@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_032@readingpro.com', '안O진 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_032@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_033@readingpro.com', '양O민 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_033@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_034@readingpro.com', '유O율 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_034@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_035@readingpro.com', '윤O혁 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_035@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_036@readingpro.com', '윤O수 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_036@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_037@readingpro.com', '이O우 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_037@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_038@readingpro.com', '이O민 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_038@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_039@readingpro.com', '이O후 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_039@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_040@readingpro.com', '이O음 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_040@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_041@readingpro.com', '이O진 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_041@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_042@readingpro.com', '이O엽 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_042@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_043@readingpro.com', '이O 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_043@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_044@readingpro.com', '이O우 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_044@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_045@readingpro.com', '이O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_045@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_046@readingpro.com', '임O찬 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_046@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_047@readingpro.com', '장O혜 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_047@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_048@readingpro.com', '정O음 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_048@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_049@readingpro.com', '정O현 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_049@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_050@readingpro.com', '정O나 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_050@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_051@readingpro.com', '조O형 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_051@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_052@readingpro.com', '조O광 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_052@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_053@readingpro.com', '조O봉 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_053@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_054@readingpro.com', '최O원 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_054@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_055@readingpro.com', '최O나 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_055@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_056@readingpro.com', '최O남 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_056@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_057@readingpro.com', '최O용 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_057@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_058@readingpro.com', '최O우 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_058@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_059@readingpro.com', '표O민 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_059@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_060@readingpro.com', '함O영 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_060@readingpro.com');
INSERT INTO public.users (email, name, user_type, school_name, school_id, password_hash, is_active)
SELECT 'parent_061@readingpro.com', '피O경 학부모', 'PARENT', '신명중학교', 1, 'wjsrnrtoanfrufahdla$12#', true
WHERE NOT EXISTS (SELECT 1 FROM public.users WHERE email = 'parent_061@readingpro.com');

-- Student-parent relations
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_000@readingpro.com'
WHERE s.email = 'student_000@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_001@readingpro.com'
WHERE s.email = 'student_001@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_002@readingpro.com'
WHERE s.email = 'student_002@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_003@readingpro.com'
WHERE s.email = 'student_003@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_004@readingpro.com'
WHERE s.email = 'student_004@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_005@readingpro.com'
WHERE s.email = 'student_005@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_006@readingpro.com'
WHERE s.email = 'student_006@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_007@readingpro.com'
WHERE s.email = 'student_007@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_008@readingpro.com'
WHERE s.email = 'student_008@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_009@readingpro.com'
WHERE s.email = 'student_009@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_010@readingpro.com'
WHERE s.email = 'student_010@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_011@readingpro.com'
WHERE s.email = 'student_011@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_012@readingpro.com'
WHERE s.email = 'student_012@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_013@readingpro.com'
WHERE s.email = 'student_013@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_014@readingpro.com'
WHERE s.email = 'student_014@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_015@readingpro.com'
WHERE s.email = 'student_015@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_016@readingpro.com'
WHERE s.email = 'student_016@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_017@readingpro.com'
WHERE s.email = 'student_017@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_018@readingpro.com'
WHERE s.email = 'student_018@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_019@readingpro.com'
WHERE s.email = 'student_019@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_020@readingpro.com'
WHERE s.email = 'student_020@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_021@readingpro.com'
WHERE s.email = 'student_021@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_022@readingpro.com'
WHERE s.email = 'student_022@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_023@readingpro.com'
WHERE s.email = 'student_023@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_024@readingpro.com'
WHERE s.email = 'student_024@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_025@readingpro.com'
WHERE s.email = 'student_025@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_026@readingpro.com'
WHERE s.email = 'student_026@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_027@readingpro.com'
WHERE s.email = 'student_027@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_028@readingpro.com'
WHERE s.email = 'student_028@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_029@readingpro.com'
WHERE s.email = 'student_029@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_030@readingpro.com'
WHERE s.email = 'student_030@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_031@readingpro.com'
WHERE s.email = 'student_031@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_032@readingpro.com'
WHERE s.email = 'student_032@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_033@readingpro.com'
WHERE s.email = 'student_033@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_034@readingpro.com'
WHERE s.email = 'student_034@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_035@readingpro.com'
WHERE s.email = 'student_035@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_036@readingpro.com'
WHERE s.email = 'student_036@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_037@readingpro.com'
WHERE s.email = 'student_037@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_038@readingpro.com'
WHERE s.email = 'student_038@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_039@readingpro.com'
WHERE s.email = 'student_039@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_040@readingpro.com'
WHERE s.email = 'student_040@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_041@readingpro.com'
WHERE s.email = 'student_041@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_042@readingpro.com'
WHERE s.email = 'student_042@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_043@readingpro.com'
WHERE s.email = 'student_043@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_044@readingpro.com'
WHERE s.email = 'student_044@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_045@readingpro.com'
WHERE s.email = 'student_045@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_046@readingpro.com'
WHERE s.email = 'student_046@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_047@readingpro.com'
WHERE s.email = 'student_047@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_048@readingpro.com'
WHERE s.email = 'student_048@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_049@readingpro.com'
WHERE s.email = 'student_049@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_050@readingpro.com'
WHERE s.email = 'student_050@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_051@readingpro.com'
WHERE s.email = 'student_051@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_052@readingpro.com'
WHERE s.email = 'student_052@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_053@readingpro.com'
WHERE s.email = 'student_053@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_054@readingpro.com'
WHERE s.email = 'student_054@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_055@readingpro.com'
WHERE s.email = 'student_055@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_056@readingpro.com'
WHERE s.email = 'student_056@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_057@readingpro.com'
WHERE s.email = 'student_057@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_058@readingpro.com'
WHERE s.email = 'student_058@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_059@readingpro.com'
WHERE s.email = 'student_059@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_060@readingpro.com'
WHERE s.email = 'student_060@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);
INSERT INTO public.student_parent_relations (student_id, parent_id, relationship, is_primary)
SELECT s.user_id, p.user_id, 'parent', true
FROM public.users s
JOIN public.users p ON p.email = 'parent_061@readingpro.com'
WHERE s.email = 'student_061@readingpro.com'
AND NOT EXISTS (
  SELECT 1 FROM public.student_parent_relations spr
  WHERE spr.student_id = s.user_id AND spr.parent_id = p.user_id
);

-- Assessment attempts
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 14.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_000@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_001@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 0.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_002@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 66.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_003@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 50.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_004@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_005@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 50.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_006@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_007@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 50.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_008@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_009@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_010@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 0.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_011@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_012@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 71.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_013@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 67.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_014@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_015@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 50.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_016@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_017@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_018@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_019@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 0.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_020@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_021@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_022@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_023@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_024@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_025@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 76.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_026@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_027@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 40.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_028@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 23.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_029@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_030@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 7.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_031@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_032@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 33.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_033@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 62.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_034@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 9.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_035@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_036@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_037@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_038@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_039@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_040@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_041@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_042@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 14.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_043@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_044@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 1.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_045@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 23.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_046@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 78.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_047@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_048@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 50.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_049@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 5.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_050@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_051@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_052@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 0.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_053@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_054@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 0.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_055@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_056@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 75.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_057@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_058@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 57.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_059@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 100.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_060@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);
INSERT INTO public.assessment_attempts (assessment_id, student_id, status, total_score, max_score)
SELECT da.assessment_id, u.user_id, 'graded', 66.0, 100
FROM public.diagnostic_assessments da
JOIN public.users u ON u.email = 'student_061@readingpro.com'
WHERE da.title = '2025학년도 중등 저학년 문해력 진단 평가'
AND NOT EXISTS (
  SELECT 1 FROM public.assessment_attempts aa
  WHERE aa.assessment_id = da.assessment_id AND aa.student_id = u.user_id
);

-- Diagnostic reports
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 14.0, 100, 14, 'F', '[{"area_name": "이해력", "score": 19.0, "max_score": 100, "percentage": 19}, {"area_name": "의사소통 능력", "score": 9.0, "max_score": 100, "percentage": 9}, {"area_name": "심미적 감수성", "score": 6.0, "max_score": 100, "percentage": 6}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '문해력 진단 결과를 종합하면 전반적인 문해력 수준이 기대에 크게 미치지 못하는 상태입니다.', '앞서 분석한 강하랑 학생의 약점 영역들을 개선하기 위해 세부 역량별 지도 방안을 아래와 같이 제시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_000@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '김민규 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하겠습니다. 6. 문해력 향상을 위한 지도 방향 김민규 학생의 진단 결과를 바탕으로, 평가 지표 및 하위 지표별로 개선을 위한 구체적인 지도 방안을 제안드립니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_001@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 0.0, 100, 0, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '로 기대 수준에 미치지 못하는 매우 낮은 단계로 판단됩니다.', '마지막으로, 김범준 학생의 문해력 향상을 위해 이해력, 의사소통 능력, 심미적 감수성 각 영역의 하위 지표별로 구체적 인 지도 방안을 제시드립니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_002@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 66.0, 100, 66, 'D', '[{"area_name": "이해력", "score": 71.0, "max_score": 100, "percentage": 71}, {"area_name": "의사소통 능력", "score": 61.0, "max_score": 100, "percentage": 61}, {"area_name": "심미적 감수성", "score": 76.0, "max_score": 100, "percentage": 76}]'::jsonb, ARRAY['이해력','심미적 감수성'], ARRAY['의사소통 능력'], '김상수 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '김상수 학생의 문해력 향상을 위해 각 세부 역량별로 다음과 같은 지도 방안을 구체적으로 제시합니다.', NULL, ARRAY['의견 쓰기와 토론 활동 확대']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_003@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 50.0, 100, 50, 'F', '[{"area_name": "이해력", "score": 55.0, "max_score": 100, "percentage": 55}, {"area_name": "의사소통 능력", "score": 45.0, "max_score": 100, "percentage": 45}, {"area_name": "심미적 감수성", "score": 42.0, "max_score": 100, "percentage": 42}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김수현 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 따라 체계적으로 지도한다면, 학생의 전반적인 문해력 수준을 향상시키고 자신감을 높이는 데 도움이 될 것입니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_004@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 65.0, "max_score": 100, "percentage": 65}, {"area_name": "의사소통 능력", "score": 75.0, "max_score": 100, "percentage": 75}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['의사소통 능력'], ARRAY['이해력','심미적 감수성'], '김정우 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '김정우 학생의 강약점을 고려하여 이해력, 의사소통 능력, 심미적 감수성 세 영역별로 다음과 같은 지도 방향을 제시합니 다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_005@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 50.0, 100, 50, 'F', '[{"area_name": "이해력", "score": 55.0, "max_score": 100, "percentage": 55}, {"area_name": "의사소통 능력", "score": 45.0, "max_score": 100, "percentage": 45}, {"area_name": "심미적 감수성", "score": 42.0, "max_score": 100, "percentage": 42}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김주영 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '김주영 학생의 세부 역량별 강약점을 고려하여, 이해력, 의사소통능력, 심미적 감수성 각 영역의 하위 지표를 향상시키기 위한 구체적인 지도 방향은 다음과 같습니다: • 이해력 향상을 위한 지도: • 사실적 이해 능력: 꾸준한 어휘 학습과 지문 요약 연습으로 글에 제시된 정보를 빠짐없이 파악하도록 지도합니 다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_006@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 80.0, "max_score": 100, "percentage": 80}, {"area_name": "의사소통 능력", "score": 70.0, "max_score": 100, "percentage": 70}, {"area_name": "심미적 감수성", "score": 85.0, "max_score": 100, "percentage": 85}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '김주혁 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력: 추론적 이해력 향상을 위해 평소 독서 후 내용을 요약하거나 다음 전개를 예측해 보는 연습을 권장합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_007@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 50.0, 100, 50, 'F', '[{"area_name": "이해력", "score": 40.0, "max_score": 100, "percentage": 40}, {"area_name": "의사소통 능력", "score": 50.0, "max_score": 100, "percentage": 50}, {"area_name": "심미적 감수성", "score": 42.0, "max_score": 100, "percentage": 42}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김준우 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '• 이해력: ◦ 사실적 이해: 글을 읽을 때 핵심 정보를 빠짐없이 찾고 이해하는 연습을 지속합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_008@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '김지훈 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이어서 김지훈 학생의 문해력 향상을 위해 이해력, 의사소통 능력, 심미적 감수성 각 영역별로 세부 지도 방안을 제시드 립니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_009@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 10.0, "max_score": 100, "percentage": 10}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김하람 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '• 이해력: 글의 핵심 정보를 놓치지 않고 이해하는 연습과 함께, 글 속에 직접 드러나지 않은 의미를 추론해보는 습관을 기릅니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_010@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 0.0, 100, 0, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 10.0, "max_score": 100, "percentage": 10}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김하영 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력 향상: 김하영 학생의 사실적 이해 능력을 높이기 위해서는 매일 짧은 글을 읽고 중요한 정보를 찾아내는 연습이 필요합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_011@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 10.0, "max_score": 100, "percentage": 10}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '리고 질문 의도를 정확히 이해하는 능력이 뛰어나다는 것을 보여줍니다.', '을 추가로 제시하였습니다. 3. 영역별 정답률 및 종합 분석 김하윤 학생의 문해력 진단 결과를 평가 지표(대분류)별로 종합하면 다음과 같습니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_012@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 71.0, 100, 71, 'C', '[{"area_name": "이해력", "score": 76.0, "max_score": 100, "percentage": 76}, {"area_name": "의사소통 능력", "score": 66.0, "max_score": 100, "percentage": 66}, {"area_name": "심미적 감수성", "score": 63.0, "max_score": 100, "percentage": 63}]'::jsonb, ARRAY['이해력'], ARRAY['의사소통 능력','심미적 감수성'], '은 매우 우수한 수준임을 확인할 수 있었습니다.', '김하준 학생의 강점과 약점을 고려하여, 문해력 향상을 위한 세부 지도 방안을 평가 지표별 하위 영역에 따라 제시하면 다음과 같습니다.', NULL, ARRAY['의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_013@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 67.0, 100, 67, 'D', '[{"area_name": "이해력", "score": 57.0, "max_score": 100, "percentage": 57}, {"area_name": "의사소통 능력", "score": 67.0, "max_score": 100, "percentage": 67}, {"area_name": "심미적 감수성", "score": 59.0, "max_score": 100, "percentage": 59}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '김효준 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '김효준 학생의 강점은 유지하고 약점을 보완하기 위해, 세부 역량별로 맞춤 지도 방향을 제시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_014@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 62.0, "max_score": 100, "percentage": 62}, {"area_name": "의사소통 능력", "score": 52.0, "max_score": 100, "percentage": 52}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '류의선 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '제시 앞서 분석한 강점과 약점을 토대로, 류의선 학생의 문해력 향상을 위한 세부 지도 방향을 영역별로 제안하면 다음과 같 습니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_015@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 50.0, 100, 50, 'F', '[{"area_name": "이해력", "score": 55.0, "max_score": 100, "percentage": 55}, {"area_name": "의사소통 능력", "score": 45.0, "max_score": 100, "percentage": 45}, {"area_name": "심미적 감수성", "score": 42.0, "max_score": 100, "percentage": 42}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '박서준 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '위의 진단 결과를 바탕으로, 박서준 학생의 문해력 향상을 위해 세부 역량별로 다음과 같은 지도 방향을 제시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_016@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 47.0, "max_score": 100, "percentage": 47}, {"area_name": "의사소통 능력", "score": 57.0, "max_score": 100, "percentage": 57}, {"area_name": "심미적 감수성", "score": 49.0, "max_score": 100, "percentage": 49}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '박이현 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '박이현 학생의 세부 역량별 문해력 향상을 위해 각 지표와 하위 지표에 따른 맞춤 지도방향을 제시하면 다음과 같습니 다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_017@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '박준서 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하고자 합니다. 2. 주요 결과 분석 2-1. 객관식 문항 결과 박준서 학생의 객관식 문항 정답 여부와 문항별 분석은 아래 표와 같습니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_018@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 10.0, "max_score": 100, "percentage": 10}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 15.0, "max_score": 100, "percentage": 15}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '박지연 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '박지연 학생의 문해력 향상을 위해 각 세부 역량별로 다음과 같은 지도 방향을 제시합니다: • 사실적 이해: 글을 읽은 후 핵심 정보를 빠짐없이 찾아내는 연습을 시킵니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_019@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 0.0, 100, 0, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '문해력 진단 결과를 종합하면, 전반적인 문해력 수준이 기대에 미치지 못하는 상태입니다.', '마지막으로, 박지영 학생의 문해력 향상을 위해 영역별 하위 능력에 초점을 맞춘 세부 지도 방향을 제안합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_020@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 62.0, "max_score": 100, "percentage": 62}, {"area_name": "의사소통 능력", "score": 52.0, "max_score": 100, "percentage": 52}, {"area_name": "심미적 감수성", "score": 49.0, "max_score": 100, "percentage": 49}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '박지환 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '박지환 학생의 강점과 약점을 고려하여, 각 세부 역량별로 문해력 향상을 위한 맞춤 지도 방향을 제시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_021@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 80.0, "max_score": 100, "percentage": 80}, {"area_name": "의사소통 능력", "score": 70.0, "max_score": 100, "percentage": 70}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['이해력','의사소통 능력'], ARRAY['심미적 감수성'], '박찬유 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하기 위한 검사입니다. 이 검 사는 크게 이해력, 의사소통 능력, 심미적 감수성 세 가지 핵심 지표로 구성되며, 각 지표는 다시 여러 하위 영역으로 나 뉩니다.', NULL, ARRAY['문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_022@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 5.0, "max_score": 100, "percentage": 5}, {"area_name": "심미적 감수성", "score": 15.0, "max_score": 100, "percentage": 15}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '방진영 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시합니다. 2. 주요 결과 분석 2-1. 객관식 문항 분석 아래 표는 객관식 문항(총 18문항)에 대한 방진영 학생의 응답을 정답과 비교한 결과입니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_023@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 80.0, "max_score": 100, "percentage": 80}, {"area_name": "의사소통 능력", "score": 70.0, "max_score": 100, "percentage": 70}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['이해력','의사소통 능력'], ARRAY['심미적 감수성'], '배선권 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '배선권 학생의 강점을 살리면서 약점을 보완하기 위해, 문해력 세부 역량별로 다음과 같은 지도 방향을 권고드립니다.', NULL, ARRAY['문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_024@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '백가람 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '• 이해력: 글의 핵심과 세부사항을 파악하는 훈련을 위해 요약하기, 주요 어휘 및 문장 구성 파악하기 연습을 권장 합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_025@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 76.0, 100, 76, 'C+', '[{"area_name": "이해력", "score": 66.0, "max_score": 100, "percentage": 66}, {"area_name": "의사소통 능력", "score": 76.0, "max_score": 100, "percentage": 76}, {"area_name": "심미적 감수성", "score": 68.0, "max_score": 100, "percentage": 68}]'::jsonb, ARRAY['의사소통 능력'], ARRAY['이해력','심미적 감수성'], '성노훈 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '• 이해력 강화: 사실적 이해를 넘어 추론적·비판적 이해 능력을 기르기 위해, 읽은 내용에 대해 ‘왜 그런지’ 생각해 보는 습관을 지도합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_026@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 100.0, "max_score": 100, "percentage": 100}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '성유나 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '성유나 학생의 문해력 강약점을 고려하여, 세부 역량별 지도 방안을 제시합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_027@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 40.0, 100, 40, 'F', '[{"area_name": "이해력", "score": 45.0, "max_score": 100, "percentage": 45}, {"area_name": "의사소통 능력", "score": 35.0, "max_score": 100, "percentage": 35}, {"area_name": "심미적 감수성", "score": 32.0, "max_score": 100, "percentage": 32}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '소수환 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시합니다. 6. 문해력 향상을 위한 지도 방향 소수환 학생의 문해력 향상을 위해, 각 세부 역량별로 다음과 같은 지도 방안을 제안합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_028@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 23.0, 100, 23, 'F', '[{"area_name": "이해력", "score": 13.0, "max_score": 100, "percentage": 13}, {"area_name": "의사소통 능력", "score": 23.0, "max_score": 100, "percentage": 23}, {"area_name": "심미적 감수성", "score": 15.0, "max_score": 100, "percentage": 15}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '문해력 진단 결과를 종합적으로 분석하면, 전반적인 문해력 수준이 기대에 미치지 못하는 상태입니다.', '신예원 학생의 문해력 향상을 위해서는 각 세부 역량별로 목표를 설정하고 맞춤형 지도를 시행해야 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_029@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 62.0, "max_score": 100, "percentage": 62}, {"area_name": "의사소통 능력", "score": 52.0, "max_score": 100, "percentage": 52}, {"area_name": "심미적 감수성", "score": 49.0, "max_score": 100, "percentage": 49}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '신우진 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 실천함으로써, 신우진 학생이 지닌 뛰어난 잠재력과 긍정적인 독서 태도가 더욱 빛을 발하고 약점 으로 지적 된 영역도 빠르게 향상되기를 기대합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_030@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 7.0, 100, 7, 'F', '[{"area_name": "이해력", "score": 12.0, "max_score": 100, "percentage": 12}, {"area_name": "의사소통 능력", "score": 2.0, "max_score": 100, "percentage": 2}, {"area_name": "심미적 감수성", "score": 17.0, "max_score": 100, "percentage": 17}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '신지웅 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '신지웅 학생의 세부 능력별 부족한 부분을 보완하기 위해 다음과 같은 맞춤형 지도 전략을 제시합니다: • 사실적 이해: 다양한 글을 읽으며 핵심 정보 찾기 연습을 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_031@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 90.0, "max_score": 100, "percentage": 90}, {"area_name": "의사소통 능력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '안수진 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하기 위한 진단 도구입니다. 문해력은 글을 읽고 이해하며 활용하는 종합적인 능력으로, 이 평가는 이해력, 의사소통능력, 심미적 감수성의 세 가지 핵심 역량과 각 역량별 하위 지표를 측정합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_032@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 33.0, 100, 33, 'F', '[{"area_name": "이해력", "score": 38.0, "max_score": 100, "percentage": 38}, {"area_name": "의사소통 능력", "score": 28.0, "max_score": 100, "percentage": 28}, {"area_name": "심미적 감수성", "score": 25.0, "max_score": 100, "percentage": 25}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '양승민 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하겠 습니다. 6. 문해력 향상을 위한 지도 방향 양승민 학생의 강점은 유지·발전시키고 약점은 보완하기 위해, 이해력, 의사소통 능력, 심미적 감수성 각 영역 및 세부 하 위 지표별로 다음과 같은 지도 방안을 제시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_033@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 62.0, 100, 62, 'D', '[{"area_name": "이해력", "score": 67.0, "max_score": 100, "percentage": 67}, {"area_name": "의사소통 능력", "score": 57.0, "max_score": 100, "percentage": 57}, {"area_name": "심미적 감수성", "score": 54.0, "max_score": 100, "percentage": 54}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '유하율 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '문해력 향상을 위해서는 각 세부 역량별로 맞춤형 지도 전략을 적용해야 합니다: 이해력 영역 • 사실적 이해: 글을 읽은 후 주요 정보를 찾아내는 연습이 필요합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_034@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 9.0, 100, 9, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 9.0, "max_score": 100, "percentage": 9}, {"area_name": "심미적 감수성", "score": 19.0, "max_score": 100, "percentage": 19}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '윤준혁 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 마련하는 데 있습니다. 객관식 문항을 통해 각 하위 지표별 기초 이해력과 사고력 수 준을 측정하고, 서술형 문항을 통해 학생의 표현력과 사고 전개 능력을 심층 평가합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_035@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '을 보여줍니다. 특히 정보를 사실적으로 기억하고 추론적으로 해석하는 능력은 동년배 중에서도 돋보이는 강점입니다.', '을 마련 하기 위한 것입니다. 단순한 지문 이해도를 넘어, 어떤 맥락의 글이든 정확하게 파악하고 추론하며, 자신의 생각을 명확 히 전달하고 타인과 소통하는 능력, 그리고 문학 작품을 통해 정서적으로 공감하고 심미적 가치를 느끼는 감수성까지 두 루 평가합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_036@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 62.0, "max_score": 100, "percentage": 62}, {"area_name": "의사소통 능력", "score": 52.0, "max_score": 100, "percentage": 52}, {"area_name": "심미적 감수성", "score": 49.0, "max_score": 100, "percentage": 49}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '이건우 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력: 다양한 글을 읽고 핵심 정보를 정확히 파악하는 연습을 지속합니다. 글을 읽은 후 중요한 내용을 요약하거나 사 실 여부를 확인하는 질문에 답해보도록 지도하여 사실적 이해 능력을 꾸준히 유지합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_037@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 90.0, "max_score": 100, "percentage": 90}, {"area_name": "의사소통 능력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '이승민 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '위의 진단 결과를 바탕으로, 이승민 학생의 문해력을 향상시키기 위한 세부 영역별 지도 방안을 제시하면 다음과 같습니 다: 이해력 향상 지도: 학생의 사실적 이해, 추론적 이해, 비판적 이해 능력을 균형 있게 키울 수 있도록 지도합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_038@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 10.0, "max_score": 100, "percentage": 10}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 15.0, "max_score": 100, "percentage": 15}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '은 수준의 사고력과 문학적 감수성 측면에서는 약점이 발견되었습니다.', '이시후 학생의 강점을 더욱 발전시키고 약점을 보완하기 위해, 이해력, 의사소통 능력, 심미적 감수성 세 영역의 하위 지 표별로 다음과 같은 맞춤형 지도 방안을 제안드립니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_039@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '이원음 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력 분야 - 사실적 이해: 다양한 종류의 글을 읽고 핵심 정보를 빠짐없이 찾아내는 연습을 지속해야 합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_040@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 90.0, "max_score": 100, "percentage": 90}, {"area_name": "의사소통 능력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '이재진 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '앞서 분석한 결과를 토대로, 이재진 학생의 문해력 향상을 위해 각 세부 역량별로 다음과 같은 지도 방향을 제시합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_041@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '이주엽 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 구체적으로 제시합니다. 6 5. 종합 평가 및 개선점 이상에서 살펴본 이주엽 학생의 문해력 진단 결과와 독자 성향을 종합하면, 기초적인 이해력과 표현 능력은 양호하지만, 심화적인 감상 능력과 자기주도적 독서 태도가 부족한 상태라고 평가됩니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_042@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 14.0, 100, 14, 'F', '[{"area_name": "이해력", "score": 19.0, "max_score": 100, "percentage": 19}, {"area_name": "의사소통 능력", "score": 9.0, "max_score": 100, "percentage": 9}, {"area_name": "심미적 감수성", "score": 24.0, "max_score": 100, "percentage": 24}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '이준 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이준 학생의 문해력 향상을 위해 세부 역량별로 맞춤 지도 방안을 제시하면 다음과 같습니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_043@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 65.0, "max_score": 100, "percentage": 65}, {"area_name": "의사소통 능력", "score": 75.0, "max_score": 100, "percentage": 75}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['의사소통 능력'], ARRAY['이해력','심미적 감수성'], '이지우 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하는 데 있습니다. 2. 주요 결과 분석 2-1. 선택형 문항 분석 아래 표는 이지우 학생의 선택형 문항(객관식) 응답에 대한 분석입니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_044@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 1.0, 100, 1, 'F', '[{"area_name": "이해력", "score": 6.0, "max_score": 100, "percentage": 6}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '이하영 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 마련하기 위한 진단 도구입니다. 이 진단은 크게 이해력, 의사소통 능력, 심미적 감수성의 세 가지 지표로 구성되며, 각 지표는 여러 하위 영역을 통해 세 부적으로 평가됩니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_045@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 23.0, 100, 23, 'F', '[{"area_name": "이해력", "score": 28.0, "max_score": 100, "percentage": 28}, {"area_name": "의사소통 능력", "score": 18.0, "max_score": 100, "percentage": 18}, {"area_name": "심미적 감수성", "score": 15.0, "max_score": 100, "percentage": 15}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '임승찬 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력 • 사실적 이해: 글을 읽은 후 글에 나타난 정보를 정확하게 찾아내는 연습을 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_046@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 78.0, 100, 78, 'C+', '[{"area_name": "이해력", "score": 68.0, "max_score": 100, "percentage": 68}, {"area_name": "의사소통 능력", "score": 78.0, "max_score": 100, "percentage": 78}, {"area_name": "심미적 감수성", "score": 88.0, "max_score": 100, "percentage": 88}]'::jsonb, ARRAY['의사소통 능력','심미적 감수성'], ARRAY['이해력'], '장인혜 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '장인혜 학생의 문해력 향상을 위해 각 세부 역량별로 다음과 같은 지도 방향을 제안합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_047@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '정믿음 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시해드립니다. 2. 주요 결과 분석 2-1. 객관식 문항 분석 정믿음 학생의 객관식 문항 응답을 문항별로 분석한 결과는 다음과 같습니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_048@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 50.0, 100, 50, 'F', '[{"area_name": "이해력", "score": 55.0, "max_score": 100, "percentage": 55}, {"area_name": "의사소통 능력", "score": 45.0, "max_score": 100, "percentage": 45}, {"area_name": "심미적 감수성", "score": 42.0, "max_score": 100, "percentage": 42}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '정석현 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하겠습니다. 특히 이해력, 의사소통능력, 심미적 감수성의 각 하위 영역에 맞춘 전략들을 통해 학생의 전반적인 문 해력 신장을 도모하고자 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_049@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 5.0, 100, 5, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 5.0, "max_score": 100, "percentage": 5}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '문해력 진단 결과를 종합하면 다음과 같은 강점과 약점이 뚜렷이 나타납니다.', '위에서 확인된 정유나 학생의 강약점을 바탕으로, 각 영역별 하위 지표에 대한 맞춤형 지도 방안을 제안드립니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_050@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 62.0, "max_score": 100, "percentage": 62}, {"area_name": "의사소통 능력", "score": 52.0, "max_score": 100, "percentage": 52}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '조건형 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력 • 사실적 이해: 글에서 요구하는 정보를 빠짐없이 파악할 수 있도록 세부 내용을 확인하고 정리하는 연습이 필요 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_051@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '조보광 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '앞으로 조보광 학생의 문해력 향상을 위해 평가 지표별로 다음과 같은 세부 지도 전략을 제안합니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_052@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 0.0, 100, 0, 'F', '[{"area_name": "이해력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 0.0, "max_score": 100, "percentage": 0}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '조희봉 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '조희봉 학생의 문해력 향상을 위해 이해력, 의사소통능력, 심미적 감수성 세 가지 영역별로 세분화된 지도 방향을 제안 합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_053@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '최승원 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '최승원 학생의 강점은 그대로 발전시키고 약점은 체계적으로 보완하기 위해, 이해력, 의사소통 능력, 심미적 감수성 세 영역의 하위 지표별로 다음과 같은 지도 방안을 제안드립니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_054@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 0.0, 100, 0, 'F', '[{"area_name": "이해력", "score": 5.0, "max_score": 100, "percentage": 5}, {"area_name": "의사소통 능력", "score": 0.0, "max_score": 100, "percentage": 0}, {"area_name": "심미적 감수성", "score": 10.0, "max_score": 100, "percentage": 10}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '문해력 진단 결과를 종합하면 전 영역에 걸쳐 기초적인 보완이 시급한 상태입니다.', '최안나 학생의 문해력 향상을 위해 이해력, 의사소통능력, 심미적 감수성 각 영역별로 다음과 같은 세부 지도 방안을 제 시합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_055@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 90.0, "max_score": 100, "percentage": 90}, {"area_name": "의사소통 능력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '최은남 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '을 제시하고자 합니다. 2. 주요 결과 분석 2-1. 객관식 문항 분석 최은남 학생의 객관식 문항에 대한 응답을 정답과 비교한 결과는 다음과 같습니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_056@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 75.0, 100, 75, 'C+', '[{"area_name": "이해력", "score": 80.0, "max_score": 100, "percentage": 80}, {"area_name": "의사소통 능력", "score": 70.0, "max_score": 100, "percentage": 70}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['이해력','의사소통 능력'], ARRAY['심미적 감수성'], '최지용 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '앞서 파악된 강약점을 바탕으로, 최지용 학생의 문해력 향상을 위한 세부 지도 방향을 각 핵심 역량 영역별로 제시하면 다음과 같습니다.', NULL, ARRAY['문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_057@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '최현우 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '최현우 학생의 문해력 향상을 위해 영역별로 맞춤형 지도 전략을 제시하면 다음과 같습니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_058@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 57.0, 100, 57, 'F', '[{"area_name": "이해력", "score": 47.0, "max_score": 100, "percentage": 47}, {"area_name": "의사소통 능력", "score": 57.0, "max_score": 100, "percentage": 57}, {"area_name": "심미적 감수성", "score": 67.0, "max_score": 100, "percentage": 67}]'::jsonb, ARRAY['학습 태도 개선'], ARRAY['이해력','의사소통 능력','심미적 감수성'], '표승민 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '이해력 - 사실적 이해: 글에 명시된 정보를 빠짐없이 찾아내고 이해하는 연습이 필요합니다.', NULL, ARRAY['핵심 정보 찾기와 요약 연습','의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_059@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 100.0, 100, 100, 'A+', '[{"area_name": "이해력", "score": 100.0, "max_score": 100, "percentage": 100}, {"area_name": "의사소통 능력", "score": 95.0, "max_score": 100, "percentage": 95}, {"area_name": "심미적 감수성", "score": 92.0, "max_score": 100, "percentage": 92}]'::jsonb, ARRAY['이해력','의사소통 능력','심미적 감수성'], ARRAY['심화 학습'], '함성영 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '앞서 파악된 강약점을 바탕으로, 함성영 학생의 문해력 향상을 위해 세부 역량별 지도 방안을 제시하면 다음과 같습니 다: • 이해력 향상 지도 방향: • 사실적 이해: 글을 읽은 후 주요 정보를 빠짐없이 찾아 정리하는 연습을 지속적으로 시킵니다.', NULL, ARRAY['고난도 지문 분석']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_060@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);
INSERT INTO public.diagnostic_reports (attempt_id, student_id, assessment_id, total_score, max_score, percentage, grade, area_scores, strengths, weaknesses, comprehensive_feedback, detailed_feedback, recommended_books, improvement_suggestions)
SELECT aa.attempt_id, aa.student_id, aa.assessment_id, 66.0, 100, 66, 'D', '[{"area_name": "이해력", "score": 71.0, "max_score": 100, "percentage": 71}, {"area_name": "의사소통 능력", "score": 61.0, "max_score": 100, "percentage": 61}, {"area_name": "심미적 감수성", "score": 58.0, "max_score": 100, "percentage": 58}]'::jsonb, ARRAY['이해력'], ARRAY['의사소통 능력','심미적 감수성'], '피채경 학생의 문해력 진단 결과를 종합하면 전반적인 이해와 표현 능력의 균형을 점검할 필요가 있습니다.', '피채경 학생의 문해력 향상을 위해 영역별로 다음과 같은 지도 방안을 제시합니다.', NULL, ARRAY['의견 쓰기와 토론 활동 확대','문학 작품 감상 및 표현 연습']
FROM public.assessment_attempts aa
JOIN public.users u ON u.user_id = aa.student_id
WHERE u.email = 'student_061@readingpro.com'
AND NOT EXISTS (SELECT 1 FROM public.diagnostic_reports dr WHERE dr.attempt_id = aa.attempt_id);

COMMIT;
