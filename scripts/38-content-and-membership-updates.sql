-- Dynamic page content, leadership records, prayer banner support, and membership payment tracking.

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS postal_code text;

ALTER TABLE public.memberships
  ADD COLUMN IF NOT EXISTS membership_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS payment_reference text UNIQUE,
  ADD COLUMN IF NOT EXISTS application_data jsonb DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS renewal_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS last_renewed_at timestamp with time zone;

CREATE TABLE IF NOT EXISTS public.membership_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id text NOT NULL UNIQUE,
  payment_reference text NOT NULL UNIQUE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  date_of_birth date,
  gender text,
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  postal_code text,
  country text DEFAULT 'nigeria',
  membership_type text NOT NULL,
  branch_id uuid REFERENCES public.branches(id),
  interests text[] DEFAULT ARRAY[]::text[],
  skills text,
  referral_source text,
  communications_opt_in boolean DEFAULT false,
  amount numeric NOT NULL,
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  membership_status text NOT NULL DEFAULT 'pending_payment' CHECK (membership_status IN ('pending_payment', 'active', 'expired', 'cancelled')),
  paid_at timestamp with time zone,
  expires_at date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_membership_applications_email ON public.membership_applications(email);
CREATE INDEX IF NOT EXISTS idx_membership_applications_membership_id ON public.membership_applications(membership_id);
CREATE INDEX IF NOT EXISTS idx_membership_applications_payment_reference ON public.membership_applications(payment_reference);

ALTER TABLE public.membership_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit membership applications" ON public.membership_applications;
CREATE POLICY "Anyone can submit membership applications"
  ON public.membership_applications FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Members can check own application" ON public.membership_applications;
CREATE POLICY "Members can check own application"
  ON public.membership_applications FOR SELECT
  USING (
    auth.role() = 'service_role'
    OR email = auth.jwt() ->> 'email'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  );

DROP POLICY IF EXISTS "Service role can manage membership applications" ON public.membership_applications;
CREATE POLICY "Service role can manage membership applications"
  ON public.membership_applications FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TABLE IF NOT EXISTS public.page_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_key text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  hero_image_url text,
  body jsonb DEFAULT '{}'::jsonb,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.page_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view published page content" ON public.page_content;
CREATE POLICY "Public can view published page content"
  ON public.page_content FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage page content" ON public.page_content;
CREATE POLICY "Admins can manage page content"
  ON public.page_content FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  );

CREATE TABLE IF NOT EXISTS public.leadership_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_key text NOT NULL,
  name text NOT NULL,
  title text NOT NULL,
  bio text,
  image_url text,
  email text,
  phone text,
  tenure text,
  achievements text,
  education text,
  legacy text,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leadership_profiles_group ON public.leadership_profiles(group_key, display_order);

ALTER TABLE public.leadership_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active leadership profiles" ON public.leadership_profiles;
CREATE POLICY "Public can view active leadership profiles"
  ON public.leadership_profiles FOR SELECT
  USING (is_active = true OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Admins can manage leadership profiles" ON public.leadership_profiles;
CREATE POLICY "Admins can manage leadership profiles"
  ON public.leadership_profiles FOR ALL
  USING (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  )
  WITH CHECK (
    auth.role() = 'service_role'
    OR EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND (profiles.role IN ('admin', 'super_admin') OR profiles.is_admin = true)
    )
  );

INSERT INTO public.page_content (page_key, title, subtitle, body)
VALUES
  ('conference/islam-in-nigeria', 'Islam in Nigeria Conference', 'Exploring the history, challenges, and future of Islam in Nigeria', '{"sections":[{"heading":"About the Conference","paragraphs":["The Islam in Nigeria Conference brings together scholars, researchers, community leaders, and policymakers to discuss Islamic history, education, culture, and contemporary community development in Nigeria."]}],"themes":["Islamic History in Nigeria","Islamic Education","Interfaith Relations","Contemporary Challenges"]}'::jsonb),
  ('conference/islam-and-education', 'Islam and Education Conference', 'Exploring Islamic education principles, challenges, and innovations', '{"sections":[{"heading":"About the Conference","paragraphs":["This annual gathering explores curriculum, teacher training, technology, and the integration of Islamic and contemporary learning."]}],"themes":["Islamic Educational Philosophy","Curriculum Development","Technology in Islamic Education","Teacher Training"]}'::jsonb),
  ('conference/islam-and-politics', 'Islam and Politics Conference', 'Exploring the relationship between Islam and politics in contemporary society', '{"sections":[{"heading":"About the Conference","paragraphs":["A thoughtful forum on governance, leadership, civic participation, justice, and public ethics from an Islamic perspective."]}],"themes":["Islamic Political Thought","Governance and Leadership","Human Rights","Political Participation"]}'::jsonb),
  ('conference/islam-and-economy', 'Islam and Economy Conference', 'Exploring Islamic economics, finance, and sustainable development', '{"sections":[{"heading":"About the Conference","paragraphs":["This conference examines Islamic finance, ethical business, zakat, poverty alleviation, entrepreneurship, and sustainable economic development."]}],"themes":["Islamic Banking and Finance","Zakat and Poverty Alleviation","Islamic Business Ethics","Sustainable Development"]}'::jsonb)
ON CONFLICT (page_key) DO NOTHING;

DROP POLICY IF EXISTS "Public can view site prayer times" ON public.prayer_times;
CREATE POLICY "Public can view site prayer times"
  ON public.prayer_times FOR SELECT
  USING (user_id IS NULL OR auth.role() = 'service_role');

DROP POLICY IF EXISTS "Public can view published publications" ON public.publications;
CREATE POLICY "Public can view published publications"
  ON public.publications FOR SELECT
  USING (is_published = true OR auth.role() = 'service_role');
