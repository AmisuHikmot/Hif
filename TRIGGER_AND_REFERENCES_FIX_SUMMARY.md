# Comprehensive Trigger and Public.Users References Fix

## Problem Identified

Multiple triggers and functions were attempting to insert into or reference `public.users` table, which **does not exist** in your database. The actual user profile table is `public.profiles`. This was causing OAuth signup failures and breaking various database operations.

## Root Cause

The migration scripts contained references to a non-existent table:
- **Affected Files:**
  - `07-add-trigger-functions.sql` - handle_new_user() and handle_user_updated() triggers
  - `06-add-publications-table.sql` - Foreign key references and RLS policies
  - `08-add-helper-functions.sql` - Dashboard statistics queries
  - `21-fix-auth-errors.sql` - Auth error handling trigger
  - `29-fix-profiles-user-id-oauth.sql` - OAuth profile creation function

## Solutions Applied

### 1. Fixed Trigger Functions (scripts/07-add-trigger-functions.sql)
**Before:**
\`\`\`sql
INSERT INTO public.users (id, email, first_name, ...)
\`\`\`

**After:**
\`\`\`sql
INSERT INTO public.profiles (id, user_id, email, first_name, ...)
VALUES (NEW.id, NEW.id, NEW.email, ...)
\`\`\`

**Key Changes:**
- Both `id` and `user_id` are now explicitly set to `NEW.id` (they must match)
- All references to `public.users` replaced with `public.profiles`
- Updated ON CONFLICT clauses to reference profiles table

### 2. Fixed Foreign Key References (scripts/06-add-publications-table.sql)
**Before:**
\`\`\`sql
author_id UUID REFERENCES public.users(id),
replied_by UUID REFERENCES public.users(id),
\`\`\`

**After:**
\`\`\`sql
author_id UUID REFERENCES public.profiles(id),
replied_by UUID REFERENCES public.profiles(id),
\`\`\`

### 3. Fixed RLS Policies (scripts/06-add-publications-table.sql)
**Before:**
\`\`\`sql
SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'
\`\`\`

**After:**
\`\`\`sql
SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
\`\`\`

### 4. Fixed Helper Functions (scripts/08-add-helper-functions.sql)
Updated all statistics queries:
- `get_dashboard_stats()` - Now queries `public.profiles` for member counts
- `get_user_stats()` - Now queries `public.profiles` for user information

### 5. Fixed Auth Error Handling (scripts/21-fix-auth-errors.sql)
Updated the handle_new_user() trigger to correctly reference profiles table with proper ON CONFLICT handling.

### 6. Fixed OAuth Profile Fix (scripts/29-fix-profiles-user-id-oauth.sql)
Updated handle_new_user() function to explicitly set both `id` and `user_id` during profile creation.

### 7. Comprehensive Cleanup (scripts/30-fix-all-public-users-references.sql)
Created a new comprehensive migration that:
- Updates all remaining dashboard stats functions
- Fixes all admin-related RLS policies
- Ensures user_id NOT NULL constraint
- Verifies all triggers are correctly configured
- Logs successful completion

## Database Schema Alignment

**profiles table structure:**
\`\`\`
- id: UUID (PRIMARY KEY)
- user_id: UUID (NOT NULL, UNIQUE)
- email: VARCHAR
- first_name: VARCHAR
- last_name: VARCHAR
- phone: VARCHAR
- role: VARCHAR
- is_active: BOOLEAN
- email_verified: BOOLEAN
- oauth_provider: VARCHAR
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
\`\`\`

**Key Constraint:**
- `id = user_id` (both reference the same auth.users(id))
- Both columns are NOT NULL and uniquely identify a profile

## OAuth Signup Flow (Now Corrected)

1. User initiates OAuth signup (Google, GitHub)
2. Supabase auth.users table receives new record with UUID
3. `on_auth_user_created` trigger fires on auth.users INSERT
4. `handle_new_user()` function executes:
   \`\`\`sql
   INSERT INTO public.profiles (id, user_id, email, ...)
   VALUES (NEW.id, NEW.id, NEW.email, ...)
   \`\`\`
5. Profile record created successfully with:
   - `id` = auth user UUID
   - `user_id` = same auth user UUID (satisfies NOT NULL constraint)
   - All other fields populated from auth metadata

## Testing Recommendations

1. **Test OAuth Signup:** Sign up with Google/GitHub - should complete without errors
2. **Verify Profile Creation:** Check that profiles table has matching id and user_id
3. **Test Dashboard Stats:** Verify admin dashboard loads without "Column doesn't exist" errors
4. **Test RLS Policies:** Confirm admin users can access protected records
5. **Verify User Logs:** Check that user activity logs are recorded correctly

## Files Modified

- `/scripts/06-add-publications-table.sql` - Foreign keys and policies
- `/scripts/07-add-trigger-functions.sql` - Core trigger functions
- `/scripts/08-add-helper-functions.sql` - Statistics functions
- `/scripts/21-fix-auth-errors.sql` - Auth error handling
- `/scripts/29-fix-profiles-user-id-oauth.sql` - OAuth profile creation
- `/scripts/30-fix-all-public-users-references.sql` - **NEW** Comprehensive cleanup

## Status

✅ All `public.users` references replaced with `public.profiles`  
✅ All triggers updated to populate both `id` and `user_id`  
✅ All foreign keys corrected  
✅ All RLS policies updated  
✅ All statistics functions corrected  
✅ Comprehensive validation migration executed  

OAuth signup should now work without constraint violations!
