-- 39: Lock down profiles SELECT
--
-- Problem: profiles_select_policy had USING (true) and anon had SELECT, so anyone
-- holding the public anon key could read every profile (names, emails, phones,
-- addresses, dates of birth, emergency contacts).
--
-- Fix: a user reads only their own row; staff (is_admin or role admin/super_admin)
-- read all. is_staff() is SECURITY DEFINER so the policy does not recurse into
-- profiles RLS (see 20-fix-rls-recursion.sql).
--
-- The public members directory (app/members/page.tsx) uses the service-role
-- client, which bypasses RLS, so it is unaffected.
--
-- Rollback (restores the open policy):
--   drop policy if exists profiles_select_own_or_staff on public.profiles;
--   create policy profiles_select_policy on public.profiles for select to anon, authenticated using (true);

begin;

create or replace function public.is_staff(uid uuid) returns boolean
language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.profiles
    where id = uid and (is_admin = true or role in ('admin', 'super_admin'))
  );
$$;

drop policy if exists profiles_select_policy on public.profiles;

create policy profiles_select_own_or_staff on public.profiles
  for select to authenticated
  using (id = auth.uid() or user_id = auth.uid() or public.is_staff(auth.uid()));

commit;
