-- ============================================================
-- VAZGRO INTERNAL SYSTEMS — DATABASE SCHEMA
-- ============================================================

-- Extensions
create extension if not exists "uuid-ossp";

-- ─── ENUMS ────────────────────────────────────────────────

create type user_role as enum ('client', 'partner', 'internal_sales', 'sales_manager', 'delivery', 'ops', 'admin');
create type service_pillar as enum ('LAUNCH', 'GROW', 'BUILD');
create type lead_stage as enum ('new', 'contacted', 'qualified', 'proposal_sent', 'negotiating', 'closed_won', 'closed_lost', 'recycled');
create type deal_stage as enum ('discovery', 'proposal', 'negotiating', 'closed_won', 'closed_lost');
create type engagement_status as enum ('active', 'paused', 'completed', 'cancelled');
create type commission_status as enum ('pending', 'approved', 'paid', 'reversed');
create type partner_tier as enum ('tier1', 'tier2', 'tier3', 'white_label');
create type invoice_status as enum ('draft', 'sent', 'paid', 'overdue', 'refunded');
create type request_status as enum ('submitted', 'in_review', 'in_progress', 'delivered', 'approved', 'revision_requested');
create type currency_code as enum ('GBP', 'EUR', 'USD', 'INR', 'AED');

-- ─── PROFILES ─────────────────────────────────────────────
-- Extends auth.users

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'client',
  first_name text,
  last_name text,
  email text not null,
  phone text,
  company text,
  avatar_url text,
  timezone text default 'Europe/London',
  notification_email boolean default true,
  notification_slack boolean default false,
  slack_user_id text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── ACCOUNTS (CLIENT COMPANIES) ──────────────────────────

create table accounts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  website text,
  industry text,
  country text default 'GB',
  currency currency_code default 'GBP',
  stripe_customer_id text unique,
  mrr_gbp numeric(10,2) default 0,
  ltv_gbp numeric(10,2) default 0,
  health_score integer check (health_score between 0 and 100),
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Account members (clients linked to an account)
create table account_members (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  is_primary boolean default false,
  created_at timestamptz default now(),
  unique(account_id, profile_id)
);

-- ─── PARTNERS ─────────────────────────────────────────────

