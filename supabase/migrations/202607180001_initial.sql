create extension if not exists citext;

create table if not exists public.inscriptions_diffgroup (
  id uuid primary key default gen_random_uuid(),
  first_name text not null check (char_length(first_name) between 2 and 80),
  last_name text not null check (char_length(last_name) between 2 and 80),
  whatsapp text not null,
  email citext not null unique,
  job_title text not null,
  company text not null,
  consented_at timestamptz not null,
  reservation_code text not null unique,
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed')),
  email_sent_at timestamptz,
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inscriptions_diffgroup_created_at_idx on public.inscriptions_diffgroup (created_at desc);
create index if not exists inscriptions_diffgroup_email_status_idx on public.inscriptions_diffgroup (email_status);

create table if not exists public.parametres_diffgroup (
  id smallint primary key check (id = 1),
  registration_open boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.parametres_diffgroup (id, registration_open)
values (1, true)
on conflict (id) do nothing;

alter table public.inscriptions_diffgroup enable row level security;
alter table public.parametres_diffgroup enable row level security;

revoke all on public.inscriptions_diffgroup from anon, authenticated;
revoke all on public.parametres_diffgroup from anon, authenticated;
