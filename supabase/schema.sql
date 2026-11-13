-- Run once in the Supabase SQL editor.
create table recipes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ingredients text not null, -- one per line
  steps text not null, -- one per line
  prep_minutes int,
  cook_minutes int,
  servings text,
  tags text[] not null default '{}',
  instagram_url text,
  photos text[] not null default '{}',
  favorite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table recipes enable row level security;
create policy "anyone reads" on recipes for select using (true);
-- Every signed-in user can write, so public signups must stay disabled in Auth settings.
create policy "signed-in writes" on recipes for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('photos', 'photos', true);
create policy "signed-in uploads" on storage.objects for insert to authenticated with check (bucket_id = 'photos');
