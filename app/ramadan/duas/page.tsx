'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Copy, Check, Moon, Star, Bookmark, BookmarkCheck,
  Share2, MessageCircle, ChevronDown, ChevronUp,
  Search, Volume2, VolumeX, Sparkles,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Dua {
  id: string;
  title: string;
  category: string;
  arabic_text: string;
  arabic_transliteration: string | null;
  english_translation: string;
  reference: string | null;
  audio_url: string | null;
  is_featured: boolean;
  order_rank: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  suhoor:            '🌅 Suhoor',
  iftar:             '🌙 Iftar',
  forgiveness:       '🤲 Forgiveness',
  'last-ten-nights': '⭐ Last 10 Nights',
  night:             '🌌 Night',
  prayer:            '🕌 Prayer',
  general:           '📿 General',
};

const LS = {
  BOOKMARKS: 'dua_bookmarks',
  THEME:     'rm_theme',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCategoryLabel(cat: string): string {
  return CATEGORY_LABELS[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1);
}

// ─── Islamic Geometric Pattern ────────────────────────────────────────────────
const IslamicPattern = ({ theme }: { theme: 'dark' | 'light' }) => (
  <div
    className="pointer-events-none fixed inset-0 z-0"
    style={{ opacity: theme === 'dark' ? 0.035 : 0.06 }}
    aria-hidden
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dua-ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill="url(#dua-ip)" />
    </svg>
  </div>
);

// ─── Audio player ─────────────────────────────────────────────────────────────
function AudioPlayer({ url }: { url: string }) {
  const [playing, setPlaying]   = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = new Audio(url);
    audioRef.current = el;
    el.addEventListener('timeupdate',  () => setProgress(el.currentTime));
    el.addEventListener('loadedmetadata', () => setDuration(el.duration));
    el.addEventListener('ended',       () => { setPlaying(false); setProgress(0); });
    return () => { el.pause(); el.src = ''; };
  }, [url]);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else         { el.play().then(() => setPlaying(true)).catch(() => {}); }
  };

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    el.currentTime = Number(e.target.value);
    setProgress(Number(e.target.value));
  };

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  return (
    <div
      className="rounded-2xl p-4 flex items-center gap-3 border"
      style={{ background: '#d4af370a', border: '1px solid #d4af3722' }}
    >
      <button
        onClick={toggle}
        className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all active:scale-95"
        style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)' }}
      >
        {playing
          ? <VolumeX className="w-4 h-4 text-slate-900" />
          : <Volume2 className="w-4 h-4 text-slate-900" />
        }
      </button>
      <div className="flex-1 space-y-1">
        <input
          type="range" min={0} max={duration || 100}
          value={progress} onChange={seek}
          className="w-full h-1 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#d4af37' }}
        />
        <div className="flex justify-between text-xs" style={{ color: '#d4af3799' }}>
          <span>{fmt(progress)}</span>
          <span>{duration ? fmt(duration) : '--:--'}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Dua card ─────────────────────────────────────────────────────────────────
