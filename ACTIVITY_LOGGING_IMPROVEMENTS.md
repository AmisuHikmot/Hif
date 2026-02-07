# Activity Logging System - Improvements & Implementation Summary

## Executive Summary

This document provides a comprehensive analysis of the improved activity logging system designed to fix Supabase Auth callback failures and unify activity logging across the platform.

---

## Problem Analysis

### Original Issues

1. **Function Signature Inconsistency**
   - `log_user_activity(UUID, VARCHAR(50), TEXT, JSONB)` in activity_log_table.sql
   - `log_activity(UUID, VARCHAR, VARCHAR, UUID, JSONB)` in helper_functions.sql
   - Multiple conflicting overloads causing resolution failures

2. **RLS Policy Conflicts**
   - Profiles table had 8 RLS policies causing auth trigger issues
   - OAuth profile creation trigger wasn't bypassing RLS properly
   - Service_role had insufficient permissions

3. **Missing user_logs Table Integration**
   - `user_logs` table existed but wasn't being used
   - Activity data spread across multiple tables
   - No unified audit trail

4. **Auth Callback Failure Chain**
   - OAuth user created in auth.users
   - Trigger tries to create profile
   - Trigger calls log_user_activity with mismatched signature
   - Function doesn't exist or fails due to RLS
   - Auth callback returns: "Database error saving new user"

---

## Solution Architecture

### Design Principles

1. **Single Source of Truth**
   - All activity logged to `user_logs` table
   - Consistent function interface
   - Clear audit trail

2. **Security-First**
   - SECURITY DEFINER for auth triggers
   - Explicit search_path to prevent injection
   - Minimal RLS policies that don't block auth

3. **Failure-Safe**
   - Exception handling in functions
   - Logging failures don't block auth operations
   - Graceful degradation

4. **Backward Compatible**
   - Dual function signatures (simple + extended)
   - Old triggers continue to work
   - Gradual migration path

---

## Implementation Details

### 1. user_logs Table

**Purpose:** Central activity audit log

**Schema:**
```sql
CREATE TABLE public.user_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Indexes:**
- `idx_user_logs_user_id` - Query user's activity history
- `idx_user_logs_action` - Query by action type
- `idx_user_logs_created_at` - Recent activity queries
- `idx_user_logs_entity` - Track changes to specific entities

**Why This Schema:**
- Foreign key to `auth.users` ensures referential integrity
- Composite entity tracking (type + id) for relational logging
- Flexible metadata for extensibility
- Created_at for temporal queries

---

### 2. log_user_activity Functions

#### Signature 1: Simple Activity Logging
```sql
log_user_activity(
  p_user_id UUID,
  p_action TEXT,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
) RETURNS UUID
```

**Use Cases:**
- User login/logout
- Settings changes
- Account events

**Example:**
```sql
PERFORM public.log_user_activity(
  NEW.id,
  'signup',
  'User registered via email',
  '{"provider": "email"}'::JSONB
);
```

---

#### Signature 2: Entity-Aware Logging
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

**Use Cases:**
- Event registration
- Donation creation
- Content interaction

**Example:**
```sql
PERFORM public.log_user_activity(
  NEW.user_id,
  'event_registration',
  'events',
  NEW.event_id,
  'Registered for: ' || v_event_title,
  jsonb_build_object('event_title', v_event_title)
);
```

---

### 3. Security Implementation

#### SECURITY DEFINER Rationale
```sql
SECURITY DEFINER
SET search_path = public
```

**Benefits:**
- Functions execute with owner's permissions (postgres)
- Bypasses user-level RLS policies
- Prevents auth callbacks from failing due to RLS
- Explicit search_path prevents schema injection

**When Used:**
- `log_user_activity()` - Needs to insert during auth
- `log_auth_signup()` - Called by auth trigger

---

#### RLS Policies - Minimal & Permissive

```sql
-- Policy 1: Users can view their own logs
CREATE POLICY "Users can view their own logs"
  ON public.user_logs FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Policy 2: Service role can manage all logs
CREATE POLICY "Service role can manage logs"
  ON public.user_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy 3: System can insert logs
CREATE POLICY "System can insert logs"
  ON public.user_logs FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);
```

**Design Philosophy:**
- Don't block SECURITY DEFINER functions
- Allow service_role to manage logs (auth triggers run as service_role)
- Prevent authenticated users from viewing others' logs
- Allow INSERT from both authenticated and service_role

---

### 4. Auth Integration

#### Signup Trigger
```sql
CREATE TRIGGER on_auth_user_created_logging
  AFTER INSERT ON auth.users
  FOR EACH ROW
  WHEN (NEW.email_confirmed_at IS NOT NULL OR NEW.raw_user_meta_data ? 'provider')
  EXECUTE FUNCTION public.log_auth_signup();
```

**Trigger Conditions:**
- Only fires when email is confirmed OR OAuth provider is present
- Prevents duplicate logs for unconfirmed emails

**Function:**
```sql
CREATE OR REPLACE FUNCTION public.log_auth_signup()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  PERFORM public.log_user_activity(
    NEW.id,
    'signup',
    'User registered: ' || COALESCE(NEW.email, 'unknown'),
    jsonb_build_object(
      'email', NEW.email,
      'provider', COALESCE(NEW.raw_user_meta_data ->> 'provider', 'email'),
      'auth_method', CASE 
        WHEN NEW.raw_user_meta_data ? 'provider' THEN 'oauth'
        ELSE 'email'
      END
    )
  );
  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  RAISE WARNING 'Error logging auth signup: %', SQLERRM;
  RETURN NEW;
