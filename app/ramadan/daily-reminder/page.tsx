'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Download, Share2, Bell, BellOff, Lock, ChevronLeft, ChevronRight,
  Moon, Bookmark, BookmarkCheck, Sun, MessageCircle,
  Flame, CheckCircle2, Clock, MapPin, Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ─── Types ───────────────────────────────────────────────────────────────────
interface DailyReminder {
  id: string;
  day_number: number;
  reminder_type: string;
  title: string;
  arabic_text: string | null;
  english_text: string;
  transliteration: string | null;
  category: string | null;
  reference: string | null;
  image_url: string | null;
  author: string | null;
  tags: string[];
}

interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
// Update RAMADAN_START each year to the first day of Ramadan
const RAMADAN_START = new Date('2026-03-01T00:00:00');

const LS = {
  STREAK_DATE:  'rm_streak_date',
  STREAK_COUNT: 'rm_streak_count',
  BOOKMARKS:    'rm_bookmarks',
  READ_DAYS:    'rm_read_days',
  THEME:        'rm_theme',
  JOURNAL:      'rm_journal_', // suffixed with day_number
  NOTIF:        'rm_notif',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCurrentRamadanDay(): number {
  const diff = Math.floor((Date.now() - RAMADAN_START.getTime()) / 86400000);
  return Math.min(Math.max(diff + 1, 1), 30);
}

function todayDateStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function getReminderTypeLabel(type: string): string {
  const map: Record<string, string> = {
    hadith:   '📖 Hadith',
    quran:    '🕌 Quranic Verse',
    dua:      '🤲 Dua',
    reminder: '💡 Reminder',
  };
  return map[type] ?? type.toUpperCase();
}

// ─── Streak helpers ───────────────────────────────────────────────────────────
function updateStreak(): number {
  const today     = todayDateStr();
  const lastDate  = localStorage.getItem(LS.STREAK_DATE) ?? '';
  const count     = parseInt(localStorage.getItem(LS.STREAK_COUNT) ?? '0', 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

  if (lastDate === today) return count;
  const newCount = lastDate === yesterday ? count + 1 : 1;
  localStorage.setItem(LS.STREAK_DATE,  today);
  localStorage.setItem(LS.STREAK_COUNT, String(newCount));
  return newCount;
}

// ─── Islamic star pattern ─────────────────────────────────────────────────────
const IslamicPattern = ({ theme }: { theme: 'dark' | 'light' }) => (
  <div
    className="pointer-events-none fixed inset-0 z-0"
    style={{ opacity: theme === 'dark' ? 0.035 : 0.06 }}
    aria-hidden
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip3" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon
            points="40,4 49,28 74,28 54,44 61,68 40,54 19,68 26,44 6,28 31,28"
            fill="none" stroke="#d4af37" strokeWidth="0.8"
          />
          <rect
            x="28" y="28" width="24" height="24"
            fill="none" stroke="#d4af37" strokeWidth="0.5"
            transform="rotate(45 40 40)"
          />
          <circle cx="40" cy="40" r="5" fill="none" stroke="#d4af37" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip3)" />
    </svg>
  </div>
);

// ─── Shimmer card reveal ──────────────────────────────────────────────────────
const ShimmerReveal = ({ show, onDone }: { show: boolean; onDone: () => void }) => {
  useEffect(() => {
    if (show) {
      const t = setTimeout(onDone, 1500);
      return () => clearTimeout(t);
    }
  }, [show, onDone]);

  if (!show) return null;

  return (
    <>
      <style>{`
        @keyframes sweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes fadeOut {
          0%   { opacity: 1; }
          70%  { opacity: 1; }
          100% { opacity: 0; pointer-events: none; }
        }
      `}</style>
      <div
        className="absolute inset-0 z-50 rounded-3xl overflow-hidden flex items-center justify-center flex-col gap-3"
        style={{
          background: 'linear-gradient(145deg, #0f1e35, #1a0e06)',
          animation: 'fadeOut 1.5s ease-out forwards',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(105deg, transparent 30%, #d4af3766 50%, transparent 70%)',
            animation: 'sweep 1.2s ease-out forwards',
          }}
        />
        <Sparkles className="w-12 h-12 text-amber-400 relative z-10" />
        <p className="text-amber-300 font-bold text-xl relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
          Day {getCurrentRamadanDay()} Unlocked ✨
        </p>
      </div>
    </>
  );
};

// ─── Prayer time countdown hook ───────────────────────────────────────────────
function usePrayerCountdown() {
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer]   = useState<{ name: string; time: string; countdown: string } | null>(null);
  const [locError, setLocError]       = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) { setLocError(true); return; }
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const { latitude, longitude } = pos.coords;
        const d = new Date();
        const url = `https://api.aladhan.com/v1/timings/${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2`;
        const res  = await fetch(url);
        const json = await res.json();
        setPrayerTimes(json.data.timings as PrayerTimes);
      } catch { setLocError(true); }
    }, () => setLocError(true));
  }, []);

  useEffect(() => {
    if (!prayerTimes) return;
    const tick = () => {
      const now = new Date();
      const prayers = [
        { name: 'Fajr (Suhoor ends)', time: prayerTimes.Fajr    },
        { name: 'Dhuhr',              time: prayerTimes.Dhuhr    },
        { name: 'Asr',                time: prayerTimes.Asr      },
        { name: 'Iftar (Maghrib)',     time: prayerTimes.Maghrib  },
        { name: 'Isha',               time: prayerTimes.Isha     },
      ];
      for (const p of prayers) {
        const [h, m] = p.time.split(':').map(Number);
        const target = new Date(now);
        target.setHours(h, m, 0, 0);
        if (target > now) {
          const diff = target.getTime() - now.getTime();
          const hh   = Math.floor(diff / 3600000);
          const mm   = Math.floor((diff % 3600000) / 60000);
          const ss   = Math.floor((diff % 60000) / 1000);
          setNextPrayer({ name: p.name, time: p.time, countdown: `${hh}h ${mm}m ${ss}s` });
          return;
        }
      }
      setNextPrayer({ name: 'Fajr tomorrow', time: prayerTimes.Fajr, countdown: '—' });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [prayerTimes]);

  return { nextPrayer, locError };
}

// ─── Day grid ─────────────────────────────────────────────────────────────────
function DayGrid({
  total, currentDay, maxUnlocked, readDays, onSelect,
}: {
  total: number; currentDay: number; maxUnlocked: number;
  readDays: Set<number>; onSelect: (d: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => i + 1).map((d) => {
        const unlocked = d <= maxUnlocked;
        const active   = d === currentDay;
        const read     = readDays.has(d);

        return (
          <button
            key={d}
            disabled={!unlocked}
            onClick={() => unlocked && onSelect(d)}
            className="relative w-9 h-9 rounded-full text-xs font-bold transition-all duration-200"
            style={{
              background: active ? 'linear-gradient(135deg,#92400e,#d4af37)' : unlocked ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)',
              border: active ? '1px solid #d4af37' : unlocked ? '1px solid rgba(255,255,255,0.12)' : '1px solid rgba(255,255,255,0.04)',
              color: active ? '#0c1a2e' : unlocked ? '#d4af37' : '#334155',
              transform: active ? 'scale(1.14)' : 'scale(1)',
              cursor: unlocked ? 'pointer' : 'not-allowed',
              boxShadow: active ? '0 0 18px #d4af3766' : 'none',
            }}
          >
            {unlocked ? d : <Lock className="w-3 h-3 mx-auto" />}
            {read && !active && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ─── Canvas draw helper (shared for square + story) ──────────────────────────
function drawReminderCanvas(
  ctx: CanvasRenderingContext2D,
  reminder: DailyReminder,
  w: number,
  h: number,
) {
  // Background
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#0c1a2e'); bg.addColorStop(0.5, '#0f172a'); bg.addColorStop(1, '#1a0f0a');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  // Outer gold border
  ctx.strokeStyle = '#d4af37'; ctx.lineWidth = 5;
  ctx.strokeRect(24, 24, w - 48, h - 48);
  ctx.strokeStyle = '#d4af3744'; ctx.lineWidth = 1.5;
  ctx.strokeRect(38, 38, w - 76, h - 76);

  // Corner dots
  ([[50,50],[w-50,50],[50,h-50],[w-50,h-50]] as [number,number][]).forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x, y, 13, 0, Math.PI * 2);
    ctx.fillStyle = '#d4af37'; ctx.fill();
  });

  // Header shimmer band
  const hg = ctx.createLinearGradient(0, 70, w, 70);
  hg.addColorStop(0, '#d4af3700'); hg.addColorStop(0.5, '#d4af3740'); hg.addColorStop(1, '#d4af3700');
  ctx.fillStyle = hg; ctx.fillRect(24, 70, w - 48, 100);

  ctx.fillStyle = '#d4af37'; ctx.textAlign = 'center';
  ctx.font = `bold ${Math.round(w * 0.025)}px Georgia`;
  ctx.fillText('HAMDUK ISLAMIC FOUNDATION', w / 2, 130);

  // Crescent
  ctx.font = `${Math.round(w * 0.06)}px Arial`;
  ctx.fillText('☽✦', w / 2, h * 0.22);

  // Day heading
  ctx.font = `bold ${Math.round(w * 0.048)}px Georgia`;
  ctx.fillText(`Day ${reminder.day_number} of Ramadan`, w / 2, h * 0.30);

  // Divider
  ctx.strokeStyle = '#d4af3788'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(w * 0.1, h * 0.34); ctx.lineTo(w * 0.9, h * 0.34); ctx.stroke();

  // Type pill
  ctx.fillStyle = '#d4af3733';
  const bx = w / 2 - 130, by = h * 0.36;
  ctx.beginPath(); ctx.roundRect(bx, by, 260, 42, 21); ctx.fill();
  ctx.fillStyle = '#d4af37'; ctx.font = `bold ${Math.round(w * 0.02)}px Georgia`;
  ctx.fillText(reminder.reminder_type.toUpperCase(), w / 2, by + 28);

  // Title
  ctx.fillStyle = '#ffffff'; ctx.font = `bold ${Math.round(w * 0.036)}px Georgia`;
  const titleWords = reminder.title.split(' ');
  let line = ''; let ty = h * 0.46;
  titleWords.forEach((word) => {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > w * 0.8 && line) {
      ctx.fillText(line.trim(), w / 2, ty); line = word + ' '; ty += w * 0.046;
    } else { line = test; }
  });
  ctx.fillText(line.trim(), w / 2, ty);

  // English text
  ctx.strokeStyle = '#d4af3733'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(w * 0.1, ty + 30); ctx.lineTo(w * 0.9, ty + 30); ctx.stroke();

  ctx.fillStyle = '#cbd5e1'; ctx.font = `${Math.round(w * 0.026)}px Georgia`;
  const words = reminder.english_text.split(' ');
  let el = ''; let ey = ty + 80;
  words.forEach((word) => {
    const test = el + word + ' ';
    if (ctx.measureText(test).width > w * 0.78 && el) {
      ctx.fillText(el.trim(), w / 2, ey); el = word + ' '; ey += Math.round(w * 0.038);
    } else { el = test; }
  });
  ctx.fillText(el.trim(), w / 2, ey);

  // Reference
  if (reminder.reference) {
    ctx.fillStyle = '#d4af3799'; ctx.font = `italic ${Math.round(w * 0.022)}px Georgia`;
    ctx.fillText(`— ${reminder.reference}`, w / 2, ey + 55);
  }

  // Footer band
  ctx.fillStyle = '#d4af3733'; ctx.fillRect(24, h - 90, w - 48, 66);
  ctx.fillStyle = '#d4af37'; ctx.font = `bold ${Math.round(w * 0.02)}px Georgia`;
  ctx.fillText('🌙  Ramadan Kareem  •  hamduk.org  🌙', w / 2, h - 52);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function DailyReminderPage() {
  const [allReminders, setAllReminders] = useState<DailyReminder[]>([]);
  const [currentDay,   setCurrentDay]   = useState(1);
  const [loading,      setLoading]      = useState(true);
  const [streak,       setStreak]       = useState(0);
  const [bookmarks,    setBookmarks]    = useState<Set<string>>(new Set());
  const [readDays,     setReadDays]     = useState<Set<number>>(new Set());
  const [theme,        setTheme]        = useState<'dark' | 'light'>('dark');
  const [activeTab,    setActiveTab]    = useState<'today' | 'saved'>('today');
  const [journalText,  setJournalText]  = useState('');
  const [journalSaved, setJournalSaved] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [showReveal,   setShowReveal]   = useState(false);
  const prevDayRef = useRef<number | null>(null);
  const { toast } = useToast();
  const { nextPrayer, locError } = usePrayerCountdown();
  const todayDay = getCurrentRamadanDay();

  // ── Bootstrap from localStorage ─────────────────────────────────────────
  useEffect(() => {
    const s = updateStreak();
    setStreak(s);
    try {
      setBookmarks(new Set(JSON.parse(localStorage.getItem(LS.BOOKMARKS) ?? '[]')));
      setReadDays(new Set(JSON.parse(localStorage.getItem(LS.READ_DAYS) ?? '[]')));
      setTheme((localStorage.getItem(LS.THEME) as 'dark' | 'light') ?? 'dark');
      setNotifEnabled(localStorage.getItem(LS.NOTIF) === '1');
    } catch {}
  }, []);

  // ── Fetch reminders ─────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/ramadan/content?type=ramadan_daily-reminders')
      .then((r) => r.json())
      .then((data: DailyReminder[]) => {
        setAllReminders(data.sort((a, b) => a.day_number - b.day_number));
        setCurrentDay(todayDay);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Load journal entry for current day ──────────────────────────────────
  useEffect(() => {
    setJournalText(localStorage.getItem(LS.JOURNAL + currentDay) ?? '');
    setJournalSaved(false);
  }, [currentDay]);

  // ── Auto-mark as read after 3s on a day ────────────────────────────────
  const markRead = useCallback((day: number) => {
    setReadDays((prev) => {
      if (prev.has(day)) return prev;
      const next = new Set(prev);
      next.add(day);
      localStorage.setItem(LS.READ_DAYS, JSON.stringify([...next]));
      return next;
    });
  }, []);

  useEffect(() => {
    const t = setTimeout(() => markRead(currentDay), 3000);
    return () => clearTimeout(t);
  }, [currentDay, markRead]);

  // ── Day selection with shimmer on today ─────────────────────────────────
  const handleSelectDay = (d: number) => {
    if (d === todayDay && !readDays.has(d) && prevDayRef.current !== null) {
      setShowReveal(true);
    }
    prevDayRef.current = currentDay;
    setCurrentDay(d);
  };

  // ── Bookmark toggle ─────────────────────────────────────────────────────
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      localStorage.setItem(LS.BOOKMARKS, JSON.stringify([...next]));
      toast({ title: next.has(id) ? '🔖 Bookmarked!' : 'Removed', description: next.has(id) ? 'Saved to favourites.' : 'Removed from favourites.' });
      return next;
    });
  };

  // ── Theme ───────────────────────────────────────────────────────────────
  const toggleTheme = () => {
    setTheme((t) => {
      const next = t === 'dark' ? 'light' : 'dark';
      localStorage.setItem(LS.THEME, next);
      return next;
    });
  };

  // ── Journal save ────────────────────────────────────────────────────────
  const saveJournal = () => {
    localStorage.setItem(LS.JOURNAL + currentDay, journalText);
    setJournalSaved(true);
    toast({ title: '📝 Saved!', description: 'Your reflection has been saved.' });
  };

  // ── Notifications ───────────────────────────────────────────────────────
  const handleToggleNotif = async () => {
    if (!('Notification' in window)) { toast({ title: 'Not supported', variant: 'destructive' }); return; }
    if (notifEnabled) {
      localStorage.removeItem(LS.NOTIF); setNotifEnabled(false);
      toast({ title: 'Notifications off' }); return;
    }
    const perm = await Notification.requestPermission();
    if (perm === 'granted') {
      localStorage.setItem(LS.NOTIF, '1'); setNotifEnabled(true);
      new Notification('🌙 Ramadan Daily Reminder', {
        body: `Day ${todayDay} is ready! Open the app to read today's reminder.`,
        tag: 'ramadan-daily',
      });
      toast({ title: '🔔 Enabled!', description: 'You\'ll get a daily reminder at 6 AM.' });
    } else {
      toast({ title: 'Permission denied', variant: 'destructive' });
    }
  };

  // ── Download square 1080×1080 ───────────────────────────────────────────
  const handleDownloadSquare = () => {
    if (!reminder) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1080;
    drawReminderCanvas(canvas.getContext('2d')!, reminder, 1080, 1080);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: `ramadan-day-${reminder.day_number}-square.png` }).click();
      URL.revokeObjectURL(url);
      toast({ title: '✅ Square downloaded!' });
    });
  };

  // ── Download story 1080×1920 ────────────────────────────────────────────
  const handleDownloadStory = () => {
    if (!reminder) return;
    const canvas = document.createElement('canvas');
    canvas.width = 1080; canvas.height = 1920;
    drawReminderCanvas(canvas.getContext('2d')!, reminder, 1080, 1920);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      Object.assign(document.createElement('a'), { href: url, download: `ramadan-day-${reminder.day_number}-story.png` }).click();
      URL.revokeObjectURL(url);
      toast({ title: '✅ Story downloaded!', description: 'Perfect for Instagram & WhatsApp Stories.' });
    });
  };

  // ── WhatsApp share ──────────────────────────────────────────────────────
  const handleWhatsApp = () => {
    if (!reminder) return;
    const text = encodeURIComponent(
      `🌙 Ramadan Reminder — Day ${reminder.day_number}\n\n*${reminder.title}*\n\n${reminder.english_text}${reminder.reference ? `\n\n— ${reminder.reference}` : ''}\n\nBy Hamduk Islamic Foundation`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // ── Generic share / copy ────────────────────────────────────────────────
  const handleShare = async () => {
    if (!reminder) return;
    const text = `🌙 Ramadan Reminder — Day ${reminder.day_number}\n\n${reminder.title}\n\n${reminder.english_text}${reminder.reference ? `\n\n— ${reminder.reference}` : ''}\n\nBy Hamduk Islamic Foundation`;
    if (navigator.share) {
      try { await navigator.share({ title: `Ramadan Day ${reminder.day_number}`, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  // ─── Derived state ─────────────────────────────────────────────────────
  const reminder       = allReminders.find((r) => r.day_number === currentDay) ?? null;
  const savedReminders = allReminders.filter((r) => bookmarks.has(r.id));

  // ─── Theme tokens ──────────────────────────────────────────────────────
  const T = {
    bg:          theme === 'dark' ? 'linear-gradient(160deg,#060d1a 0%,#0f172a 40%,#130a05 100%)' : 'linear-gradient(160deg,#faf5e4 0%,#fef9ec 40%,#fdf6e3 100%)',
    cardBg:      theme === 'dark' ? 'linear-gradient(145deg,#0f1e35 0%,#0c1520 100%)' : 'linear-gradient(145deg,#fffdf5 0%,#fef9e7 100%)',
    cardBorder:  theme === 'dark' ? '#d4af3730' : '#d4af3760',
    text:        theme === 'dark' ? '#e2e8f0' : '#1e293b',
    subtext:     theme === 'dark' ? '#94a3b8' : '#64748b',
    insetBg:     theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
    insetBorder: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    inputBg:     theme === 'dark' ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
  };

  const iconColor = T.subtext;

  // ─── Render ────────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen overflow-x-hidden transition-colors duration-500"
      style={{ background: T.bg }}
    >
      <IslamicPattern theme={theme} />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
      </div>

      <div className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-7">

          {/* ── Top bar ── */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-1">
                Hamduk Islamic Foundation
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: 'Georgia, serif', color: T.text }}
              >
                Daily Ramadan<br />
                <span className="text-amber-400">Reminders</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={toggleTheme}
                className="w-9 h-9 rounded-full flex items-center justify-center border transition-all"
                style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}`, color: iconColor }}
                title="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <button
                onClick={handleToggleNotif}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full border text-sm font-medium transition-all"
                style={{
                  background: notifEnabled ? '#d4af3715' : T.insetBg,
                  border: notifEnabled ? '1px solid #d4af3755' : `1px solid ${T.insetBorder}`,
                  color: notifEnabled ? '#fbbf24' : iconColor,
                }}
              >
                {notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                <span className="hidden sm:inline">{notifEnabled ? 'On' : 'Notify me'}</span>
              </button>
            </div>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Flame className="w-4 h-4" style={{ color: streak > 2 ? '#f97316' : '#fbbf24' }} />, value: streak, label: 'Day streak', color: '#fbbf24' },
              { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, value: readDays.size, label: 'Days read', color: '#34d399' },
              { icon: <Bookmark className="w-4 h-4 text-amber-400" />, value: bookmarks.size, label: 'Saved', color: '#fbbf24' },
            ].map((stat) => (
              <div key={stat.label} className="rounded-2xl p-4 text-center border backdrop-blur-sm"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {stat.icon}
                  <span className="text-2xl font-bold" style={{ color: stat.color, fontFamily: 'Georgia, serif' }}>
                    {stat.value}
                  </span>
                </div>
                <p className="text-xs" style={{ color: T.subtext }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* ── Prayer countdown ── */}
          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
          >
            {locError ? (
              <div className="flex items-center gap-2 justify-center text-sm" style={{ color: T.subtext }}>
                <MapPin className="w-4 h-4" />
                <span>Enable location for Iftar / Suhoor countdown</span>
              </div>
            ) : nextPrayer ? (
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-amber-400/70">Next</p>
                    <p className="font-bold text-sm" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>
                      {nextPrayer.name}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-amber-400 font-mono tabular-nums">{nextPrayer.countdown}</p>
                  <p className="text-xs" style={{ color: T.subtext }}>{nextPrayer.time}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 justify-center" style={{ color: T.subtext }}>
                <MapPin className="w-4 h-4 text-amber-400/40 animate-pulse" />
                <span className="text-xs">Detecting your location…</span>
              </div>
            )}
          </div>

          {/* ── Progress bar ── */}
          <div className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-300 text-sm font-semibold">Your Ramadan Journey</span>
              <span className="text-xs" style={{ color: T.subtext }}>Day {todayDay} / 30 unlocked</span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: T.insetBg }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(todayDay / 30) * 100}%`, background: 'linear-gradient(90deg,#92400e,#d4af37)' }} />
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex rounded-2xl overflow-hidden border" style={{ border: `1px solid ${T.cardBorder}` }}>
            {(['today', 'saved'] as const).map((tab, i) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: activeTab === tab ? 'linear-gradient(135deg,#92400e44,#d4af3722)' : T.insetBg,
                  color: activeTab === tab ? '#fbbf24' : T.subtext,
                  borderRight: i === 0 ? `1px solid ${T.cardBorder}` : 'none',
                }}>
                {tab === 'today'
                  ? <><Moon className="w-3.5 h-3.5" /> Today</>
                  : <><Bookmark className="w-3.5 h-3.5" /> Saved ({bookmarks.size})</>
                }
              </button>
            ))}
          </div>

          {/* ═══ TODAY TAB ═══════════════════════════════════════════════════ */}
          {activeTab === 'today' && (
            <>
              {/* Day grid */}
              <div className="rounded-2xl p-5 border backdrop-blur-sm"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-center" style={{ color: T.subtext }}>
                  Select a Day
                </p>
                <DayGrid
                  total={30} currentDay={currentDay}
                  maxUnlocked={todayDay} readDays={readDays}
                  onSelect={handleSelectDay}
                />
              </div>

              {/* Navigation arrows */}
              <div className="flex items-center justify-between gap-3">
                <button onClick={() => handleSelectDay(Math.max(1, currentDay - 1))}
                  disabled={currentDay <= 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border text-sm transition-all disabled:opacity-30"
                  style={{ border: `1px solid ${T.insetBorder}`, color: iconColor }}>
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>
                <div className="text-center">
                  <p className="font-bold text-lg" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>Day {currentDay}</p>
                  {currentDay === todayDay && <p className="text-amber-400 text-xs">Today</p>}
                </div>
                <button onClick={() => handleSelectDay(Math.min(todayDay, currentDay + 1))}
                  disabled={currentDay >= todayDay}
                  className="flex items-center gap-1 px-4 py-2 rounded-full border text-sm transition-all disabled:opacity-30"
                  style={{ border: `1px solid ${T.insetBorder}`, color: iconColor }}>
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Reminder card */}
              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Moon className="w-10 h-10 text-amber-400 animate-pulse" />
                  <p className="text-sm" style={{ color: T.subtext }}>Loading reminder…</p>
                </div>
              ) : reminder ? (
                <div
                  className="relative rounded-3xl overflow-hidden border backdrop-blur-sm"
                  style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                >
                  {/* Shimmer overlay for new day reveal */}
                  <ShimmerReveal show={showReveal} onDone={() => setShowReveal(false)} />

                  {/* Gold top strip */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

                  {/* Card header */}
                  <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: T.insetBorder }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                          style={{ background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }}>
                          {getReminderTypeLabel(reminder.reminder_type)}
                        </span>
                        <h2 className="text-xl font-bold leading-snug" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>
                          {reminder.title}
                        </h2>
                      </div>
                      <button onClick={() => toggleBookmark(reminder.id)}
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center border transition-all"
                        style={{
                          background: bookmarks.has(reminder.id) ? '#d4af3722' : T.insetBg,
                          border: bookmarks.has(reminder.id) ? '1px solid #d4af3755' : `1px solid ${T.insetBorder}`,
                        }}
                        title="Bookmark this reminder"
                      >
                        {bookmarks.has(reminder.id)
                          ? <BookmarkCheck className="w-4 h-4 text-amber-400" />
                          : <Bookmark className="w-4 h-4" style={{ color: iconColor }} />}
                      </button>
                    </div>
                    {readDays.has(currentDay) && (
                      <div className="flex items-center gap-1.5 mt-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-xs text-emerald-400">Read</span>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="px-6 py-6 space-y-6">

                    {/* Arabic */}
                    {reminder.arabic_text && (
                      <div className="rounded-2xl p-5 text-center border"
                        style={{ background: '#d4af370a', border: '1px solid #d4af3720' }}>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: T.subtext }}>Arabic</p>
                        <p className="text-2xl md:text-3xl leading-loose text-amber-200" dir="rtl" style={{ lineHeight: 2.2 }}>
                          {reminder.arabic_text}
                        </p>
                      </div>
                    )}

                    {/* Transliteration */}
                    {reminder.transliteration && (
                      <div>
                        <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: T.subtext }}>Transliteration</p>
                        <p className="italic leading-relaxed" style={{ color: T.text }}>{reminder.transliteration}</p>
                      </div>
                    )}

                    {/* English */}
                    <div className="relative rounded-2xl p-5 border"
                      style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                      <span className="absolute -top-5 left-4 text-6xl text-amber-500/15 font-serif leading-none select-none">"</span>
                      <p className="leading-relaxed text-base md:text-lg" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>
                        {reminder.english_text}
                      </p>
                    </div>

                    {/* Reference */}
                    {(reminder.reference || reminder.author) && (
                      <div className="flex items-center gap-3">
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,#d4af3744,transparent)' }} />
                        <p className="text-amber-400/70 text-sm italic">
                          {reminder.reference}{reminder.author && reminder.reference ? ' · ' : ''}{reminder.author}
                        </p>
                        <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,#d4af3744,transparent)' }} />
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="space-y-3 pt-1">
                      {/* Downloads */}
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleDownloadSquare}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
                          style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', color: '#0c1a2e' }}>
                          <Download className="w-4 h-4" /> Square
                        </button>
                        <button onClick={handleDownloadStory}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
                          style={{ background: '#d4af3715', border: '1px solid #d4af3744', color: '#d4af37' }}>
                          <Download className="w-4 h-4" /> Story 9:16
                        </button>
                      </div>
                      {/* Share */}
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={handleShare}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
                          style={{ border: `1px solid ${T.insetBorder}`, color: iconColor }}>
                          <Share2 className="w-4 h-4" /> Share
                        </button>
                        <button onClick={handleWhatsApp}
                          className="flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
                          style={{ background: '#25D36615', border: '1px solid #25D36644', color: '#25D366' }}>
                          <MessageCircle className="w-4 h-4" /> WhatsApp
                        </button>
                      </div>
                    </div>

                    {/* Reflection journal */}
                    <div className="rounded-2xl p-4 border space-y-3"
                      style={{ background: T.inputBg, border: `1px solid ${T.insetBorder}` }}>
                      <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.subtext }}>
                        📝 My Reflection — Day {currentDay}
                      </p>
                      <textarea
                        value={journalText}
                        onChange={(e) => { setJournalText(e.target.value); setJournalSaved(false); }}
                        placeholder="Write your personal reflection on today's reminder…"
                        rows={4}
                        className="w-full bg-transparent resize-none outline-none text-sm leading-relaxed"
                        style={{ color: T.text, fontFamily: 'Georgia, serif' }}
                      />
                      <button onClick={saveJournal}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95"
                        style={
                          journalSaved
                            ? { background: '#16a34a22', color: '#4ade80', border: '1px solid #16a34a44' }
                            : { background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }
                        }>
                        {journalSaved ? <><CheckCircle2 className="w-3 h-3" /> Saved</> : 'Save reflection'}
                      </button>
                    </div>
                  </div>

                  {/* Gold bottom strip */}
                  <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
                </div>
              ) : (
                <div className="rounded-3xl border p-12 text-center" style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                  <Lock className="w-10 h-10 mx-auto mb-4" style={{ color: T.subtext }} />
                  <p style={{ color: T.subtext }}>This day hasn't been unlocked yet.</p>
                  <p className="text-xs mt-1" style={{ color: T.subtext }}>Come back on day {currentDay} of Ramadan.</p>
                </div>
              )}
            </>
          )}

          {/* ═══ SAVED TAB ═══════════════════════════════════════════════════ */}
          {activeTab === 'saved' && (
            <div className="space-y-4">
              {savedReminders.length === 0 ? (
                <div className="rounded-3xl border p-14 text-center" style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                  <Bookmark className="w-10 h-10 mx-auto mb-4" style={{ color: T.subtext }} />
                  <p className="font-semibold mb-1" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>No saved reminders yet</p>
                  <p className="text-sm" style={{ color: T.subtext }}>
                    Tap the 🔖 icon on any reminder to save it here.
                  </p>
                </div>
              ) : (
                savedReminders.map((r) => (
                  <div key={r.id} className="rounded-2xl border p-5 space-y-3"
                    style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <span className="text-xs text-amber-400/60 font-bold uppercase tracking-wide">Day {r.day_number}</span>
                        <h3 className="font-bold leading-snug" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>{r.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => { setCurrentDay(r.day_number); setActiveTab('today'); }}
                          className="text-xs px-3 py-1.5 rounded-full border font-semibold transition-all"
                          style={{ border: `1px solid ${T.insetBorder}`, color: iconColor }}>
                          View
                        </button>
                        <button onClick={() => toggleBookmark(r.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center border"
                          style={{ background: '#d4af3715', border: '1px solid #d4af3744' }}>
                          <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed line-clamp-3" style={{ color: T.subtext }}>
                      {r.english_text}
                    </p>
                    {r.reference && (
                      <p className="text-xs italic text-amber-400/60">— {r.reference}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pb-6">
            <div className="inline-flex items-center gap-2 text-amber-400/40 text-xs">
              <Moon className="w-3 h-3" />
              <span>Hamduk Islamic Foundation · Ramadan Kareem</span>
              <Moon className="w-3 h-3" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
