-- 40: Lock down donations
--
-- Problems found on the live database (Oct 25, 2026):
--   allow_service_role            ALL    to public   USING (true) WITH CHECK (true)
--       -> despite its name, ANY holder of the public anon key can read, edit
--          and delete every donation (e.g. mark one "completed", or erase it).
--   allow_all_select_donations    SELECT to anon     USING (true)
--       -> donor names, emails, phones and messages are public.
--   allow_all_insert_donations    INSERT to anon     WITH CHECK (true)
--       -> anyone can insert donations, including ones already "completed".
--   increment_project_raised()    SECURITY DEFINER, EXECUTE granted to anon
--       -> anyone can inflate any project's total.
--   donation_projects keeps two totals, `raised` (shown by the website) and
--       `amount_raised` (the only one increment_project_raised updates), so the
--       website's progress bar never moves.
--
-- Fix: donors read only their own rows; staff read all; every write goes
-- through the server (service role bypasses RLS), which is what
-- app/api/payments/initialize and /verify use.
--
-- RUN ORDER: deploy the web change to app/api/payments/initialize/route.ts
-- FIRST (it switches the insert to the service-role client). If this script
-- runs before that deploy, website donations will fail with an RLS error.
--
-- Needs scripts/39-lock-down-profiles-select.sql (public.is_staff).
--
-- Rollback:
--   drop policy if exists donations_select_own_or_staff on public.donations;
--   create policy allow_all_select_donations on public.donations for select to anon, authenticated using (true);
--   create policy allow_all_insert_donations on public.donations for insert to anon, authenticated with check (true);
--   create policy allow_service_role on public.donations for all to public using (true) with check (true);
--   grant execute on function public.increment_project_raised(uuid, bigint) to public;

begin;

drop policy if exists allow_service_role on public.donations;
drop policy if exists allow_all_select_donations on public.donations;
drop policy if exists allow_all_insert_donations on public.donations;

create policy donations_select_own_or_staff on public.donations
  for select to authenticated
  using (user_id = auth.uid() or public.is_staff(auth.uid()));

-- Only the server (service role) may bump a project total. Both total columns
-- are kept in step so the website and the mobile app agree.
create or replace function public.increment_project_raised(project_id uuid, amount bigint)
returns void language plpgsql security definer set search_path = public as $$
begin
  update donation_projects
  set amount_raised = coalesce(amount_raised, 0) + amount,
      raised = coalesce(raised, 0) + amount,
      updated_at = now()
  where id = project_id;
end;
$$;

revoke execute on function public.increment_project_raised(uuid, bigint) from public, anon, authenticated;
grant execute on function public.increment_project_raised(uuid, bigint) to service_role;

-- Bring the two totals together once (the higher one wins).
update public.donation_projects
set raised = greatest(coalesce(raised, 0), coalesce(amount_raised, 0)),
    amount_raised = greatest(coalesce(raised, 0), coalesce(amount_raised, 0));

commit;
