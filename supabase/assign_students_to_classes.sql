-- Add class_name column if missing and assign students into 3 classes per school.
alter table public.users
  add column if not exists class_name text;

with ranked as (
  select
    user_id,
    school_id,
    row_number() over (partition by school_id order by user_id) as rn
  from public.users
  where user_type = 'STUDENT'
)
update public.users u
set class_name = concat(((ranked.rn - 1) % 3) + 1, '반')
from ranked
where u.user_id = ranked.user_id;
