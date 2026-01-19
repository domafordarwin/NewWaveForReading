-- authoring_items 테이블에 stimulus_id 컬럼 추가
-- 문항과 지문 간의 직접적인 연결을 위함

-- stimulus_id 컬럼 추가 (없으면)
alter table public.authoring_items
  add column if not exists stimulus_id bigint references public.stimuli(stimulus_id) on delete set null;

-- 인덱스 추가
create index if not exists idx_authoring_items_stimulus on public.authoring_items(stimulus_id);

-- 기존 데이터 마이그레이션: content_json에서 stimulus_id 추출하여 업데이트
update public.authoring_items ai
set stimulus_id = (
  select (aiv.content_json->>'stimulus_id')::bigint
  from public.authoring_item_versions aiv
  where aiv.version_id = ai.current_version_id
    and aiv.content_json->>'stimulus_id' is not null
)
where ai.stimulus_id is null
  and ai.current_version_id is not null;
