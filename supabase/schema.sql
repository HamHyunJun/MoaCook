-- MoaCook Supabase 스키마
-- Supabase 대시보드 > SQL Editor에서 한 번 실행한다. (여러 번 실행해도 안전)
-- 앱 서버는 service role 키로 접근하므로, 브라우저(anon 키)에서는 테이블에 직접 접근할 수 없도록 RLS만 켜 둔다.

-- 레시피
create table if not exists public.recipes (
  id text primary key,
  name text not null,
  image text not null,
  description text not null,
  category text not null,
  difficulty smallint not null check (difficulty between 1 and 3),
  cooking_time integer not null check (cooking_time > 0),
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  youtube_query text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists recipes_created_at_idx on public.recipes (created_at);

-- 카테고리 목록 (카테고리를 추가하면 여기와 shared/types/recipe.ts를 함께 고치고 이 파일을 다시 실행한다)
alter table public.recipes drop constraint if exists recipes_category_check;
-- 목록에서 빠진 카테고리를 쓰던 레시피는 한식으로 옮긴다 (초기 레시피는 서버가 먼저 알맞은 카테고리로 옮겨 둔다)
update public.recipes set category = '한식'
  where category not in ('한식', '중식', '일식', '양식', '비건');
alter table public.recipes add constraint recipes_category_check
  check (category in ('한식', '중식', '일식', '양식', '비건'));

-- 앱 설정 (초기 레시피 데이터 버전 등)
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null
);

alter table public.recipes enable row level security;
alter table public.app_settings enable row level security;

-- 레시피 사진 버킷 (누구나 볼 수 있고, 업로드는 앱 서버만)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('recipe-images', 'recipe-images', true, 4194304, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do nothing;
