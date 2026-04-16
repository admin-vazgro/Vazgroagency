-- ─── 002_sla_recycle_schedule.sql ─────────────────────────────────────────────
-- Schedules recycle_sla_breached_leads() to run every 15 minutes via pg_cron.
--
-- Prerequisites:
--   1. pg_cron extension enabled in your Supabase project
--      (Database → Extensions → pg_cron → Enable)
--   2. Run this migration in the SQL Editor as the postgres superuser, NOT
--      via a normal anon/service-role key (pg_cron requires superuser access).
--
-- To apply:
--   Paste into Supabase Dashboard → SQL Editor and click Run.
-- ──────────────────────────────────────────────────────────────────────────────

-- Enable pg_cron if not already present
create extension if not exists pg_cron with schema pg_catalog;

-- Grant usage to the postgres role (Supabase default)
grant usage on schema cron to postgres;

-- Remove any existing job with the same name to allow re-running this migration
select cron.unschedule('recycle-sla-leads') where exists (
  select 1 from cron.job where jobname = 'recycle-sla-leads'
);

-- Schedule: every 15 minutes, run recycle_sla_breached_leads()
select cron.schedule(
  'recycle-sla-leads',
  '*/15 * * * *',
  $$select recycle_sla_breached_leads()$$
);
