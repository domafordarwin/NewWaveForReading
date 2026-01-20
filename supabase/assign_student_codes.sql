-- Backfill school_code and student_code for existing users.
update public.users
set school_code = public.school_code_from_name(school_name)
where school_name is not null
  and (school_code is null or school_code = '');

update public.users
set school_code = 'SMJ'
where school_name = '신명중학교';

update public.users
set student_code = public.generate_student_code(school_code)
where user_type = 'STUDENT'
  and (student_code is null or student_code = '');

update public.users
set student_code = public.generate_student_code('SMJ')
where user_type = 'STUDENT'
  and school_name = '신명중학교'
  and (student_code is null or student_code = '' or student_code not like 'SMJ_%');
