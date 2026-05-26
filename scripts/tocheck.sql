select format(
  '%s.%s | owner=%s | rls=%s | force_rls=%s',
  n.nspname,
  c.relname,
  pg_get_userbyid(c.relowner),
  case when c.relrowsecurity then 'on' else 'off' end,
  case when c.relforcerowsecurity then 'on' else 'off' end
) as sql_report
from pg_class c
join pg_namespace n
  on n.oid = c.relnamespace
where c.relkind = 'r'
  and n.nspname in ('public', 'storage')
order by n.nspname, c.relname;

[
  {
    "sql_report": "public.achievements | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.activity_log | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.activity_logs | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.admin_audit_log | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.admin_roles | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.announcements | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.answers | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.azkar_completions | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.badges | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.branches | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.cancellation_requests | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.challenges | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.chat_messages | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.contact_messages | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.contact_submissions | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.donation_projects | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.donations | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.dua_wall | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.duas | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.event_images | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.event_registrations | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.events | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.group_chats | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.habit_tracking | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.media | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.media_library | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.membership | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.memberships | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.mosque_registrations | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.newsletter_subscribers | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.newsletters | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.notifications | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.order_status_history | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.payment_settings | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.paystack_transactions | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.paystack_webhooks | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.prayer_logs | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.prayer_times | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.profiles | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.programs | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.publications | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.questions | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.quran_bookmarks | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.quran_progress | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_bank_accounts | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_charity_info | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_daily_reminders | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_duas | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_knowledge_base | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.ramadan_reflection_verses | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.reward_points | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.rls_policies_backup_profiles | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.saved_content | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.scholar_bookings | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.scholars | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.search_analytics | owner=postgres | rls=off | force_rls=off"
  },
  {
    "sql_report": "public.shop_categories | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_digital_downloads | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_order_items | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_order_items_enhanced | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_orders | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_orders_enhanced | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_products | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_products_enhanced | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.shop_promo_codes | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.subscriptions | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.tasbeeh_logs | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.testimonials | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_2fa_attempts | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_2fa_backup_code_usage | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_2fa_secrets | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_achievements | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_badges | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_challenges | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_journals | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_logs | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.user_ramadan_tracking | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "public.volunteers | owner=postgres | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.buckets | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.buckets_analytics | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.buckets_vectors | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.migrations | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.objects | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.s3_multipart_uploads | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.s3_multipart_uploads_parts | owner=supabase_storage_admin | rls=on | force_rls=off"
  },
  {
    "sql_report": "storage.vector_indexes | owner=supabase_storage_admin | rls=on | force_rls=off"
  }
]

select format(
  '%s.%s.%s | %s%s | nullable=%s | default=%s',
  c.table_schema,
  c.table_name,
  c.column_name,
  c.data_type,
  coalesce('(' || c.character_maximum_length::text || ')', ''),
  c.is_nullable,
  coalesce(c.column_default, '')
) as sql_report
from information_schema.columns c
where c.table_schema in ('public', 'storage')
order by c.table_schema, c.table_name, c.ordinal_position;

[
  {
    "sql_report": "public.achievements.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.achievements.name | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.achievements.description | text | nullable=YES | default="
  },
  {
    "sql_report": "public.achievements.icon | character varying | nullable=YES | default="
  },
  {
    "sql_report": "public.achievements.criteria | jsonb | nullable=YES | default="
  },
  {
    "sql_report": "public.achievements.points | integer | nullable=YES | default=0"
  },
  {
    "sql_report": "public.achievements.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.activity_log.id | uuid | nullable=NO | default=gen_random_uuid()"
  },
  {
    "sql_report": "public.activity_log.user_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_log.action_type | character varying(50) | nullable=NO | default="
  },
  {
    "sql_report": "public.activity_log.description | text | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_log.metadata | jsonb | nullable=YES | default='{}'::jsonb"
  },
  {
    "sql_report": "public.activity_log.ip_address | character varying(45) | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_log.user_agent | text | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_log.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.activity_logs.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.activity_logs.user_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.action | character varying(100) | nullable=NO | default="
  },
  {
    "sql_report": "public.activity_logs.entity_type | character varying(50) | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.entity_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.details | jsonb | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.ip_address | inet | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.user_agent | text | nullable=YES | default="
  },
  {
    "sql_report": "public.activity_logs.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.admin_audit_log.id | uuid | nullable=NO | default=gen_random_uuid()"
  },
  {
    "sql_report": "public.admin_audit_log.admin_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.action | text | nullable=NO | default="
  },
  {
    "sql_report": "public.admin_audit_log.entity_type | text | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.entity_id | text | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.old_values | jsonb | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.new_values | jsonb | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.ip_address | text | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.user_agent | text | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_audit_log.created_at | timestamp without time zone | nullable=YES | default=CURRENT_TIMESTAMP"
  },
  {
    "sql_report": "public.admin_roles.id | uuid | nullable=NO | default=gen_random_uuid()"
  },
  {
    "sql_report": "public.admin_roles.name | text | nullable=NO | default="
  },
  {
    "sql_report": "public.admin_roles.description | text | nullable=YES | default="
  },
  {
    "sql_report": "public.admin_roles.permissions | jsonb | nullable=YES | default='[]'::jsonb"
  },
  {
    "sql_report": "public.admin_roles.created_at | timestamp without time zone | nullable=YES | default=CURRENT_TIMESTAMP"
  },
  {
    "sql_report": "public.admin_roles.updated_at | timestamp without time zone | nullable=YES | default=CURRENT_TIMESTAMP"
  },
  {
    "sql_report": "public.announcements.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.announcements.title | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.announcements.content | text | nullable=NO | default="
  },
  {
    "sql_report": "public.announcements.announcement_type | character varying | nullable=YES | default='general'::character varying"
  },
  {
    "sql_report": "public.announcements.priority | character varying | nullable=YES | default='normal'::character varying"
  },
  {
    "sql_report": "public.announcements.is_pinned | boolean | nullable=YES | default=false"
  },
  {
    "sql_report": "public.announcements.start_date | timestamp with time zone | nullable=YES | default="
  },
  {
    "sql_report": "public.announcements.end_date | timestamp with time zone | nullable=YES | default="
  },
  {
    "sql_report": "public.announcements.created_by | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.announcements.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.announcements.updated_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.answers.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.answers.question_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.answers.scholar_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.answers.answer_text | text | nullable=NO | default="
  },
  {
    "sql_report": "public.answers.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.answers.updated_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.azkar_completions.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.azkar_completions.user_id | uuid | nullable=YES | default="
  },
  {
    "sql_report": "public.azkar_completions.azkar_type | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.azkar_completions.azkar_name | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.azkar_completions.completed_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.azkar_completions.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.badges.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.badges.name | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.badges.description | text | nullable=YES | default="
  },
  {
    "sql_report": "public.badges.icon | character varying | nullable=YES | default="
  },
  {
    "sql_report": "public.badges.criteria | jsonb | nullable=YES | default="
  },
  {
    "sql_report": "public.badges.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.branches.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.branches.name | character varying(200) | nullable=NO | default="
  },
  {
    "sql_report": "public.branches.address | text | nullable=NO | default="
  },
  {
    "sql_report": "public.branches.city | character varying(100) | nullable=NO | default="
  },
  {
    "sql_report": "public.branches.state | character varying(100) | nullable=NO | default="
  },
  {
    "sql_report": "public.branches.region | character varying(50) | nullable=NO | default="
  },
  {
    "sql_report": "public.branches.phone | character varying(20) | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.email | character varying(255) | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.coordinator_name | character varying(100) | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.coordinator_phone | character varying(20) | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.coordinator_email | character varying(255) | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.established_year | integer | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.member_count | integer | nullable=YES | default=0"
  },
  {
    "sql_report": "public.branches.is_active | boolean | nullable=YES | default=true"
  },
  {
    "sql_report": "public.branches.latitude | numeric | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.longitude | numeric | nullable=YES | default="
  },
  {
    "sql_report": "public.branches.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.branches.updated_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.cancellation_requests.id | uuid | nullable=NO | default=gen_random_uuid()"
  },
  {
    "sql_report": "public.cancellation_requests.order_id | uuid | nullable=NO | default="
  },
  {
    "sql_report": "public.cancellation_requests.reason | text | nullable=NO | default="
  },
  {
    "sql_report": "public.cancellation_requests.notes | text | nullable=YES | default="
  },
  {
    "sql_report": "public.cancellation_requests.status | text | nullable=YES | default='pending'::text"
  },
  {
    "sql_report": "public.cancellation_requests.requested_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.cancellation_requests.resolved_at | timestamp with time zone | nullable=YES | default="
  },
  {
    "sql_report": "public.cancellation_requests.created_at | timestamp with time zone | nullable=YES | default=now()"
  },
  {
    "sql_report": "public.challenges.id | uuid | nullable=NO | default=uuid_generate_v4()"
  },
  {
    "sql_report": "public.challenges.title | character varying | nullable=NO | default="
  },
  {
    "sql_report": "public.challenges.description | text | nullable=YES | default="
  },
  {
    "sql_report": "public.challenges.challenge_type | character varying | nullable=YES | default="
  },
  {
    "sql_report": "public.challenges.start_date | date | nullable=YES | default="
  }
]

select format(
  '%s.%s | %s | permissive=%s | roles=%s | cmd=%s | using=%s | check=%s',
  p.schemaname,
  p.tablename,
  p.policyname,
  p.permissive,
  array_to_string(p.roles, ','),
  p.cmd,
  coalesce(p.qual, ''),
  coalesce(p.with_check, '')
) as sql_report
from pg_catalog.pg_policies p
where p.schemaname in ('public', 'storage')
order by p.schemaname, p.tablename, p.policyname;

