# Ramadan Feature Implementation Guide

## Overview

A comprehensive Ramadan experience has been implemented with public-facing routes under `/ramadan/`. The feature includes spiritual reflections, daily reminders, Quranic duas, knowledge base, and charity information.

---

## Database Schema

### Tables Created

1. **ramadan_daily_reminders**
   - Stores daily Ramadan reminders (one per day)
   - Supports multiple types: hadith, dua, quote, tip
   - Day number (1-30) to unlock reminders progressively
   - Published/draft status control

2. **ramadan_knowledge_base**
   - Educational articles about Ramadan
   - Categories: basics, fasting, spiritual, practical
   - Difficulty levels: beginner, intermediate, advanced
   - Slug-based navigation

3. **ramadan_duas**
   - Collection of essential Ramadan supplications
   - Categories: suhoor, iftar, forgiveness, last-ten-nights
   - Arabic text with transliteration and English translation
   - Audio support for recitation

4. **ramadan_reflection_verses**
   - Quranic verses for reflection
   - Featured verses for homepage display
   - Theme and reflection notes

5. **ramadan_charity_info**
   - Charity information sections
   - Ordered display for UI rendering

6. **ramadan_bank_accounts**
   - Bank account details for donations
   - Currency and account type support
   - Active/inactive status control

7. **user_ramadan_tracking**
   - Tracks user engagement during Ramadan
   - Reminders viewed, duas bookmarked, articles read
   - Last visited date

---

## Routes & Pages

### 1. `/ramadan` - Home Page
**File:** `/app/ramadan/page.tsx`

**Features:**
- Beautiful spiritual intro with crescent moon SVG
- Initial welcome message
- "Begin the Reflection" CTA button
- Auto-playing Quranic recitation (user-initiated)
- Featured Quranic verse display (Al-Baqarah 2:185)
- Navigation to sub-sections

**Audio Source:** Yaseer Al-Dossari recitation
- URL: `https://wnumzpiahvnuofdoetil.supabase.co/storage/v1/object/public/Ramadan/YASEER-AL-DOSSARI.mp3`
- Loops continuously after CTA click
- No media controls visible

### 2. `/ramadan/daily-reminder` - Daily Reminder Page
**File:** `/app/ramadan/daily-reminder/page.tsx`

**Features:**
- Display one reminder per day
- Day-based unlocking (only current/previous days accessible)
- Types rotate: Hadith, Dua, Quote, Practical tip
- Download as image functionality
- Share via social media or clipboard
- Previous/Next day navigation
- Watermark: "By Hamduk Islamic Foundation"

**Download Functionality:**
- Generates canvas-based image
- Includes day number, type, content
- PNG format download

### 3. `/ramadan/knowledge` - Knowledge Base
**File:** `/app/ramadan/knowledge/page.tsx`

**Features:**
- Educational cards about Ramadan
- Topics: What is Ramadan, Fasting rules, Laylatul Qadr, Zakat-ul-Fitr
- Simple, non-technical language
- Read time estimates
- Difficulty levels (beginner/intermediate/advanced)
- Expandable content cards
- Categories and tags

### 4. `/ramadan/duas` - Duas Collection
**File:** `/app/ramadan/duas/page.tsx`

**Features:**
- Organized by categories:
  - Suhoor (before fasting)
  - Iftar (breaking fast)
  - Forgiveness
  - Last 10 Nights
- Arabic text with transliteration
- English translation
- Copy to clipboard functionality
- Audio support for recitations
- Source/Reference attribution

### 5. `/ramadan/charity` - Charity Page
**File:** `/app/ramadan/charity/page.tsx`

**Features:**
- Charity significance explanation
- Types of charity (Sadaqah, Zakat, Feeding)
- Foundation's Ramadan activities
- Bank account details:
  - Account Name: Hamduk Unique Concept
  - Account Number: 1214132103
  - Bank: Zenith Bank
  - Currency: NGN
- Copy account number functionality
- Donation call-to-action
- Transparency messaging

