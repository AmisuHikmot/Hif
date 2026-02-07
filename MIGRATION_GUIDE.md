# Supabase Auth Callback Fix - Migration Guide

## Problem Statement

The Supabase Auth callback was failing with error:
```
Error: Database error saving new user
error_code: unexpected_failure
error_description: Database error saving new user
```

**Root Cause:** Function signature inconsistencies and RLS policy conflicts with `log_user_activity` function called during OAuth signup.

## Solution Overview

This migration consolidates multiple activity logging functions into a unified implementation with proper Supabase Auth integration support.

---

## Migration Steps

### Step 1: Execute the Migration Script

Run the migration file **26-fix-activity-logging-functions.sql** in your Supabase SQL editor:

```bash
# Via Supabase Dashboard:
1. Go to SQL Editor
2. Create new query
3. Copy contents of: scripts/26-fix-activity-logging-functions.sql
4. Click "Run"
5. Verify success (no errors)
```

**What this migration does:**
- Drops conflicting function overloads
- Ensures `user_logs` table exists with correct schema
- Creates unified `log_user_activity` function with dual signatures
- Grants proper execute permissions for all roles
- Sets up RLS policies that allow service_role to bypass for auth triggers
- Creates signup logging trigger for OAuth integration

---

### Step 2: Update Function Calls

Update all existing calls to `log_user_activity` to use the new signatures:

#### Before (Old Signature):
```sql
PERFORM log_user_activity(
  NEW.id,
  'registration'::VARCHAR(50),
  'New user registered',
  jsonb_build_object('email', NEW.email)
);
```

#### After (New Signature - Option 1 - Simple):
```sql
PERFORM log_user_activity(
  NEW.id,
  'registration',
  'New user registered',
  jsonb_build_object('email', NEW.email)
);
```

#### After (New Signature - Option 2 - With Entity Tracking):
```sql
PERFORM log_user_activity(
  NEW.id,
  'registration',
  'users',
  NEW.id,
  'New user registered',
  jsonb_build_object('email', NEW.email)
);
```

**Updated Files in This Project:**
- ✅ `scripts/09-activity-log-table.sql` - Trigger functions use new signature
- ✅ `scripts/25-oauth-profile-support.sql` - OAuth profile creation trigger

**Script Changes Required:**

In `scripts/09-activity-log-table.sql`, update the triggers:

```sql
-- OLD (broken)
PERFORM log_user_activity(
  NEW.id,
  'registration',
  'New user registered',
  jsonb_build_object('email', NEW.email, 'membership_type', NEW.membership_type)
);

-- NEW (fixed)
PERFORM public.log_user_activity(
  NEW.id,
  'registration',
  'New user registered',
  jsonb_build_object('email', NEW.email, 'membership_type', NEW.membership_type)
);
```

---

### Step 3: Verify Database State

After running the migration, verify the setup:

#### Check Function Signatures
```sql
SELECT 
  proname,
  pg_get_function_arguments(oid) as signature,
  prosecdef as has_security_definer
FROM pg_proc 
WHERE proname = 'log_user_activity' 
  AND pronamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY proname, pg_get_function_arguments(oid);
```

**Expected Output:**
```
proname           | signature                              | has_security_definer
log_user_activity | p_user_id uuid, p_action text, p_description text, p_metadata jsonb | t
log_user_activity | p_user_id uuid, p_action text, p_entity_type text, p_entity_id uuid, p_description text, p_metadata jsonb | t
```

#### Check user_logs Table
```sql
\d public.user_logs
```

**Expected Structure:**
```
Table "public.user_logs"
Column      | Type                     | Modifiers
id          | uuid                     | not null default gen_random_uuid()
user_id     | uuid                     | not null
action      | text                     | not null
entity_type | text                     | 
entity_id   | uuid                     | 
description | text                     | 
metadata    | jsonb                    | default '{}'::jsonb
created_at  | timestamp with time zone | not null default now()
```

#### Check RLS Policies
```sql
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles::text,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'user_logs'
ORDER BY policyname;
```

**Expected Policies:**
- `Service role can manage logs` (ALL, service_role)
- `System can insert logs` (INSERT, authenticated/service_role)
- `Users can view their own logs` (SELECT, authenticated)

---

## Testing the Fix

### Test 1: OAuth Signup Flow

1. Go to your app's login page
2. Click OAuth provider (Google, Apple, etc.)
3. Complete OAuth flow
4. Verify redirect to dashboard (no error)

**Expected Result:** User successfully created and authenticated

### Test 2: Verify Logging

After successful OAuth signup:

```sql
SELECT 
  id,
  user_id,
  action,
  description,
  created_at
FROM public.user_logs
WHERE action = 'signup'
ORDER BY created_at DESC
LIMIT 1;
```

**Expected Result:** One log entry with action='signup'

### Test 3: Test Direct Function Call