[
  {
    "sql_report": "public.achievements | Anyone can view achievements | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.achievements | Authenticated users can manage achievements | permissive=PERMISSIVE | roles=authenticated | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.activity_log | Admins can view all activity logs | permissive=PERMISSIVE | roles=authenticated | cmd=SELECT | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))) | check="
  },
  {
    "sql_report": "public.activity_log | Users can view their own activity | permissive=PERMISSIVE | roles=authenticated | cmd=SELECT | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.activity_logs | Admins can view all activity logs | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((( SELECT profiles.is_admin\n   FROM profiles\n  WHERE (profiles.id = auth.uid())) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.activity_logs | System can insert activity logs | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=(auth.role() = 'service_role'::text)"
  },
  {
    "sql_report": "public.activity_logs | Users can view their activity | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.announcements | Anyone can view active announcements | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.announcements | Authenticated users can manage announcements | permissive=PERMISSIVE | roles=authenticated | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.answers | Anyone can view answers | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.answers | Authenticated users can create answers | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.answers | Authenticated users can delete answers | permissive=PERMISSIVE | roles=authenticated | cmd=DELETE | using=true | check="
  },
  {
    "sql_report": "public.answers | Authenticated users can update answers | permissive=PERMISSIVE | roles=authenticated | cmd=UPDATE | using=true | check=true"
  },
  {
    "sql_report": "public.azkar_completions | Users can manage their azkar completions | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.badges | Anyone can view badges | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.badges | Authenticated users can manage badges | permissive=PERMISSIVE | roles=authenticated | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.branches | Admins can manage branches | permissive=PERMISSIVE | roles=public | cmd=ALL | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.branches | Anyone can view branches | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.cancellation_requests | Public cancellation request read | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.challenges | Anyone can view challenges | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.challenges | Authenticated users can manage challenges | permissive=PERMISSIVE | roles=authenticated | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.chat_messages | Anyone can view chat messages | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.chat_messages | Authenticated users can send messages | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.chat_messages | Users can delete their messages | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.chat_messages | Users can update their messages | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.contact_submissions | Admins can update contact submissions | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.contact_submissions | Admins can view contact submissions | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.contact_submissions | Anyone can submit contact form | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.donations | Admins can manage donations | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))) | check="
  },
  {
    "sql_report": "public.donations | allow_all_insert_donations | permissive=PERMISSIVE | roles=anon,authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.donations | allow_all_select_donations | permissive=PERMISSIVE | roles=anon,authenticated | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.donations | allow_service_role | permissive=PERMISSIVE | roles=public | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.dua_wall | Anyone can view approved duas | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((is_approved = true) OR (auth.uid() = user_id)) | check="
  },
  {
    "sql_report": "public.dua_wall | Authenticated users can post duas | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.dua_wall | Users can delete their duas | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.dua_wall | Users can update their duas | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.duas | Anyone can view duas | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.duas | Authenticated users can create duas | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.duas | Authenticated users can delete duas | permissive=PERMISSIVE | roles=authenticated | cmd=DELETE | using=true | check="
  },
  {
    "sql_report": "public.duas | Authenticated users can update duas | permissive=PERMISSIVE | roles=authenticated | cmd=UPDATE | using=true | check=true"
  },
  {
    "sql_report": "public.event_images | Admins can manage event images | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))) | check="
  },
  {
    "sql_report": "public.event_images | Anyone can view event images | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.event_registrations | Admins can view all registrations | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.event_registrations | Service role has full access to registrations | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(auth.role() = 'service_role'::text) | check="
  },
  {
    "sql_report": "public.event_registrations | Users can cancel their own registrations | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.event_registrations | Users can read their own registrations | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((user_id = auth.uid()) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.event_registrations | Users can register for events | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=(user_id = auth.uid())"
  },
  {
    "sql_report": "public.event_registrations | Users can update their registrations | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.event_registrations | Users can view their own registrations | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.event_registrations | Users can view their registrations | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.events | Admins can manage all events | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))) | check="
  },
  {
    "sql_report": "public.events | Admins can manage events | permissive=PERMISSIVE | roles=public | cmd=ALL | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.events | Anyone can view events | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.events | Authenticated users can create events | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=(auth.role() = 'authenticated'::text)"
  },
  {
    "sql_report": "public.events | Organizers can delete their events | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=((created_by = auth.uid()) OR (organizer_id = auth.uid()) OR (is_admin(auth.uid()) = true)) | check="
  },
  {
    "sql_report": "public.events | Organizers can update their events | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=((created_by = auth.uid()) OR (organizer_id = auth.uid()) OR (is_admin(auth.uid()) = true)) | check="
  },
  {
    "sql_report": "public.group_chats | Anyone can view group chats | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.group_chats | Authenticated users can create groups | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.group_chats | Creators can delete their groups | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = creator_id) | check="
  },
  {
    "sql_report": "public.group_chats | Creators can update their groups | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = creator_id) | check=(auth.uid() = creator_id)"
  },
  {
    "sql_report": "public.habit_tracking | Users can manage their habits | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.media | Admins can manage media | permissive=PERMISSIVE | roles=public | cmd=ALL | using=((( SELECT profiles.is_admin\n   FROM profiles\n  WHERE (profiles.id = auth.uid())) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.media | Anyone can view media | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.media_library | Anyone can view media | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.media_library | Authenticated users can manage media | permissive=PERMISSIVE | roles=authenticated | cmd=ALL | using=true | check=true"
  },
  {
    "sql_report": "public.membership | Users can create membership | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.membership | Users can delete their membership | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.membership | Users can update their membership | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.membership | Users can view their membership | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.memberships | Admins can manage memberships | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = ANY ((ARRAY['admin'::character varying, 'super_admin'::character varying])::text[]))))) | check="
  },
  {
    "sql_report": "public.memberships | Users can view their own membership | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(user_id = auth.uid()) | check="
  },
  {
    "sql_report": "public.mosque_registrations | Admin can delete | permissive=PERMISSIVE | roles=authenticated | cmd=DELETE | using=true | check="
  },
  {
    "sql_report": "public.mosque_registrations | Admin can read | permissive=PERMISSIVE | roles=authenticated | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.mosque_registrations | Admin can update | permissive=PERMISSIVE | roles=authenticated | cmd=UPDATE | using=true | check="
  },
  {
    "sql_report": "public.mosque_registrations | Public can register | permissive=PERMISSIVE | roles=anon,authenticated | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.newsletter_subscribers | Admins can view subscribers | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(EXISTS ( SELECT 1\n   FROM profiles\n  WHERE ((profiles.id = auth.uid()) AND ((profiles.role)::text = 'admin'::text)))) | check="
  },
  {
    "sql_report": "public.newsletter_subscribers | Anyone can subscribe | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.newsletter_subscribers | Users can unsubscribe via token | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=true | check=true"
  },
  {
    "sql_report": "public.newsletters | Admins can view all newsletter subscriptions | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.newsletters | Anyone can subscribe to newsletter | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=true"
  },
  {
    "sql_report": "public.notifications | Users can delete their notifications | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.notifications | Users can update their notifications | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.notifications | Users can view their notifications | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.order_status_history | Public order status history read | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.paystack_transactions | Admins can update transactions | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.paystack_transactions | Admins can view all transactions | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=((is_admin(auth.uid()) = true) OR (auth.role() = 'service_role'::text)) | check="
  },
  {
    "sql_report": "public.paystack_transactions | Service role manages transactions | permissive=PERMISSIVE | roles=public | cmd=ALL | using=(auth.role() = 'service_role'::text) | check="
  },
  {
    "sql_report": "public.paystack_transactions | System can insert transactions | permissive=PERMISSIVE | roles=public | cmd=INSERT | using= | check=(auth.role() = 'service_role'::text)"
  },
  {
    "sql_report": "public.prayer_logs | Users can delete their prayer logs | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.prayer_logs | Users can insert prayer logs | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.prayer_logs | Users can update their prayer logs | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.prayer_logs | Users can view their prayer logs | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.prayer_times | Users can delete their prayer times | permissive=PERMISSIVE | roles=public | cmd=DELETE | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.prayer_times | Users can insert prayer times | permissive=PERMISSIVE | roles=authenticated | cmd=INSERT | using= | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.prayer_times | Users can update their prayer times | permissive=PERMISSIVE | roles=public | cmd=UPDATE | using=(auth.uid() = user_id) | check=(auth.uid() = user_id)"
  },
  {
    "sql_report": "public.prayer_times | Users can view their prayer times | permissive=PERMISSIVE | roles=public | cmd=SELECT | using=(auth.uid() = user_id) | check="
  },
  {
    "sql_report": "public.profiles | insert_own_profile | permissive=PERMISSIVE | roles=anon,authenticated | cmd=INSERT | using= | check=((auth.uid() = id) OR (auth.uid() = user_id) OR (auth.role() = 'service_role'::text))"
  },
  {
    "sql_report": "public.profiles | profiles_select_policy | permissive=PERMISSIVE | roles=anon,authenticated | cmd=SELECT | using=true | check="
  },
  {
    "sql_report": "public.profiles | profiles_update_own | permissive=PERMISSIVE | roles=authenticated | cmd=UPDATE | using=((auth.uid() = id) AND (auth.uid() = user_id)) | check=((auth.uid() = id) AND (auth.uid() = user_id))"
  },
  {
    "sql_report": "public.profiles | service_role_all_profiles | permissive=PERMISSIVE | roles=service_role | cmd=ALL | using=true | check=true"
  }
]

select format(
  '%s.%s | trigger=%s | enabled=%s | definition=%s',
  n.nspname,
  c.relname,
  tr.tgname,
  tr.tgenabled,
  pg_get_triggerdef(tr.oid, true)
) as sql_report
from pg_catalog.pg_trigger tr
join pg_catalog.pg_class c
  on c.oid = tr.tgrelid
join pg_catalog.pg_namespace n
  on n.oid = c.relnamespace
where not tr.tgisinternal
  and n.nspname in ('public', 'auth', 'storage')
order by n.nspname, c.relname, tr.tgname;

[
  {
    "sql_report": "auth.users | trigger=on_auth_user_created | enabled=O | definition=CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user()"
  },
  {
    "sql_report": "auth.users | trigger=on_auth_user_created_logging | enabled=O | definition=CREATE TRIGGER on_auth_user_created_logging AFTER INSERT ON auth.users FOR EACH ROW WHEN (new.email_confirmed_at IS NOT NULL OR new.raw_user_meta_data ? 'provider'::text) EXECUTE FUNCTION log_auth_signup()"
  },
  {
    "sql_report": "auth.users | trigger=on_auth_user_updated | enabled=O | definition=CREATE TRIGGER on_auth_user_updated AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_user_updated()"
  },
  {
    "sql_report": "auth.users | trigger=trigger_user_updated | enabled=O | definition=CREATE TRIGGER trigger_user_updated AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_user_updated()"
  },
  {
    "sql_report": "auth.users | trigger=user_update_trigger | enabled=O | definition=CREATE TRIGGER user_update_trigger AFTER UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_user_updated()"
  },
  {
    "sql_report": "public.announcements | trigger=update_announcements_updated_at | enabled=O | definition=CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.branches | trigger=update_branches_updated_at | enabled=O | definition=CREATE TRIGGER update_branches_updated_at BEFORE UPDATE ON branches FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.donations | trigger=tr_donation_completed_update_project | enabled=O | definition=CREATE TRIGGER tr_donation_completed_update_project AFTER UPDATE ON donations FOR EACH ROW WHEN (new.payment_status::text = 'completed'::text AND old.payment_status::text <> 'completed'::text) EXECUTE FUNCTION handle_donation_completed()"
  },
  {
    "sql_report": "public.donations | trigger=tr_log_donation | enabled=O | definition=CREATE TRIGGER tr_log_donation AFTER INSERT OR UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION log_donation()"
  },
  {
    "sql_report": "public.donations | trigger=update_donations_updated_at | enabled=O | definition=CREATE TRIGGER update_donations_updated_at BEFORE UPDATE ON donations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.event_registrations | trigger=on_registration_delete | enabled=O | definition=CREATE TRIGGER on_registration_delete AFTER DELETE ON event_registrations FOR EACH ROW EXECUTE FUNCTION handle_registration_delete()"
  },
  {
    "sql_report": "public.event_registrations | trigger=tr_log_event_registration | enabled=O | definition=CREATE TRIGGER tr_log_event_registration AFTER INSERT ON event_registrations FOR EACH ROW EXECUTE FUNCTION log_event_registration()"
  },
  {
    "sql_report": "public.event_registrations | trigger=update_event_attendee_count_trigger | enabled=O | definition=CREATE TRIGGER update_event_attendee_count_trigger AFTER INSERT OR DELETE ON event_registrations FOR EACH ROW EXECUTE FUNCTION update_event_attendee_count()"
  },
  {
    "sql_report": "public.events | trigger=update_events_updated_at | enabled=O | definition=CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.media | trigger=update_media_updated_at | enabled=O | definition=CREATE TRIGGER update_media_updated_at BEFORE UPDATE ON media FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.memberships | trigger=update_memberships_updated_at | enabled=O | definition=CREATE TRIGGER update_memberships_updated_at BEFORE UPDATE ON memberships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.mosque_registrations | trigger=mosque_reg_updated_at | enabled=O | definition=CREATE TRIGGER mosque_reg_updated_at BEFORE UPDATE ON mosque_registrations FOR EACH ROW EXECUTE FUNCTION update_mosque_reg_updated_at()"
  },
  {
    "sql_report": "public.paystack_transactions | trigger=trigger_update_donation_from_paystack | enabled=O | definition=CREATE TRIGGER trigger_update_donation_from_paystack AFTER UPDATE ON paystack_transactions FOR EACH ROW WHEN (old.status IS DISTINCT FROM new.status) EXECUTE FUNCTION update_donation_from_paystack()"
  },
  {
    "sql_report": "public.paystack_transactions | trigger=trigger_update_project_raised | enabled=O | definition=CREATE TRIGGER trigger_update_project_raised AFTER UPDATE ON paystack_transactions FOR EACH ROW WHEN (new.status IS DISTINCT FROM old.status AND new.status = 'success'::text) EXECUTE FUNCTION update_project_raised_amount()"
  },
  {
    "sql_report": "public.profiles | trigger=log_registration_trigger | enabled=O | definition=CREATE TRIGGER log_registration_trigger AFTER INSERT ON profiles FOR EACH ROW EXECUTE FUNCTION log_user_registration()"
  },
  {
    "sql_report": "public.profiles | trigger=tr_log_user_registration | enabled=O | definition=CREATE TRIGGER tr_log_user_registration AFTER INSERT ON profiles FOR EACH ROW EXECUTE FUNCTION log_user_registration()"
  },
  {
    "sql_report": "public.profiles | trigger=update_profiles_updated_at | enabled=O | definition=CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.profiles | trigger=update_profiles_updated_at_trigger | enabled=O | definition=CREATE TRIGGER update_profiles_updated_at_trigger BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_profiles_updated_at()"
  },
  {
    "sql_report": "public.profiles | trigger=update_users_updated_at | enabled=O | definition=CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.publications | trigger=set_publication_slug_trigger | enabled=O | definition=CREATE TRIGGER set_publication_slug_trigger BEFORE INSERT ON publications FOR EACH ROW EXECUTE FUNCTION set_publication_slug()"
  },
  {
    "sql_report": "public.publications | trigger=update_publications_updated_at | enabled=O | definition=CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON publications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "public.shop_orders_enhanced | trigger=shop_generate_digital_downloads_trigger | enabled=O | definition=CREATE TRIGGER shop_generate_digital_downloads_trigger AFTER UPDATE ON shop_orders_enhanced FOR EACH ROW EXECUTE FUNCTION shop_generate_digital_downloads()"
  },
  {
    "sql_report": "public.shop_orders_enhanced | trigger=shop_reduce_stock_on_payment_trigger | enabled=O | definition=CREATE TRIGGER shop_reduce_stock_on_payment_trigger AFTER UPDATE ON shop_orders_enhanced FOR EACH ROW EXECUTE FUNCTION shop_reduce_stock_on_payment()"
  },
  {
    "sql_report": "public.shop_orders_enhanced | trigger=trg_order_status_history | enabled=O | definition=CREATE TRIGGER trg_order_status_history AFTER UPDATE ON shop_orders_enhanced FOR EACH ROW EXECUTE FUNCTION log_order_status_change()"
  },
  {
    "sql_report": "public.testimonials | trigger=update_testimonials_updated_at | enabled=O | definition=CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON testimonials FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()"
  },
  {
    "sql_report": "storage.buckets | trigger=enforce_bucket_name_length_trigger | enabled=O | definition=CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length()"
  },
  {
    "sql_report": "storage.buckets | trigger=protect_buckets_delete | enabled=O | definition=CREATE TRIGGER protect_buckets_delete BEFORE DELETE ON storage.buckets FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete()"
  },
  {
    "sql_report": "storage.objects | trigger=protect_objects_delete | enabled=O | definition=CREATE TRIGGER protect_objects_delete BEFORE DELETE ON storage.objects FOR EACH STATEMENT EXECUTE FUNCTION storage.protect_delete()"
  },
  {
    "sql_report": "storage.objects | trigger=update_objects_updated_at | enabled=O | definition=CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column()"
  }
]

