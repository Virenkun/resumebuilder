-- User profiles + resumes in Postgres, artifacts in Storage.
-- Apply via `supabase db push` or paste into Supabase SQL editor.

-- =========================================================================
-- 1. Enums
-- =========================================================================

do $$ begin
    create type public.experience_level as enum
        ('student', 'entry', 'mid', 'senior', 'lead', 'executive');
exception when duplicate_object then null; end $$;

do $$ begin
    create type public.primary_goal as enum
        ('first_job', 'new_job', 'career_switch', 'promotion', 'freelance', 'exploring');
exception when duplicate_object then null; end $$;

-- =========================================================================
-- 2. Tables
-- =========================================================================

create table if not exists public.user_profiles (
    user_id                 uuid primary key references auth.users(id) on delete cascade,
    full_name               text,
    target_role             text,
    experience_level        public.experience_level,
    years_experience        int check (years_experience is null
                                       or (years_experience between 0 and 60)),
    industry                text,
    primary_goal            public.primary_goal,
    skills                  text[] not null default '{}'::text[],
    onboarding_resume_id    uuid,
    onboarding_completed    bool not null default false,
    onboarding_completed_at timestamptz,
    created_at              timestamptz not null default now(),
    updated_at              timestamptz not null default now()
);

create index if not exists idx_user_profiles_onboarding
    on public.user_profiles (onboarding_completed);

create table if not exists public.resumes (
    id              uuid primary key,
    user_id         uuid not null references auth.users(id) on delete cascade,
    name            text,
    template        text not null default 'jakes_resume',
    ats_score       numeric,
    target_jd       text,
    data            jsonb not null,
    last_modified   timestamptz not null default now(),
    created_at      timestamptz not null default now()
);

create index if not exists idx_resumes_user
    on public.resumes (user_id, last_modified desc);

-- Loose FK now that both tables exist.
do $$ begin
    alter table public.user_profiles
        add constraint user_profiles_onboarding_resume_fk
        foreign key (onboarding_resume_id)
        references public.resumes(id) on delete set null;
exception when duplicate_object then null; end $$;

-- =========================================================================
-- 3. Triggers
-- =========================================================================

-- updated_at on user_profiles (reuses public.set_updated_at from 0001)
drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
    before update on public.user_profiles
    for each row execute function public.set_updated_at();

-- last_modified on resumes
create or replace function public.set_last_modified()
returns trigger
language plpgsql
as $$
begin
    new.last_modified := now();
    return new;
end;
$$;

drop trigger if exists trg_resumes_last_modified on public.resumes;
create trigger trg_resumes_last_modified
    before update on public.resumes
    for each row execute function public.set_last_modified();

-- Auto-create user_profiles row on new auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    insert into public.user_profiles (user_id, full_name)
    values (new.id, new.raw_user_meta_data ->> 'full_name')
    on conflict (user_id) do nothing;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- Backfill pre-existing users (they will be routed to /welcome on next login)
insert into public.user_profiles (user_id, full_name)
select id, raw_user_meta_data ->> 'full_name'
from auth.users
on conflict (user_id) do nothing;

-- =========================================================================
-- 4. Row-Level Security
-- =========================================================================

alter table public.user_profiles enable row level security;

drop policy if exists "user_profiles_select_own" on public.user_profiles;
create policy "user_profiles_select_own"
    on public.user_profiles for select
    to authenticated using (auth.uid() = user_id);

drop policy if exists "user_profiles_insert_own" on public.user_profiles;
create policy "user_profiles_insert_own"
    on public.user_profiles for insert
    to authenticated with check (auth.uid() = user_id);

drop policy if exists "user_profiles_update_own" on public.user_profiles;
create policy "user_profiles_update_own"
    on public.user_profiles for update
    to authenticated using (auth.uid() = user_id)
                      with check (auth.uid() = user_id);

alter table public.resumes enable row level security;

drop policy if exists "resumes_select_own" on public.resumes;
create policy "resumes_select_own"
    on public.resumes for select
    to authenticated using (auth.uid() = user_id);

drop policy if exists "resumes_insert_own" on public.resumes;
create policy "resumes_insert_own"
    on public.resumes for insert
    to authenticated with check (auth.uid() = user_id);

drop policy if exists "resumes_update_own" on public.resumes;
create policy "resumes_update_own"
    on public.resumes for update
    to authenticated using (auth.uid() = user_id)
                      with check (auth.uid() = user_id);

drop policy if exists "resumes_delete_own" on public.resumes;
create policy "resumes_delete_own"
    on public.resumes for delete
    to authenticated using (auth.uid() = user_id);

-- =========================================================================
-- 5. Storage bucket for binary resume artifacts (PDF / TEX / original)
-- =========================================================================

insert into storage.buckets (id, name, public)
    values ('resume-artifacts', 'resume-artifacts', false)
    on conflict (id) do nothing;

-- Users can read only their own objects. Layout: `{user_id}/{resume_id}/...`.
drop policy if exists "resume_artifacts_select_own" on storage.objects;
create policy "resume_artifacts_select_own"
    on storage.objects for select
    to authenticated
    using (bucket_id = 'resume-artifacts'
           and (storage.foldername(name))[1] = auth.uid()::text);

-- Writes/deletes are service-role only (no policy for anon/authenticated).
