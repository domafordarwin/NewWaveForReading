-- Backfill student_code for existing relations.
update public.student_parent_relations spr
set student_code = u.student_code
from public.users u
where spr.student_id = u.user_id
  and (spr.student_code is null or spr.student_code = '');
