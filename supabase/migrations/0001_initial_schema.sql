-- ============================================================
-- Suffa IT Academy — Initial Schema
-- ============================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================
create type user_role as enum ('student', 'admin');
create type course_status as enum ('available', 'coming_soon', 'archived');
create type enrollment_status as enum ('active', 'revoked', 'expired');
create type payment_status as enum ('pending', 'success', 'failed', 'cancelled', 'refunded');
create type payment_gateway as enum ('uzumpay', 'payme', 'paynet', 'click');

-- ============================================================
-- PROFILES  (extends auth.users 1-to-1)
-- ============================================================
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  phone       text,
  full_name   text,
  avatar_url  text,
  role        user_role not null default 'student',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- COURSES
-- ============================================================
create table courses (
  id          uuid primary key default uuid_generate_v4(),
  slug        text not null unique,
  title       text not null,
  description text,
  thumbnail   text,
  status      course_status not null default 'coming_soon',
  -- price stored in tiyin (1 UZS = 100 tiyin); null means "contact us"
  price_tiyin bigint,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- MODULES
-- ============================================================
create table modules (
  id          uuid primary key default uuid_generate_v4(),
  course_id   uuid not null references courses(id) on delete cascade,
  title       text not null,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- LESSONS
-- ============================================================
create table lessons (
  id              uuid primary key default uuid_generate_v4(),
  module_id       uuid not null references modules(id) on delete cascade,
  course_id       uuid not null references courses(id) on delete cascade,
  title           text not null,
  description     text,
  -- Mux asset / playback IDs — never exposed publicly
  mux_asset_id    text,
  mux_playback_id text,
  duration_sec    int,
  sort_order      int not null default 0,
  is_preview      boolean not null default false,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- ENROLLMENTS
-- ============================================================
create table enrollments (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references courses(id) on delete cascade,
  status      enrollment_status not null default 'active',
  -- null = paid via gateway; non-null = manual grant by admin
  granted_by  uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id, course_id)
);

-- ============================================================
-- PAYMENTS
-- ============================================================
create table payments (
  id             uuid primary key default uuid_generate_v4(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  course_id      uuid not null references courses(id) on delete cascade,
  gateway        payment_gateway not null,
  status         payment_status not null default 'pending',
  amount_tiyin   bigint not null,
  transaction_id text not null,
  raw_payload    jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  -- idempotency: one transaction per gateway
  unique(gateway, transaction_id)
);

-- ============================================================
-- MANUAL GRANTS (audit log for cash payments)
-- ============================================================
create table manual_grants (
  id          uuid primary key default uuid_generate_v4(),
  admin_id    uuid not null references auth.users(id) on delete cascade,
  student_id  uuid not null references auth.users(id) on delete cascade,
  course_id   uuid not null references courses(id) on delete cascade,
  note        text,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- LESSON PROGRESS
-- ============================================================
create table lesson_progress (
  id              uuid primary key default uuid_generate_v4(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  lesson_id       uuid not null references lessons(id) on delete cascade,
  course_id       uuid not null references courses(id) on delete cascade,
  watched_sec     int not null default 0,
  completed       boolean not null default false,
  last_watched_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);

-- ============================================================
-- INDEXES
-- ============================================================
create index on enrollments(user_id);
create index on enrollments(course_id);
create index on payments(user_id);
create index on payments(course_id);
create index on payments(status);
create index on lesson_progress(user_id, course_id);
create index on modules(course_id, sort_order);
create index on lessons(module_id, sort_order);
create index on lessons(course_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_profiles_updated_at before update on profiles
  for each row execute procedure handle_updated_at();
create trigger trg_courses_updated_at before update on courses
  for each row execute procedure handle_updated_at();
create trigger trg_enrollments_updated_at before update on enrollments
  for each row execute procedure handle_updated_at();
create trigger trg_payments_updated_at before update on payments
  for each row execute procedure handle_updated_at();

-- ============================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table profiles enable row level security;
alter table courses enable row level security;
alter table modules enable row level security;
alter table lessons enable row level security;
alter table enrollments enable row level security;
alter table payments enable row level security;
alter table manual_grants enable row level security;
alter table lesson_progress enable row level security;

-- Helper: is current user admin?
create or replace function is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Helper: has active enrollment?
create or replace function has_enrollment(p_course_id uuid)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from enrollments
    where user_id = auth.uid()
      and course_id = p_course_id
      and status = 'active'
  );
$$;

-- profiles: users see own; admins see all
create policy "profiles_select_own" on profiles for select
  using (auth.uid() = id or is_admin());
create policy "profiles_update_own" on profiles for update
  using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles_admin_all" on profiles for all
  using (is_admin());

-- courses: public read
create policy "courses_public_read" on courses for select using (true);
create policy "courses_admin_write" on courses for all using (is_admin());

-- modules: public read
create policy "modules_public_read" on modules for select using (true);
create policy "modules_admin_write" on modules for all using (is_admin());

-- lessons: enrolled users and admins can select
create policy "lessons_enrolled_or_preview" on lessons for select
  using (
    is_preview = true
    or has_enrollment(course_id)
    or is_admin()
  );
create policy "lessons_admin_write" on lessons for all using (is_admin());

-- enrollments
create policy "enrollments_own" on enrollments for select
  using (auth.uid() = user_id or is_admin());
create policy "enrollments_admin_write" on enrollments for all
  using (is_admin());

-- payments
create policy "payments_own" on payments for select
  using (auth.uid() = user_id or is_admin());
create policy "payments_service_insert" on payments for insert
  with check (true); -- service role inserts from webhook handler

-- manual_grants: admins only
create policy "manual_grants_admin" on manual_grants for all
  using (is_admin());

-- lesson_progress
create policy "progress_own" on lesson_progress for all
  using (auth.uid() = user_id);
create policy "progress_admin_read" on lesson_progress for select
  using (is_admin());
