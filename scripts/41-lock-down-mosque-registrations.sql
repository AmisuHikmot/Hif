-- 41: Lock down mosque_registrations
--
-- Problem: the "Admin can read / update / delete" policies were USING (true) for
-- every signed-in user, so anyone who creates an account could read, change or
-- delete all registrations (contact names, phones, emails). Signing up is open,
-- and the mobile app makes it easier, so this is now reachable by anyone.
--
-- Fix: only staff (see is_staff() in script 39, which must be run first) can
-- read, update or delete. Public registration (INSERT) is unchanged.
--
-- Rollback:
--   drop policy if exists mosque_reg_staff_select on public.mosque_registrations;
--   drop policy if exists mosque_reg_staff_update on public.mosque_registrations;
--   drop policy if exists mosque_reg_staff_delete on public.mosque_registrations;
--   create policy "Admin can read"   on public.mosque_registrations for select to authenticated using (true);
--   create policy "Admin can update" on public.mosque_registrations for update to authenticated using (true);
--   create policy "Admin can delete" on public.mosque_registrations for delete to authenticated using (true);

begin;

drop policy if exists "Admin can read" on public.mosque_registrations;
drop policy if exists "Admin can update" on public.mosque_registrations;
drop policy if exists "Admin can delete" on public.mosque_registrations;

create policy mosque_reg_staff_select on public.mosque_registrations
  for select to authenticated using (public.is_staff(auth.uid()));
create policy mosque_reg_staff_update on public.mosque_registrations
  for update to authenticated using (public.is_staff(auth.uid()));
create policy mosque_reg_staff_delete on public.mosque_registrations
  for delete to authenticated using (public.is_staff(auth.uid()));

commit;
