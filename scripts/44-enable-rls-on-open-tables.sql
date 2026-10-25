-- 44: Turn on row-level security where it was OFF
--
-- Problem: RLS was disabled on profiles, admin_roles, admin_audit_log,
-- contact_messages, donation_projects, payment_settings, paystack_webhooks and
-- search_analytics, and the anon role holds full table privileges. With the
-- public anon key anyone could therefore:
--   * read every profile (so script 39's policy had no effect);
--   * set is_admin = true / role = 'super_admin' on any profile, including their
--     own, which makes them staff everywhere else;
--   * rewrite admin_roles, payment_settings, donation_projects (goals, totals),
--     delete the audit log, and read contact messages and webhook payloads.
--
-- Fix, in this order:
--   1. A trigger stops anyone but the server / database owner from changing
--      profiles.role or profiles.is_admin (and from creating a profile that is
--      already admin). Without it, enabling RLS would still let a user make
--      themselves staff, because the "update own profile" policies allow it.
--   2. RLS on, with policies matching how the web app uses each table
--      (service-role routes bypass RLS and are unaffected).
--
-- To promote an admin afterwards, run an UPDATE in the Supabase SQL editor
-- (it runs as postgres, which the trigger allows) or use the service-role key.
--
-- Run script 39 first (is_staff()). After running, test: sign in on the website,
-- open your profile, edit it, open the admin pages, submit the contact form,
-- open /donate. If something breaks, the rollback is at the bottom.

begin;

-- 1. Guard privileged columns -------------------------------------------------
create or replace function public.profiles_protect_privileged() returns trigger
language plpgsql as $$
begin
  -- The database owner and the service-role client may set anything.
  if current_user in ('postgres', 'supabase_admin', 'service_role') then
    return new;
  end if;

  if tg_op = 'INSERT' then
    new.role := 'user';
    new.is_admin := false;
  else
    new.role := old.role;
    new.is_admin := old.is_admin;
  end if;
  return new;
end $$;

drop trigger if exists profiles_protect_privileged_trg on public.profiles;
create trigger profiles_protect_privileged_trg
  before insert or update on public.profiles
  for each row execute function public.profiles_protect_privileged();

-- 2. Row-level security -------------------------------------------------------
alter table public.profiles enable row level security;
-- (policies on profiles already exist: select own/staff from script 39,
--  insert own, update own)

alter table public.admin_roles enable row level security;
create policy admin_roles_staff_select on public.admin_roles
  for select to authenticated using (public.is_staff(auth.uid()));

alter table public.admin_audit_log enable row level security;
create policy admin_audit_log_staff_select on public.admin_audit_log
  for select to authenticated using (public.is_staff(auth.uid()));
create policy admin_audit_log_staff_insert on public.admin_audit_log
  for insert to authenticated
  with check (public.is_staff(auth.uid()) and admin_id = auth.uid());

alter table public.contact_messages enable row level security;
create policy contact_messages_insert on public.contact_messages
  for insert to anon, authenticated with check (status = 'new');
create policy contact_messages_staff_select on public.contact_messages
  for select to authenticated using (public.is_staff(auth.uid()));
create policy contact_messages_staff_update on public.contact_messages
  for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
create policy contact_messages_staff_delete on public.contact_messages
  for delete to authenticated using (public.is_staff(auth.uid()));

alter table public.donation_projects enable row level security;
create policy donation_projects_public_select on public.donation_projects
  for select to anon, authenticated using (true);
create policy donation_projects_staff_write on public.donation_projects
  for all to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Server only: no policies means no access except through the service role.
alter table public.payment_settings enable row level security;
alter table public.paystack_webhooks enable row level security;

alter table public.search_analytics enable row level security;
create policy search_analytics_insert on public.search_analytics
  for insert to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
create policy search_analytics_staff_select on public.search_analytics
  for select to authenticated using (public.is_staff(auth.uid()));

commit;

-- Rollback (re-opens the holes; only if something breaks):
--   alter table public.profiles disable row level security;
--   alter table public.admin_roles disable row level security;
--   alter table public.admin_audit_log disable row level security;
--   alter table public.contact_messages disable row level security;
--   alter table public.donation_projects disable row level security;
--   alter table public.payment_settings disable row level security;
--   alter table public.paystack_webhooks disable row level security;
--   alter table public.search_analytics disable row level security;
--   drop trigger if exists profiles_protect_privileged_trg on public.profiles;
