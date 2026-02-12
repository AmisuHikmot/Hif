# API Reference - Profile Management System

## Authentication

All endpoints require an authenticated user (Supabase auth token). Include in the Authorization header:

```
Authorization: Bearer {user_token}
```

---

## Profile Endpoints

### GET /api/profile
Get the current user's profile.

**Request:**
```http
GET /api/profile
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+234...",
  "address": "...",
  "city": "...",
  "state": "...",
  "postal_code": "...",
  "country": "...",
  "bio": "...",
  "occupation": "...",
  "organization": "...",
  "website": "...",
  "profile_picture_url": "https://...",
  "profile_picture_uploaded_at": "2024-01-01T00:00:00Z",
  "notification_preferences": {...},
  "last_password_change": "2024-01-01T00:00:00Z",
  "password_change_count": 2,
  "updated_at": "2024-01-01T00:00:00Z"
}
```

---

### PUT /api/profile
Update the current user's profile.

**Request:**
```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+234...",
  "bio": "My bio",
  "occupation": "Engineer"
}
```

**Response:** `200 OK`
```json
{
  // Same as GET response
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Invalid data
- `500` - Server error

---

### POST /api/profile/picture/upload
Upload a new profile picture.

**Request:**
```http
POST /api/profile/picture/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form data:
- file: File (JPEG, PNG, or WebP, max 5MB)
```

**Response:** `200 OK`
```json
{
  "url": "https://supabase.../storage/v1/object/public/profile-pictures/..."
}
```

**Errors:**
- `400` - Invalid file (size, type)
- `401` - Unauthorized
- `500` - Upload failed

---

### DELETE /api/profile/picture/upload
Delete the current user's profile picture.

**Request:**
```http
DELETE /api/profile/picture/upload
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true
}
```

**Errors:**
- `401` - Unauthorized
- `404` - No picture to delete
- `500` - Delete failed

---

## Notification Preferences Endpoints

### GET /api/profile/notifications
Get notification preferences for current user.

**Request:**
```http
GET /api/profile/notifications
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "newsletter": true,
  "eventReminders": true,
  "donationUpdates": true,
  "communityDigest": false,
  "generalAnnouncements": true
}
```

---

### PUT /api/profile/notifications
Update notification preferences.

**Request:**
```http
PUT /api/profile/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "emailNotifications": true,
  "smsNotifications": true,
  "newsletter": false
}
```

Note: Only include fields you want to update; others will retain their values.

**Response:** `200 OK`
```json
{
  // Updated preferences
}
```

**Errors:**
- `401` - Unauthorized
- `400` - Invalid data
- `500` - Update failed

---

### POST /api/profile/password
Record a password change (called after Supabase updates password).

**Request:**
```http
POST /api/profile/password
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password change recorded"
}
```

---

## 2FA Endpoints

### POST /api/auth/2fa
Generate a new TOTP secret for 2FA setup.

**Request:**
```http
POST /api/auth/2fa
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "secret": "JBSWY3DPEBLW64TMMQ",
  "qrCodeUri": "otpauth://totp/...",
  "backupCodes": [
    "XXXX-XXXX",
    "YYYY-YYYY",
    "..."
  ]
}
```

**Notes:**
- `secret`: Base32-encoded secret for manual entry
- `qrCodeUri`: URI for QR code generation
- `backupCodes`: 10 formatted codes for backup access

---

### POST /api/auth/2fa/verify
Verify TOTP token and enable 2FA.

**Request:**
```http
POST /api/auth/2fa/verify
Authorization: Bearer {token}
Content-Type: application/json

