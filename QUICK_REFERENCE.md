# Activity Logging - Quick Reference Card

## Problem → Solution
| Issue | Solution |
|-------|----------|
| "Database error saving new user" on OAuth signup | Run Migration 26, verify RLS policies |
| Function signature mismatch | Use new signature: `(UUID, TEXT, TEXT, JSONB)` |
| RLS policy blocking auth | Service_role policy allows bypass |
| Multiple log tables | All activity now goes to `user_logs` |

---

## Migration Execution

### 1. Run the Migration (Copy & Paste)
```sql
-- Go to Supabase Dashboard → SQL Editor
-- Copy entire contents of: scripts/26-fix-activity-logging-functions.sql
-- Paste & Execute
-- ✓ Should complete with no errors
```

### 2. Verify Setup (Run Verification Queries)

**Check Functions Exist:**
```sql
SELECT proname, pg_get_function_arguments(oid) 
FROM pg_proc WHERE proname = 'log_user_activity';
-- Should return 2 rows with different argument signatures
```

**Check Table Exists:**
```sql
\d public.user_logs
-- Should show id, user_id, action, entity_type, entity_id, description, metadata, created_at
```

**Check RLS Policies:**
```sql
SELECT policyname FROM pg_policies WHERE tablename = 'user_logs';
-- Should show: Service role can manage logs, System can insert logs, Users can view their own logs
```

### 3. Test OAuth Signup
1. Open your app
2. Click login with OAuth provider
3. Complete provider flow
4. Verify no errors and redirect to dashboard

### 4. Verify Logging Worked
```sql
SELECT id, user_id, action, description, created_at 
FROM public.user_logs 
WHERE action = 'signup' 
ORDER BY created_at DESC LIMIT 1;
-- Should return the signup log entry
```

---

## Function Signatures

### Simple Logging (Most Common)
```sql
PERFORM public.log_user_activity(
  user_id_uuid,           -- UUID of user
  'action_name',          -- TEXT: signup, login, donation, etc.
  'Description here',     -- TEXT: optional description
  '{"key":"value"}'::JSONB-- JSONB: optional metadata
);
```

### Entity-Related Logging
```sql
PERFORM public.log_user_activity(
  user_id_uuid,                -- UUID of user
  'action_name',               -- TEXT: event_registration, content_view, etc.
  'table_name',                -- TEXT: events, donations, publications, etc.
  entity_id_uuid,              -- UUID of affected entity
  'Description here',          -- TEXT: optional
  '{"detail":"value"}'::JSONB  -- JSONB: optional metadata
);
```

---

## Trigger Integration

### Old Code (Don't Use)
```sql
PERFORM log_user_activity(
  NEW.id,
  'registration'::VARCHAR(50),
  'New user registered',
  jsonb_build_object('email', NEW.email)
);
```

### New Code (Use This)
```sql
PERFORM public.log_user_activity(
  NEW.id,
  'registration',
  'New user registered',
  jsonb_build_object('email', NEW.email)
);
```

### Extended Code (Entity Tracking)
```sql
PERFORM public.log_user_activity(
  NEW.user_id,
  'event_registration',
  'events',
  NEW.event_id,
  'Registered for event',
  jsonb_build_object('event_title', v_event_title)
);
```

---

## Common Queries

### User's Activity History
```sql
SELECT action, description, created_at 
FROM public.user_logs 
WHERE user_id = '12345678-1234-5678-1234-567812345678'::UUID
ORDER BY created_at DESC LIMIT 20;
```

### Activity by Type
```sql
SELECT action, COUNT(*) as count, MAX(created_at) as latest
FROM public.user_logs
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY action
ORDER BY count DESC;
```

### Entity Changes
```sql
SELECT user_id, action, description, created_at
FROM public.user_logs
WHERE entity_type = 'events' AND entity_id = 'event-uuid'::UUID
ORDER BY created_at DESC;
```

### Recent Activity (All Users)
```sql
SELECT user_id, action, description, created_at
FROM public.user_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

---

## Troubleshooting Checklist

### OAuth Still Failing?
- [ ] Did migration execute? (`SELECT count(*) FROM user_logs;` should return a number)
- [ ] Are functions created? (`SELECT proname FROM pg_proc WHERE proname = 'log_user_activity';`)
- [ ] Are RLS policies set? (`SELECT * FROM pg_policies WHERE tablename = 'user_logs';`)
- [ ] Check Supabase Logs → Auth for detailed error
- [ ] Test function directly: `SELECT public.log_user_activity(...)`

### Function Not Found?
```sql
-- Re-run migration
-- Or manually create:
CREATE FUNCTION public.log_user_activity(...) 
  RETURNS UUID 
  LANGUAGE plpgsql 
  SECURITY DEFINER 
  SET search_path = public 
  AS $$...$$;
```

### RLS Policy Blocking?
```sql
-- Add service_role bypass if missing
CREATE POLICY "Service role can manage logs"
  ON public.user_logs FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Add insert permission if missing
CREATE POLICY "System can insert logs"
  ON public.user_logs FOR INSERT
  TO authenticated, service_role
  WITH CHECK (true);
```

### Permission Denied?
```sql
-- Grant execute to all roles
GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;

GRANT EXECUTE ON FUNCTION public.log_user_activity(UUID, TEXT, TEXT, UUID, TEXT, JSONB) 
  TO postgres, anon, authenticated, service_role;
```

---

## Files Modified

| File | Change | Status |
|------|--------|--------|
| `scripts/26-fix-activity-logging-functions.sql` | NEW: Migration script | ✓ Ready |
| `MIGRATION_GUIDE.md` | NEW: Detailed guide | ✓ Ready |
| `ACTIVITY_LOGGING_IMPROVEMENTS.md` | NEW: Technical design | ✓ Ready |
| `QUICK_REFERENCE.md` | NEW: This file | ✓ Ready |
| `scripts/09-activity-log-table.sql` | TODO: Update triggers | ⏳ Pending |
| `scripts/25-oauth-profile-support.sql` | TODO: Verify compatible | ⏳ Pending |

---

## Timeline

```
Now         ↓ Run Migration 26
            ↓ Verify Setup (5 min)
            ↓ Test OAuth (2 min)
            ↓ Check Logs (1 min)
            ↓
Complete!   Done - OAuth should work now
```

---

## Support Resources

| Resource | Link |
|----------|------|
| Full Migration Guide | `MIGRATION_GUIDE.md` |
| Technical Details | `ACTIVITY_LOGGING_IMPROVEMENTS.md` |
| PostgreSQL Functions | https://postgresql.org/docs/current/sql-createfunction.html |
| Supabase Auth | https://supabase.com/docs/guides/auth |
| RLS Policy Guide | https://supabase.com/docs/guides/database/postgres/row-level-security |

---

## Key Takeaways

✓ **One function signature** for all activity logging  
✓ **SECURITY DEFINER** prevents RLS from blocking auth  
✓ **Two overloads** support both simple and entity tracking  
✓ **user_logs table** is central audit log  
✓ **Graceful error handling** means logging never blocks auth  
✓ **Complete documentation** for future maintenance  

---

**Status:** Ready for production  
**Last Updated:** 2026-02-07  
**Version:** 1.0
