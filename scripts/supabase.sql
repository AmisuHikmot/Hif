-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.achievements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  icon character varying,
  criteria jsonb,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.activity_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action_type character varying NOT NULL,
  description text,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address character varying,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_log_pkey PRIMARY KEY (id)
);
CREATE TABLE public.activity_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  action character varying NOT NULL,
  entity_type character varying,
  entity_id uuid,
  details jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT activity_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.admin_audit_log (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  admin_id uuid,
  action text NOT NULL,
  entity_type text,
  entity_id text,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_audit_log_pkey PRIMARY KEY (id),
  CONSTRAINT admin_audit_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.admin_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  permissions jsonb DEFAULT '[]'::jsonb,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT admin_roles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.announcements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  content text NOT NULL,
  announcement_type character varying DEFAULT 'general'::character varying,
  priority character varying DEFAULT 'normal'::character varying,
  is_pinned boolean DEFAULT false,
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT announcements_pkey PRIMARY KEY (id),
  CONSTRAINT announcements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.answers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  question_id uuid,
  scholar_id uuid,
  answer_text text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT answers_pkey PRIMARY KEY (id),
  CONSTRAINT answers_question_id_fkey FOREIGN KEY (question_id) REFERENCES public.questions(id),
  CONSTRAINT answers_scholar_id_fkey FOREIGN KEY (scholar_id) REFERENCES public.scholars(id)
);
CREATE TABLE public.azkar_completions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  azkar_type character varying NOT NULL,
  azkar_name character varying NOT NULL,
  completed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT azkar_completions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.badges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  icon character varying,
  criteria jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.branches (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  address text NOT NULL,
  city character varying NOT NULL,
  state character varying NOT NULL,
  region character varying NOT NULL,
  phone character varying,
  email character varying,
  coordinator_name character varying,
  coordinator_phone character varying,
  coordinator_email character varying,
  established_year integer,
  member_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  latitude numeric,
  longitude numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT branches_pkey PRIMARY KEY (id)
);
CREATE TABLE public.cancellation_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  reason text NOT NULL,
  notes text,
  status text DEFAULT 'pending'::text,
  requested_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT cancellation_requests_pkey PRIMARY KEY (id),
  CONSTRAINT cancellation_requests_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shop_orders_enhanced(id)
);
CREATE TABLE public.challenges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  challenge_type character varying,
  start_date date,
  end_date date,
  target_value integer,
  points integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT challenges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.chat_messages (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  group_id uuid,
  user_id uuid,
  message_text text NOT NULL,
  is_deleted boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT chat_messages_pkey PRIMARY KEY (id),
  CONSTRAINT chat_messages_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.group_chats(id)
);
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text DEFAULT 'new'::text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT contact_messages_pkey PRIMARY KEY (id)
);
CREATE TABLE public.contact_submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email character varying NOT NULL,
  phone character varying,
  subject character varying NOT NULL,
  message text NOT NULL,
  status character varying DEFAULT 'pending'::character varying,
  replied_at timestamp with time zone,
  replied_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT contact_submissions_pkey PRIMARY KEY (id),
  CONSTRAINT contact_submissions_replied_by_fkey FOREIGN KEY (replied_by) REFERENCES public.profiles(id)
);
CREATE TABLE public.donation_projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image text,
  category text,
  raised bigint DEFAULT 0,
  goal bigint,
  deadline timestamp without time zone,
  status text DEFAULT 'active'::text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  amount_raised bigint DEFAULT 0,
  CONSTRAINT donation_projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.donations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  amount numeric NOT NULL,
  currency character varying DEFAULT 'NGN'::character varying,
  donation_type character varying,
  project_name character varying,
  payment_method character varying,
  payment_reference character varying UNIQUE,
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying, 'completed'::character varying, 'failed'::character varying, 'refunded'::character varying]::text[])),
  is_anonymous boolean DEFAULT false,
  donor_name character varying,
  donor_email character varying,
  donor_phone character varying,
  message text,
  receipt_sent boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  project_id uuid,
  status text,
  CONSTRAINT donations_pkey PRIMARY KEY (id),
  CONSTRAINT donations_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.donation_projects(id)
);
CREATE TABLE public.dua_wall (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  dua_text text NOT NULL,
  is_anonymous boolean DEFAULT false,
  likes_count integer DEFAULT 0,
  shares_count integer DEFAULT 0,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT dua_wall_pkey PRIMARY KEY (id)
);
CREATE TABLE public.duas (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  arabic_text text NOT NULL,
  transliteration text,
  translation text,
  reference character varying,
  category character varying,
  tags ARRAY,
  audio_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT duas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.event_images (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL,
  image_url text NOT NULL,
  thumbnail_url text,
  display_order integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
  CONSTRAINT event_images_pkey PRIMARY KEY (id),
  CONSTRAINT event_images_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.event_registrations (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  event_id uuid,
  user_id uuid,
  registration_date timestamp with time zone DEFAULT now(),
  attendance_status character varying DEFAULT 'registered'::character varying CHECK (attendance_status::text = ANY (ARRAY['registered'::character varying, 'attended'::character varying, 'no_show'::character varying, 'cancelled'::character varying]::text[])),
  notes text,
  CONSTRAINT event_registrations_pkey PRIMARY KEY (id),
  CONSTRAINT event_registrations_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id),
  CONSTRAINT event_registrations_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.events (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  event_date date NOT NULL,
  start_time time without time zone,
  end_time time without time zone,
  location character varying,
  branch_id uuid,
  category character varying NOT NULL,
  max_attendees integer,
  current_attendees integer DEFAULT 0,
  registration_required boolean DEFAULT false,
  registration_deadline date,
  status character varying DEFAULT 'upcoming'::character varying CHECK (status::text = ANY (ARRAY['upcoming'::character varying, 'ongoing'::character varying, 'completed'::character varying, 'cancelled'::character varying]::text[])),
  is_featured boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  organizer_id uuid,
  image_url text,
  CONSTRAINT events_pkey PRIMARY KEY (id),
  CONSTRAINT events_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT events_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT events_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES auth.users(id)
);
CREATE TABLE public.group_chats (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  avatar_url text,
  creator_id uuid,
  is_moderated boolean DEFAULT true,
  max_members integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT group_chats_pkey PRIMARY KEY (id),
  CONSTRAINT group_chats_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.habit_tracking (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  habit_name character varying NOT NULL,
  habit_type character varying,
  frequency character varying DEFAULT 'daily'::character varying,
  target_count integer,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  last_completed_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT habit_tracking_pkey PRIMARY KEY (id)
);
CREATE TABLE public.media (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  media_type character varying NOT NULL CHECK (media_type::text = ANY (ARRAY['video'::character varying, 'audio'::character varying, 'image'::character varying, 'document'::character varying]::text[])),
  category character varying,
  file_url text NOT NULL,
  thumbnail_url text,
  file_size bigint,
  duration integer,
  speaker_name character varying,
  event_id uuid,
  upload_date date DEFAULT CURRENT_DATE,
  is_featured boolean DEFAULT false,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  tags ARRAY,
  created_by uuid,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT media_pkey PRIMARY KEY (id),
  CONSTRAINT media_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.profiles(id),
  CONSTRAINT media_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.events(id)
);
CREATE TABLE public.media_library (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  media_type character varying,
  file_url text NOT NULL,
  thumbnail_url text,
  category character varying,
  tags ARRAY,
  duration integer,
  views_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT media_library_pkey PRIMARY KEY (id)
);
CREATE TABLE public.membership (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  membership_type character varying NOT NULL,
  start_date date NOT NULL,
  end_date date,
  status character varying DEFAULT 'active'::character varying,
  qr_code text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT membership_pkey PRIMARY KEY (id)
);
CREATE TABLE public.memberships (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  membership_type character varying NOT NULL,
  status character varying DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'inactive'::character varying, 'suspended'::character varying, 'expired'::character varying]::text[])),
  start_date date NOT NULL,
  end_date date,
  branch_id uuid,
  membership_fee numeric,
  payment_status character varying DEFAULT 'pending'::character varying CHECK (payment_status::text = ANY (ARRAY['pending'::character varying, 'paid'::character varying, 'overdue'::character varying]::text[])),
  renewal_date date,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT memberships_pkey PRIMARY KEY (id),
  CONSTRAINT memberships_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id),
  CONSTRAINT memberships_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.mosque_registrations (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  registration_code text NOT NULL UNIQUE,
  mosque_name text NOT NULL,
  mosque_address text NOT NULL,
  mosque_lga text NOT NULL,
  mosque_state text NOT NULL,
  mosque_phone text NOT NULL,
  mosque_email text,
  mosque_website text,
  mosque_instagram text,
  mosque_facebook text,
  logo_url text,
  contact_name text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text,
  contact_role text NOT NULL,
  ustaz_name text NOT NULL,
  ustaz_phone text NOT NULL,
  ustaz_email text,
  extra_person_name text,
  extra_person_phone text,
  extra_person_email text,
  competitors jsonb NOT NULL DEFAULT '[]'::jsonb,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text, 'waitlisted'::text])),
  admin_notes text,
  reviewed_by text,
  reviewed_at timestamp with time zone,
  submitted_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  extra_person_role text DEFAULT 'Ustaz (2nd)'::text,
  CONSTRAINT mosque_registrations_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletter_subscribers (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  status text DEFAULT 'subscribed'::text,
  subscribed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  unsubscribed_at timestamp without time zone,
  is_active boolean DEFAULT true,
  CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id)
);
CREATE TABLE public.newsletters (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  email character varying NOT NULL UNIQUE,
  first_name character varying,
  last_name character varying,
  is_active boolean DEFAULT true,
  subscription_date timestamp with time zone DEFAULT now(),
  unsubscribe_token uuid DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT newsletters_pkey PRIMARY KEY (id)
);
CREATE TABLE public.notifications (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title character varying NOT NULL,
  message text NOT NULL,
  notification_type character varying,
  is_read boolean DEFAULT false,
  action_url character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT notifications_pkey PRIMARY KEY (id),
  CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.order_status_history (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  status text NOT NULL,
  note text,
  changed_by text DEFAULT 'system'::text,
  changed_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT order_status_history_pkey PRIMARY KEY (id),
  CONSTRAINT order_status_history_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shop_orders_enhanced(id)
);
CREATE TABLE public.payment_settings (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT payment_settings_pkey PRIMARY KEY (id)
);
CREATE TABLE public.paystack_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  donation_id uuid,
  reference text NOT NULL UNIQUE,
  amount_kobo bigint,
  status text DEFAULT 'pending'::text,
  payment_method text,
  authorization_url text,
  access_code text,
  message text,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  paid_at timestamp without time zone,
  CONSTRAINT paystack_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT paystack_transactions_donation_id_fkey FOREIGN KEY (donation_id) REFERENCES public.donations(id)
);
CREATE TABLE public.paystack_webhooks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference text,
  event_type text,
  payload jsonb,
  processed boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT paystack_webhooks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.prayer_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  prayer_name character varying NOT NULL,
  prayer_date date NOT NULL,
  logged_at timestamp with time zone DEFAULT now(),
  on_time boolean DEFAULT true,
  in_congregation boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT prayer_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.prayer_times (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  date date NOT NULL,
  fajr character varying,
  sunrise character varying,
  dhuhr character varying,
  asr character varying,
  maghrib character varying,
  isha character varying,
  location_lat double precision,
  location_lng double precision,
  calculation_method character varying,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT prayer_times_pkey PRIMARY KEY (id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text NOT NULL UNIQUE,
  password_hash text,
  first_name text,
  last_name text,
  phone text,
  role character varying DEFAULT 'user'::character varying CHECK (role::text = ANY (ARRAY['user'::character varying, 'member'::character varying, 'admin'::character varying, 'super_admin'::character varying]::text[])),
  is_active boolean DEFAULT true,
  email_verified boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  avartar_url text,
  date_of_birth date,
  gender text,
  address text,
  city text,
  state text,
  country text,
  occupation text,
  education_level text,
  marital_status text,
  emergency_contact_name text,
  emergency_contact_phone text,
  membership_type text,
  email_confirmed_at timestamp with time zone,
  last_sign_in timestamp with time zone,
  is_admin boolean DEFAULT false,
  admin_role text,
  last_login timestamp without time zone,
  avatar_url text,
  oauth_provider text CHECK (oauth_provider = ANY (ARRAY['google'::text, 'apple'::text, 'facebook'::text, 'email'::text])),
  oauth_id text,
  user_id uuid NOT NULL,
  profile_picture_url text,
  profile_picture_uploaded_at timestamp with time zone,
  notification_preferences jsonb DEFAULT '{"newsletter": true, "eventReminders": true, "communityDigest": false, "donationUpdates": true, "smsNotifications": false, "emailNotifications": true, "generalAnnouncements": true}'::jsonb,
  last_password_change timestamp with time zone,
  password_change_count integer DEFAULT 0,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_user_id_fkey FOREIGN KEY (id) REFERENCES auth.users(id),
  CONSTRAINT fk_profiles_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.programs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  title character varying NOT NULL,
  description text,
  program_type character varying,
  instructor character varying,
  schedule_info text,
  location character varying,
  is_online boolean DEFAULT false,
  image_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  featured_image_url text,
  CONSTRAINT programs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.publications (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  description text,
  content text,
  publication_type character varying NOT NULL DEFAULT 'paper'::character varying,
  author_name character varying,
  author_id uuid,
  cover_image_url text,
  file_url text,
  file_size bigint,
  category character varying,
  tags ARRAY,
  is_published boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  published_at timestamp with time zone,
  view_count integer DEFAULT 0,
  download_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT publications_pkey PRIMARY KEY (id),
  CONSTRAINT publications_author_id_fkey FOREIGN KEY (author_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.questions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  question_text text NOT NULL,
  category character varying,
  is_anonymous boolean DEFAULT false,
  status character varying DEFAULT 'pending'::character varying,
  views_count integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT questions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quran_bookmarks (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  note text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quran_bookmarks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.quran_progress (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  completed boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT quran_progress_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_bank_accounts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  account_name character varying NOT NULL,
  account_number character varying NOT NULL UNIQUE,
  bank_name character varying NOT NULL,
  account_type character varying,
  currency character varying DEFAULT 'NGN'::character varying,
  is_active boolean DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_bank_accounts_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_charity_info (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  section_name character varying NOT NULL UNIQUE,
  content text NOT NULL,
  icon character varying,
  order_rank integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_charity_info_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_daily_reminders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  day_number integer NOT NULL UNIQUE,
  reminder_type character varying NOT NULL,
  title character varying NOT NULL,
  arabic_text text,
  english_text text NOT NULL,
  transliteration text,
  category character varying,
  reference character varying,
  image_url text,
  author character varying,
  tags ARRAY DEFAULT ARRAY[]::text[],
  is_published boolean DEFAULT false,
  publish_date date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_daily_reminders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_duas (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title character varying NOT NULL,
  category character varying NOT NULL,
  arabic_text text NOT NULL,
  arabic_transliteration text,
  english_translation text NOT NULL,
  reference character varying,
  audio_url text,
  is_featured boolean DEFAULT false,
  order_rank integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_duas_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_knowledge_base (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug character varying NOT NULL UNIQUE,
  title character varying NOT NULL,
  description text,
  content text NOT NULL,
  category character varying,
  difficulty_level character varying DEFAULT 'beginner'::character varying,
  read_time_minutes integer,
  image_url text,
  order_rank integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_knowledge_base_pkey PRIMARY KEY (id)
);
CREATE TABLE public.ramadan_reflection_verses (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  arabic_text text NOT NULL,
  english_translation text NOT NULL,
  theme character varying,
  reflection_note text,
  is_featured boolean DEFAULT false,
  order_rank integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ramadan_reflection_verses_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reward_points (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  points integer NOT NULL,
  reason character varying,
  transaction_type character varying,
  related_entity_type character varying,
  related_entity_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT reward_points_pkey PRIMARY KEY (id)
);
CREATE TABLE public.rls_policies_backup_profiles (
  schemaname name,
  tablename name,
  policyname name,
  permissive text,
  roles ARRAY,
  cmd text,
  qual text,
  with_check text
);
CREATE TABLE public.saved_content (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  content_type character varying NOT NULL,
  content_id uuid,
  title character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT saved_content_pkey PRIMARY KEY (id)
);
CREATE TABLE public.scholar_bookings (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  scholar_id uuid,
  user_id uuid,
  booking_date timestamp with time zone NOT NULL,
  topic character varying,
  status character varying DEFAULT 'pending'::character varying,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT scholar_bookings_pkey PRIMARY KEY (id),
  CONSTRAINT scholar_bookings_scholar_id_fkey FOREIGN KEY (scholar_id) REFERENCES public.scholars(id)
);
CREATE TABLE public.scholars (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  bio text,
  specialization character varying,
  topics ARRAY,
  avatar_url text,
  email character varying,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT scholars_pkey PRIMARY KEY (id)
);
CREATE TABLE public.search_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  query text,
  results_count integer,
  user_id uuid,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT search_analytics_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_digital_downloads (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  order_item_id uuid NOT NULL,
  product_id uuid NOT NULL,
  download_token text NOT NULL UNIQUE,
  expires_at timestamp with time zone NOT NULL,
  download_count integer DEFAULT 0,
  max_downloads integer DEFAULT 3,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_digital_downloads_pkey PRIMARY KEY (id),
  CONSTRAINT shop_digital_downloads_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shop_orders_enhanced(id),
  CONSTRAINT shop_digital_downloads_order_item_id_fkey FOREIGN KEY (order_item_id) REFERENCES public.shop_order_items_enhanced(id),
  CONSTRAINT shop_digital_downloads_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.shop_products_enhanced(id)
);
CREATE TABLE public.shop_order_items (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  order_id uuid,
  product_id uuid,
  quantity integer NOT NULL,
  price numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_order_items_pkey PRIMARY KEY (id),
  CONSTRAINT shop_order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shop_orders(id),
  CONSTRAINT shop_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.shop_products(id)
);
CREATE TABLE public.shop_order_items_enhanced (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  product_name text NOT NULL,
  product_type text NOT NULL,
  quantity integer NOT NULL,
  unit_price numeric NOT NULL,
  subtotal numeric NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_order_items_enhanced_pkey PRIMARY KEY (id),
  CONSTRAINT shop_order_items_enhanced_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.shop_orders_enhanced(id),
  CONSTRAINT shop_order_items_enhanced_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.shop_products_enhanced(id)
);
CREATE TABLE public.shop_orders (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  total_amount numeric NOT NULL,
  currency character varying DEFAULT 'USD'::character varying,
  status character varying DEFAULT 'pending'::character varying,
  payment_method character varying,
  shipping_address text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_orders_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_orders_enhanced (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  reference text NOT NULL UNIQUE,
  customer_name text,
  customer_email text NOT NULL,
  customer_phone text,
  delivery_address text,
  subtotal numeric,
  shipping_fee numeric DEFAULT 0,
  discount_amount numeric DEFAULT 0,
  total numeric,
  promo_code_id uuid,
  payment_status text DEFAULT 'pending'::text CHECK (payment_status = ANY (ARRAY['pending'::text, 'paid'::text, 'failed'::text])),
  order_status text DEFAULT 'processing'::text CHECK (order_status = ANY (ARRAY['pending'::text, 'processing'::text, 'ready_for_dispatch'::text, 'out_for_delivery'::text, 'delivered'::text, 'cancelled'::text])),
  has_digital boolean DEFAULT false,
  user_id uuid,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  payment_confirmed_at timestamp with time zone,
  processing_at timestamp with time zone,
  ready_for_dispatch_at timestamp with time zone,
  out_for_delivery_at timestamp with time zone,
  delivered_at timestamp with time zone,
  cancelled_at timestamp with time zone,
  cancellation_reason text,
  status_note text,
  estimated_delivery_date date,
  CONSTRAINT shop_orders_enhanced_pkey PRIMARY KEY (id),
  CONSTRAINT shop_orders_enhanced_promo_code_id_fkey FOREIGN KEY (promo_code_id) REFERENCES public.shop_promo_codes(id)
);
CREATE TABLE public.shop_products (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  name character varying NOT NULL,
  description text,
  price numeric NOT NULL,
  currency character varying DEFAULT 'USD'::character varying,
  category character varying,
  image_url text,
  stock_quantity integer DEFAULT 0,
  is_available boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_products_pkey PRIMARY KEY (id)
);
CREATE TABLE public.shop_products_enhanced (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  short_description text,
  price numeric NOT NULL,
  stock integer DEFAULT 0,
  type text DEFAULT 'physical'::text CHECK (type = ANY (ARRAY['physical'::text, 'digital'::text])),
  category_id uuid,
  image_url text,
  digital_file_path text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_products_enhanced_pkey PRIMARY KEY (id),
  CONSTRAINT shop_products_enhanced_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.shop_categories(id)
);
CREATE TABLE public.shop_promo_codes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  discount_type text NOT NULL CHECK (discount_type = ANY (ARRAY['percentage'::text, 'fixed'::text])),
  discount_value numeric NOT NULL,
  max_uses integer,
  used_count integer DEFAULT 0,
  expires_at timestamp with time zone,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT shop_promo_codes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.subscriptions (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  plan_name character varying NOT NULL,
  status character varying DEFAULT 'active'::character varying,
  start_date date NOT NULL,
  end_date date,
  auto_renew boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT subscriptions_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tasbeeh_logs (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  count integer NOT NULL,
  phrase character varying,
  logged_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT tasbeeh_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.testimonials (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  entity_type character varying,
  entity_id uuid,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  is_approved boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT testimonials_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_2fa_attempts (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  attempt_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ip_address text,
  success boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_2fa_attempts_pkey PRIMARY KEY (id),
  CONSTRAINT user_2fa_attempts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_2fa_backup_code_usage (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  backup_code_hash text NOT NULL,
  used_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  ip_address text,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_2fa_backup_code_usage_pkey PRIMARY KEY (id),
  CONSTRAINT user_2fa_backup_code_usage_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_2fa_secrets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  secret text NOT NULL,
  backup_codes ARRAY NOT NULL,
  is_enabled boolean NOT NULL DEFAULT false,
  setup_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  verified_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT user_2fa_secrets_pkey PRIMARY KEY (id),
  CONSTRAINT user_2fa_secrets_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_achievements (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  achievement_id uuid,
  earned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_achievements_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_badges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  badge_id uuid,
  earned_at timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_badges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_challenges (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  challenge_id uuid,
  status character varying DEFAULT 'in_progress'::character varying,
  current_progress integer DEFAULT 0,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_challenges_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_journals (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  title character varying,
  content text NOT NULL,
  tags ARRAY,
  mood character varying,
  is_private boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_journals_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  action text NOT NULL,
  description text,
  entity_type text,
  entity_id uuid,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user_ramadan_tracking (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE,
  reminders_viewed ARRAY DEFAULT ARRAY[]::integer[],
  duas_bookmarked ARRAY DEFAULT ARRAY[]::uuid[],
  knowledge_articles_read ARRAY DEFAULT ARRAY[]::uuid[],
  last_visited date,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_ramadan_tracking_pkey PRIMARY KEY (id),
  CONSTRAINT user_ramadan_tracking_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.volunteers (
  id uuid NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid,
  interests ARRAY,
  availability character varying,
  skills ARRAY,
  status character varying DEFAULT 'pending'::character varying,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT volunteers_pkey PRIMARY KEY (id)
);