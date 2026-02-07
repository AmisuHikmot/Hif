# Auth Callback Error - RESOLVED ✓

## Problem
```
ERROR: column "user_id" of relation "profiles" does not exist (SQLSTATE 42703)
```
This error occurred during Supabase Auth callback when users signed up via OAuth (Google, GitHub, etc.), preventing successful user registration.

## Root Cause
The `profiles` table was missing a `user_id` column that several trigger functions and signup handlers were attempting to reference. While the `id` column exists (foreign key to `auth.users.id`), the functions expected an explicit `user_id` column for clarity and consistency.

## Solution Implemented
Migration script: `scripts/27-add-user-id-to-profiles.sql`

### Changes Made:
1. **Added `user_id` UUID column** to the `profiles` table
   - Initialized with values from the existing `id` column
   - Set as NOT NULL after population
   
2. **Created unique index** on `user_id` for performance
   - Index: `idx_profiles_user_id`
   
3. **Added deferrable foreign key constraint**
   - `fk_profiles_user_id` → `auth.users(id)`
   - Supports CASCADE delete and update
   - Marked DEFERRABLE INITIALLY DEFERRED to handle transaction edge cases

4. **Updated functions to use user_id**:
   - `handle_oauth_user_signup()` - Now inserts/updates user_id explicitly
   - `handle_new_user()` - Now handles user_id for email-based signups
   - Both functions include error handling to prevent signup failures

5. **Updated RLS policies**:
   - `profiles_insert_service_role` - Service role can insert profiles
   - `profiles_insert_own` - Users can insert their own profiles (with user_id validation)
   - `profiles_select_own` - Users can view their profiles
   - `profiles_update_own` - Users can update their profiles

6. **Granted permissions** to all roles:
   - `postgres`, `anon`, `authenticated`, `service_role`

## Verification Results
Migration executed successfully. Column verification shows:

| Column | Data Type | Nullable | Notes |
|--------|-----------|----------|-------|
| `id` | uuid | NO | Primary key, FK to auth.users |
| `user_id` | uuid | NO | Explicit user reference |

## Testing OAuth Signup
After this migration, OAuth signup flow should work correctly:
1. User initiates OAuth login (Google/GitHub)
2. Supabase auth.users record is created
3. Auth callback triggers `handle_oauth_user_signup()` trigger
4. Profile record is created with both `id` and `user_id` populated
5. User successfully completes signup

## Rollback (if needed)
```sql
-- Drop user_id column
ALTER TABLE public.profiles DROP COLUMN IF EXISTS user_id CASCADE;

-- Drop the index
DROP INDEX IF EXISTS idx_profiles_user_id;

-- Drop the constraint (cascade handles this automatically)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS fk_profiles_user_id;
```

## Status
✅ **COMPLETE** - Migration applied successfully to Supabase database
- Column added and populated
- Constraints created
- Functions updated
- Permissions granted
- Ready for OAuth signup testing

## Next Steps
1. Test OAuth signup flow in the app
2. Monitor auth logs for any related errors
3. If issues persist, check:
   - Supabase auth settings are configured
   - OAuth providers (Google/GitHub) are correctly set up
   - Environment variables are correct
