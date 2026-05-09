create extension if not exists "pgcrypto";

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  name text,
  role text default 'user',
  status text default 'inactive',
  plan text default 'free',
  active_device_id text,
  device_changed_at timestamp with time zone,
  activated_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

create table if not exists chapters (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  chapter_order integer not null,
  created_at timestamp with time zone default now()
);

create table if not exists videos (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid references chapters(id) on delete cascade,
  title text not null,
  description text,
  youtube_video_id text not null,
  video_order integer not null,
  is_sample boolean default false,
  created_at timestamp with time zone default now()
);

create table if not exists payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  amount integer not null,
  screenshot_url text not null,
  status text default 'pending',
  admin_note text,
  created_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

alter table profiles enable row level security;
alter table chapters enable row level security;
alter table videos enable row level security;
alter table payment_requests enable row level security;

create policy "read own profile" on profiles for select using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "update own profile" on profiles for update using (auth.uid() = id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "insert own profile" on profiles for insert with check (auth.uid() = id);

create policy "chapters readable" on chapters for select using (true);
create policy "chapters admin write" on chapters for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "videos readable" on videos for select using (true);
create policy "videos admin write" on videos for all using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

create policy "payment own read" on payment_requests for select using (auth.uid() = user_id or exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));
create policy "payment own insert" on payment_requests for insert with check (auth.uid() = user_id);
create policy "payment admin update" on payment_requests for update using (exists (select 1 from profiles p where p.id = auth.uid() and p.role = 'admin'));

-- Run this after your first admin account is registered. Replace email.
-- update profiles set role = 'admin', status = 'active', plan = 'premium' where email = 'your-email@example.com';
