-- Function to increment attendee count for events
CREATE OR REPLACE FUNCTION public.increment_attendee_count(event_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.events
  SET current_attendees = COALESCE(current_attendees, 0) + 1
  WHERE id = event_id;
END;
$$;

-- Function to decrement attendee count for events
CREATE OR REPLACE FUNCTION public.decrement_attendee_count(event_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.events
  SET current_attendees = GREATEST(COALESCE(current_attendees, 0) - 1, 0)
  WHERE id = event_id;
END;
$$;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM public.users WHERE role = 'member' AND is_active = true),
    'total_events', (SELECT COUNT(*) FROM public.events WHERE event_date >= CURRENT_DATE),
    'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE payment_status = 'completed'),
    'total_branches', (SELECT COUNT(*) FROM public.branches WHERE is_active = true),
    'new_members_this_month', (SELECT COUNT(*) FROM public.users WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),
    'donations_this_month', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND payment_status = 'completed')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE user_id = p_user_id AND payment_status = 'completed'),
    'events_attended', (SELECT COUNT(*) FROM public.event_registrations WHERE user_id = p_user_id AND attendance_status = 'attended'),
    'events_registered', (SELECT COUNT(*) FROM public.event_registrations WHERE user_id = p_user_id),
    'total_points', (SELECT COALESCE(SUM(points), 0) FROM public.reward_points WHERE user_id = p_user_id),
    'badges_earned', (SELECT COUNT(*) FROM public.user_badges WHERE user_id = p_user_id)
  ) INTO result;
  
  RETURN result;
END;
$$;

-- Trigger to auto-decrement attendees when registration is deleted
CREATE OR REPLACE FUNCTION public.handle_registration_delete()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  PERFORM public.decrement_attendee_count(OLD.event_id);
  RETURN OLD;
END;
$$;

DROP TRIGGER IF EXISTS on_registration_delete ON public.event_registrations;
CREATE TRIGGER on_registration_delete
  AFTER DELETE ON public.event_registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_registration_delete();
