-- Fix RLS policies for auth users to grant proper permissions

-- Drop existing problematic policies on profiles table
DROP POLICY IF EXISTS "Allow insert via trigger" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;

-- Recreate profiles table policies with proper auth.uid() checks
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);





-- Enable RLS on profiles if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create trigger to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, role, is_active)
  VALUES (
    new.id,
    new.email,
    new.user_metadata->>'first_name',
    new.user_metadata->>'last_name',
    'user',
    true
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create new trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Grant proper permissions
GRANT SELECT ON public.profiles TO authenticated;
GRANT INSERT ON public.profiles TO authenticated;
GRANT UPDATE ON public.profiles TO authenticated;