select format(
  '%s.%s(%s) | returns=%s | language=%s | security=%s | volatility=%s',
  n.nspname,
  p.proname,
  pg_get_function_identity_arguments(p.oid),
  pg_get_function_result(p.oid),
  l.lanname,
  case when p.prosecdef then 'definer' else 'invoker' end,
  p.provolatile
) as sql_report
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n
  on n.oid = p.pronamespace
join pg_catalog.pg_language l
  on l.oid = p.prolang
where n.nspname in ('public', 'storage')
order by
  n.nspname,
  p.proname,
  pg_get_function_identity_arguments(p.oid);

  [
  {
    "sql_report": "public.decrement_attendee_count(event_id uuid) | returns=void | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.ensure_storage_bucket_exists() | returns=void | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.generate_slug(title text) | returns=text | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.get_dashboard_stats() | returns=json | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.get_project_progress(project_id uuid) | returns=TABLE(id uuid, title text, amount_raised bigint, goal bigint, progress_percentage numeric, is_funded boolean, days_remaining integer) | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.get_user_2fa_status(user_uuid uuid) | returns=TABLE(is_enabled boolean, setup_at timestamp with time zone, verified_at timestamp with time zone, has_backup_codes boolean) | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.get_user_stats(p_user_id uuid) | returns=json | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.handle_donation_completed() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.handle_new_user() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.handle_oauth_user_signup_complete() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.handle_registration_delete() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.handle_user_updated() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.increment_attendee_count(event_id uuid) | returns=void | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.increment_download_count(table_name text, record_id uuid) | returns=void | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.increment_project_raised(project_id uuid, amount bigint) | returns=void | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.increment_view_count(table_name text, record_id uuid) | returns=void | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.is_admin(user_id uuid) | returns=boolean | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.is_authenticated() | returns=boolean | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.is_current_user_admin() | returns=boolean | language=sql | security=definer | volatility=s"
  },
  {
    "sql_report": "public.log_activity(p_user_id uuid, p_action character varying, p_entity_type character varying, p_entity_id uuid, p_details jsonb) | returns=uuid | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.log_auth_signup() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.log_donation() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.log_event_registration() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.log_order_status_change() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.log_user_activity(p_user_id uuid, p_action text, p_description text, p_metadata jsonb) | returns=uuid | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.log_user_activity(p_user_id uuid, p_action text, p_entity_type text, p_entity_id uuid, p_description text, p_metadata jsonb) | returns=uuid | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.log_user_registration() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.rls_auto_enable() | returns=event_trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.set_publication_slug() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.shop_calculate_order_total(p_subtotal numeric, p_shipping_fee numeric, p_discount_amount numeric) | returns=numeric | language=plpgsql | security=invoker | volatility=i"
  },
  {
    "sql_report": "public.shop_calculate_shipping_fee(p_order_id uuid) | returns=numeric | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "public.shop_generate_digital_downloads() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.shop_increment_promo_usage(p_promo_id uuid) | returns=void | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.shop_reduce_stock_on_payment() | returns=trigger | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "public.shop_validate_promo_code(p_code text) | returns=TABLE(id uuid, code text, discount_type text, discount_value numeric, is_valid boolean, error_message text) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "public.update_donation_from_paystack() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.update_event_attendee_count() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.update_mosque_reg_updated_at() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.update_profiles_updated_at() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.update_project_raised_amount() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.update_updated_at_column() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "public.verify_profile_sync() | returns=TABLE(total_auth_users bigint, total_profiles bigint, missing_profiles bigint) | language=plpgsql | security=definer | volatility=v"
  },
  {
    "sql_report": "storage.allow_any_operation(expected_operations text[]) | returns=boolean | language=sql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.allow_only_operation(expected_operation text) | returns=boolean | language=sql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) | returns=void | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "storage.enforce_bucket_name_length() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "storage.extension(name text) | returns=text | language=plpgsql | security=invoker | volatility=i"
  },
  {
    "sql_report": "storage.filename(name text) | returns=text | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "storage.foldername(name text) | returns=text[] | language=plpgsql | security=invoker | volatility=i"
  },
  {
    "sql_report": "storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text) | returns=text | language=sql | security=invoker | volatility=i"
  },
  {
    "sql_report": "storage.get_size_by_bucket() | returns=TABLE(size bigint, bucket_id text) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer, next_key_token text, next_upload_token text) | returns=TABLE(key text, id text, created_at timestamp with time zone) | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer, start_after text, next_token text, sort_order text) | returns=TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.operation() | returns=text | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.protect_delete() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  },
  {
    "sql_report": "storage.search(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text) | returns=TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text) | returns=TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.search_v2(prefix text, bucket_name text, limits integer, levels integer, start_after text, sort_order text, sort_column text, sort_column_after text) | returns=TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb) | language=plpgsql | security=invoker | volatility=s"
  },
  {
    "sql_report": "storage.update_updated_at_column() | returns=trigger | language=plpgsql | security=invoker | volatility=v"
  }
]

select pg_get_functiondef(p.oid) as sql_report
from pg_catalog.pg_proc p
join pg_catalog.pg_namespace n
  on n.oid = p.pronamespace
where n.nspname in ('public', 'storage')
order by
  n.nspname,
  p.proname,
  pg_get_function_identity_arguments(p.oid);

  [
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.decrement_attendee_count(event_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE public.events\n  SET current_attendees = GREATEST(COALESCE(current_attendees, 0) - 1, 0)\n  WHERE id = event_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.ensure_storage_bucket_exists()\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- Note: Bucket creation is typically handled via Supabase dashboard\n  -- or via application startup code using admin client\n  -- This is a placeholder for documentation\n  RAISE NOTICE 'Ensure profile-pictures bucket exists with RLS enabled';\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.generate_slug(title text)\n RETURNS text\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  slug TEXT;\n  base_slug TEXT;\n  counter INTEGER := 0;\nBEGIN\n  -- Convert to lowercase, replace spaces with hyphens, remove special chars\n  base_slug := LOWER(REGEXP_REPLACE(REGEXP_REPLACE(title, '[^a-zA-Z0-9\\s-]', '', 'g'), '\\s+', '-', 'g'));\n  slug := base_slug;\n  \n  -- Check for uniqueness and add counter if needed\n  WHILE EXISTS (SELECT 1 FROM public.publications WHERE publications.slug = slug) LOOP\n    counter := counter + 1;\n    slug := base_slug || '-' || counter;\n  END LOOP;\n  \n  RETURN slug;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.get_dashboard_stats()\n RETURNS json\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  result JSON;\nBEGIN\n  SELECT json_build_object(\n    'total_members', (SELECT COUNT(*) FROM public.profiles WHERE role = 'member' AND is_active = true),\n    'total_events', (SELECT COUNT(*) FROM public.events WHERE event_date >= CURRENT_DATE),\n    'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE payment_status = 'completed'),\n    'total_branches', (SELECT COUNT(*) FROM public.branches WHERE is_active = true),\n    'new_members_this_month', (SELECT COUNT(*) FROM public.profiles WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)),\n    'donations_this_month', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE) AND payment_status = 'completed')\n  ) INTO result;\n  \n  RETURN result;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.get_project_progress(project_id uuid)\n RETURNS TABLE(id uuid, title text, amount_raised bigint, goal bigint, progress_percentage numeric, is_funded boolean, days_remaining integer)\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT \n    dp.id,\n    dp.title,\n    dp.amount_raised,\n    dp.goal,\n    CASE \n      WHEN dp.goal = 0 THEN 0::DECIMAL\n      ELSE (CAST(dp.amount_raised AS DECIMAL) / dp.goal * 100)::DECIMAL\n    END,\n    dp.amount_raised >= dp.goal,\n    CASE \n      WHEN dp.deadline IS NULL THEN NULL::INTEGER\n      ELSE EXTRACT(DAY FROM (dp.deadline - NOW()))::INTEGER\n    END\n  FROM donation_projects dp\n  WHERE dp.id = project_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.get_user_2fa_status(user_uuid uuid)\n RETURNS TABLE(is_enabled boolean, setup_at timestamp with time zone, verified_at timestamp with time zone, has_backup_codes boolean)\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT \n    user_2fa_secrets.is_enabled,\n    user_2fa_secrets.setup_at,\n    user_2fa_secrets.verified_at,\n    (array_length(user_2fa_secrets.backup_codes, 1) > 0)\n  FROM public.user_2fa_secrets\n  WHERE user_2fa_secrets.user_id = user_uuid;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.get_user_stats(p_user_id uuid)\n RETURNS json\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  result JSON;\nBEGIN\n  SELECT json_build_object(\n    'total_donations', (SELECT COALESCE(SUM(amount), 0) FROM public.donations WHERE user_id = p_user_id AND payment_status = 'completed'),\n    'events_attended', (SELECT COUNT(*) FROM public.event_registrations WHERE user_id = p_user_id AND attendance_status = 'attended'),\n    'events_registered', (SELECT COUNT(*) FROM public.event_registrations WHERE user_id = p_user_id),\n    'total_points', (SELECT COALESCE(SUM(points), 0) FROM public.reward_points WHERE user_id = p_user_id),\n    'badges_earned', (SELECT COUNT(*) FROM public.user_badges WHERE user_id = p_user_id)\n  ) INTO result;\n  \n  RETURN result;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.handle_donation_completed()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  -- If donation status is being updated to 'completed' and project_id exists\n  IF NEW.payment_status = 'completed' AND NEW.project_id IS NOT NULL THEN\n    UPDATE donation_projects\n    SET \n      amount_raised = COALESCE(amount_raised, 0) + NEW.amount,\n      updated_at = NOW()\n    WHERE id = NEW.project_id;\n  END IF;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.handle_new_user()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public', 'auth'\nAS $function$\r\nDECLARE\r\n  v_provider TEXT;\r\nBEGIN\r\n  -- Log execution\r\n  RAISE LOG 'handle_new_user: Creating profile for user ID: %, Email: %', NEW.id, NEW.email;\r\n  \r\n  -- Validate we have an ID\r\n  IF NEW.id IS NULL THEN\r\n    RAISE EXCEPTION 'Cannot create profile: auth.users.id is NULL';\r\n  END IF;\r\n  \r\n  -- Extract OAuth provider ONLY from raw_user_meta_data\r\n  v_provider := COALESCE(\r\n    NEW.raw_user_meta_data->>'provider',\r\n    'email'\r\n  );\r\n  \r\n  -- Single insert with ON CONFLICT to handle any race conditions\r\n  INSERT INTO public.profiles (\r\n    id,\r\n    user_id,\r\n    email,\r\n    first_name,\r\n    last_name,\r\n    avatar_url,\r\n    oauth_provider,\r\n    email_verified,\r\n    is_active,\r\n    role,\r\n    created_at,\r\n    updated_at\r\n  )\r\n  VALUES (\r\n    NEW.id,\r\n    NEW.id,\r\n    NEW.email,\r\n    COALESCE(NEW.raw_user_meta_data->>'given_name', NEW.raw_user_meta_data->>'first_name', ''),\r\n    COALESCE(NEW.raw_user_meta_data->>'family_name', NEW.raw_user_meta_data->>'last_name', ''),\r\n    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', ''),\r\n    v_provider,\r\n    COALESCE(NEW.email_confirmed_at IS NOT NULL, false),\r\n    true,\r\n    'user',\r\n    NOW(),\r\n    NOW()\r\n  )\r\n  ON CONFLICT (id) DO UPDATE SET\r\n    email = EXCLUDED.email,\r\n    oauth_provider = COALESCE(EXCLUDED.oauth_provider, profiles.oauth_provider),\r\n    updated_at = NOW();\r\n  \r\n  RAISE LOG 'handle_new_user: Successfully created profile for user %', NEW.id;\r\n  RETURN NEW;\r\n  \r\nEXCEPTION\r\n  WHEN others THEN\r\n    RAISE LOG 'handle_new_user ERROR for user %: % (SQLSTATE: %)', NEW.id, SQLERRM, SQLSTATE;\r\n    -- Re-raise to see the actual error\r\n    RAISE;\r\nEND;\r\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.handle_oauth_user_signup_complete()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nDECLARE\n  v_provider TEXT;\n  v_error_msg TEXT;\nBEGIN\n  -- Log the trigger execution\n  RAISE NOTICE 'OAuth signup trigger: user_id=%, email=%', NEW.id, NEW.email;\n  \n  -- Extract provider from OAuth metadata\n  v_provider := COALESCE(NEW.raw_user_meta_data->>'provider', 'email');\n  \n  -- Validate user ID is not NULL\n  IF NEW.id IS NULL THEN\n    RAISE EXCEPTION 'Cannot create profile: auth.users.id is NULL';\n  END IF;\n  \n  BEGIN\n    -- Insert or update profile with EXPLICIT user_id = id mapping\n    INSERT INTO public.profiles (\n      id,\n      user_id,\n      email,\n      role,\n      is_active,\n      oauth_provider,\n      created_at,\n      updated_at\n    )\n    VALUES (\n      NEW.id,                                   -- id column\n      NEW.id,                                   -- user_id column (MUST match id)\n      COALESCE(NEW.email, ''),                 -- email\n      'user',                                   -- default role\n      true,                                     -- default active\n      v_provider,                               -- oauth provider\n      NOW(),                                    -- creation timestamp\n      NOW()                                     -- update timestamp\n    )\n    ON CONFLICT (id) DO UPDATE SET\n      user_id = COALESCE(NEW.id, profiles.user_id),\n      email = COALESCE(EXCLUDED.email, profiles.email),\n      oauth_provider = CASE\n        WHEN profiles.oauth_provider IS NULL THEN v_provider\n        ELSE profiles.oauth_provider\n      END,\n      updated_at = NOW()\n    WHERE profiles.id = NEW.id;\n    \n  EXCEPTION WHEN OTHERS THEN\n    v_error_msg := SQLERRM;\n    RAISE NOTICE 'Error in handle_oauth_user_signup_complete for user %: %', NEW.id, v_error_msg;\n    -- Continue without blocking auth\n  END;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.handle_registration_delete()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  PERFORM public.decrement_attendee_count(OLD.event_id);\n  RETURN OLD;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.handle_user_updated()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nBEGIN\n  UPDATE public.profiles\n  SET \n    email_verified = COALESCE(NEW.email_confirmed_at IS NOT NULL, email_verified),\n    updated_at = NOW()\n  WHERE id = NEW.id;\n  \n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.increment_attendee_count(event_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE public.events\n  SET current_attendees = COALESCE(current_attendees, 0) + 1\n  WHERE id = event_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.increment_download_count(table_name text, record_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  EXECUTE format('UPDATE public.%I SET download_count = COALESCE(download_count, 0) + 1 WHERE id = $1', table_name)\n  USING record_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.increment_project_raised(project_id uuid, amount bigint)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  UPDATE donation_projects\n  SET \n    amount_raised = COALESCE(amount_raised, 0) + amount,\n    updated_at = NOW()\n  WHERE id = project_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.increment_view_count(table_name text, record_id uuid)\n RETURNS void\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  EXECUTE format('UPDATE public.%I SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1', table_name)\n  USING record_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  RETURN EXISTS (\n    SELECT 1 FROM profiles \n    WHERE id = user_id AND is_admin = true\n  );\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.is_authenticated()\n RETURNS boolean\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  RETURN auth.role() = 'authenticated' OR auth.role() = 'service_role';\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.is_current_user_admin()\n RETURNS boolean\n LANGUAGE sql\n STABLE SECURITY DEFINER\nAS $function$\n  SELECT EXISTS (\n    SELECT 1 FROM public.profiles\n    WHERE id = auth.uid()\n      AND role IN ('admin', 'super_admin')\n  );\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_activity(p_user_id uuid, p_action character varying, p_entity_type character varying, p_entity_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT NULL::jsonb)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  log_id UUID;\nBEGIN\n  INSERT INTO public.activity_logs (user_id, action, entity_type, entity_id, details)\n  VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details)\n  RETURNING id INTO log_id;\n  \n  RETURN log_id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_auth_signup()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nBEGIN\n  -- Log user signup event\n  PERFORM public.log_user_activity(\n    NEW.id,\n    'signup',\n    'User registered: ' || COALESCE(NEW.email, 'unknown'),\n    jsonb_build_object(\n      'email', NEW.email,\n      'provider', COALESCE(NEW.raw_user_meta_data ->> 'provider', 'email'),\n      'auth_method', CASE \n        WHEN NEW.raw_user_meta_data ? 'provider' THEN 'oauth'\n        ELSE 'email'\n      END\n    )\n  );\n  \n  RETURN NEW;\nEXCEPTION WHEN OTHERS THEN\n  -- Don't fail auth signup if logging fails\n  RAISE WARNING 'Error logging auth signup: %', SQLERRM;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_donation()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.status = 'completed' THEN\n    PERFORM log_user_activity(\n      NEW.user_id,\n      'donation',\n      'Made a donation of ' || NEW.amount || ' NGN',\n      jsonb_build_object('amount', NEW.amount, 'type', NEW.donation_type, 'project', NEW.project_name)\n    );\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_event_registration()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n  v_event_title TEXT;\nBEGIN\n  SELECT title INTO v_event_title FROM events WHERE id = NEW.event_id;\n  \n  PERFORM log_user_activity(\n    NEW.user_id,\n    'event',\n    'Registered for event: ' || v_event_title,\n    jsonb_build_object('event_id', NEW.event_id, 'event_title', v_event_title)\n  );\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_order_status_change()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.order_status IS DISTINCT FROM OLD.order_status THEN\n    INSERT INTO order_status_history (order_id, status, note, changed_at)\n    VALUES (NEW.id, NEW.order_status, NEW.status_note, now());\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_user_activity(p_user_id uuid, p_action text, p_description text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nDECLARE\n  v_log_id UUID;\nBEGIN\n  -- Validate inputs\n  IF p_user_id IS NULL THEN\n    RAISE WARNING 'log_user_activity called with NULL user_id';\n    RETURN NULL;\n  END IF;\n\n  IF p_action IS NULL OR p_action = '' THEN\n    RAISE WARNING 'log_user_activity called with empty action';\n    RETURN NULL;\n  END IF;\n\n  -- Insert log entry\n  INSERT INTO public.user_logs (\n    user_id,\n    action,\n    description,\n    metadata\n  )\n  VALUES (\n    p_user_id,\n    COALESCE(p_action, 'unknown'),\n    p_description,\n    COALESCE(p_metadata, '{}')\n  )\n  ON CONFLICT DO NOTHING\n  RETURNING id INTO v_log_id;\n\n  RETURN v_log_id;\n\nEXCEPTION WHEN OTHERS THEN\n  -- Log errors but don't fail the calling operation\n  RAISE WARNING 'Error in log_user_activity: %', SQLERRM;\n  RETURN NULL;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_user_activity(p_user_id uuid, p_action text, p_entity_type text, p_entity_id uuid, p_description text DEFAULT NULL::text, p_metadata jsonb DEFAULT '{}'::jsonb)\n RETURNS uuid\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nDECLARE\n  v_log_id UUID;\nBEGIN\n  -- Validate inputs\n  IF p_user_id IS NULL THEN\n    RAISE WARNING 'log_user_activity called with NULL user_id';\n    RETURN NULL;\n  END IF;\n\n  IF p_action IS NULL OR p_action = '' THEN\n    RAISE WARNING 'log_user_activity called with empty action';\n    RETURN NULL;\n  END IF;\n\n  -- Insert log entry with entity tracking\n  INSERT INTO public.user_logs (\n    user_id,\n    action,\n    entity_type,\n    entity_id,\n    description,\n    metadata\n  )\n  VALUES (\n    p_user_id,\n    COALESCE(p_action, 'unknown'),\n    p_entity_type,\n    p_entity_id,\n    p_description,\n    COALESCE(p_metadata, '{}')\n  )\n  ON CONFLICT DO NOTHING\n  RETURNING id INTO v_log_id;\n\n  RETURN v_log_id;\n\nEXCEPTION WHEN OTHERS THEN\n  RAISE WARNING 'Error in log_user_activity (extended): %', SQLERRM;\n  RETURN NULL;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.log_user_registration()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  PERFORM log_user_activity(\r\n    NEW.id,\r\n    'registration',\r\n    'New user registered',\r\n    jsonb_build_object(\r\n      'email', NEW.email,\r\n      'first_name', NEW.first_name,\r\n      'last_name', NEW.last_name,\r\n      'phone', NEW.phone,\r\n      'membership_type', NEW.membership_type\r\n    )\r\n  );\r\n\r\n  RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.rls_auto_enable()\n RETURNS event_trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'pg_catalog'\nAS $function$\nDECLARE\n  cmd record;\nBEGIN\n  FOR cmd IN\n    SELECT *\n    FROM pg_event_trigger_ddl_commands()\n    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')\n      AND object_type IN ('table','partitioned table')\n  LOOP\n     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN\n      BEGIN\n        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);\n        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;\n      EXCEPTION\n        WHEN OTHERS THEN\n          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;\n      END;\n     ELSE\n        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;\n     END IF;\n  END LOOP;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.set_publication_slug()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.slug IS NULL OR NEW.slug = '' THEN\n    NEW.slug := public.generate_slug(NEW.title);\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_calculate_order_total(p_subtotal numeric, p_shipping_fee numeric DEFAULT 0, p_discount_amount numeric DEFAULT 0)\n RETURNS numeric\n LANGUAGE plpgsql\n IMMUTABLE\nAS $function$\nBEGIN\n  RETURN p_subtotal + p_shipping_fee - p_discount_amount;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_calculate_shipping_fee(p_order_id uuid)\n RETURNS numeric\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n  v_has_physical BOOLEAN;\nBEGIN\n  SELECT EXISTS(\n    SELECT 1 FROM shop_order_items_enhanced \n    WHERE order_id = p_order_id AND product_type = 'physical'\n  ) INTO v_has_physical;\n  \n  -- Free shipping if only digital products, otherwise flat 1500 NGN\n  RETURN CASE WHEN v_has_physical THEN 1500::NUMERIC ELSE 0::NUMERIC END;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_generate_digital_downloads()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nDECLARE\n  v_item RECORD;\n  v_token TEXT;\nBEGIN\n  -- Only process when payment_status changes to 'paid'\n  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN\n    -- Generate download token for each digital product in the order\n    FOR v_item IN\n      SELECT oi.* FROM shop_order_items_enhanced oi\n      WHERE oi.order_id = NEW.id AND oi.product_type = 'digital'\n    LOOP\n      -- Generate a secure random token\n      v_token := encode(gen_random_bytes(32), 'hex');\n      \n      INSERT INTO shop_digital_downloads (\n        order_id,\n        order_item_id,\n        product_id,\n        download_token,\n        expires_at,\n        max_downloads\n      ) VALUES (\n        NEW.id,\n        v_item.id,\n        v_item.product_id,\n        v_token,\n        now() + INTERVAL '72 hours',\n        3\n      );\n    END LOOP;\n    \n    -- Mark order as having digital products\n    UPDATE shop_orders_enhanced \n    SET has_digital = (\n      EXISTS (\n        SELECT 1 FROM shop_order_items_enhanced \n        WHERE order_id = NEW.id AND product_type = 'digital'\n      )\n    )\n    WHERE id = NEW.id;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_increment_promo_usage(p_promo_id uuid)\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  UPDATE shop_promo_codes\n  SET used_count = used_count + 1\n  WHERE id = p_promo_id AND (max_uses IS NULL OR used_count < max_uses);\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_reduce_stock_on_payment()\n RETURNS trigger\n LANGUAGE plpgsql\n SECURITY DEFINER\nAS $function$\nBEGIN\n  -- Only process when payment_status changes to 'paid'\n  IF NEW.payment_status = 'paid' AND OLD.payment_status != 'paid' THEN\n    -- Reduce stock for each non-digital order item\n    UPDATE shop_products_enhanced p\n    SET stock = stock - oi.quantity\n    FROM shop_order_items_enhanced oi\n    WHERE oi.order_id = NEW.id\n      AND oi.product_id = p.id\n      AND oi.product_type = 'physical';\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.shop_validate_promo_code(p_code text)\n RETURNS TABLE(id uuid, code text, discount_type text, discount_value numeric, is_valid boolean, error_message text)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT\n    pc.id,\n    pc.code,\n    pc.discount_type,\n    pc.discount_value,\n    (pc.is_active \n      AND (pc.expires_at IS NULL OR pc.expires_at > now())\n      AND (pc.max_uses IS NULL OR pc.used_count < pc.max_uses)\n    )::BOOLEAN AS is_valid,\n    CASE\n      WHEN NOT pc.is_active THEN 'Promo code is no longer active'\n      WHEN pc.expires_at IS NOT NULL AND pc.expires_at <= now() THEN 'Promo code has expired'\n      WHEN pc.max_uses IS NOT NULL AND pc.used_count >= pc.max_uses THEN 'Promo code has reached maximum uses'\n      ELSE NULL\n    END AS error_message\n  FROM shop_promo_codes pc\n  WHERE pc.code = p_code\n  LIMIT 1;\n  \n  -- If no code found\n  IF NOT FOUND THEN\n    RETURN QUERY SELECT\n      NULL::UUID,\n      p_code,\n      NULL::TEXT,\n      NULL::NUMERIC,\n      FALSE::BOOLEAN,\n      'Promo code not found'::TEXT;\n  END IF;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_donation_from_paystack()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  IF NEW.status = 'success' THEN\n    UPDATE donations \n    SET payment_status = 'completed', updated_at = CURRENT_TIMESTAMP\n    WHERE id = NEW.donation_id;\n  ELSIF NEW.status = 'failed' THEN\n    UPDATE donations \n    SET payment_status = 'failed', updated_at = CURRENT_TIMESTAMP\n    WHERE id = NEW.donation_id;\n  END IF;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_event_attendee_count()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    IF TG_OP = 'INSERT' THEN\n        UPDATE events \n        SET current_attendees = current_attendees + 1 \n        WHERE id = NEW.event_id;\n        RETURN NEW;\n    ELSIF TG_OP = 'DELETE' THEN\n        UPDATE events \n        SET current_attendees = current_attendees - 1 \n        WHERE id = OLD.event_id;\n        RETURN OLD;\n    END IF;\n    RETURN NULL;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_mosque_reg_updated_at()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\r\nBEGIN\r\n  NEW.updated_at = NOW();\r\n  RETURN NEW;\r\nEND;\r\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  NEW.updated_at = CURRENT_TIMESTAMP;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_project_raised_amount()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  UPDATE donation_projects\n  SET raised = (\n    SELECT COALESCE(SUM(amount), 0)\n    FROM paystack_transactions pt\n    JOIN donations d ON pt.donation_id = d.id\n    WHERE d.project_id = NEW.project_id AND pt.status = 'success'\n  ),\n  updated_at = CURRENT_TIMESTAMP\n  WHERE id = NEW.project_id;\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.update_updated_at_column()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  NEW.updated_at = NOW();\n  RETURN NEW;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION public.verify_profile_sync()\n RETURNS TABLE(total_auth_users bigint, total_profiles bigint, missing_profiles bigint)\n LANGUAGE plpgsql\n SECURITY DEFINER\n SET search_path TO 'public'\nAS $function$\nBEGIN\n  RETURN QUERY\n  SELECT \n    COUNT(DISTINCT au.id)::BIGINT,\n    COUNT(DISTINCT p.id)::BIGINT,\n    (COUNT(DISTINCT au.id) - COUNT(DISTINCT p.id))::BIGINT\n  FROM auth.users au\n  LEFT JOIN public.profiles p ON au.id = p.id;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.allow_any_operation(expected_operations text[])\n RETURNS boolean\n LANGUAGE sql\n STABLE\nAS $function$\n  WITH current_operation AS (\n    SELECT storage.operation() AS raw_operation\n  ),\n  normalized AS (\n    SELECT CASE\n      WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)\n      ELSE raw_operation\n    END AS current_operation\n    FROM current_operation\n  )\n  SELECT EXISTS (\n    SELECT 1\n    FROM normalized n\n    CROSS JOIN LATERAL unnest(expected_operations) AS expected_operation\n    WHERE expected_operation IS NOT NULL\n      AND expected_operation <> ''\n      AND n.current_operation = CASE\n        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)\n        ELSE expected_operation\n      END\n  );\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.allow_only_operation(expected_operation text)\n RETURNS boolean\n LANGUAGE sql\n STABLE\nAS $function$\n  WITH current_operation AS (\n    SELECT storage.operation() AS raw_operation\n  ),\n  normalized AS (\n    SELECT\n      CASE\n        WHEN raw_operation LIKE 'storage.%' THEN substr(raw_operation, 9)\n        ELSE raw_operation\n      END AS current_operation,\n      CASE\n        WHEN expected_operation LIKE 'storage.%' THEN substr(expected_operation, 9)\n        ELSE expected_operation\n      END AS requested_operation\n    FROM current_operation\n  )\n  SELECT CASE\n    WHEN requested_operation IS NULL OR requested_operation = '' THEN FALSE\n    ELSE COALESCE(current_operation = requested_operation, FALSE)\n  END\n  FROM normalized;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)\n RETURNS void\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n  INSERT INTO \"storage\".\"objects\" (\"bucket_id\", \"name\", \"owner\", \"metadata\") VALUES (bucketid, name, owner, metadata);\n  -- hack to rollback the successful insert\n  RAISE sqlstate 'PT200' using\n  message = 'ROLLBACK',\n  detail = 'rollback successful insert';\nEND\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.enforce_bucket_name_length()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nbegin\n    if length(new.name) > 100 then\n        raise exception 'bucket name \"%\" is too long (% characters). Max is 100.', new.name, length(new.name);\n    end if;\n    return new;\nend;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.extension(name text)\n RETURNS text\n LANGUAGE plpgsql\n IMMUTABLE\nAS $function$\nDECLARE\n    _parts text[];\n    _filename text;\nBEGIN\n    -- Split on \"/\" to get path segments\n    SELECT string_to_array(name, '/') INTO _parts;\n    -- Get the last path segment (the actual filename)\n    SELECT _parts[array_length(_parts, 1)] INTO _filename;\n    -- Extract extension: reverse, split on '.', then reverse again\n    RETURN reverse(split_part(reverse(_filename), '.', 1));\nEND\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.filename(name text)\n RETURNS text\n LANGUAGE plpgsql\nAS $function$\nDECLARE\n_parts text[];\nBEGIN\n\tselect string_to_array(name, '/') into _parts;\n\treturn _parts[array_length(_parts,1)];\nEND\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.foldername(name text)\n RETURNS text[]\n LANGUAGE plpgsql\n IMMUTABLE\nAS $function$\nDECLARE\n    _parts text[];\nBEGIN\n    -- Split on \"/\" to get path segments\n    SELECT string_to_array(name, '/') INTO _parts;\n    -- Return everything except the last segment\n    RETURN _parts[1 : array_length(_parts,1) - 1];\nEND\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.get_common_prefix(p_key text, p_prefix text, p_delimiter text)\n RETURNS text\n LANGUAGE sql\n IMMUTABLE\nAS $function$\nSELECT CASE\n    WHEN position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)) > 0\n    THEN left(p_key, length(p_prefix) + position(p_delimiter IN substring(p_key FROM length(p_prefix) + 1)))\n    ELSE NULL\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.get_size_by_bucket()\n RETURNS TABLE(size bigint, bucket_id text)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nBEGIN\n    return query\n        select sum((metadata->>'size')::bigint)::bigint as size, obj.bucket_id\n        from \"storage\".objects as obj\n        group by obj.bucket_id;\nEND\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text)\n RETURNS TABLE(key text, id text, created_at timestamp with time zone)\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    RETURN QUERY EXECUTE\n        'SELECT DISTINCT ON(key COLLATE \"C\") * from (\n            SELECT\n                CASE\n                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN\n                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))\n                    ELSE\n                        key\n                END AS key, id, created_at\n            FROM\n                storage.s3_multipart_uploads\n            WHERE\n                bucket_id = $5 AND\n                key ILIKE $1 || ''%'' AND\n                CASE\n                    WHEN $4 != '''' AND $6 = '''' THEN\n                        CASE\n                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN\n                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE \"C\" > $4\n                            ELSE\n                                key COLLATE \"C\" > $4\n                            END\n                    ELSE\n                        true\n                END AND\n                CASE\n                    WHEN $6 != '''' THEN\n                        id COLLATE \"C\" > $6\n                    ELSE\n                        true\n                    END\n            ORDER BY\n                key COLLATE \"C\" ASC, created_at ASC) as e order by key COLLATE \"C\" LIMIT $3'\n        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.list_objects_with_delimiter(_bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text)\n RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    v_peek_name TEXT;\n    v_current RECORD;\n    v_common_prefix TEXT;\n\n    -- Configuration\n    v_is_asc BOOLEAN;\n    v_prefix TEXT;\n    v_start TEXT;\n    v_upper_bound TEXT;\n    v_file_batch_size INT;\n\n    -- Seek state\n    v_next_seek TEXT;\n    v_count INT := 0;\n\n    -- Dynamic SQL for batch query only\n    v_batch_query TEXT;\n\nBEGIN\n    -- ========================================================================\n    -- INITIALIZATION\n    -- ========================================================================\n    v_is_asc := lower(coalesce(sort_order, 'asc')) = 'asc';\n    v_prefix := coalesce(prefix_param, '');\n    v_start := CASE WHEN coalesce(next_token, '') <> '' THEN next_token ELSE coalesce(start_after, '') END;\n    v_file_batch_size := LEAST(GREATEST(max_keys * 2, 100), 1000);\n\n    -- Calculate upper bound for prefix filtering (bytewise, using COLLATE \"C\")\n    IF v_prefix = '' THEN\n        v_upper_bound := NULL;\n    ELSIF right(v_prefix, 1) = delimiter_param THEN\n        v_upper_bound := left(v_prefix, -1) || chr(ascii(delimiter_param) + 1);\n    ELSE\n        v_upper_bound := left(v_prefix, -1) || chr(ascii(right(v_prefix, 1)) + 1);\n    END IF;\n\n    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)\n    IF v_is_asc THEN\n        IF v_upper_bound IS NOT NULL THEN\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE \"C\" >= $2 ' ||\n                'AND o.name COLLATE \"C\" < $3 ORDER BY o.name COLLATE \"C\" ASC LIMIT $4';\n        ELSE\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE \"C\" >= $2 ' ||\n                'ORDER BY o.name COLLATE \"C\" ASC LIMIT $4';\n        END IF;\n    ELSE\n        IF v_upper_bound IS NOT NULL THEN\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE \"C\" < $2 ' ||\n                'AND o.name COLLATE \"C\" >= $3 ORDER BY o.name COLLATE \"C\" DESC LIMIT $4';\n        ELSE\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND o.name COLLATE \"C\" < $2 ' ||\n                'ORDER BY o.name COLLATE \"C\" DESC LIMIT $4';\n        END IF;\n    END IF;\n\n    -- ========================================================================\n    -- SEEK INITIALIZATION: Determine starting position\n    -- ========================================================================\n    IF v_start = '' THEN\n        IF v_is_asc THEN\n            v_next_seek := v_prefix;\n        ELSE\n            -- DESC without cursor: find the last item in range\n            IF v_upper_bound IS NOT NULL THEN\n                SELECT o.name INTO v_next_seek FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" >= v_prefix AND o.name COLLATE \"C\" < v_upper_bound\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            ELSIF v_prefix <> '' THEN\n                SELECT o.name INTO v_next_seek FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" >= v_prefix\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            ELSE\n                SELECT o.name INTO v_next_seek FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            END IF;\n\n            IF v_next_seek IS NOT NULL THEN\n                v_next_seek := v_next_seek || delimiter_param;\n            ELSE\n                RETURN;\n            END IF;\n        END IF;\n    ELSE\n        -- Cursor provided: determine if it refers to a folder or leaf\n        IF EXISTS (\n            SELECT 1 FROM storage.objects o\n            WHERE o.bucket_id = _bucket_id\n              AND o.name COLLATE \"C\" LIKE v_start || delimiter_param || '%'\n            LIMIT 1\n        ) THEN\n            -- Cursor refers to a folder\n            IF v_is_asc THEN\n                v_next_seek := v_start || chr(ascii(delimiter_param) + 1);\n            ELSE\n                v_next_seek := v_start || delimiter_param;\n            END IF;\n        ELSE\n            -- Cursor refers to a leaf object\n            IF v_is_asc THEN\n                v_next_seek := v_start || delimiter_param;\n            ELSE\n                v_next_seek := v_start;\n            END IF;\n        END IF;\n    END IF;\n\n    -- ========================================================================\n    -- MAIN LOOP: Hybrid peek-then-batch algorithm\n    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch\n    -- ========================================================================\n    LOOP\n        EXIT WHEN v_count >= max_keys;\n\n        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)\n        IF v_is_asc THEN\n            IF v_upper_bound IS NOT NULL THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" >= v_next_seek AND o.name COLLATE \"C\" < v_upper_bound\n                ORDER BY o.name COLLATE \"C\" ASC LIMIT 1;\n            ELSE\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" >= v_next_seek\n                ORDER BY o.name COLLATE \"C\" ASC LIMIT 1;\n            END IF;\n        ELSE\n            IF v_upper_bound IS NOT NULL THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" < v_next_seek AND o.name COLLATE \"C\" >= v_prefix\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            ELSIF v_prefix <> '' THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" < v_next_seek AND o.name COLLATE \"C\" >= v_prefix\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            ELSE\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = _bucket_id AND o.name COLLATE \"C\" < v_next_seek\n                ORDER BY o.name COLLATE \"C\" DESC LIMIT 1;\n            END IF;\n        END IF;\n\n        EXIT WHEN v_peek_name IS NULL;\n\n        -- STEP 2: Check if this is a FOLDER or FILE\n        v_common_prefix := storage.get_common_prefix(v_peek_name, v_prefix, delimiter_param);\n\n        IF v_common_prefix IS NOT NULL THEN\n            -- FOLDER: Emit and skip to next folder (no heap access needed)\n            name := rtrim(v_common_prefix, delimiter_param);\n            id := NULL;\n            updated_at := NULL;\n            created_at := NULL;\n            last_accessed_at := NULL;\n            metadata := NULL;\n            RETURN NEXT;\n            v_count := v_count + 1;\n\n            -- Advance seek past the folder range\n            IF v_is_asc THEN\n                v_next_seek := left(v_common_prefix, -1) || chr(ascii(delimiter_param) + 1);\n            ELSE\n                v_next_seek := v_common_prefix;\n            END IF;\n        ELSE\n            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)\n            -- For ASC: upper_bound is the exclusive upper limit (< condition)\n            -- For DESC: prefix is the inclusive lower limit (>= condition)\n            FOR v_current IN EXECUTE v_batch_query USING _bucket_id, v_next_seek,\n                CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix) ELSE v_prefix END, v_file_batch_size\n            LOOP\n                v_common_prefix := storage.get_common_prefix(v_current.name, v_prefix, delimiter_param);\n\n                IF v_common_prefix IS NOT NULL THEN\n                    -- Hit a folder: exit batch, let peek handle it\n                    v_next_seek := v_current.name;\n                    EXIT;\n                END IF;\n\n                -- Emit file\n                name := v_current.name;\n                id := v_current.id;\n                updated_at := v_current.updated_at;\n                created_at := v_current.created_at;\n                last_accessed_at := v_current.last_accessed_at;\n                metadata := v_current.metadata;\n                RETURN NEXT;\n                v_count := v_count + 1;\n\n                -- Advance seek past this file\n                IF v_is_asc THEN\n                    v_next_seek := v_current.name || delimiter_param;\n                ELSE\n                    v_next_seek := v_current.name;\n                END IF;\n\n                EXIT WHEN v_count >= max_keys;\n            END LOOP;\n        END IF;\n    END LOOP;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.operation()\n RETURNS text\n LANGUAGE plpgsql\n STABLE\nAS $function$\nBEGIN\n    RETURN current_setting('storage.operation', true);\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.protect_delete()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    -- Check if storage.allow_delete_query is set to 'true'\n    IF COALESCE(current_setting('storage.allow_delete_query', true), 'false') != 'true' THEN\n        RAISE EXCEPTION 'Direct deletion from storage tables is not allowed. Use the Storage API instead.'\n            USING HINT = 'This prevents accidental data loss from orphaned objects.',\n                  ERRCODE = '42501';\n    END IF;\n    RETURN NULL;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text)\n RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    v_peek_name TEXT;\n    v_current RECORD;\n    v_common_prefix TEXT;\n    v_delimiter CONSTANT TEXT := '/';\n\n    -- Configuration\n    v_limit INT;\n    v_prefix TEXT;\n    v_prefix_lower TEXT;\n    v_is_asc BOOLEAN;\n    v_order_by TEXT;\n    v_sort_order TEXT;\n    v_upper_bound TEXT;\n    v_file_batch_size INT;\n\n    -- Dynamic SQL for batch query only\n    v_batch_query TEXT;\n\n    -- Seek state\n    v_next_seek TEXT;\n    v_count INT := 0;\n    v_skipped INT := 0;\nBEGIN\n    -- ========================================================================\n    -- INITIALIZATION\n    -- ========================================================================\n    v_limit := LEAST(coalesce(limits, 100), 1500);\n    v_prefix := coalesce(prefix, '') || coalesce(search, '');\n    v_prefix_lower := lower(v_prefix);\n    v_is_asc := lower(coalesce(sortorder, 'asc')) = 'asc';\n    v_file_batch_size := LEAST(GREATEST(v_limit * 2, 100), 1000);\n\n    -- Validate sort column\n    CASE lower(coalesce(sortcolumn, 'name'))\n        WHEN 'name' THEN v_order_by := 'name';\n        WHEN 'updated_at' THEN v_order_by := 'updated_at';\n        WHEN 'created_at' THEN v_order_by := 'created_at';\n        WHEN 'last_accessed_at' THEN v_order_by := 'last_accessed_at';\n        ELSE v_order_by := 'name';\n    END CASE;\n\n    v_sort_order := CASE WHEN v_is_asc THEN 'asc' ELSE 'desc' END;\n\n    -- ========================================================================\n    -- NON-NAME SORTING: Use path_tokens approach (unchanged)\n    -- ========================================================================\n    IF v_order_by != 'name' THEN\n        RETURN QUERY EXECUTE format(\n            $sql$\n            WITH folders AS (\n                SELECT path_tokens[$1] AS folder\n                FROM storage.objects\n                WHERE objects.name ILIKE $2 || '%%'\n                  AND bucket_id = $3\n                  AND array_length(objects.path_tokens, 1) <> $1\n                GROUP BY folder\n                ORDER BY folder %s\n            )\n            (SELECT folder AS \"name\",\n                   NULL::uuid AS id,\n                   NULL::timestamptz AS updated_at,\n                   NULL::timestamptz AS created_at,\n                   NULL::timestamptz AS last_accessed_at,\n                   NULL::jsonb AS metadata FROM folders)\n            UNION ALL\n            (SELECT path_tokens[$1] AS \"name\",\n                   id, updated_at, created_at, last_accessed_at, metadata\n             FROM storage.objects\n             WHERE objects.name ILIKE $2 || '%%'\n               AND bucket_id = $3\n               AND array_length(objects.path_tokens, 1) = $1\n             ORDER BY %I %s)\n            LIMIT $4 OFFSET $5\n            $sql$, v_sort_order, v_order_by, v_sort_order\n        ) USING levels, v_prefix, bucketname, v_limit, offsets;\n        RETURN;\n    END IF;\n\n    -- ========================================================================\n    -- NAME SORTING: Hybrid skip-scan with batch optimization\n    -- ========================================================================\n\n    -- Calculate upper bound for prefix filtering\n    IF v_prefix_lower = '' THEN\n        v_upper_bound := NULL;\n    ELSIF right(v_prefix_lower, 1) = v_delimiter THEN\n        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(v_delimiter) + 1);\n    ELSE\n        v_upper_bound := left(v_prefix_lower, -1) || chr(ascii(right(v_prefix_lower, 1)) + 1);\n    END IF;\n\n    -- Build batch query (dynamic SQL - called infrequently, amortized over many rows)\n    IF v_is_asc THEN\n        IF v_upper_bound IS NOT NULL THEN\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE \"C\" >= $2 ' ||\n                'AND lower(o.name) COLLATE \"C\" < $3 ORDER BY lower(o.name) COLLATE \"C\" ASC LIMIT $4';\n        ELSE\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE \"C\" >= $2 ' ||\n                'ORDER BY lower(o.name) COLLATE \"C\" ASC LIMIT $4';\n        END IF;\n    ELSE\n        IF v_upper_bound IS NOT NULL THEN\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE \"C\" < $2 ' ||\n                'AND lower(o.name) COLLATE \"C\" >= $3 ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT $4';\n        ELSE\n            v_batch_query := 'SELECT o.name, o.id, o.updated_at, o.created_at, o.last_accessed_at, o.metadata ' ||\n                'FROM storage.objects o WHERE o.bucket_id = $1 AND lower(o.name) COLLATE \"C\" < $2 ' ||\n                'ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT $4';\n        END IF;\n    END IF;\n\n    -- Initialize seek position\n    IF v_is_asc THEN\n        v_next_seek := v_prefix_lower;\n    ELSE\n        -- DESC: find the last item in range first (static SQL)\n        IF v_upper_bound IS NOT NULL THEN\n            SELECT o.name INTO v_peek_name FROM storage.objects o\n            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" >= v_prefix_lower AND lower(o.name) COLLATE \"C\" < v_upper_bound\n            ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n        ELSIF v_prefix_lower <> '' THEN\n            SELECT o.name INTO v_peek_name FROM storage.objects o\n            WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" >= v_prefix_lower\n            ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n        ELSE\n            SELECT o.name INTO v_peek_name FROM storage.objects o\n            WHERE o.bucket_id = bucketname\n            ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n        END IF;\n\n        IF v_peek_name IS NOT NULL THEN\n            v_next_seek := lower(v_peek_name) || v_delimiter;\n        ELSE\n            RETURN;\n        END IF;\n    END IF;\n\n    -- ========================================================================\n    -- MAIN LOOP: Hybrid peek-then-batch algorithm\n    -- Uses STATIC SQL for peek (hot path) and DYNAMIC SQL for batch\n    -- ========================================================================\n    LOOP\n        EXIT WHEN v_count >= v_limit;\n\n        -- STEP 1: PEEK using STATIC SQL (plan cached, very fast)\n        IF v_is_asc THEN\n            IF v_upper_bound IS NOT NULL THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" >= v_next_seek AND lower(o.name) COLLATE \"C\" < v_upper_bound\n                ORDER BY lower(o.name) COLLATE \"C\" ASC LIMIT 1;\n            ELSE\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" >= v_next_seek\n                ORDER BY lower(o.name) COLLATE \"C\" ASC LIMIT 1;\n            END IF;\n        ELSE\n            IF v_upper_bound IS NOT NULL THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" < v_next_seek AND lower(o.name) COLLATE \"C\" >= v_prefix_lower\n                ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n            ELSIF v_prefix_lower <> '' THEN\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" < v_next_seek AND lower(o.name) COLLATE \"C\" >= v_prefix_lower\n                ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n            ELSE\n                SELECT o.name INTO v_peek_name FROM storage.objects o\n                WHERE o.bucket_id = bucketname AND lower(o.name) COLLATE \"C\" < v_next_seek\n                ORDER BY lower(o.name) COLLATE \"C\" DESC LIMIT 1;\n            END IF;\n        END IF;\n\n        EXIT WHEN v_peek_name IS NULL;\n\n        -- STEP 2: Check if this is a FOLDER or FILE\n        v_common_prefix := storage.get_common_prefix(lower(v_peek_name), v_prefix_lower, v_delimiter);\n\n        IF v_common_prefix IS NOT NULL THEN\n            -- FOLDER: Handle offset, emit if needed, skip to next folder\n            IF v_skipped < offsets THEN\n                v_skipped := v_skipped + 1;\n            ELSE\n                name := split_part(rtrim(storage.get_common_prefix(v_peek_name, v_prefix, v_delimiter), v_delimiter), v_delimiter, levels);\n                id := NULL;\n                updated_at := NULL;\n                created_at := NULL;\n                last_accessed_at := NULL;\n                metadata := NULL;\n                RETURN NEXT;\n                v_count := v_count + 1;\n            END IF;\n\n            -- Advance seek past the folder range\n            IF v_is_asc THEN\n                v_next_seek := lower(left(v_common_prefix, -1)) || chr(ascii(v_delimiter) + 1);\n            ELSE\n                v_next_seek := lower(v_common_prefix);\n            END IF;\n        ELSE\n            -- FILE: Batch fetch using DYNAMIC SQL (overhead amortized over many rows)\n            -- For ASC: upper_bound is the exclusive upper limit (< condition)\n            -- For DESC: prefix_lower is the inclusive lower limit (>= condition)\n            FOR v_current IN EXECUTE v_batch_query\n                USING bucketname, v_next_seek,\n                    CASE WHEN v_is_asc THEN COALESCE(v_upper_bound, v_prefix_lower) ELSE v_prefix_lower END, v_file_batch_size\n            LOOP\n                v_common_prefix := storage.get_common_prefix(lower(v_current.name), v_prefix_lower, v_delimiter);\n\n                IF v_common_prefix IS NOT NULL THEN\n                    -- Hit a folder: exit batch, let peek handle it\n                    v_next_seek := lower(v_current.name);\n                    EXIT;\n                END IF;\n\n                -- Handle offset skipping\n                IF v_skipped < offsets THEN\n                    v_skipped := v_skipped + 1;\n                ELSE\n                    -- Emit file\n                    name := split_part(v_current.name, v_delimiter, levels);\n                    id := v_current.id;\n                    updated_at := v_current.updated_at;\n                    created_at := v_current.created_at;\n                    last_accessed_at := v_current.last_accessed_at;\n                    metadata := v_current.metadata;\n                    RETURN NEXT;\n                    v_count := v_count + 1;\n                END IF;\n\n                -- Advance seek past this file\n                IF v_is_asc THEN\n                    v_next_seek := lower(v_current.name) || v_delimiter;\n                ELSE\n                    v_next_seek := lower(v_current.name);\n                END IF;\n\n                EXIT WHEN v_count >= v_limit;\n            END LOOP;\n        END IF;\n    END LOOP;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.search_by_timestamp(p_prefix text, p_bucket_id text, p_limit integer, p_level integer, p_start_after text, p_sort_order text, p_sort_column text, p_sort_column_after text)\n RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    v_cursor_op text;\n    v_query text;\n    v_prefix text;\nBEGIN\n    v_prefix := coalesce(p_prefix, '');\n\n    IF p_sort_order = 'asc' THEN\n        v_cursor_op := '>';\n    ELSE\n        v_cursor_op := '<';\n    END IF;\n\n    v_query := format($sql$\n        WITH raw_objects AS (\n            SELECT\n                o.name AS obj_name,\n                o.id AS obj_id,\n                o.updated_at AS obj_updated_at,\n                o.created_at AS obj_created_at,\n                o.last_accessed_at AS obj_last_accessed_at,\n                o.metadata AS obj_metadata,\n                storage.get_common_prefix(o.name, $1, '/') AS common_prefix\n            FROM storage.objects o\n            WHERE o.bucket_id = $2\n              AND o.name COLLATE \"C\" LIKE $1 || '%%'\n        ),\n        -- Aggregate common prefixes (folders)\n        -- Both created_at and updated_at use MIN(obj_created_at) to match the old prefixes table behavior\n        aggregated_prefixes AS (\n            SELECT\n                rtrim(common_prefix, '/') AS name,\n                NULL::uuid AS id,\n                MIN(obj_created_at) AS updated_at,\n                MIN(obj_created_at) AS created_at,\n                NULL::timestamptz AS last_accessed_at,\n                NULL::jsonb AS metadata,\n                TRUE AS is_prefix\n            FROM raw_objects\n            WHERE common_prefix IS NOT NULL\n            GROUP BY common_prefix\n        ),\n        leaf_objects AS (\n            SELECT\n                obj_name AS name,\n                obj_id AS id,\n                obj_updated_at AS updated_at,\n                obj_created_at AS created_at,\n                obj_last_accessed_at AS last_accessed_at,\n                obj_metadata AS metadata,\n                FALSE AS is_prefix\n            FROM raw_objects\n            WHERE common_prefix IS NULL\n        ),\n        combined AS (\n            SELECT * FROM aggregated_prefixes\n            UNION ALL\n            SELECT * FROM leaf_objects\n        ),\n        filtered AS (\n            SELECT *\n            FROM combined\n            WHERE (\n                $5 = ''\n                OR ROW(\n                    date_trunc('milliseconds', %I),\n                    name COLLATE \"C\"\n                ) %s ROW(\n                    COALESCE(NULLIF($6, '')::timestamptz, 'epoch'::timestamptz),\n                    $5\n                )\n            )\n        )\n        SELECT\n            split_part(name, '/', $3) AS key,\n            name,\n            id,\n            updated_at,\n            created_at,\n            last_accessed_at,\n            metadata\n        FROM filtered\n        ORDER BY\n            COALESCE(date_trunc('milliseconds', %I), 'epoch'::timestamptz) %s,\n            name COLLATE \"C\" %s\n        LIMIT $4\n    $sql$,\n        p_sort_column,\n        v_cursor_op,\n        p_sort_column,\n        p_sort_order,\n        p_sort_order\n    );\n\n    RETURN QUERY EXECUTE v_query\n    USING v_prefix, p_bucket_id, p_level, p_limit, p_start_after, p_sort_column_after;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text)\n RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)\n LANGUAGE plpgsql\n STABLE\nAS $function$\nDECLARE\n    v_sort_col text;\n    v_sort_ord text;\n    v_limit int;\nBEGIN\n    -- Cap limit to maximum of 1500 records\n    v_limit := LEAST(coalesce(limits, 100), 1500);\n\n    -- Validate and normalize sort_order\n    v_sort_ord := lower(coalesce(sort_order, 'asc'));\n    IF v_sort_ord NOT IN ('asc', 'desc') THEN\n        v_sort_ord := 'asc';\n    END IF;\n\n    -- Validate and normalize sort_column\n    v_sort_col := lower(coalesce(sort_column, 'name'));\n    IF v_sort_col NOT IN ('name', 'updated_at', 'created_at') THEN\n        v_sort_col := 'name';\n    END IF;\n\n    -- Route to appropriate implementation\n    IF v_sort_col = 'name' THEN\n        -- Use list_objects_with_delimiter for name sorting (most efficient: O(k * log n))\n        RETURN QUERY\n        SELECT\n            split_part(l.name, '/', levels) AS key,\n            l.name AS name,\n            l.id,\n            l.updated_at,\n            l.created_at,\n            l.last_accessed_at,\n            l.metadata\n        FROM storage.list_objects_with_delimiter(\n            bucket_name,\n            coalesce(prefix, ''),\n            '/',\n            v_limit,\n            start_after,\n            '',\n            v_sort_ord\n        ) l;\n    ELSE\n        -- Use aggregation approach for timestamp sorting\n        -- Not efficient for large datasets but supports correct pagination\n        RETURN QUERY SELECT * FROM storage.search_by_timestamp(\n            prefix, bucket_name, v_limit, levels, start_after,\n            v_sort_ord, v_sort_col, sort_column_after\n        );\n    END IF;\nEND;\n$function$\n"
  },
  {
    "sql_report": "CREATE OR REPLACE FUNCTION storage.update_updated_at_column()\n RETURNS trigger\n LANGUAGE plpgsql\nAS $function$\nBEGIN\n    NEW.updated_at = now();\n    RETURN NEW; \nEND;\n$function$\n"
  }
]

