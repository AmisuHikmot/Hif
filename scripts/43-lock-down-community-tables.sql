-- 43: Lock down the community / content tables
--
-- Problem (found by reading pg_policies; no web page uses these tables yet, but
-- the mobile app will, and sign-up is open to anyone):
--   * scholars, announcements, badges, achievements, challenges, media_library:
--     any signed-in user could create, edit or delete rows.
--   * duas, answers (scholar answers): any signed-in user could add, change or
--     delete them. These are religious content and must only change through
--     staff / the Shariah-approved process.
--   * reward_points, user_badges, user_achievements: any signed-in user could
--     award any points, badges or achievements to anyone, including themselves.
--   * questions, dua_wall, testimonials, group_chats: the INSERT check was
--     "true", so a user could post as someone else, and could post or edit a row
--     already marked approved (skipping moderation).
--
-- Fix: staff-only writes for content and awards (is_staff() from script 39 must
-- exist); user-owned posts must belong to the poster and start unapproved, and
-- users cannot approve their own rows. Public reads are unchanged. Awards are
-- made by staff or the service-role (server) client, which bypasses RLS.
--
-- Rollback: re-create the dropped policies, e.g.
--   create policy "Authenticated users can manage scholars" on public.scholars for all to authenticated using (true) with check (true);
-- (the full list of dropped names is below in the drop statements).

begin;

-- Staff-only content tables ---------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['scholars','announcements','badges','achievements','challenges','media_library'] loop
    execute format('drop policy if exists %I on public.%I', 'Authenticated users can manage ' ||
      case t when 'media_library' then 'media' else t end, t);
    execute format('create policy %I on public.%I for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()))',
      t || '_staff_write', t);
  end loop;
end $$;

-- duas ------------------------------------------------------------------------
drop policy if exists "Authenticated users can create duas" on public.duas;
drop policy if exists "Authenticated users can update duas" on public.duas;
drop policy if exists "Authenticated users can delete duas" on public.duas;
create policy duas_staff_write on public.duas
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- answers ---------------------------------------------------------------------
drop policy if exists "Authenticated users can create answers" on public.answers;
drop policy if exists "Authenticated users can update answers" on public.answers;
drop policy if exists "Authenticated users can delete answers" on public.answers;
create policy answers_staff_write on public.answers
  for all to authenticated using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));

-- Awards: staff or server only ------------------------------------------------
drop policy if exists "System can award points" on public.reward_points;
drop policy if exists "System can award badges" on public.user_badges;
drop policy if exists "System can award achievements" on public.user_achievements;
create policy reward_points_staff_insert on public.reward_points
  for insert to authenticated with check (public.is_staff(auth.uid()));
create policy user_badges_staff_insert on public.user_badges
  for insert to authenticated with check (public.is_staff(auth.uid()));
create policy user_achievements_staff_insert on public.user_achievements
  for insert to authenticated with check (public.is_staff(auth.uid()));

-- User posts: own, and unapproved until moderated ------------------------------
drop policy if exists "Authenticated users can ask questions" on public.questions;
drop policy if exists "Users can update their questions" on public.questions;
create policy questions_insert_own on public.questions
  for insert to authenticated
  with check (user_id = auth.uid() and status::text is distinct from 'approved');
create policy questions_update_own on public.questions
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and status::text is distinct from 'approved');
create policy questions_staff_moderate on public.questions
  for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
-- Staff must also see unapproved rows to moderate them.
create policy questions_staff_select on public.questions
  for select to authenticated using (public.is_staff(auth.uid()));

drop policy if exists "Authenticated users can post duas" on public.dua_wall;
drop policy if exists "Users can update their duas" on public.dua_wall;
create policy dua_wall_insert_own on public.dua_wall
  for insert to authenticated
  with check (user_id = auth.uid() and is_approved is not true);
create policy dua_wall_update_own on public.dua_wall
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and is_approved is not true);
create policy dua_wall_staff_moderate on public.dua_wall
  for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
-- Staff must also see unapproved rows to moderate them.
create policy dua_wall_staff_select on public.dua_wall
  for select to authenticated using (public.is_staff(auth.uid()));

drop policy if exists "Authenticated users can create testimonials" on public.testimonials;
drop policy if exists "Users can update their testimonials" on public.testimonials;
create policy testimonials_insert_own on public.testimonials
  for insert to authenticated
  with check (user_id = auth.uid() and is_approved is not true);
create policy testimonials_update_own on public.testimonials
  for update to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid() and is_approved is not true);
create policy testimonials_staff_moderate on public.testimonials
  for update to authenticated
  using (public.is_staff(auth.uid())) with check (public.is_staff(auth.uid()));
-- Staff must also see unapproved rows to moderate them.
create policy testimonials_staff_select on public.testimonials
  for select to authenticated using (public.is_staff(auth.uid()));

drop policy if exists "Authenticated users can create groups" on public.group_chats;
create policy group_chats_insert_own on public.group_chats
  for insert to authenticated with check (creator_id = auth.uid());

commit;
