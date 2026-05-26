# Quick Start Guide - Profile Management System

## What Was Built

A complete profile management system with these features:

1. **Profile CRUD Operations** - Update all user profile fields
2. **Profile Picture Uploads** - Upload to Supabase storage with validation
3. **Password Management** - Secure password changes with strength indicator
4. **2FA with TOTP** - Setup, verification, and backup codes
5. **Notification Preferences** - JSON-based customizable settings

---

## Getting Started

### 1. Database Setup (Already Done)
The migration script has already been executed:
\`\`\`sql
Scripts/31-enhance-profiles-for-new-features.sql
\`\`\`

This created:
- Enhanced `profiles` table
- `user_2fa_secrets` table
- `user_2fa_attempts` table
- `user_2fa_backup_code_usage` table
- All necessary RLS policies

### 2. Profile Picture Setup

Create a storage bucket in Supabase:

\`\`\`bash
# Via Supabase Dashboard:
1. Go to Storage > Buckets
2. Create new bucket: "profile-pictures"
3. Set to Private (authentication required)
4. Enable RLS for the bucket
\`\`\`

Or it will auto-create on first use if you have admin access.

### 3. Access the Features

**Profile Page:**
\`\`\`
http://localhost:3000/dashboard/profile
\`\`\`

Features available:
- Update personal information
- Upload/delete profile picture
- Change password with strength indicator
- View 2FA status
- Toggle notification preferences

**2FA Setup:**
- First-time users: Directed to `/auth/setup-2fa`
- Subsequent logins: Prompted at `/auth/verify-2fa`

---

## File Quick Reference

### Utilities
- **TOTP**: `/lib/auth/totp.ts` - TOTP generation and verification
- **Storage**: `/lib/supabase/storage.ts` - File upload handling
- **Profile Service**: `/lib/services/profile-service.ts` - All business logic

### API Endpoints
\`\`\`
GET    /api/profile                      - Get profile
PUT    /api/profile                      - Update profile
POST   /api/profile/picture/upload       - Upload picture
DELETE /api/profile/picture/upload       - Delete picture
GET    /api/profile/notifications        - Get preferences
PUT    /api/profile/notifications        - Update preferences
POST   /api/profile/password             - Record password change

POST   /api/auth/2fa                     - Generate 2FA secret
POST   /api/auth/2fa/verify              - Verify and enable 2FA
GET    /api/auth/2fa/status              - Get status
DELETE /api/auth/2fa/status              - Disable 2FA
\`\`\`

### Components
- `ProfilePictureUpload` - `/components/profile/profile-picture-upload.tsx`
- `PasswordChangeForm` - `/components/profile/password-change-form.tsx`
- `TwoFAStatus` - `/components/profile/2fa-status.tsx`
- `NotificationPreferences` - `/components/profile/notification-preferences.tsx`

### Pages
- Enhanced Profile: `/app/dashboard/profile/page.tsx`
- 2FA Setup: `/app/auth/setup-2fa/page.tsx`
- 2FA Verify: `/app/auth/verify-2fa/page.tsx`

---

## Key Code Examples

### Using Profile Service

\`\`\`typescript
import { getProfile, updateProfile } from '@/lib/services/profile-service';

// Get user profile
const profile = await getProfile(userId);

// Update profile
await updateProfile(userId, {
  first_name: 'John',
  last_name: 'Doe'
});
\`\`\`

### Using TOTP

\`\`\`typescript
import { 
  generateTOTPSecret, 
  generateTOTPToken, 
  verifyTOTPToken 
} from '@/lib/auth/totp';

// Generate secret
const secret = generateTOTPSecret();

// Generate token
const token = generateTOTPToken(secret);

// Verify token
const isValid = verifyTOTPToken(secret, '123456');
\`\`\`

### Using Storage

\`\`\`typescript
import { 
  uploadProfilePicture, 
  deleteProfilePicture,
  validateProfilePicture 
} from '@/lib/supabase/storage';

// Validate file
const validation = validateProfilePicture(file);
if (!validation.valid) {
  console.error(validation.error);
}

// Upload
const filePath = await uploadProfilePicture(userId, file);

// Delete
await deleteProfilePicture(filePath);
\`\`\`

---

## Database Schema Reference

### profiles table (new columns)
\`\`\`sql
profile_picture_url TEXT
profile_picture_uploaded_at TIMESTAMP
notification_preferences JSONB
last_password_change TIMESTAMP
password_change_count INTEGER
updated_at TIMESTAMP
\`\`\`

### user_2fa_secrets table
\`\`\`sql
id UUID PRIMARY KEY
user_id UUID (FK)
secret TEXT (TOTP secret)
backup_codes TEXT[] (hashed codes)
is_enabled BOOLEAN
setup_at TIMESTAMP
verified_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
\`\`\`

### Notification Preferences JSON
\`\`\`json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "newsletter": true,
  "eventReminders": true,
  "donationUpdates": true,
  "communityDigest": false,
  "generalAnnouncements": true
}
\`\`\`

---

## Security Notes

1. **2FA Rate Limiting**
   - Max 5 failed attempts per 15 minutes
   - Automatically enforced in API

2. **Backup Codes**
   - Single-use only
   - SHA256 hashed in database
   - 8-character hex strings

3. **File Uploads**
   - Max 5MB
   - Validated MIME types
   - Filename randomization with timestamp

4. **Session Security**
   - All endpoints require authentication
   - RLS policies enforce user isolation
   - Password-protected 2FA disable

---

## Testing Checklist

\`\`\`
[ ] Profile picture upload works
[ ] Profile picture deletion works
[ ] Profile fields update correctly
[ ] Password change form validates correctly
[ ] Password strength indicator works
[ ] 2FA setup QR code displays
[ ] 2FA verification accepts 6-digit code
[ ] Backup codes display and copy
[ ] Notification preferences save
[ ] Rate limiting prevents brute force
[ ] User can't access other users' data (RLS)
[ ] Deleted pictures don't remain in storage
\`\`\`

---

## Troubleshooting

### File Upload Not Working
1. Check Supabase storage bucket exists
2. Verify bucket name is "profile-pictures"
3. Check file size (< 5MB)
4. Verify file type (JPEG, PNG, WebP)

### 2FA Setup Not Working
1. Check user can access `/auth/setup-2fa`
2. Verify Supabase tables created
3. Check backend can generate TOTP secret
4. Test with valid 6-digit codes

### Profile Not Updating
1. Verify user is authenticated
2. Check RLS policies on profiles table
3. Verify API endpoint responses
4. Check database has been migrated

### Notification Preferences Not Saving
1. Verify notification_preferences column exists
2. Check JSON structure is valid
3. Verify PUT endpoint is being called
4. Check for API errors in console

---

## Next Steps

1. **QR Code Rendering** (Optional)
   \`\`\`bash
   npm install qrcode.react
   \`\`\`
   Then update `/app/auth/setup-2fa/page.tsx` to render QR code

2. **Email Notifications**
   - Send confirmation emails on 2FA setup
   - Alert on password changes
   - Notify on security events

3. **Session Management**
   - Display active sessions
   - Allow device management
   - Remote logout functionality

4. **Audit Logging**
   - Track all profile changes
   - Log security events
   - Store IP addresses and user agents

---

## Support

For detailed implementation information, see:
- `/IMPLEMENTATION_COMPLETE.md` - Full technical documentation
- `/v0_plans/deep-route.md` - Original implementation plan

All code includes TypeScript types and JSDoc comments for easy reference.

---

**Status**: ✅ Implementation Complete and Ready to Use
