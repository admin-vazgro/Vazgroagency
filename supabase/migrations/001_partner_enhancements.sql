-- ============================================================
-- MIGRATION 001 — PARTNER PROGRAMME ENHANCEMENTS
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Partner self-service applications table
-- ─────────────────────────────────────────────────────────────
create table if not exists partner_applications (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  company_name text,
  website text,
  linkedin_url text,
  description text,          -- how they plan to bring clients
  how_heard text,            -- how they found the programme
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  reviewed_by uuid references profiles(id),
  reviewed_at timestamptz,
  rejection_reason text,
  created_at timestamptz default now()
);

-- Allow anonymous inserts (public application form)
alter table partner_applications enable row level security;

create policy "Anyone can submit a partner application"
  on partner_applications for insert to anon, authenticated
  with check (true);

create policy "Hub staff can view and update applications"
  on partner_applications for all to authenticated
  using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'ops', 'sales_manager', 'internal_sales')
    )
  );

-- 2. Add estimated value and services to leads
-- ─────────────────────────────────────────────────────────────
alter table leads add column if not exists estimated_value_gbp numeric(10,2);
alter table leads add column if not exists services_interested text[] default '{}';

-- 3. Tier auto-sync trigger: update partners.tier when a deal closes
-- ─────────────────────────────────────────────────────────────
create or replace function sync_partner_tier_on_deal_close()
returns trigger as $$
begin
  -- Only fire when transitioning TO closed_won
  if new.stage = 'closed_won' and (old.stage is distinct from 'closed_won') then
    -- Update closer's tier
    if new.partner_id is not null then
      update partners
      set tier = get_partner_tier(new.partner_id),
          updated_at = now()
      where id = new.partner_id;
    end if;
    -- Update referrer's tier (if different)
    if new.referrer_id is not null and new.referrer_id is distinct from new.partner_id then
      update partners
      set tier = get_partner_tier(new.referrer_id),
          updated_at = now()
      where id = new.referrer_id;
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- Drop before recreate to avoid conflicts on re-run
drop trigger if exists trg_sync_partner_tier on deals;
create trigger trg_sync_partner_tier
  after update on deals
  for each row execute function sync_partner_tier_on_deal_close();

-- 4. RLS: allow anon to insert into partner_applications via service role
-- ─────────────────────────────────────────────────────────────
-- (The server action uses the admin/service-role client, so RLS is bypassed.
--  The policies above are for read-access by hub staff via user sessions.)
