-- Retry: correct quoting in DO blocks for policy creation
-- 1) Timestamp helper
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer set search_path = public;

-- 2) Feature flags table
create table if not exists public.feature_flags (
  id bigserial primary key,
  key text not null unique,
  description text,
  enabled boolean not null default false,
  rollout integer not null default 100,
  payload jsonb not null default '{}'::jsonb,
  start_at timestamptz,
  end_at timestamptz,
  created_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rollout_percent_check check (rollout >= 0 and rollout <= 100)
);

-- 3) Enable RLS
alter table public.feature_flags enable row level security;

-- 4) RLS policies via DO blocks with proper quoting
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'feature_flags' AND polname = 'Feature flags are viewable by everyone'
  ) THEN
    EXECUTE 'create policy "Feature flags are viewable by everyone" on public.feature_flags for select using (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'feature_flags' AND polname = 'Authenticated users can insert feature flags'
  ) THEN
    EXECUTE 'create policy "Authenticated users can insert feature flags" on public.feature_flags for insert to authenticated with check (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'feature_flags' AND polname = 'Authenticated users can update feature flags'
  ) THEN
    EXECUTE 'create policy "Authenticated users can update feature flags" on public.feature_flags for update to authenticated using (true) with check (true)';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' AND tablename = 'feature_flags' AND polname = 'Authenticated users can delete feature flags'
  ) THEN
    EXECUTE 'create policy "Authenticated users can delete feature flags" on public.feature_flags for delete to authenticated using (true)';
  END IF;
END$$;

-- 5) Trigger for updated_at (recreate safely)
drop trigger if exists update_feature_flags_updated_at on public.feature_flags;
create trigger update_feature_flags_updated_at
before update on public.feature_flags
for each row execute function public.update_updated_at_column();

-- 6) Seed initial Bit flags (safe upsert)
insert into public.feature_flags (key, description, enabled, rollout, payload)
values
  ('bit_1_hero', 'Enable High-Impact Home Hero', false, 100, '{}'::jsonb),
  ('bit_2_plp', 'Enable Product Cards & PLP', false, 100, '{}'::jsonb),
  ('bit_3_pdp', 'Enable Product Detail Page enhancements', false, 100, '{}'::jsonb),
  ('bit_4_fomo', 'Enable FOMO & Urgency System', false, 100, '{}'::jsonb),
  ('bit_5_capture', 'Enable Email/SMS capture funnel', false, 100, '{}'::jsonb),
  ('bit_6_checkout', 'Enable Checkout & Payments', false, 100, '{}'::jsonb)
on conflict (key) do update set
  description = excluded.description,
  rollout = excluded.rollout;