function DuaCard({
  dua, bookmarks, onBookmark, T,
}: {
  dua:       Dua;
  bookmarks: Set<string>;
  onBookmark: (id: string) => void;
  T:         ReturnType<typeof makeTokens>;
}) {
  const [expanded,  setExpanded]  = useState(true);
  const [copiedId,  setCopiedId]  = useState<string | null>(null);
  const { toast } = useToast();

  const copy = (key: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(key);
      toast({ title: 'Copied!', description: 'Dua copied to clipboard.' });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const share = async (dua: Dua) => {
    const text =
      `🤲 ${dua.title}\n\n` +
      `${dua.arabic_text}\n\n` +
      `${dua.arabic_transliteration ? dua.arabic_transliteration + '\n\n' : ''}` +
      `${dua.english_translation}` +
      `${dua.reference ? `\n\n— ${dua.reference}` : ''}` +
      `\n\nBy Hamduk Islamic Foundation`;

    if (navigator.share) {
      try { await navigator.share({ title: dua.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  const whatsapp = (dua: Dua) => {
    const text = encodeURIComponent(
      `🤲 *${dua.title}*\n\n` +
      `${dua.arabic_text}\n\n` +
      `${dua.arabic_transliteration ? dua.arabic_transliteration + '\n\n' : ''}` +
      `${dua.english_translation}` +
      `${dua.reference ? `\n\n— ${dua.reference}` : ''}` +
      `\n\nBy Hamduk Islamic Foundation`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const isBookmarked = bookmarks.has(dua.id);

  return (
    <div
      className="rounded-3xl overflow-hidden border backdrop-blur-sm transition-all duration-300"
      style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
    >
      {/* Gold top strip */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

      {/* Card header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {dua.is_featured && (
                <span
                  className="text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1"
                  style={{ background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }}
                >
                  <Sparkles className="w-3 h-3" /> Featured
                </span>
              )}
            </div>
            <h3
              className="text-lg font-bold leading-snug"
              style={{ color: T.text, fontFamily: 'Georgia, serif' }}
            >
              {dua.title}
            </h3>
            {dua.reference && (
              <p className="text-xs mt-1 italic" style={{ color: T.subtext }}>
                {dua.reference}
              </p>
            )}
          </div>

          {/* Header actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Bookmark */}
            <button
              onClick={() => onBookmark(dua.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
              style={{
                background: isBookmarked ? '#d4af3722' : T.insetBg,
                border:     isBookmarked ? '1px solid #d4af3755' : `1px solid ${T.insetBorder}`,
              }}
              title="Bookmark"
            >
              {isBookmarked
                ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                : <Bookmark      className="w-3.5 h-3.5" style={{ color: T.subtext }} />
              }
            </button>

            {/* Expand / collapse */}
            <button
              onClick={() => setExpanded((e) => !e)}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
              style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}`, color: T.subtext }}
            >
              {expanded
                ? <ChevronUp   className="w-3.5 h-3.5" />
                : <ChevronDown className="w-3.5 h-3.5" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible body */}
      {expanded && (
        <div className="px-6 pb-6 space-y-5">

          {/* Arabic text */}
          <div
            className="relative rounded-2xl p-5 border text-center"
            style={{ background: '#d4af370a', border: '1px solid #d4af3720' }}
          >
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3 text-left"
              style={{ color: T.subtext }}
            >
              Arabic
            </p>
            <p
              className="text-2xl md:text-3xl leading-loose text-amber-100"
              dir="rtl"
              style={{ lineHeight: 2.3 }}
            >
              {dua.arabic_text}
            </p>
            {/* Copy arabic */}
            <button
              onClick={() => copy(dua.id + '-arabic', dua.arabic_text)}
              className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center border transition-all"
              style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}
            >
              {copiedId === dua.id + '-arabic'
                ? <Check className="w-3 h-3 text-emerald-400" />
                : <Copy  className="w-3 h-3" style={{ color: T.subtext }} />
              }
            </button>
          </div>

          {/* Transliteration */}
          {dua.arabic_transliteration && (
            <div
              className="rounded-2xl p-4 border"
              style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}
            >
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: T.subtext }}
              >
                Transliteration
              </p>
              <p className="italic leading-relaxed text-sm" style={{ color: T.text }}>
                {dua.arabic_transliteration}
              </p>
            </div>
          )}

          {/* English translation */}
          <div
            className="relative rounded-2xl p-5 border"
            style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <p
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ color: T.subtext }}
              >
                Translation
              </p>
              {/* Copy translation */}
              <button
                onClick={() => copy(dua.id + '-eng', dua.english_translation)}
                className="w-7 h-7 rounded-full flex items-center justify-center border transition-all shrink-0"
                style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}
              >
                {copiedId === dua.id + '-eng'
                  ? <Check className="w-3 h-3 text-emerald-400" />
                  : <Copy  className="w-3 h-3" style={{ color: T.subtext }} />
                }
              </button>
            </div>
            <span className="absolute top-10 left-4 text-5xl text-amber-500/10 font-serif leading-none select-none">
              "
            </span>
            <p
              className="leading-relaxed text-base"
              style={{ color: T.text, fontFamily: 'Georgia, serif' }}
            >
              {dua.english_translation}
            </p>
          </div>

          {/* Audio player */}
          {dua.audio_url && (
            <div>
              <p
                className="text-xs font-semibold tracking-widest uppercase mb-2"
                style={{ color: T.subtext }}
              >
                Audio Recitation
              </p>
              <AudioPlayer url={dua.audio_url} />
            </div>
          )}

          {/* Action row: share + whatsapp */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => share(dua)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
              style={{ border: `1px solid ${T.insetBorder}`, color: T.subtext }}
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={() => whatsapp(dua)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
              style={{ background: '#25D36615', border: '1px solid #25D36644', color: '#25D366' }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Gold bottom strip */}
      <div className="h-0.5 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
    </div>
  );
}

// ─── Theme token factory ──────────────────────────────────────────────────────
function makeTokens(theme: 'dark' | 'light') {
  return {
    bg: theme === 'dark'
      ? 'linear-gradient(160deg, #060d1a 0%, #0f172a 40%, #130a05 100%)'
      : 'linear-gradient(160deg, #faf5e4 0%, #fef9ec 40%, #fdf6e3 100%)',
    cardBg: theme === 'dark'
      ? 'linear-gradient(145deg, #0f1e35 0%, #0c1520 100%)'
      : 'linear-gradient(145deg, #fffdf5 0%, #fef9e7 100%)',
    cardBorder:  theme === 'dark' ? '#d4af3730' : '#d4af3760',
    text:        theme === 'dark' ? '#e2e8f0'   : '#1e293b',
    subtext:     theme === 'dark' ? '#94a3b8'   : '#64748b',
    insetBg:     theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
    insetBorder: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
  };
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RamadanDuasPage() {
  const [duas,           setDuas]           = useState<Dua[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('');
  const [bookmarks,      setBookmarks]      = useState<Set<string>>(new Set());
  const [searchQuery,    setSearchQuery]    = useState('');
  const [activeTab,      setActiveTab]      = useState<'browse' | 'saved'>('browse');
  const [theme,          setTheme]          = useState<'dark' | 'light'>('dark');
  const { toast } = useToast();

  // ── Bootstrap ─────────────────────────────────────────────────────────────
  useEffect(() => {
    try {
      setBookmarks(new Set(JSON.parse(localStorage.getItem(LS.BOOKMARKS) ?? '[]')));
      setTheme((localStorage.getItem(LS.THEME) as 'dark' | 'light') ?? 'dark');
    } catch {}
  }, []);

  // ── Fetch duas ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/ramadan/content?type=ramadan_duas')
      .then((r) => r.json())
      .then((data: Dua[]) => {
        setDuas(data);
        if (data.length > 0) {
          const first = [...data].sort((a, b) => a.order_rank - b.order_rank)[0];
          setActiveCategory(first.category);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Bookmark toggle ───────────────────────────────────────────────────────
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        toast({ title: 'Removed from saved' });
      } else {
        next.add(id);
        toast({ title: '🔖 Dua saved!' });
      }
      localStorage.setItem(LS.BOOKMARKS, JSON.stringify([...next]));
      return next;
    });
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const categories = duas
    .slice()
    .sort((a, b) => a.order_rank - b.order_rank)
    .reduce<string[]>((acc, d) => {
      if (!acc.includes(d.category)) acc.push(d.category);
      return acc;
    }, []);

  const getCategoryDuas = (category: string) =>
    duas
      .filter((d) => d.category === category)
      .sort((a, b) => a.order_rank - b.order_rank);

  const searchResults = searchQuery.trim().length > 1
    ? duas.filter((d) =>
        d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.english_translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (d.arabic_transliteration ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const savedDuas    = duas.filter((d) => bookmarks.has(d.id));
  const featuredDuas = duas.filter((d) => d.is_featured);

  const T = makeTokens(theme);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="relative min-h-screen overflow-x-hidden transition-colors duration-500"
      style={{ background: T.bg }}
    >
      <IslamicPattern theme={theme} />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }}
        />
        <div
          className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle, #15803d, transparent)' }}
        />
      </div>

      <div className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-7">

          {/* ── Page header ── */}
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <p className="text-amber-400/70 text-xs font-semibold tracking-widest uppercase mb-1">
                Hamduk Islamic Foundation
              </p>
              <h1
                className="text-3xl md:text-4xl font-bold leading-tight"
                style={{ fontFamily: 'Georgia, serif', color: T.text }}
              >
                Ramadan<br />
                <span className="text-amber-400">Dua Corner</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: T.subtext }}>
                Essential supplications for the blessed month
              </p>
            </div>

            {/* Theme toggle */}
            <button
              onClick={() => setTheme((t) => {
                const next = t === 'dark' ? 'light' : 'dark';
                localStorage.setItem(LS.THEME, next);
                return next;
              })}
              className="w-9 h-9 rounded-full flex items-center justify-center border transition-all mt-1"
              style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}`, color: T.subtext }}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: duas.length,        label: 'Total Duas'  },
              { value: featuredDuas.length, label: 'Featured'   },
              { value: bookmarks.size,      label: 'Saved'      },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center border backdrop-blur-sm"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
              >
                <p
                  className="text-2xl font-bold text-amber-400"
                  style={{ fontFamily: 'Georgia, serif' }}
                >
                  {s.value}
                </p>
                <p className="text-xs mt-0.5" style={{ color: T.subtext }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Search bar ── */}
          <div
            className="relative rounded-2xl border overflow-hidden"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
          >
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
              style={{ color: T.subtext }}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search duas by title, translation or transliteration…"
              className="w-full bg-transparent pl-11 pr-4 py-3.5 text-sm outline-none placeholder:opacity-40"
              style={{ color: T.text }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-0.5 rounded-full"
                style={{ color: T.subtext, background: T.insetBg }}
              >
                ✕
              </button>
            )}
          </div>

          {/* ── Search results ── */}
          {searchQuery.trim().length > 1 && (
            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: T.subtext }}>
                {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              {searchResults.length === 0 ? (
                <div
                  className="rounded-2xl border p-8 text-center"
                  style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                >
                  <p style={{ color: T.subtext }}>No duas matched your search.</p>
                </div>
              ) : (
                searchResults.map((dua) => (
                  <DuaCard key={dua.id} dua={dua} bookmarks={bookmarks} onBookmark={toggleBookmark} T={T} />
                ))
              )}
            </div>
          )}

          {/* ── Main tabs (hidden while searching) ── */}
          {!searchQuery.trim() && (
            <>
              {/* Browse / Saved tabs */}
              <div
                className="flex rounded-2xl overflow-hidden border"
                style={{ border: `1px solid ${T.cardBorder}` }}
              >
                {(['browse', 'saved'] as const).map((tab, i) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="flex-1 py-3 text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2"
                    style={{
                      background: activeTab === tab
                        ? 'linear-gradient(135deg, #92400e44, #d4af3722)'
                        : T.insetBg,
                      color:       activeTab === tab ? '#fbbf24' : T.subtext,
                      borderRight: i === 0 ? `1px solid ${T.cardBorder}` : 'none',
                    }}
                  >
                    {tab === 'browse'
                      ? <><Moon className="w-3.5 h-3.5" /> Browse Duas</>
                      : <><Bookmark className="w-3.5 h-3.5" /> Saved ({bookmarks.size})</>
                    }
                  </button>
                ))}
              </div>

              {/* ═══ BROWSE TAB ═══ */}
              {activeTab === 'browse' && (
                <>
                  {loading ? (
                    <div className="flex flex-col items-center py-20 gap-4">
                      <Moon className="w-10 h-10 text-amber-400 animate-pulse" />
                      <p className="text-sm" style={{ color: T.subtext }}>Loading duas…</p>
                    </div>
                  ) : duas.length === 0 ? (
                    <div
                      className="rounded-2xl border p-10 text-center"
                      style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                    >
                      <p style={{ color: T.subtext }}>No duas available yet.</p>
                    </div>
                  ) : (
                    <>
                      {/* Category pills — horizontally scrollable */}
                      <div className="overflow-x-auto pb-1 -mx-1">
                        <div className="flex gap-2 px-1 w-max">
                          {categories.map((cat) => {
                            const active = cat === activeCategory;
                            return (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className="shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border whitespace-nowrap"
                                style={{
                                  background: active
                                    ? 'linear-gradient(135deg, #92400e, #d4af37)'
                                    : T.insetBg,
                                  border: active
                                    ? '1px solid #d4af37'
                                    : `1px solid ${T.insetBorder}`,
                                  color:     active ? '#0c1a2e' : T.subtext,
                                  boxShadow: active ? '0 0 14px #d4af3744' : 'none',
                                  transform: active ? 'scale(1.04)' : 'scale(1)',
                                }}
                              >
                                {getCategoryLabel(cat)}
                                <span
                                  className="ml-1.5 text-xs opacity-70"
                                >
                                  ({getCategoryDuas(cat).length})
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Category description header */}
                      <div
                        className="rounded-2xl px-5 py-4 border"
                        style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h2
                              className="font-bold text-lg"
                              style={{ color: T.text, fontFamily: 'Georgia, serif' }}
                            >
                              {getCategoryLabel(activeCategory)}
                            </h2>
                            <p className="text-xs mt-0.5" style={{ color: T.subtext }}>
                              {getCategoryDuas(activeCategory).length} dua{getCategoryDuas(activeCategory).length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-4xl opacity-30">
                            {activeCategory === 'iftar'            ? '🌙'
                            : activeCategory === 'suhoor'          ? '🌅'
                            : activeCategory === 'forgiveness'     ? '🤲'
                            : activeCategory === 'last-ten-nights' ? '⭐'
                            : activeCategory === 'night'           ? '🌌'
                            : activeCategory === 'prayer'          ? '🕌'
                            : '📿'}
                          </div>
                        </div>
                        {/* Gold divider */}
                        <div
                          className="mt-3 h-px w-full"
                          style={{ background: 'linear-gradient(90deg, #d4af3744, transparent)' }}
                        />
                      </div>

                      {/* Dua cards for active category */}
                      <div className="space-y-5">
                        {getCategoryDuas(activeCategory).map((dua) => (
                          <DuaCard
                            key={dua.id}
                            dua={dua}
                            bookmarks={bookmarks}
                            onBookmark={toggleBookmark}
                            T={T}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}

              {/* ═══ SAVED TAB ═══ */}
              {activeTab === 'saved' && (
                <div className="space-y-5">
                  {savedDuas.length === 0 ? (
                    <div
                      className="rounded-3xl border p-14 text-center"
                      style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                    >
                      <Bookmark className="w-10 h-10 mx-auto mb-4" style={{ color: T.subtext }} />
                      <p
                        className="font-semibold mb-1"
                        style={{ color: T.text, fontFamily: 'Georgia, serif' }}
                      >
                        No saved duas yet
                      </p>
                      <p className="text-sm" style={{ color: T.subtext }}>
                        Tap the 🔖 icon on any dua to save it here.
                      </p>
                    </div>
                  ) : (
                    savedDuas.map((dua) => (
                      <DuaCard
                        key={dua.id}
                        dua={dua}
                        bookmarks={bookmarks}
                        onBookmark={toggleBookmark}
                        T={T}
                      />
                    ))
                  )}
                </div>
              )}
            </>
          )}

          {/* ── Footer note ── */}
          <div
            className="rounded-2xl px-5 py-4 border text-center"
            style={{ background: '#d4af3708', border: '1px solid #d4af3720' }}
          >
            <p className="text-sm italic" style={{ color: T.subtext, fontFamily: 'Georgia, serif' }}>
              "And your Lord says: Call upon Me, I will respond to you."
            </p>
            <p className="text-xs mt-1 text-amber-400/50">— Qur'an 40:60</p>
          </div>

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