create table partners (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid references profiles(id) on delete cascade,
  tier partner_tier default 'tier1',
  status text default 'active' check (status in ('pending', 'active', 'suspended', 'rejected')),
  type text default 'referral' check (type in ('referral', 'commission_sdr', 'white_label')),
  company_name text,
  kyc_verified boolean default false,
  stripe_account_id text, -- Stripe Connect
  bank_details jsonb,
  tax_form_url text,
  concurrent_leads_cap integer default 10,
  open_leads_count integer default 0,
  total_closed_gbp numeric(10,2) default 0,
  approved_at timestamptz,
  suspended_at timestamptz,
  suspension_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Partner audit log
create table partner_audit_log (
  id uuid primary key default uuid_generate_v4(),
  partner_id uuid references partners(id),
  action text not null,
  performed_by uuid references profiles(id),
  metadata jsonb,
  created_at timestamptz default now()
);

-- ─── LEADS ────────────────────────────────────────────────

create table leads (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text,
  email text not null,
  phone text,
  company text,
  website text,
  country text,
  pillar service_pillar,
  stage lead_stage default 'new',
  source text, -- website, partner_referral, cold_outreach, inbound_email, etc.
  owner_id uuid references profiles(id), -- assigned rep
  partner_id uuid references partners(id), -- attribution (permanent)
  referrer_id uuid references partners(id), -- referrer attribution
  notes text,
  sla_contacted_deadline timestamptz, -- first-touch 24h SLA
  sla_qualified_deadline timestamptz, -- qualified within 5 working days
  last_activity_at timestamptz,
  stale_warning_sent_at timestamptz,
  recycled_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── DEALS ────────────────────────────────────────────────

create table deals (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id),
  account_id uuid references accounts(id),
  pillar service_pillar not null,
  stage deal_stage default 'discovery',
  title text not null,
  value_gbp numeric(10,2),
  currency currency_code default 'GBP',
  value_local numeric(10,2),
  closer_id uuid references profiles(id), -- who closed it
  partner_id uuid references partners(id), -- closer partner attribution
  referrer_id uuid references partners(id), -- referrer attribution
  owner_id uuid references profiles(id), -- internal owner
  closed_at timestamptz,
  last_activity_at timestamptz,
  stale_warning_sent_at timestamptz,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── ENGAGEMENTS ──────────────────────────────────────────

create table engagements (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id),
  deal_id uuid references deals(id),
  pillar service_pillar not null,
  title text not null,
  status engagement_status default 'active',
  pm_id uuid references profiles(id), -- dedicated PM
  brief text,
  current_milestone text,
  next_milestone text,
  start_date date,
  end_date date,
  stripe_subscription_id text, -- for GROW
  monthly_value_gbp numeric(10,2),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Engagement team members
create table engagement_team (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references engagements(id) on delete cascade,
  profile_id uuid references profiles(id),
  role text, -- PM, Designer, Developer, etc.
  created_at timestamptz default now()
);

-- ─── MILESTONES ───────────────────────────────────────────

create table milestones (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references engagements(id) on delete cascade,
  title text not null,
  description text,
  due_date date,
  completed_at timestamptz,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- ─── REQUESTS (KANBAN) ────────────────────────────────────

create table requests (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references engagements(id) on delete cascade,
  account_id uuid references accounts(id),
  submitted_by uuid references profiles(id),
  assigned_to uuid references profiles(id),
  title text not null,
  description text,
  priority text default 'normal' check (priority in ('low', 'normal', 'high', 'urgent')),
  status request_status default 'submitted',
  revision_notes text,
  delivered_at timestamptz,
  approved_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── FILES / DELIVERABLES ─────────────────────────────────

create table deliverables (
  id uuid primary key default uuid_generate_v4(),
  engagement_id uuid references engagements(id) on delete cascade,
  request_id uuid references requests(id),
  uploaded_by uuid references profiles(id),
  name text not null,
  file_url text not null,
  file_type text,
  file_size_bytes bigint,
  version integer default 1,
  requires_approval boolean default false,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  sign_off_notes text,
  created_at timestamptz default now()
);

-- ─── INVOICES ─────────────────────────────────────────────

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  account_id uuid references accounts(id),
  engagement_id uuid references engagements(id),
  stripe_invoice_id text unique,
  stripe_payment_intent_id text,
  pillar service_pillar,
  title text not null,
  amount_gbp numeric(10,2) not null,
  currency currency_code default 'GBP',
  amount_local numeric(10,2),
  status invoice_status default 'draft',
  due_date date,
  paid_at timestamptz,
  refunded_at timestamptz,
  refund_reason text,
  pdf_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── COMMISSIONS ──────────────────────────────────────────

create table commissions (
  id uuid primary key default uuid_generate_v4(),
  deal_id uuid references deals(id),
  invoice_id uuid references invoices(id),
  recipient_id uuid references partners(id),
  recipient_type text check (recipient_type in ('closer', 'referrer')),
  tier partner_tier not null,
  rate_percent numeric(5,2) not null,
  base_amount_gbp numeric(10,2) not null,
  commission_amount_gbp numeric(10,2) not null,
  pillar service_pillar,
  grow_month integer, -- for GROW taper (1, 2-6, 7-12)
  status commission_status default 'pending',
  claw_back_window_ends timestamptz,
  approved_by uuid references profiles(id),
  approved_at timestamptz,
  paid_at timestamptz,
  stripe_payout_id text,
  statement_pdf_url text,
  reversed_at timestamptz,
  reversal_reason text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── ACTIVITIES (CRM) ─────────────────────────────────────

create table activities (
  id uuid primary key default uuid_generate_v4(),
  lead_id uuid references leads(id),
  deal_id uuid references deals(id),
  account_id uuid references accounts(id),
  performed_by uuid references profiles(id),
  type text not null, -- email, call, meeting, note, stage_change, file_upload, etc.
  subject text,
  body text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- ─── INBOX / ENQUIRIES ────────────────────────────────────

create table inbox_messages (
  id uuid primary key default uuid_generate_v4(),
  from_email text not null,
  from_name text,
  subject text,
  body text,
  source text default 'website', -- website, partner, email_sync, manual
  lead_id uuid references leads(id),
  deal_id uuid references deals(id),
  assigned_to uuid references profiles(id),
  read_at timestamptz,
  archived_at timestamptz,
  created_at timestamptz default now()
);

-- ─── LIBRARY (SALES ENABLEMENT) ──────────────────────────

create table library_items (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text, -- pitch_deck, case_study, one_pager, pricing_sheet, email_template
  description text,
  file_url text,
  thumbnail_url text,
  visible_to_partners boolean default true,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ─── HUB SETTINGS ─────────────────────────────────────────

create table hub_settings (
  key text primary key,
  value jsonb not null,
  description text,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

-- Default settings
insert into hub_settings (key, value, description) values
  ('commission_tiers', '[
    {"tier": "tier1", "min_gbp": 0, "max_gbp": 1000, "closer_rate": 10, "referrer_rate": 5},
    {"tier": "tier2", "min_gbp": 1001, "max_gbp": 3000, "closer_rate": 12, "referrer_rate": 6},
    {"tier": "tier3", "min_gbp": 3001, "max_gbp": null, "closer_rate": 15, "referrer_rate": 7}
  ]', 'Commission tier thresholds and rates'),
  ('grow_taper', '[
    {"months": [1], "multiplier": 1.0},
    {"months": [2,3,4,5,6], "multiplier": 0.5},
    {"months": [7,8,9,10,11,12], "multiplier": 0.25},
    {"months_after": 12, "multiplier": 0}
  ]', 'GROW commission taper schedule'),
  ('sla_first_touch_hours', '24', 'Hours before first-touch SLA breach'),
  ('sla_first_touch_warning_hours', '18', 'Hours before first-touch SLA warning'),
  ('sla_qualify_working_days', '5', 'Working days to qualify a lead'),
  ('sla_stale_deal_working_days', '10', 'Working days before deal is considered stale'),
  ('sla_stale_deal_warning_days', '7', 'Working days before stale deal warning'),
  ('partner_concurrent_leads_cap', '{"tier1": 10, "tier2": 20, "tier3": 50}', 'Max concurrent open leads per tier'),
  ('claw_back_window_days', '30', 'Days before commission is released from claw-back hold'),
  ('currencies', '["GBP","EUR","USD","INR","AED"]', 'Supported currencies'),
  ('pipeline_stages_launch', '["new","contacted","qualified","proposal_sent","negotiating","closed_won","closed_lost"]', 'LAUNCH pipeline stages'),
  ('pipeline_stages_grow', '["new","contacted","qualified","proposal_sent","negotiating","closed_won","closed_lost"]', 'GROW pipeline stages'),
  ('pipeline_stages_build', '["new","contacted","qualified","discovery","proposal","negotiating","closed_won","closed_lost"]', 'BUILD pipeline stages');

-- ─── ROW LEVEL SECURITY ───────────────────────────────────

alter table profiles enable row level security;
alter table accounts enable row level security;
alter table account_members enable row level security;
alter table partners enable row level security;
alter table leads enable row level security;
alter table deals enable row level security;
alter table engagements enable row level security;
alter table requests enable row level security;
alter table deliverables enable row level security;
alter table invoices enable row level security;
alter table commissions enable row level security;
alter table activities enable row level security;
alter table inbox_messages enable row level security;
alter table library_items enable row level security;

-- Profiles: users can read their own profile
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- Admins and ops can see all profiles
create policy "Admin can view all profiles" on profiles for all using (
  exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'ops'))
);

-- Clients can only see their own account data
create policy "Clients see own account" on accounts for select using (
  exists (select 1 from account_members where account_id = accounts.id and profile_id = auth.uid())
  or exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'ops', 'delivery', 'sales_manager', 'internal_sales'))
);

-- Partners see only their own commission data
create policy "Partners see own commissions" on commissions for select using (
  exists (select 1 from partners where id = commissions.recipient_id and profile_id = auth.uid())
  or exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'ops', 'sales_manager'))
);

-- Partners see only their own leads
create policy "Partners see assigned leads" on leads for select using (
  exists (select 1 from partners p where p.profile_id = auth.uid() and (p.id = leads.partner_id or leads.owner_id = auth.uid()))
  or exists (select 1 from profiles where id = auth.uid() and role in ('admin', 'ops', 'sales_manager', 'internal_sales'))
);

-- ─── FUNCTIONS ────────────────────────────────────────────

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create a matching profile row for every new auth user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (
    id,
    email,
    first_name,
    last_name,
    role
  )
  values (
    new.id,
    coalesce(new.email, ''),
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name',
    case
      when new.raw_user_meta_data->>'role' in ('client', 'partner', 'internal_sales', 'sales_manager', 'delivery', 'ops', 'admin')
        then (new.raw_user_meta_data->>'role')::user_role
      else 'client'::user_role
    end
  )
  on conflict (id) do nothing;

  return new;
exception
  when others then
    return new;
end;
$$ language plpgsql security definer;

-- Apply to all tables with updated_at
create trigger trg_profiles_updated_at before update on profiles for each row execute function update_updated_at();
create trigger trg_accounts_updated_at before update on accounts for each row execute function update_updated_at();
create trigger trg_partners_updated_at before update on partners for each row execute function update_updated_at();
create trigger trg_leads_updated_at before update on leads for each row execute function update_updated_at();
create trigger trg_deals_updated_at before update on deals for each row execute function update_updated_at();
create trigger trg_engagements_updated_at before update on engagements for each row execute function update_updated_at();
create trigger trg_requests_updated_at before update on requests for each row execute function update_updated_at();
create trigger trg_invoices_updated_at before update on invoices for each row execute function update_updated_at();
create trigger trg_commissions_updated_at before update on commissions for each row execute function update_updated_at();
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Calculate partner tier based on current month closed revenue
create or replace function get_partner_tier(partner_uuid uuid)
returns partner_tier as $$
declare
  monthly_rev numeric;
  tiers jsonb;
  t jsonb;
  result partner_tier;
begin
  -- Get monthly closed revenue
  select coalesce(sum(d.value_gbp), 0) into monthly_rev
  from deals d
  join partners p on p.id = d.partner_id
  where p.id = partner_uuid
    and d.stage = 'closed_won'
    and date_trunc('month', d.closed_at) = date_trunc('month', now());

  -- Get tier thresholds from settings
  select value into tiers from hub_settings where key = 'commission_tiers';

  result := 'tier1';
  for t in select * from jsonb_array_elements(tiers) loop
    if monthly_rev >= (t->>'min_gbp')::numeric then
      if (t->>'max_gbp') is null or monthly_rev <= (t->>'max_gbp')::numeric then
        result := (t->>'tier')::partner_tier;
      end if;
    end if;
  end loop;

  return result;
end;
$$ language plpgsql;

-- Get commission rate for a partner/type/tier
create or replace function get_commission_rate(p_tier partner_tier, p_type text)
returns numeric as $$
declare
  tiers jsonb;
  t jsonb;
begin
  select value into tiers from hub_settings where key = 'commission_tiers';
  for t in select * from jsonb_array_elements(tiers) loop
    if (t->>'tier') = p_tier::text then
      if p_type = 'closer' then
        return (t->>'closer_rate')::numeric;
      else
        return (t->>'referrer_rate')::numeric;
      end if;
    end if;
  end loop;
  return 10; -- fallback
end;
$$ language plpgsql;

-- Create commission rows when a deal closes
create or replace function create_commissions_on_deal_close()
returns trigger as $$
declare
  closer_tier partner_tier;
  referrer_tier partner_tier;
  closer_rate numeric;
  referrer_rate numeric;
  claw_back_days integer;
begin
  if new.stage = 'closed_won' and old.stage != 'closed_won' then
    select (value::text)::integer into claw_back_days from hub_settings where key = 'claw_back_window_days';

    -- Closer commission
    if new.partner_id is not null then
      closer_tier := get_partner_tier(new.partner_id);
      closer_rate := get_commission_rate(closer_tier, 'closer');
      insert into commissions (deal_id, recipient_id, recipient_type, tier, rate_percent, base_amount_gbp, commission_amount_gbp, pillar, grow_month, claw_back_window_ends)
      values (new.id, new.partner_id, 'closer', closer_tier, closer_rate, new.value_gbp, new.value_gbp * closer_rate / 100, new.pillar, 1, now() + (claw_back_days || ' days')::interval);
    end if;

    -- Referrer commission (if different person)
    if new.referrer_id is not null and new.referrer_id != new.partner_id then
      referrer_tier := get_partner_tier(new.referrer_id);
      referrer_rate := get_commission_rate(referrer_tier, 'referrer');
      insert into commissions (deal_id, recipient_id, recipient_type, tier, rate_percent, base_amount_gbp, commission_amount_gbp, pillar, grow_month, claw_back_window_ends)
      values (new.id, new.referrer_id, 'referrer', referrer_tier, referrer_rate, new.value_gbp, new.value_gbp * referrer_rate / 100, new.pillar, 1, now() + (claw_back_days || ' days')::interval);
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_create_commissions after update on deals for each row execute function create_commissions_on_deal_close();

-- Auto-recycle leads past SLA
create or replace function recycle_sla_breached_leads()
returns void as $$
begin
  update leads
  set stage = 'recycled',
      recycled_at = now(),
      owner_id = null
  where stage in ('new', 'contacted')
    and sla_contacted_deadline < now()
    and recycled_at is null;
end;
$$ language plpgsql;
