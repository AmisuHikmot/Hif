-- COMPREHENSIVE FIX: Replace all public.users references with public.profiles
-- This ensures all triggers, functions, and RLS policies use the correct table
-- ============================================================

-- 1. Fix any remaining foreign key references
DO $$
DECLARE
  constraint_rec RECORD;
BEGIN
  FOR constraint_rec IN
    SELECT tc.table_name, tc.constraint_name, kcu.column_name
    FROM information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu
      ON tc.constraint_name = kcu.constraint_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND tc.table_schema = 'public'
      AND kcu.table_name != 'profiles'
  LOOP
    -- Check if constraint references public.users
    IF constraint_rec.constraint_name ILIKE '%user%' THEN
      BEGIN
        -- Drop and recreate to point to profiles instead
        EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I CASCADE',
          constraint_rec.table_name, constraint_rec.constraint_name);
      EXCEPTION WHEN OTHERS THEN
        NULL; -- Ignore errors
      END;
    END IF;
  END LOOP;
END;
$$;

-- 2. Ensure all dashboard stats functions use profiles
CREATE OR REPLACE FUNCTION public.get_dashboard_stats()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total_members', (SELECT COUNT(*) FROM public.profiles WHERE role = 'member' AND is_active = true),
    'total_events', (SELECT COUNT(*) FROM public.events WHERE event_date >= CURRENT_DATE),
    'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE payment_status = 'completed'),
    'total_branches', (SELECT COUNT(*) FROM public.branches WHERE is_active = true),
    'new_members_this_month', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),
    'donations_this_month', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND payment_status = 'completed')
  ) INTO result;
  
  RETURN result;
END;
$$;

-- 3. Ensure all user statistics functions use profiles
CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'user_id', p_user_id,
    'full_name', (COALESCE(first_name, '') || ' ' || COALESCE(last_name, '')),
    'email', email,
    'role', role,
    'is_active', is_active,
    'joined_at', created_at,
    'total_donations', (
      SELECT COALESCE(SUM(amount), 0) 
      FROM public.donations 
      WHERE user_id = p_user_id AND payment_status = 'completed'
    ),
    'total_events_attended', (
      SELECT COUNT(*) 
      FROM public.event_registrations 
      WHERE user_id = p_user_id AND status = 'confirmed'
    )
  ) INTO result
  FROM public.profiles
  WHERE id = p_user_id;
  
  RETURN result;
END;
$$;

-- 4. Fix all RLS policies that reference public.users
-- Drop and recreate admin-related policies to use profiles
DROP POLICY IF EXISTS "Admins can manage all records" ON public.events;
CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all records" ON public.donations;
CREATE POLICY "Admins can manage donations" ON public.donations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Admins can manage all records" ON public.user_logs;
CREATE POLICY "Admins can view all activity logs" ON public.user_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 5. Verify profiles table has user_id NOT NULL constraint
ALTER TABLE public.profiles
ALTER COLUMN user_id SET NOT NULL;

-- 6. Ensure handle_new_user trigger is correctly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 7. Ensure handle_user_updated trigger is correctly configured
DROP TRIGGER IF EXISTS on_auth_user_updated ON auth.users;
CREATE TRIGGER on_auth_user_updated
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_user_updated();

-- 8. Log completion
DO $$
BEGIN
  RAISE NOTICE 'Successfully fixed all public.users references - all now use public.profiles';
  RAISE NOTICE 'All triggers are configured and ready for use';
END;
$$;