select format(
  '%s.%s | %s | %s -> %s.%s(%s)',
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  string_agg(
    kcu.column_name,
    ', ' order by kcu.ordinal_position
  ),
  ccu.table_schema,
  ccu.table_name,
  string_agg(
    ccu.column_name,
    ', ' order by kcu.ordinal_position
  )
) as sql_report
from information_schema.table_constraints tc
join information_schema.key_column_usage kcu
  on tc.constraint_name = kcu.constraint_name
  and tc.table_schema = kcu.table_schema
join information_schema.constraint_column_usage ccu
  on ccu.constraint_name = tc.constraint_name
  and ccu.table_schema = tc.table_schema
where tc.constraint_type = 'FOREIGN KEY'
  and tc.table_schema in ('public', 'storage')
group by
  tc.table_schema,
  tc.table_name,
  tc.constraint_name,
  ccu.table_schema,
  ccu.table_name
order by
  tc.table_schema,
  tc.table_name,
  tc.constraint_name;

  [
  {
    "sql_report": "public.admin_audit_log | admin_audit_log_admin_id_fkey | admin_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.announcements | announcements_created_by_fkey | created_by -> public.profiles(id)"
  },
  {
    "sql_report": "public.answers | answers_question_id_fkey | question_id -> public.questions(id)"
  },
  {
    "sql_report": "public.answers | answers_scholar_id_fkey | scholar_id -> public.scholars(id)"
  },
  {
    "sql_report": "public.cancellation_requests | cancellation_requests_order_id_fkey | order_id -> public.shop_orders_enhanced(id)"
  },
  {
    "sql_report": "public.chat_messages | chat_messages_group_id_fkey | group_id -> public.group_chats(id)"
  },
  {
    "sql_report": "public.contact_submissions | contact_submissions_replied_by_fkey | replied_by -> public.profiles(id)"
  },
  {
    "sql_report": "public.donations | donations_project_id_fkey | project_id -> public.donation_projects(id)"
  },
  {
    "sql_report": "public.event_images | event_images_event_id_fkey | event_id -> public.events(id)"
  },
  {
    "sql_report": "public.event_registrations | event_registrations_event_id_fkey | event_id -> public.events(id)"
  },
  {
    "sql_report": "public.event_registrations | event_registrations_user_id_fkey | user_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.events | events_branch_id_fkey | branch_id -> public.branches(id)"
  },
  {
    "sql_report": "public.events | events_created_by_fkey | created_by -> public.profiles(id)"
  },
  {
    "sql_report": "public.group_chats | group_chats_creator_id_fkey | creator_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.media | media_created_by_fkey | created_by -> public.profiles(id)"
  },
  {
    "sql_report": "public.media | media_event_id_fkey | event_id -> public.events(id)"
  },
  {
    "sql_report": "public.memberships | memberships_branch_id_fkey | branch_id -> public.branches(id)"
  },
  {
    "sql_report": "public.memberships | memberships_user_id_fkey | user_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.notifications | notifications_user_id_fkey | user_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.order_status_history | order_status_history_order_id_fkey | order_id -> public.shop_orders_enhanced(id)"
  },
  {
    "sql_report": "public.paystack_transactions | paystack_transactions_donation_id_fkey | donation_id -> public.donations(id)"
  },
  {
    "sql_report": "public.publications | publications_author_id_fkey | author_id -> public.profiles(id)"
  },
  {
    "sql_report": "public.scholar_bookings | scholar_bookings_scholar_id_fkey | scholar_id -> public.scholars(id)"
  },
  {
    "sql_report": "public.shop_digital_downloads | shop_digital_downloads_order_id_fkey | order_id -> public.shop_orders_enhanced(id)"
  },
  {
    "sql_report": "public.shop_digital_downloads | shop_digital_downloads_order_item_id_fkey | order_item_id -> public.shop_order_items_enhanced(id)"
  },
  {
    "sql_report": "public.shop_digital_downloads | shop_digital_downloads_product_id_fkey | product_id -> public.shop_products_enhanced(id)"
  },
  {
    "sql_report": "public.shop_order_items | shop_order_items_order_id_fkey | order_id -> public.shop_orders(id)"
  },
  {
    "sql_report": "public.shop_order_items | shop_order_items_product_id_fkey | product_id -> public.shop_products(id)"
  },
  {
    "sql_report": "public.shop_order_items_enhanced | shop_order_items_enhanced_order_id_fkey | order_id -> public.shop_orders_enhanced(id)"
  },
  {
    "sql_report": "public.shop_order_items_enhanced | shop_order_items_enhanced_product_id_fkey | product_id -> public.shop_products_enhanced(id)"
  },
  {
    "sql_report": "public.shop_orders_enhanced | shop_orders_enhanced_promo_code_id_fkey | promo_code_id -> public.shop_promo_codes(id)"
  },
  {
    "sql_report": "public.shop_products_enhanced | shop_products_enhanced_category_id_fkey | category_id -> public.shop_categories(id)"
  }
]

