'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Share2, Bell, BellOff, Lock, ChevronLeft, ChevronRight, Moon, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Returns which Ramadan day we're currently on (1-based, capped at 30).
 *  Swap out RAMADAN_START for the real start date of the current year. */
const RAMADAN_START = new Date('2026-03-01T00:00:00'); // ← update each year

function getCurrentRamadanDay(): number {
  const now = new Date();
  const diff = Math.floor((now.getTime() - RAMADAN_START.getTime()) / (1000 * 60 * 60 * 24));
  return Math.min(Math.max(diff + 1, 1), 30);
}

function getReminderTypeLabel(type: string) {
  const map: Record<string, string> = {
    hadith: '📖 Hadith',
    quran: '🕌 Quranic Verse',
    dua: '🤲 Dua',
    reminder: '💡 Reminder',
  };
  return map[type] ?? type.toUpperCase();
}

// ─── Geometric Islamic pattern as inline SVG background ─────────────────────
const IslamicPatternBg = () => (
  <div className="pointer-events-none fixed inset-0 opacity-[0.04] z-0" aria-hidden>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="star8" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon
            points="40,4 49,28 74,28 54,44 61,68 40,54 19,68 26,44 6,28 31,28"
            fill="none" stroke="#d4af37" strokeWidth="0.8"
          />
          <rect x="28" y="28" width="24" height="24" fill="none" stroke="#d4af37" strokeWidth="0.5" transform="rotate(45 40 40)" />
          <circle cx="40" cy="40" r="6" fill="none" stroke="#d4af37" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#star8)" />
    </svg>
  </div>
);

// ─── Floating crescent/stars decoration ─────────────────────────────────────
const FloatingDecor = () => (
  <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
    {/* Top-right crescent */}
    <div className="absolute -top-10 -right-10 w-64 h-64 opacity-10">
      <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M100,20 A80,80 0 1,1 60,165 A55,55 0 1,0 100,20Z" fill="#d4af37" />
      </svg>
    </div>
    {/* Bottom-left glow */}
    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-amber-600/10 blur-3xl" />
    {/* Scattered stars */}
    {[
      { top: '8%', left: '10%', size: 12 },
      { top: '15%', left: '85%', size: 8 },
      { top: '35%', left: '92%', size: 10 },
      { top: '55%', left: '5%', size: 7 },
      { top: '75%', left: '80%', size: 9 },
      { top: '90%', left: '20%', size: 6 },
    ].map((s, i) => (
      <Star
        key={i}
        className="absolute text-amber-400/30 animate-pulse"
        style={{ top: s.top, left: s.left, width: s.size, height: s.size, animationDelay: `${i * 0.7}s` }}
        fill="currentColor"
      />
    ))}
  </div>
);

