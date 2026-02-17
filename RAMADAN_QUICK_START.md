# Ramadan Feature - Quick Start Guide

## What's New

A complete Ramadan experience with 5 new pages, database tables, and navbar integration is now live!

---

## Quick Access

### Public URLs
- **Home**: `/ramadan` - Spiritual intro with featured verse
- **Daily Reminder**: `/ramadan/daily-reminder` - Day-by-day engagement
- **Knowledge**: `/ramadan/knowledge` - Educational articles
- **Duas**: `/ramadan/duas` - Prayer collections
- **Charity**: `/ramadan/charity` - Donation information

### Navbar
- Ramadan menu added (emerald highlight)
- Desktop dropdown with all sections
- Mobile menu with expanded section

---

## What Works Out of the Box

1. **Audio Recitation**
   - Plays on homepage CTA click
   - Yaseer Al-Dossari recitation
   - No controls visible (spiritual experience)
   - Loops continuously

2. **Content Management**
   - Daily reminders (4 samples included)
   - Knowledge articles (5 samples)
   - Duas (4 samples)
   - Charity information (populated)
   - Bank account details (Zenith Bank)

3. **User Features**
   - Download reminders as PNG
   - Share via social/clipboard
   - Copy bank account numbers
   - Category-based dua organization
   - Read-time estimates

---

## Database Status

✅ **7 tables created**
- ramadan_daily_reminders
- ramadan_knowledge_base
- ramadan_duas
- ramadan_reflection_verses
- ramadan_charity_info
- ramadan_bank_accounts
- user_ramadan_tracking

✅ **RLS policies configured**
✅ **Sample data inserted**
✅ **Indexes optimized**

---

## Adding More Content

### Option 1: Supabase Dashboard
1. Go to your Supabase project
2. Open "ramadan_*" tables
3. Click "Insert row"
4. Fill in content and set `is_published = TRUE`

### Option 2: SQL Script
```sql
-- Add daily reminder
INSERT INTO ramadan_daily_reminders 
(day_number, reminder_type, title, english_text, is_published)
VALUES (5, 'hadith', 'Title', 'Content here', TRUE);

-- Add knowledge article
INSERT INTO ramadan_knowledge_base 
(slug, title, content, is_published)
VALUES ('article-url', 'Article Title', 'Full content...', TRUE);

-- Add dua
INSERT INTO ramadan_duas 
(title, category, arabic_text, english_translation)
VALUES ('Dua Name', 'iftar', 'Arabic text', 'English text');
```

---

## Customization

### Change Colors
Edit `/app/globals.css` to update:
- Emerald to another color for Ramadan highlight
- Dark gradient colors

Example:
```css
/* Change emerald to blue */
.bg-emerald-600 → .bg-blue-600
```

### Change Audio File
Edit `/app/ramadan/page.tsx` line ~90:
```typescript
const audioUrl = 'YOUR_NEW_AUDIO_URL_HERE';
```

### Update Bank Details
Edit `/scripts/33-ramadan-sample-data.sql` or Supabase dashboard:
```sql
UPDATE ramadan_bank_accounts 
SET account_number = 'NEW_NUMBER' 
WHERE account_name = 'Hamduk Unique Concept';
```

### Modify Intro Text
Edit `/app/ramadan/page.tsx` lines ~153-160:
```typescript
<h1>Your Custom Title</h1>
<p>Your Custom Subtitle</p>
<p>Your Custom Quote</p>
```

---

## Testing Checklist

- [ ] Visit `/ramadan` → See crescent moon
- [ ] Click "Begin the Reflection" → Audio plays
- [ ] See featured verse (Al-Baqarah 2:185)
- [ ] Click daily reminder → Day 1 loads
- [ ] Download reminder → PNG saves
- [ ] Visit knowledge → Articles expand
- [ ] Click duas → Copy buttons work
- [ ] Check charity → Bank details visible
- [ ] Mobile menu → Ramadan section visible
- [ ] All links functional

---

## File Structure

```
Created Files:
├── /app/ramadan/
│   ├── page.tsx (Home page)
│   ├── layout.tsx (Ramadan layout)
│   ├── daily-reminder/page.tsx
│   ├── knowledge/page.tsx
│   ├── duas/page.tsx
│   └── charity/page.tsx
├── /lib/services/
│   └── ramadan-service.ts
├── /scripts/
│   ├── 32-ramadan-content-tables.sql
│   └── 33-ramadan-sample-data.sql
├── /components/
│   └── site-header.tsx (Updated)
└── /app/globals.css (Updated for Arabic)

Documentation:
├── /RAMADAN_FEATURE_GUIDE.md (Complete docs)
├── /IMPLEMENTATION_SUMMARY.md (Technical overview)
└── /RAMADAN_QUICK_START.md (This file)
```

---

## Common Issues & Solutions

**Issue**: Audio not playing
- Solution: Check if audio URL is accessible in Supabase storage

**Issue**: Arabic text not displaying
- Solution: Font loaded from Google Fonts, check RTL direction in CSS

**Issue**: Copy buttons not working
- Solution: Requires HTTPS in production (works in localhost)

**Issue**: Daily reminder shows empty
- Solution: Check `is_published = TRUE` in database

**Issue**: Mobile menu not showing Ramadan
- Solution: Clear browser cache, re-check navbar update

---

## Performance Tips

1. **Database Queries**
   - Indexed on day_number, is_published, category
   - Efficient SELECT queries only

2. **Images**
   - Lazy load knowledge article images
   - Generated on-the-fly for reminder downloads

3. **Audio**
   - Only loads on user interaction
   - Stored in Supabase CDN

4. **Caching**
   - Static pages where possible
   - Revalidate daily for fresh content

---

## Support Resources

1. **Documentation**
   - Read: `/RAMADAN_FEATURE_GUIDE.md` (complete reference)
   - Read: `/IMPLEMENTATION_SUMMARY.md` (technical details)

2. **Database Schema**
   - Check Supabase dashboard → Tables
   - Review RLS policies → Security

3. **Code Reference**
   - `/lib/services/ramadan-service.ts` (all methods)
   - `/app/ramadan/page.tsx` (home page example)

---

## Feature Roadmap

Future enhancements (optional):
- [ ] Admin panel for content management
- [ ] Email notifications for daily reminders
- [ ] User preferences (notification time, language)
- [ ] Community duas wall
- [ ] Ramadan prayer times
- [ ] Progress tracker
- [ ] Multi-language UI
- [ ] Analytics dashboard

---

## Summary

Everything is ready to go! Visit `/ramadan` to see the complete feature.

**Key URLs:**
- Home: `https://yourdomain.com/ramadan`
- Daily Reminders: `https://yourdomain.com/ramadan/daily-reminder`
- Knowledge: `https://yourdomain.com/ramadan/knowledge`
- Duas: `https://yourdomain.com/ramadan/duas`
- Charity: `https://yourdomain.com/ramadan/charity`

**Need to add content?** Use Supabase dashboard or SQL scripts.
**Need to customize?** Edit colors in globals.css or content in page components.

---

**Status**: Production Ready
**Last Updated**: February 17, 2026
**Support**: Check documentation files for detailed guides