---

## Service Layer

### RamadanService
**File:** `/lib/services/ramadan-service.ts`

**Methods:**
- `getDailyReminder(dayNumber)` - Get reminder for specific day
- `getAllDailyReminders(limit)` - Get all reminders
- `getFeaturedReflectionVerse()` - Get homepage verse
- `getKnowledgeArticles()` - Get all knowledge articles
- `getKnowledgeArticleBySlug(slug)` - Get specific article
- `getDuasByCategory(category)` - Get duas by category
- `getFeaturedDuas()` - Get featured duas
- `getAllDuas()` - Get all duas
- `getCharityInfo()` - Get charity information
- `getBankAccounts()` - Get bank account details
- `getDuaCategories()` - Get available categories

All methods include error handling and logging.

---

## Navigation Integration

### Desktop Navigation
- Ramadan menu item with emerald glow effect
- Animated highlight to draw attention
- Dropdown with all sub-sections
- Positioned before Events in navbar

### Mobile Navigation
- Highlighted Ramadan section with emerald background
- Expanded by default appearance
- All sub-sections accessible

---

## Design & Styling

### Color Scheme
- Primary: Emerald (#10b981)
- Background: Slate-950 to Slate-900 gradient
- Accent: Emerald with transparency
- Text: White/Slate combinations

### Features
- Calm animations (fade, slide, scale)
- Subtle star twinkling effects
- Gradient backgrounds
- Responsive design (mobile-first)
- Dark mode optimized
- No harsh transitions or flashy effects

---

## Security & RLS Policies

All tables have Row Level Security enabled:
- Public viewing for published content
- Users can manage their own tracking data
- Admin controls for content management

---

## Sample Data

Default data inserted:
1. **Featured Verse:** Al-Baqarah 2:185
2. **Charity Sections:** Why Charity, Types, Community Impact
3. **Bank Account:** Hamduk Unique Concept (NGN currency)

---

## Dynamic Features

### Progressive Disclosure
- Daily reminders unlock by day number
- Future days inaccessible
- Previous days remain accessible
- Encourages daily visits

### User Engagement Tracking
- Track reminders viewed
- Bookmark duas
- Save articles read
- Last visit tracking

### Sharing Capabilities
- Download reminder as image
- Share via native share API
- Fallback to clipboard copy
- Account number quick-copy

---

## Environment Setup

No additional environment variables required. Uses existing Supabase integration.

---

## Content Management

### Adding Content

**New Daily Reminder:**
```sql
INSERT INTO ramadan_daily_reminders (day_number, reminder_type, title, english_text, is_published)
VALUES (1, 'hadith', 'Title', 'Content...', TRUE);
```

**New Knowledge Article:**
```sql
INSERT INTO ramadan_knowledge_base (slug, title, content, is_published)
VALUES ('article-slug', 'Title', 'Content...', TRUE);
```

**New Dua:**
```sql
INSERT INTO ramadan_duas (title, category, arabic_text, english_translation)
VALUES ('Dua Title', 'iftar', 'Arabic...', 'English...');
```

---

## Future Enhancements

- Notification system for daily reminders
- User preferences for notification timing
- Community duas wall
- Performance metrics dashboard
- Multi-language support
- Custom recitation selection
- Ramadan prayer time integration

---

## Testing Checklist

- [ ] Home page loads with verse
- [ ] Audio plays on CTA click
- [ ] Daily reminder navigation works
- [ ] Download generates correct image
- [ ] Knowledge articles display properly
- [ ] Duas copy functionality works
- [ ] Charity account number copies
- [ ] Mobile menu responsive
- [ ] All links functional
- [ ] Error states handled

---

## Support & Maintenance

For issues or updates, check:
- Database connection and RLS policies
- Sample data insertion status
- File paths and route structure
- Environment variables (if needed)
- Supabase storage bucket for audio files

---

**Implementation Date:** February 2026  
**By:** Hamduk Islamic Foundation  
**Status:** Production Ready