END;
$$;
```

**Error Handling:**
- Catches all exceptions
- Logs warning but returns NEW
- Auth continues even if logging fails

---

## Migration Strategy

### Phase 1: Deploy Migration 26
- Create user_logs table with proper schema
- Create unified log_user_activity functions
- Grant permissions to all roles
- Set up RLS policies

### Phase 2: Update Existing Triggers
- Modify activity_log_table.sql triggers to use new signature
- Update oauth_profile_support.sql if needed
- Test OAuth signup flow

### Phase 3: Verify & Monitor
- Test OAuth signup (Google, Apple, etc.)
- Query user_logs to verify logging
- Monitor for errors in Supabase logs

### Phase 4: Cleanup (Optional)
- Migrate data from activity_log table if needed
- Deprecate old activity_log table
- Update application code to query user_logs

---

## Usage Patterns

### Pattern 1: Immediate Action Logging
```sql
-- In trigger or function
PERFORM public.log_user_activity(
  user_id,
  'donation_completed',
  'User made a donation',
  jsonb_build_object(
    'amount', donation_amount,
    'currency', 'NGN',
    'project', project_name
  )
);
```

### Pattern 2: Entity Change Tracking
```sql
PERFORM public.log_user_activity(
  auth.uid(),
  'profile_updated',
  'profiles',
  auth.uid(),
  'User updated profile information',
  jsonb_build_object(
    'fields_changed', ARRAY['first_name', 'last_name'],
    'updated_at', NOW()
  )
);
```

### Pattern 3: Bulk Action Logging
```sql
-- Log multiple related actions
WITH created_registrations AS (
  INSERT INTO event_registrations (...)
  VALUES (...)
  RETURNING id, event_id, user_id
)
INSERT INTO user_logs (user_id, action, entity_type, entity_id, description)
SELECT 
  user_id,
  'event_registration',
  'events',
  event_id,
  'Registered for event'
FROM created_registrations;
```

---

## Monitoring & Analytics

### Query Recent Activity
```sql
SELECT 
  user_id,
  action,
  description,
  created_at
FROM public.user_logs
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 100;
```

### Track Entity Changes
```sql
SELECT 
  user_id,
  action,
  COUNT(*) as count,
  MAX(created_at) as latest
FROM public.user_logs
WHERE entity_type = 'events'
GROUP BY user_id, action
ORDER BY latest DESC;
```

### Find Problem Actions
```sql
SELECT 
  action,
  COUNT(*) as total,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY action
ORDER BY total DESC;
```

---

## Performance Considerations

### Indexes
- `user_id` - Most common query filter
- `action` - Activity type aggregations
- `created_at DESC` - Recent activity queries (DESC for efficient ordering)
- `entity_type, entity_id` - Entity change tracking

### Partitioning (Future)
For high-volume applications, consider monthly partitioning:
```sql
CREATE TABLE public.user_logs_2026_02 PARTITION OF public.user_logs
  FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

### Archival Strategy
- Archive logs older than 1 year
- Keep recent logs for quick queries
- Maintain summary statistics for reporting

---

## Validation Checklist

- [ ] Migration 26 executed successfully
- [ ] Function signatures verified with pg_proc query
- [ ] user_logs table schema matches specification
- [ ] RLS policies created correctly
- [ ] Grants applied to all roles
- [ ] OAuth signup flow tested (no errors)
- [ ] Log entry created for signup action
- [ ] user_logs table contains sample data
- [ ] Direct function calls work with both signatures
- [ ] Trigger calls updated to use new signature
- [ ] No errors in Supabase logs

---

## Troubleshooting Decision Tree

```
Auth Callback Fails?
├─ Check error message in browser console
├─ Check Supabase Logs → Auth
├─ Run: SELECT proname FROM pg_proc WHERE proname = 'log_user_activity'
│  ├─ Function missing? → Re-run migration 26
│  └─ Function exists?
│     ├─ Check function signature: pg_get_function_arguments()
│     ├─ Check RLS policies: SELECT * FROM pg_policies WHERE tablename = 'user_logs'
│     └─ Check grants: \dp public.log_user_activity
└─ Test with: SELECT public.log_user_activity(...) directly
   ├─ Works? → Issue in trigger
   │  └─ Check trigger function exception handling
   └─ Fails? → Issue in function or RLS
      └─ Check Supabase logs for RLS error
```

---

## References

### PostgreSQL Docs
- [CREATE FUNCTION](https://www.postgresql.org/docs/current/sql-createfunction.html)
- [Function Overloading](https://www.postgresql.org/docs/current/xfunc-overload.html)
- [SECURITY DEFINER](https://www.postgresql.org/docs/current/sql-createfunction.html#SQL-CREATEFUNCTION-SECURITY)

### Supabase Docs
- [Auth Callbacks](https://supabase.com/docs/guides/auth/managing-user-data)
- [Row Level Security](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Custom Claims](https://supabase.com/docs/guides/auth/custom-claims)

---

## Support & Escalation

For unresolved issues:
1. Capture exact error message and timestamp
2. Run verification queries from Step 3 of MIGRATION_GUIDE.md
3. Check Supabase Dashboard → Logs for backend errors
4. Provide this information to support or developer team
