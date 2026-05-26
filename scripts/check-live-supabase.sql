-- Run this in the Supabase SQL editor, then save/copy the single result column
-- into scripts/tocheck.sql for review.
-- It is read-only and inspects schema, RLS, policies, triggers, functions,
-- indexes, foreign keys, storage buckets, and selected auth hooks.

with report_lines as (
  select 10 as section_order, 1 as line_order, '== DATABASE TABLES ==' as line
  union all
  select
    10,
    10 + row_number() over (order by t.table_schema, t.table_name),
    format(
      '%s.%s | owner=%s | rls=%s | force_rls=%s',
      t.schemaname,
      t.tablename,
      t.tableowner,
      case when t.rowsecurity then 'on' else 'off' end,
      case when t.forcerowsecurity then 'on' else 'off' end
    )
  from pg_catalog.pg_tables t
  where t.schemaname in ('public', 'storage')

  union all
  select 20, 1, chr(10) || '== TABLE COLUMNS =='
  union all
  select
    20,
    10 + row_number() over (order by c.table_schema, c.table_name, c.ordinal_position),
    format(
      '%s.%s.%s | %s%s | nullable=%s | default=%s',
      c.table_schema,
      c.table_name,
      c.column_name,
      c.data_type,
      coalesce('(' || c.character_maximum_length::text || ')', ''),
      c.is_nullable,
      coalesce(c.column_default, '')
    )
  from information_schema.columns c
  where c.table_schema in ('public', 'storage')

  union all
  select 30, 1, chr(10) || '== RLS POLICIES =='
  union all
  select
    30,
    10 + row_number() over (order by p.schemaname, p.tablename, p.policyname),
    format(
      '%s.%s | %s | permissive=%s | roles=%s | cmd=%s | using=%s | check=%s',
      p.schemaname,
      p.tablename,
      p.policyname,
      p.permissive,
      array_to_string(p.roles, ','),
      p.cmd,
      coalesce(p.qual, ''),
      coalesce(p.with_check, '')
    )
  from pg_catalog.pg_policies p
  where p.schemaname in ('public', 'storage')

  union all
  select 40, 1, chr(10) || '== TRIGGERS =='
  union all
  select
    40,
    10 + row_number() over (order by n.nspname, c.relname, tr.tgname),
    format(
      '%s.%s | trigger=%s | enabled=%s | definition=%s',
      n.nspname,
      c.relname,
      tr.tgname,
      tr.tgenabled,
      pg_get_triggerdef(tr.oid, true)
    )
  from pg_catalog.pg_trigger tr
  join pg_catalog.pg_class c on c.oid = tr.tgrelid
  join pg_catalog.pg_namespace n on n.oid = c.relnamespace
  where not tr.tgisinternal
    and n.nspname in ('public', 'auth', 'storage')

  union all
  select 50, 1, chr(10) || '== PUBLIC FUNCTIONS =='
  union all
  select
    50,
    10 + row_number() over (order by n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)),
    format(
      '%s.%s(%s) | returns=%s | language=%s | security=%s | volatility=%s',
      n.nspname,
      p.proname,
      pg_get_function_identity_arguments(p.oid),
      pg_get_function_result(p.oid),
      l.lanname,
      case when p.prosecdef then 'definer' else 'invoker' end,
      p.provolatile
    )
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  join pg_catalog.pg_language l on l.oid = p.prolang
  where n.nspname in ('public', 'storage')

  union all
  select 60, 1, chr(10) || '== FUNCTION DEFINITIONS =='
  union all
  select
    60,
    10 + row_number() over (order by n.nspname, p.proname, pg_get_function_identity_arguments(p.oid)),
    pg_get_functiondef(p.oid)
  from pg_catalog.pg_proc p
  join pg_catalog.pg_namespace n on n.oid = p.pronamespace
  where n.nspname in ('public', 'storage')

  union all
  select 70, 1, chr(10) || '== FOREIGN KEYS =='
  union all
  select
    70,
    10 + row_number() over (order by tc.table_schema, tc.table_name, tc.constraint_name),
    format(
      '%s.%s | %s | %s -> %s.%s(%s)',
      tc.table_schema,
      tc.table_name,
      tc.constraint_name,
      string_agg(kcu.column_name, ', ' order by kcu.ordinal_position),
      ccu.table_schema,
      ccu.table_name,
      string_agg(ccu.column_name, ', ' order by kcu.ordinal_position)
    )
  from information_schema.table_constraints tc
  join information_schema.key_column_usage kcu
    on tc.constraint_name = kcu.constraint_name
    and tc.table_schema = kcu.table_schema
  join information_schema.constraint_column_usage ccu
    on ccu.constraint_name = tc.constraint_name
    and ccu.table_schema = tc.table_schema
  where tc.constraint_type = 'FOREIGN KEY'
    and tc.table_schema in ('public', 'storage')
  group by tc.table_schema, tc.table_name, tc.constraint_name, ccu.table_schema, ccu.table_name

  union all
  select 80, 1, chr(10) || '== INDEXES =='
  union all
  select
    80,
    10 + row_number() over (order by i.schemaname, i.tablename, i.indexname),
    format('%s.%s | %s | %s', i.schemaname, i.tablename, i.indexname, i.indexdef)
  from pg_catalog.pg_indexes i
  where i.schemaname in ('public', 'storage')

  union all
  select 90, 1, chr(10) || '== STORAGE BUCKETS =='
  union all
  select
    90,
    10 + row_number() over (order by b.id),
    format(
      'bucket=%s | name=%s | public=%s | file_size_limit=%s | allowed_mime_types=%s',
      b.id,
      b.name,
      b.public,
      coalesce(b.file_size_limit::text, ''),
      coalesce(array_to_string(b.allowed_mime_types, ','), '')
    )
  from storage.buckets b
)
select line as sql_report
from report_lines
order by section_order, line_order;