```sql
-- Test simple signature
SELECT public.log_user_activity(
  '00000000-0000-0000-0000-000000000001'::UUID,
  'test_action',
  'Test log entry',
  '{"test": true}'::JSONB
);

-- Test extended signature
SELECT public.log_user_activity(
  '00000000-0000-0000-0000-000000000001'::UUID,
  'test_entity_action',
  'test_entity',
  '00000000-0000-0000-0000-000000000002'::UUID,
  'Test with entity',
  '{"test": true}'::JSONB
);
```

**Expected Result:** Both return a UUID (log entry ID)

---

## Function Signatures Reference

### Simple Activity Logging

```sql
log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `p_user_id` | UUID | Yes | ID of the user performing the action |
| `p_action` | TEXT | Yes | Action type (e.g., 'signup', 'login', 'donation') |
| `p_description` | TEXT | No | Human-readable action description |
| `p_metadata` | JSONB | No | Additional context as JSON object |

**Returns:** UUID of created log entry, or NULL if failed

**Example:**
```sql
PERFORM public.log_user_activity(
  auth_user_id,
  'login',
  'User logged in successfully',
  jsonb_build_object('ip', client_ip, 'browser', user_agent)
);
```

---

### Entity-Related Logging

```sql
log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_entity_type TEXT,
  p_entity_id UUID,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `p_user_id` | UUID | Yes | ID of the user |
| `p_action` | TEXT | Yes | Action type (e.g., 'event_registration') |
| `p_entity_type` | TEXT | Yes | Type of entity affected (e.g., 'events', 'donations') |
| `p_entity_id` | UUID | Yes | ID of the affected entity |
| `p_description` | TEXT | No | Action description |
| `p_metadata` | JSONB | No | Additional context |

**Returns:** UUID of created log entry, or NULL if failed

**Example:**
```sql
PERFORM public.log_user_activity(
  user_id,
  'event_registration',
  'events',
  event_id,
  'Registered for event',
  jsonb_build_object('event_title', v_event_title, 'registered_at', NOW())
);
```

---

## Troubleshooting

### Issue: "Function log_user_activity does not exist"

**Cause:** Migration not executed or function dropped

**Solution:**
1. Verify migration 26 was executed: `SELECT * FROM supabase_migrations.schema_migrations WHERE name LIKE '%activity%';`
2. Re-run migration 26 if missing
3. Check function exists: `SELECT proname FROM pg_proc WHERE proname = 'log_user_activity';`

### Issue: "Permission denied for schema public"

**Cause:** Missing role grants

**Solution:**
```sql
-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, UUID, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;

-- Grant table access
GRANT ALL ON public.user_logs TO service_role;
GRANT INSERT, SELECT ON public.user_logs TO authenticated;
```

### Issue: "RLS policy violation"

**Cause:** RLS policies blocking auth triggers

**Solution:** Migration 26 already handles this. If still failing:
```sql
-- Verify service_role policy
SELECT * FROM pg_policies WHERE tablename = 'user_logs' AND policyname = 'Service role can manage logs';

-- If missing, create it
CREATE POLICY "Service role can manage logs"
  ON public.user_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
```

### Issue: "User auth callback still failing after migration"

**Cause:** Other triggers interfering

**Solution:**
1. Check for other auth-related triggers: `SELECT * FROM pg_trigger WHERE tgrelid = 'auth.users'::regclass;`
2. Check OAuth profile creation trigger in migration 25
3. Verify profiles table RLS policies don't conflict
4. Check app logs in Supabase Dashboard for detailed error messages

---

## Rollback Plan

If you need to revert this migration:

```sql
-- Drop the new functions
DROP FUNCTION IF EXISTS public.log_user_activity(UUID, TEXT, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.log_user_activity(UUID, TEXT, TEXT, UUID, TEXT, JSONB) CASCADE;
DROP FUNCTION IF EXISTS public.log_auth_signup() CASCADE;

-- Remove RLS policies
DROP POLICY IF EXISTS "Service role can manage logs" ON public.user_logs;
DROP POLICY IF EXISTS "System can insert logs" ON public.user_logs;
DROP POLICY IF EXISTS "Users can view their own logs" ON public.user_logs;

-- Disable RLS on user_logs (optional)
ALTER TABLE public.user_logs DISABLE ROW LEVEL SECURITY;

-- Restore old functions if needed (from scripts 07 or 09)
-- Note: Old functions may have been causing the issue, so careful when restoring
```

---

## Additional Resources

- **Supabase Auth Callbacks:** https://supabase.com/docs/guides/auth/managing-user-data
- **PostgreSQL Functions:** https://www.postgresql.org/docs/current/sql-createfunction.html
- **Supabase RLS:** https://supabase.com/docs/guides/database/postgres/row-level-security
- **Function Overloading:** https://www.postgresql.org/docs/current/xfunc-overload.html

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-07 | Initial migration script and guide |

---

## Questions or Issues?

If problems persist after following this guide:
1. Check Supabase Dashboard → Logs for detailed error messages
2. Verify all steps in Step 3 (Verify Database State)
3. Check browser console for OAuth redirect errors
4. Contact Supabase support with migration logs
