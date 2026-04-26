-- Production template storage: metadata in Postgres, files in Storage.
-- Apply via `supabase db push` or paste into Supabase SQL editor.

-- =========================================================================
-- 1. Tables
-- =========================================================================

create table if not exists public.templates (
    id              text primary key,
    name            text not null,
    description     text not null,
    category        text,
    tags            text[] default '{}'::text[],
    author          text,
    latest_version  int not null default 1,
    is_active       bool not null default true,
    is_featured     bool not null default false,
    is_premium      bool not null default false,
    display_order   int not null default 100,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table if not exists public.template_versions (
    template_id     text not null references public.templates(id) on delete cascade,
    version         int not null,
    tex_path        text not null,
    preview_path    text not null,
    thumbnail_path  text not null,
    checksum        text not null,
    changelog       text,
    created_at      timestamptz not null default now(),
    primary key (template_id, version)
);

create index if not exists idx_templates_active_order
    on public.templates (is_active, display_order);

create index if not exists idx_template_versions_template_id
    on public.template_versions (template_id);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
    new.updated_at := now();
    return new;
end;
$$;

drop trigger if exists trg_templates_updated_at on public.templates;
create trigger trg_templates_updated_at
    before update on public.templates
    for each row execute function public.set_updated_at();

-- =========================================================================
-- 2. Row-Level Security
-- =========================================================================

alter table public.templates enable row level security;
alter table public.template_versions enable row level security;

-- Public read of active templates for anon + authenticated
drop policy if exists "templates_read_active" on public.templates;
create policy "templates_read_active"
    on public.templates
    for select
    to anon, authenticated
    using (is_active = true);

-- Read versions for active templates
drop policy if exists "template_versions_read_active" on public.template_versions;
create policy "template_versions_read_active"
    on public.template_versions
    for select
    to anon, authenticated
    using (
        exists (
            select 1 from public.templates t
            where t.id = template_versions.template_id
              and t.is_active = true
        )
    );

-- Service role bypasses RLS automatically; no explicit write policy needed.

-- =========================================================================
-- 3. Storage bucket + policies
-- =========================================================================

insert into storage.buckets (id, name, public)
    values ('templates', 'templates', true)
    on conflict (id) do update set public = excluded.public;

-- Public read of objects in the templates bucket
drop policy if exists "templates_bucket_public_read" on storage.objects;
create policy "templates_bucket_public_read"
    on storage.objects
    for select
    to anon, authenticated
    using (bucket_id = 'templates');

-- Writes to the bucket are service-role only (no policy for anon/authenticated).