{
  "token": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "2FA has been enabled"
}
```

**Errors:**
- `400` - Invalid token (wrong code)
- `401` - Unauthorized
- `500` - Verification failed

---

### GET /api/auth/2fa/status
Get current 2FA status.

**Request:**
```http
GET /api/auth/2fa/status
Authorization: Bearer {token}
```

**Response:** `200 OK`
```json
{
  "is_enabled": true,
  "setup_at": "2024-01-01T00:00:00Z",
  "verified_at": "2024-01-01T00:00:00Z",
  "has_backup_codes": true
}
```

If 2FA is not set up:
```json
{
  "is_enabled": false,
  "setup_at": null,
  "verified_at": null,
  "has_backup_codes": false
}
```

---

### DELETE /api/auth/2fa/status
Disable 2FA (requires password confirmation).

**Request:**
```http
DELETE /api/auth/2fa/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "password": "user_password"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "2FA has been disabled"
}
```

**Errors:**
- `400` - Password required
- `401` - Invalid password
- `500` - Disable failed

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message describing what went wrong"
}
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (invalid data) |
| 401 | Unauthorized (not authenticated) |
| 404 | Not found |
| 500 | Server error |

---

## Rate Limiting

### 2FA Verification
- **Limit**: 5 failed attempts per 15 minutes
- **Response**: `429 Too Many Requests` (implemented in profile service)
- **Check**: Use `check2FARateLimit()` in profile service

---

## TypeScript Examples

### Using Fetch API

```typescript
// Get profile
const profile = await fetch('/api/profile', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

// Update profile
const updated = await fetch('/api/profile', {
  method: 'PUT',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    first_name: 'John'
  })
}).then(r => r.json());

// Upload picture
const formData = new FormData();
formData.append('file', file);

const picture = await fetch('/api/profile/picture/upload', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
}).then(r => r.json());

// Setup 2FA
const twoFA = await fetch('/api/auth/2fa', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  }
}).then(r => r.json());

console.log(twoFA.secret);
console.log(twoFA.qrCodeUri);
```

### Using SWR

```typescript
import useSWR from 'swr';

function ProfileComponent() {
  const { data: profile, isLoading } = useSWR(
    '/api/profile',
    async (url) => {
      const token = await getToken(); // Get from auth context
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      return res.json();
    }
  );

  return (
    <div>
      {isLoading ? 'Loading...' : (
        <p>Hello, {profile?.first_name}</p>
      )}
    </div>
  );
}
```

---

## Webhooks & Events

Currently, no webhooks are implemented. To add event notifications:

1. Emit events when profile changes
2. Create webhook endpoints
3. Store webhook subscriptions in database
4. Send POST requests to subscribed endpoints

Example events:
- `profile.updated`
- `profile.picture.uploaded`
- `password.changed`
- `2fa.enabled`
- `2fa.disabled`

---

## Rate Limiting & Quotas

Currently enforced:
- 2FA verification: 5 attempts per 15 minutes
- File uploads: 5MB max per file

Recommended to add:
- Global rate limiting: 1000 requests per hour per IP
- Profile updates: 10 per minute per user
- File uploads: 5 per hour per user

---

## Migration from v0

If migrating from v0:

1. Run migration script 31
2. Update profile page imports
3. Point to new API endpoints
4. Test all workflows
5. Migrate existing data if needed

---

## Caching Strategy

For better performance:

```typescript
// Profile - Cache for 5 minutes
fetch('/api/profile', {
  headers: { 'Cache-Control': 'max-age=300' }
});

// Preferences - Cache for 10 minutes
fetch('/api/profile/notifications', {
  headers: { 'Cache-Control': 'max-age=600' }
});

// 2FA Status - No caching (security critical)
fetch('/api/auth/2fa/status', {
  headers: { 'Cache-Control': 'no-cache' }
});
```

---

## FAQ

**Q: Can users change their email?**
A: No, email is read-only. Only password can be changed via auth.

**Q: How long are backup codes valid?**
A: Indefinitely, until one is used. Each code can only be used once.

**Q: What happens if TOTP is disabled?**
A: 2FA verification is no longer required. Backup codes become invalid.

**Q: Can multiple devices have the same TOTP secret?**
A: Yes, scan the QR code on multiple devices. All will generate the same codes.

**Q: Is there a way to recover a lost authenticator app?**
A: Yes, use one of the backup codes. Keep them safe!

---

**Last Updated**: January 2024  
**API Version**: 1.0