select format(
  '%s.%s | %s | %s',
  i.schemaname,
  i.tablename,
  i.indexname,
  i.indexdef
) as sql_report
from pg_catalog.pg_indexes i
where i.schemaname in ('public', 'storage')
order by i.schemaname, i.tablename, i.indexname;

[
  {
    "sql_report": "public.achievements | achievements_pkey | CREATE UNIQUE INDEX achievements_pkey ON public.achievements USING btree (id)"
  },
  {
    "sql_report": "public.activity_log | activity_log_pkey | CREATE UNIQUE INDEX activity_log_pkey ON public.activity_log USING btree (id)"
  },
  {
    "sql_report": "public.activity_log | idx_activity_log_action_type | CREATE INDEX idx_activity_log_action_type ON public.activity_log USING btree (action_type)"
  },
  {
    "sql_report": "public.activity_log | idx_activity_log_created_at | CREATE INDEX idx_activity_log_created_at ON public.activity_log USING btree (created_at DESC)"
  },
  {
    "sql_report": "public.activity_log | idx_activity_log_user_id | CREATE INDEX idx_activity_log_user_id ON public.activity_log USING btree (user_id)"
  },
  {
    "sql_report": "public.activity_logs | activity_logs_pkey | CREATE UNIQUE INDEX activity_logs_pkey ON public.activity_logs USING btree (id)"
  },
  {
    "sql_report": "public.activity_logs | idx_activity_logs_created_at | CREATE INDEX idx_activity_logs_created_at ON public.activity_logs USING btree (created_at)"
  },
  {
    "sql_report": "public.activity_logs | idx_activity_logs_user | CREATE INDEX idx_activity_logs_user ON public.activity_logs USING btree (user_id, created_at)"
  },
  {
    "sql_report": "public.activity_logs | idx_activity_logs_user_id | CREATE INDEX idx_activity_logs_user_id ON public.activity_logs USING btree (user_id)"
  },
  {
    "sql_report": "public.admin_audit_log | admin_audit_log_pkey | CREATE UNIQUE INDEX admin_audit_log_pkey ON public.admin_audit_log USING btree (id)"
  },
  {
    "sql_report": "public.admin_audit_log | idx_admin_audit_log_admin_id | CREATE INDEX idx_admin_audit_log_admin_id ON public.admin_audit_log USING btree (admin_id)"
  },
  {
    "sql_report": "public.admin_audit_log | idx_admin_audit_log_created_at | CREATE INDEX idx_admin_audit_log_created_at ON public.admin_audit_log USING btree (created_at)"
  },
  {
    "sql_report": "public.admin_roles | admin_roles_name_key | CREATE UNIQUE INDEX admin_roles_name_key ON public.admin_roles USING btree (name)"
  },
  {
    "sql_report": "public.admin_roles | admin_roles_pkey | CREATE UNIQUE INDEX admin_roles_pkey ON public.admin_roles USING btree (id)"
  },
  {
    "sql_report": "public.announcements | announcements_pkey | CREATE UNIQUE INDEX announcements_pkey ON public.announcements USING btree (id)"
  },
  {
    "sql_report": "public.answers | answers_pkey | CREATE UNIQUE INDEX answers_pkey ON public.answers USING btree (id)"
  },
  {
    "sql_report": "public.azkar_completions | azkar_completions_pkey | CREATE UNIQUE INDEX azkar_completions_pkey ON public.azkar_completions USING btree (id)"
  },
  {
    "sql_report": "public.badges | badges_pkey | CREATE UNIQUE INDEX badges_pkey ON public.badges USING btree (id)"
  },
  {
    "sql_report": "public.branches | branches_pkey | CREATE UNIQUE INDEX branches_pkey ON public.branches USING btree (id)"
  },
  {
    "sql_report": "public.branches | idx_branches_is_active | CREATE INDEX idx_branches_is_active ON public.branches USING btree (is_active)"
  },
  {
    "sql_report": "public.branches | idx_branches_region | CREATE INDEX idx_branches_region ON public.branches USING btree (region)"
  },
  {
    "sql_report": "public.branches | idx_branches_state | CREATE INDEX idx_branches_state ON public.branches USING btree (state)"
  },
  {
    "sql_report": "public.cancellation_requests | cancellation_requests_pkey | CREATE UNIQUE INDEX cancellation_requests_pkey ON public.cancellation_requests USING btree (id)"
  },
  {
    "sql_report": "public.cancellation_requests | idx_cancellation_requests_order_id | CREATE INDEX idx_cancellation_requests_order_id ON public.cancellation_requests USING btree (order_id)"
  },
  {
    "sql_report": "public.cancellation_requests | idx_cancellation_requests_status | CREATE INDEX idx_cancellation_requests_status ON public.cancellation_requests USING btree (status)"
  },
  {
    "sql_report": "public.challenges | challenges_pkey | CREATE UNIQUE INDEX challenges_pkey ON public.challenges USING btree (id)"
  },
  {
    "sql_report": "public.chat_messages | chat_messages_pkey | CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id)"
  },
  {
    "sql_report": "public.chat_messages | idx_chat_messages_group | CREATE INDEX idx_chat_messages_group ON public.chat_messages USING btree (group_id, created_at)"
  },
  {
    "sql_report": "public.contact_messages | contact_messages_pkey | CREATE UNIQUE INDEX contact_messages_pkey ON public.contact_messages USING btree (id)"
  },
  {
    "sql_report": "public.contact_messages | idx_contact_messages_email | CREATE INDEX idx_contact_messages_email ON public.contact_messages USING btree (email)"
  },
  {
    "sql_report": "public.contact_messages | idx_contact_messages_status | CREATE INDEX idx_contact_messages_status ON public.contact_messages USING btree (status)"
  },
  {
    "sql_report": "public.contact_submissions | contact_submissions_pkey | CREATE UNIQUE INDEX contact_submissions_pkey ON public.contact_submissions USING btree (id)"
  },
  {
    "sql_report": "public.contact_submissions | idx_contact_submissions_status | CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status)"
  },
  {
    "sql_report": "public.donation_projects | donation_projects_pkey | CREATE UNIQUE INDEX donation_projects_pkey ON public.donation_projects USING btree (id)"
  },
  {
    "sql_report": "public.donation_projects | idx_donation_projects_status | CREATE INDEX idx_donation_projects_status ON public.donation_projects USING btree (status)"
  },
  {
    "sql_report": "public.donations | donations_payment_reference_key | CREATE UNIQUE INDEX donations_payment_reference_key ON public.donations USING btree (payment_reference)"
  },
  {
    "sql_report": "public.donations | donations_pkey | CREATE UNIQUE INDEX donations_pkey ON public.donations USING btree (id)"
  },
  {
    "sql_report": "public.donations | idx_donations_created_at | CREATE INDEX idx_donations_created_at ON public.donations USING btree (created_at)"
  },
  {
    "sql_report": "public.donations | idx_donations_email | CREATE INDEX idx_donations_email ON public.donations USING btree (donor_email)"
  },
  {
    "sql_report": "public.donations | idx_donations_payment_status | CREATE INDEX idx_donations_payment_status ON public.donations USING btree (payment_status)"
  },
  {
    "sql_report": "public.donations | idx_donations_project_id | CREATE INDEX idx_donations_project_id ON public.donations USING btree (project_id)"
  },
  {
    "sql_report": "public.donations | idx_donations_user_id | CREATE INDEX idx_donations_user_id ON public.donations USING btree (user_id)"
  },
  {
    "sql_report": "public.dua_wall | dua_wall_pkey | CREATE UNIQUE INDEX dua_wall_pkey ON public.dua_wall USING btree (id)"
  },
  {
    "sql_report": "public.duas | duas_pkey | CREATE UNIQUE INDEX duas_pkey ON public.duas USING btree (id)"
  },
  {
    "sql_report": "public.event_images | event_images_event_id_image_url_key | CREATE UNIQUE INDEX event_images_event_id_image_url_key ON public.event_images USING btree (event_id, image_url)"
  },
  {
    "sql_report": "public.event_images | event_images_pkey | CREATE UNIQUE INDEX event_images_pkey ON public.event_images USING btree (id)"
  },
  {
    "sql_report": "public.event_images | idx_event_images_event_id | CREATE INDEX idx_event_images_event_id ON public.event_images USING btree (event_id)"
  },
  {
    "sql_report": "public.event_images | idx_event_images_featured | CREATE INDEX idx_event_images_featured ON public.event_images USING btree (is_featured) WHERE (is_featured = true)"
  },
  {
    "sql_report": "public.event_registrations | event_registrations_event_id_user_id_key | CREATE UNIQUE INDEX event_registrations_event_id_user_id_key ON public.event_registrations USING btree (event_id, user_id)"
  },
  {
    "sql_report": "public.event_registrations | event_registrations_pkey | CREATE UNIQUE INDEX event_registrations_pkey ON public.event_registrations USING btree (id)"
  },
  {
    "sql_report": "public.event_registrations | idx_event_registrations_event_id | CREATE INDEX idx_event_registrations_event_id ON public.event_registrations USING btree (event_id)"
  },
  {
    "sql_report": "public.event_registrations | idx_event_registrations_user_id | CREATE INDEX idx_event_registrations_user_id ON public.event_registrations USING btree (user_id)"
  },
  {
    "sql_report": "public.events | events_pkey | CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id)"
  },
  {
    "sql_report": "public.events | idx_events_branch_id | CREATE INDEX idx_events_branch_id ON public.events USING btree (branch_id)"
  },
  {
    "sql_report": "public.events | idx_events_category | CREATE INDEX idx_events_category ON public.events USING btree (category)"
  },
  {
    "sql_report": "public.events | idx_events_date | CREATE INDEX idx_events_date ON public.events USING btree (event_date)"
  },
  {
    "sql_report": "public.events | idx_events_is_featured | CREATE INDEX idx_events_is_featured ON public.events USING btree (is_featured)"
  },
  {
    "sql_report": "public.events | idx_events_start_time | CREATE INDEX idx_events_start_time ON public.events USING btree (start_time)"
  },
  {
    "sql_report": "public.events | idx_events_status | CREATE INDEX idx_events_status ON public.events USING btree (status)"
  },
  {
    "sql_report": "public.group_chats | group_chats_pkey | CREATE UNIQUE INDEX group_chats_pkey ON public.group_chats USING btree (id)"
  },
  {
    "sql_report": "public.habit_tracking | habit_tracking_pkey | CREATE UNIQUE INDEX habit_tracking_pkey ON public.habit_tracking USING btree (id)"
  },
  {
    "sql_report": "public.media | idx_media_category | CREATE INDEX idx_media_category ON public.media USING btree (category)"
  },
  {
    "sql_report": "public.media | idx_media_created_at | CREATE INDEX idx_media_created_at ON public.media USING btree (created_at)"
  },
  {
    "sql_report": "public.media | idx_media_is_featured | CREATE INDEX idx_media_is_featured ON public.media USING btree (is_featured)"
  },
  {
    "sql_report": "public.media | idx_media_type | CREATE INDEX idx_media_type ON public.media USING btree (media_type)"
  },
  {
    "sql_report": "public.media | media_pkey | CREATE UNIQUE INDEX media_pkey ON public.media USING btree (id)"
  },
  {
    "sql_report": "public.media_library | media_library_pkey | CREATE UNIQUE INDEX media_library_pkey ON public.media_library USING btree (id)"
  },
  {
    "sql_report": "public.membership | membership_pkey | CREATE UNIQUE INDEX membership_pkey ON public.membership USING btree (id)"
  },
  {
    "sql_report": "public.memberships | idx_memberships_branch_id | CREATE INDEX idx_memberships_branch_id ON public.memberships USING btree (branch_id)"
  },
  {
    "sql_report": "public.memberships | idx_memberships_status | CREATE INDEX idx_memberships_status ON public.memberships USING btree (status)"
  },
  {
    "sql_report": "public.memberships | idx_memberships_user_id | CREATE INDEX idx_memberships_user_id ON public.memberships USING btree (user_id)"
  },
  {
    "sql_report": "public.memberships | memberships_pkey | CREATE UNIQUE INDEX memberships_pkey ON public.memberships USING btree (id)"
  },
  {
    "sql_report": "public.mosque_registrations | idx_mosque_reg_code | CREATE INDEX idx_mosque_reg_code ON public.mosque_registrations USING btree (registration_code)"
  },
  {
    "sql_report": "public.mosque_registrations | idx_mosque_reg_state | CREATE INDEX idx_mosque_reg_state ON public.mosque_registrations USING btree (mosque_state)"
  },
  {
    "sql_report": "public.mosque_registrations | idx_mosque_reg_status | CREATE INDEX idx_mosque_reg_status ON public.mosque_registrations USING btree (status)"
  },
  {
    "sql_report": "public.mosque_registrations | idx_mosque_reg_submitted | CREATE INDEX idx_mosque_reg_submitted ON public.mosque_registrations USING btree (submitted_at DESC)"
  },
  {
    "sql_report": "public.mosque_registrations | mosque_registrations_pkey | CREATE UNIQUE INDEX mosque_registrations_pkey ON public.mosque_registrations USING btree (id)"
  },
  {
    "sql_report": "public.mosque_registrations | mosque_registrations_registration_code_key | CREATE UNIQUE INDEX mosque_registrations_registration_code_key ON public.mosque_registrations USING btree (registration_code)"
  },
  {
    "sql_report": "public.newsletter_subscribers | idx_newsletter_active | CREATE INDEX idx_newsletter_active ON public.newsletter_subscribers USING btree (is_active)"
  },
  {
    "sql_report": "public.newsletter_subscribers | idx_newsletter_email | CREATE INDEX idx_newsletter_email ON public.newsletter_subscribers USING btree (email)"
  },
  {
    "sql_report": "public.newsletter_subscribers | idx_newsletter_subscribers_email | CREATE INDEX idx_newsletter_subscribers_email ON public.newsletter_subscribers USING btree (email)"
  },
  {
    "sql_report": "public.newsletter_subscribers | idx_newsletter_subscribers_status | CREATE INDEX idx_newsletter_subscribers_status ON public.newsletter_subscribers USING btree (status)"
  },
  {
    "sql_report": "public.newsletter_subscribers | newsletter_subscribers_email_key | CREATE UNIQUE INDEX newsletter_subscribers_email_key ON public.newsletter_subscribers USING btree (email)"
  },
  {
    "sql_report": "public.newsletter_subscribers | newsletter_subscribers_pkey | CREATE UNIQUE INDEX newsletter_subscribers_pkey ON public.newsletter_subscribers USING btree (id)"
  },
  {
    "sql_report": "public.newsletters | idx_newsletters_email | CREATE INDEX idx_newsletters_email ON public.newsletters USING btree (email)"
  },
  {
    "sql_report": "public.newsletters | idx_newsletters_is_active | CREATE INDEX idx_newsletters_is_active ON public.newsletters USING btree (is_active)"
  },
  {
    "sql_report": "public.newsletters | newsletters_email_key | CREATE UNIQUE INDEX newsletters_email_key ON public.newsletters USING btree (email)"
  },
  {
    "sql_report": "public.newsletters | newsletters_pkey | CREATE UNIQUE INDEX newsletters_pkey ON public.newsletters USING btree (id)"
  },
  {
    "sql_report": "public.notifications | idx_notifications_user | CREATE INDEX idx_notifications_user ON public.notifications USING btree (user_id, is_read)"
  },
  {
    "sql_report": "public.notifications | notifications_pkey | CREATE UNIQUE INDEX notifications_pkey ON public.notifications USING btree (id)"
  },
  {
    "sql_report": "public.order_status_history | idx_order_status_history_changed_at | CREATE INDEX idx_order_status_history_changed_at ON public.order_status_history USING btree (changed_at)"
  },
  {
    "sql_report": "public.order_status_history | idx_order_status_history_order_id | CREATE INDEX idx_order_status_history_order_id ON public.order_status_history USING btree (order_id)"
  },
  {
    "sql_report": "public.order_status_history | order_status_history_pkey | CREATE UNIQUE INDEX order_status_history_pkey ON public.order_status_history USING btree (id)"
  },
  {
    "sql_report": "public.payment_settings | payment_settings_key_key | CREATE UNIQUE INDEX payment_settings_key_key ON public.payment_settings USING btree (key)"
  },
  {
    "sql_report": "public.payment_settings | payment_settings_pkey | CREATE UNIQUE INDEX payment_settings_pkey ON public.payment_settings USING btree (id)"
  },
  {
    "sql_report": "public.paystack_transactions | idx_paystack_donation_id | CREATE INDEX idx_paystack_donation_id ON public.paystack_transactions USING btree (donation_id)"
  },
  {
    "sql_report": "public.paystack_transactions | idx_paystack_reference | CREATE INDEX idx_paystack_reference ON public.paystack_transactions USING btree (reference)"
  },
  {
    "sql_report": "public.paystack_transactions | idx_paystack_transactions_reference | CREATE INDEX idx_paystack_transactions_reference ON public.paystack_transactions USING btree (reference)"
  },
  {
    "sql_report": "public.paystack_transactions | paystack_transactions_pkey | CREATE UNIQUE INDEX paystack_transactions_pkey ON public.paystack_transactions USING btree (id)"
  },
  {
    "sql_report": "public.paystack_transactions | paystack_transactions_reference_key | CREATE UNIQUE INDEX paystack_transactions_reference_key ON public.paystack_transactions USING btree (reference)"
  }
]

select format(
  'bucket=%s | name=%s | public=%s | file_size_limit=%s | allowed_mime_types=%s',
  b.id,
  b.name,
  b.public,
  coalesce(b.file_size_limit::text, ''),
  coalesce(array_to_string(b.allowed_mime_types, ','), '')
) as sql_report
from storage.buckets b
order by b.id;

[
  {
    "sql_report": "bucket=digital-products | name=digital-products | public=f | file_size_limit= | allowed_mime_types="
  },
  {
    "sql_report": "bucket=profile_picture | name=profile_picture | public=t | file_size_limit= | allowed_mime_types="
  },
  {
    "sql_report": "bucket=Ramadan | name=Ramadan | public=t | file_size_limit= | allowed_mime_types="
  },
  {
    "sql_report": "bucket=registrations | name=registrations | public=t | file_size_limit= | allowed_mime_types="
  },
  {
    "sql_report": "bucket=shop | name=shop | public=t | file_size_limit= | allowed_mime_types="
  }
]