// ─── Day selector pill row ───────────────────────────────────────────────────
function DayGrid({
  total,
  currentDay,
  maxUnlocked,
  onSelect,
}: {
  total: number;
  currentDay: number;
  maxUnlocked: number;
  onSelect: (d: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {Array.from({ length: total }, (_, i) => i + 1).map((d) => {
        const unlocked = d <= maxUnlocked;
        const active = d === currentDay;
        return (
          <button
            key={d}
            disabled={!unlocked}
            onClick={() => unlocked && onSelect(d)}
            className={`
              w-9 h-9 rounded-full text-xs font-bold transition-all duration-200 border
              ${active
                ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-lg shadow-amber-500/40 scale-110'
                : unlocked
                  ? 'bg-slate-800/70 border-slate-600 text-amber-300 hover:border-amber-500 hover:bg-amber-500/10'
                  : 'bg-slate-900/40 border-slate-800 text-slate-700 cursor-not-allowed'}
            `}
          >
            {unlocked ? d : <Lock className="w-3 h-3 mx-auto" />}
          </button>
        );
      })}
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function DailyReminderPage() {
  const [allReminders, setAllReminders] = useState<DailyReminder[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>('default');
  const [notifEnabled, setNotifEnabled] = useState(false);
  const { toast } = useToast();
  const cardRef = useRef<HTMLDivElement>(null);

  const todayDay = getCurrentRamadanDay(); // furthest unlocked day

  // ── Fetch ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetch_ = async () => {
      try {
        const res = await fetch('/api/ramadan/content?type=ramadan_daily-reminders');
        const data: DailyReminder[] = await res.json();
        const sorted = data.sort((a, b) => a.day_number - b.day_number);
        setAllReminders(sorted);
        setCurrentDay(todayDay);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch_();
  }, []);

  // ── Notification permission on mount ────────────────────────────────────
  useEffect(() => {
    if ('Notification' in window) {
      setNotifPermission(Notification.permission);
      setNotifEnabled(Notification.permission === 'granted' && localStorage.getItem('ramadan_notif') === '1');
    }
  }, []);

  // ── Schedule daily notification ─────────────────────────────────────────
  const scheduleDailyNotif = () => {
    // We register a service worker that will handle daily push.
    // Here we demonstrate the UI flow + a direct Notification for immediate feedback.
    const now = new Date();
    const next = new Date();
    next.setHours(6, 0, 0, 0); // 6 AM daily
    if (next <= now) next.setDate(next.getDate() + 1);
    const delay = next.getTime() - now.getTime();

    // Show a sample notification immediately so user sees it works
    new Notification('🌙 Ramadan Daily Reminder', {
      body: `Day ${todayDay} reminder is ready! Open the app to read today's reminder.`,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'ramadan-daily',
    });

    // Schedule next-day notification via setTimeout (works while tab is open)
    // For true background push you'd wire a service worker — this pattern works for PWA
    setTimeout(() => {
      new Notification('🌙 Ramadan Daily Reminder', {
        body: `Day ${todayDay + 1} reminder is now unlocked! Start your day with reflection.`,
        icon: '/favicon.ico',
        tag: 'ramadan-daily',
      });
    }, delay);
  };

  const handleToggleNotifications = async () => {
    if (!('Notification' in window)) {
      toast({ title: 'Not supported', description: 'Notifications are not supported in this browser.', variant: 'destructive' });
      return;
    }

    if (notifEnabled) {
      // Disable
      localStorage.removeItem('ramadan_notif');
      setNotifEnabled(false);
      toast({ title: 'Notifications off', description: 'You will no longer receive daily reminders.' });
      return;
    }

    const permission = await Notification.requestPermission();
    setNotifPermission(permission);

    if (permission === 'granted') {
      localStorage.setItem('ramadan_notif', '1');
      setNotifEnabled(true);
      scheduleDailyNotif();
      toast({ title: '🔔 Notifications enabled!', description: 'You\'ll get a daily reminder every morning at 6 AM.' });
    } else {
      toast({ title: 'Permission denied', description: 'Enable notifications in your browser settings.', variant: 'destructive' });
    }
  };

  // ── Download as image ───────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!reminder) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background
    const bg = ctx.createLinearGradient(0, 0, 1080, 1350);
    bg.addColorStop(0, '#0c1a2e');
    bg.addColorStop(0.5, '#0f172a');
    bg.addColorStop(1, '#1a0f0a');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1350);

    // Gold border frame
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 6;
    ctx.strokeRect(30, 30, 1020, 1290);
    ctx.strokeStyle = '#d4af3755';
    ctx.lineWidth = 2;
    ctx.strokeRect(44, 44, 992, 1262);

    // Corner ornaments
    const corners = [[60, 60], [1020, 60], [60, 1290], [1020, 1290]];
    corners.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 18, 0, Math.PI * 2);
      ctx.fillStyle = '#d4af37';
      ctx.fill();
    });

    // Header band
    const headerGrad = ctx.createLinearGradient(0, 80, 1080, 80);
    headerGrad.addColorStop(0, '#d4af3722');
    headerGrad.addColorStop(0.5, '#d4af3744');
    headerGrad.addColorStop(1, '#d4af3722');
    ctx.fillStyle = headerGrad;
    ctx.fillRect(30, 80, 1020, 120);

    // Foundation name
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 28px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('HAMDUK ISLAMIC FOUNDATION', 540, 135);

    // Crescent + star emoji stand-in
    ctx.font = '60px Arial';
    ctx.fillText('☽✦', 540, 260);

    // Day badge
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 56px Georgia';
    ctx.fillText(`Day ${reminder.day_number} of Ramadan`, 540, 350);

    // Divider
    ctx.strokeStyle = '#d4af3788';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 380);
    ctx.lineTo(980, 380);
    ctx.stroke();

    // Type badge
    ctx.fillStyle = '#d4af3766';
    ctx.beginPath();
    ctx.roundRect(390, 395, 300, 48, 24);
    ctx.fill();
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 22px Georgia';
    ctx.fillText(reminder.reminder_type.toUpperCase(), 540, 426);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 40px Georgia';
    const titleWords = reminder.title.split(' ');
    let titleLine = '';
    let titleY = 510;
    titleWords.forEach((word) => {
      const test = titleLine + word + ' ';
      if (ctx.measureText(test).width > 900 && titleLine) {
        ctx.fillText(titleLine.trim(), 540, titleY);
        titleLine = word + ' ';
        titleY += 52;
      } else { titleLine = test; }
    });
    ctx.fillText(titleLine.trim(), 540, titleY);

    // Arabic text
    if (reminder.arabic_text) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '36px Arial';
      ctx.fillText(reminder.arabic_text, 540, titleY + 90);
    }

    // Divider
    ctx.strokeStyle = '#d4af3744';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, titleY + 130);
    ctx.lineTo(980, titleY + 130);
    ctx.stroke();

    // English text
    ctx.fillStyle = '#cbd5e1';
    ctx.font = '28px Georgia';
    const words = reminder.english_text.split(' ');
    let line = '';
    let y = titleY + 185;
    const maxWidth = 880;
    words.forEach((word) => {
      const test = line + word + ' ';
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line.trim(), 540, y);
        line = word + ' ';
        y += 42;
      } else { line = test; }
    });
    ctx.fillText(line.trim(), 540, y);

    // Reference
    if (reminder.reference) {
      ctx.fillStyle = '#d4af3799';
      ctx.font = 'italic 24px Georgia';
      ctx.fillText(`— ${reminder.reference}`, 540, y + 60);
    }

    // Footer
    ctx.fillStyle = '#d4af3766';
    ctx.fillRect(30, 1240, 1020, 80);
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 22px Georgia';
    ctx.fillText('🌙  Ramadan Kareem  •  hamduk.org  🌙', 540, 1288);

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ramadan-day-${reminder.day_number}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: '✅ Downloaded!', description: `Day ${reminder.day_number} reminder saved.` });
    });
  };

  // ── Share ───────────────────────────────────────────────────────────────
  const handleShare = async () => {
    if (!reminder) return;
    const text = `🌙 Ramadan Reminder — Day ${reminder.day_number}\n\n${reminder.title}\n\n${reminder.english_text}${reminder.reference ? `\n\n— ${reminder.reference}` : ''}\n\nBy Hamduk Islamic Foundation`;
    if (navigator.share) {
      try { await navigator.share({ title: `Ramadan Day ${reminder.day_number}`, text }); }
      catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied!', description: 'Reminder copied to clipboard.' });
    }
  };

  const reminder = allReminders.find((r) => r.day_number === currentDay) ?? null;

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0f172a 40%, #130a05 100%)' }}>
      <IslamicPatternBg />
      <FloatingDecor />

      <div className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* ── Top bar: title + notification toggle ── */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-1">Hamduk Islamic Foundation</p>
              <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
                Daily Ramadan<br />
                <span className="text-amber-400">Reminders</span>
              </h1>
            </div>
            <button
              onClick={handleToggleNotifications}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200 mt-2 ${
                notifEnabled
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 hover:bg-amber-500/30'
                  : 'bg-slate-800/60 border-slate-600 text-slate-400 hover:border-amber-500/50 hover:text-amber-400'
              }`}
            >
              {notifEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{notifEnabled ? 'On' : 'Notify me'}</span>
            </button>
          </div>

          {/* ── Progress banner ── */}
          <div className="bg-slate-900/60 border border-amber-500/20 rounded-2xl p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-300 text-sm font-semibold">Your Ramadan Journey</span>
              <span className="text-slate-400 text-xs">Day {todayDay} / 30 unlocked</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(todayDay / 30) * 100}%`,
                  background: 'linear-gradient(90deg, #92400e, #d4af37)',
                }}
              />
            </div>
          </div>

          {/* ── Day grid ── */}
          <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4 text-center">Select a Day</p>
            <DayGrid
              total={30}
              currentDay={currentDay}
              maxUnlocked={todayDay}
              onSelect={setCurrentDay}
            />
          </div>

          {/* ── Navigation arrows ── */}
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setCurrentDay((d) => Math.max(1, d - 1))}
              disabled={currentDay <= 1}
              className="flex items-center gap-1 px-4 py-2 rounded-full border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>
            <div className="text-center">
              <p className="text-white font-bold text-lg" style={{ fontFamily: 'Georgia, serif' }}>Day {currentDay}</p>
              {currentDay === todayDay && <p className="text-amber-400 text-xs">Today</p>}
            </div>
            <button
              onClick={() => setCurrentDay((d) => Math.min(todayDay, d + 1))}
              disabled={currentDay >= todayDay}
              className="flex items-center gap-1 px-4 py-2 rounded-full border border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* ── Reminder card ── */}
          {loading ? (
            <div className="flex flex-col items-center py-20 gap-4">
              <Moon className="w-10 h-10 text-amber-400 animate-pulse" />
              <p className="text-slate-400 text-sm">Loading reminder...</p>
            </div>
          ) : reminder ? (
            <div
              ref={cardRef}
              className="relative rounded-3xl overflow-hidden border border-amber-500/20 backdrop-blur-sm"
              style={{ background: 'linear-gradient(145deg, #0f1e35 0%, #0c1520 50%, #1a0e06 100%)' }}
            >
              {/* Gold top accent bar */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />

              {/* Card header */}
              <div className="px-6 pt-6 pb-4 border-b border-amber-500/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <span className="inline-block text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full mb-3"
                      style={{ background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }}>
                      {getReminderTypeLabel(reminder.reminder_type)}
                    </span>
                    <h2 className="text-xl font-bold text-white leading-snug" style={{ fontFamily: 'Georgia, serif' }}>
                      {reminder.title}
                    </h2>
                  </div>
                  <div className="shrink-0 w-14 h-14 rounded-full flex items-center justify-center border border-amber-500/30"
                    style={{ background: 'radial-gradient(circle, #d4af3722, transparent)' }}>
                    <span className="text-2xl">
                      {reminder.reminder_type === 'quran' ? '📖' : reminder.reminder_type === 'hadith' ? '🕌' : '🤲'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="px-6 py-6 space-y-6">

                {/* Arabic text */}
                {reminder.arabic_text && (
                  <div className="relative rounded-2xl p-5 text-center border border-amber-500/10"
                    style={{ background: '#d4af370a' }}>
                    <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-3">Arabic</p>
                    <p
                      className="text-2xl md:text-3xl leading-loose text-amber-200"
                      dir="rtl"
                      style={{ fontFamily: 'Arial, sans-serif', lineHeight: '2.2' }}
                    >
                      {reminder.arabic_text}
                    </p>
                  </div>
                )}

                {/* Transliteration */}
                {reminder.transliteration && (
                  <div>
                    <p className="text-slate-500 text-xs font-semibold tracking-widest uppercase mb-2">Transliteration</p>
                    <p className="text-slate-300 italic leading-relaxed">{reminder.transliteration}</p>
                  </div>
                )}

                {/* English */}
                <div className="relative rounded-2xl p-5 border border-slate-700/50"
                  style={{ background: 'rgba(255,255,255,0.02)' }}>
                  {/* Opening quote mark */}
                  <span className="absolute -top-4 left-5 text-6xl text-amber-500/20 font-serif leading-none select-none">"</span>
                  <p className="text-slate-200 leading-relaxed text-base md:text-lg" style={{ fontFamily: 'Georgia, serif' }}>
                    {reminder.english_text}
                  </p>
                </div>

                {/* Reference + Author */}
                {(reminder.reference || reminder.author) && (
                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg, #d4af3744, transparent)' }} />
                    <p className="text-amber-400/70 text-sm italic">
                      {reminder.reference && `${reminder.reference}`}
                      {reminder.author && reminder.reference && ' · '}
                      {reminder.author}
                    </p>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg, #d4af3744, transparent)' }} />
                  </div>
                )}

                {/* Tags */}
                {reminder.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {reminder.tags.map((tag) => (
                      <span key={tag} className="text-xs px-3 py-1 rounded-full text-slate-400 border border-slate-700">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:opacity-90 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #92400e, #d4af37)', color: '#0c1a2e' }}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm border border-amber-500/40 text-amber-400 hover:bg-amber-500/10 transition-all duration-200 active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                </div>
              </div>

              {/* Gold bottom accent bar */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }} />
            </div>
          ) : (
            <div className="rounded-3xl border border-amber-500/20 p-12 text-center backdrop-blur-sm"
              style={{ background: 'linear-gradient(145deg, #0f1e35, #0c1520)' }}>
              <Lock className="w-10 h-10 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">This day hasn't been unlocked yet.</p>
              <p className="text-slate-600 text-sm mt-1">Come back on day {currentDay} of Ramadan.</p>
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-4 pb-8">
            <div className="inline-flex items-center gap-2 text-amber-400/50 text-xs">
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
