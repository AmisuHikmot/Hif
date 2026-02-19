'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Moon, Clock, BookOpen, Bookmark, BookmarkCheck,
  Search, Share2, MessageCircle, ChevronDown, ChevronUp,
  Star, Layers, Flame, CheckCircle2, Sun,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ─── Types ────────────────────────────────────────────────────────────────────
interface KnowledgeArticle {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  category: string | null;
  difficulty_level: string;
  read_time_minutes: number | null;
  image_url: string | null;
  order_rank: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LS = {
  BOOKMARKS: 'kb_bookmarks',
  READ:      'kb_read',
  THEME:     'rm_theme',
};

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner:     { label: 'Beginner',     color: '#34d399', bg: '#34d39915' },
  intermediate: { label: 'Intermediate', color: '#fbbf24', bg: '#fbbf2415' },
  advanced:     { label: 'Advanced',     color: '#f87171', bg: '#f8717115' },
};

const CATEGORY_EMOJI: Record<string, string> = {
  fiqh:        '⚖️',
  history:     '📜',
  spirituality:'🌿',
  worship:     '🕌',
  charity:     '💛',
  quran:       '📖',
  hadith:      '🌙',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getCategoryEmoji(cat: string | null): string {
  if (!cat) return '📚';
  return CATEGORY_EMOJI[cat.toLowerCase()] ?? '📚';
}

function getDifficultyConfig(level: string) {
  return DIFFICULTY_CONFIG[level.toLowerCase()] ?? { label: level, color: '#94a3b8', bg: '#94a3b815' };
}

// ─── Theme tokens ─────────────────────────────────────────────────────────────
function makeTokens(theme: 'dark' | 'light') {
  return {
    bg:          theme === 'dark' ? 'linear-gradient(160deg,#060d1a 0%,#0f172a 40%,#130a05 100%)' : 'linear-gradient(160deg,#faf5e4 0%,#fef9ec 40%,#fdf6e3 100%)',
    cardBg:      theme === 'dark' ? 'linear-gradient(145deg,#0f1e35 0%,#0c1520 100%)' : 'linear-gradient(145deg,#fffdf5 0%,#fef9e7 100%)',
    cardBorder:  theme === 'dark' ? '#d4af3730' : '#d4af3760',
    text:        theme === 'dark' ? '#e2e8f0' : '#1e293b',
    subtext:     theme === 'dark' ? '#94a3b8' : '#64748b',
    insetBg:     theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',
    insetBorder: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    prose:       theme === 'dark' ? '#cbd5e1' : '#334155',
  };
}

// ─── Islamic pattern ──────────────────────────────────────────────────────────
const IslamicPattern = ({ theme }: { theme: 'dark' | 'light' }) => (
  <div
    className="pointer-events-none fixed inset-0 z-0"
    style={{ opacity: theme === 'dark' ? 0.035 : 0.06 }}
    aria-hidden
  >
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="kb-ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
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
      <rect width="100%" height="100%" fill="url(#kb-ip)" />
    </svg>
  </div>
);

// ─── Reading progress tracker ─────────────────────────────────────────────────
function ReadingProgress({ articleId, onRead }: { articleId: string; onRead: (id: string) => void }) {
  const ref      = useRef<HTMLDivElement>(null);
  const fired    = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          // Mark as read after 4 seconds of being visible
          const t = setTimeout(() => { onRead(articleId); fired.current = true; }, 4000);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [articleId, onRead]);

  return <div ref={ref} className="h-1" />;
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({
  article,
  bookmarks,
  readArticles,
  onBookmark,
  onRead,
  T,
}: {
  article:      KnowledgeArticle;
  bookmarks:    Set<string>;
  readArticles: Set<string>;
  onBookmark:   (id: string) => void;
  onRead:       (id: string) => void;
  T:            ReturnType<typeof makeTokens>;
}) {
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  const isBookmarked = bookmarks.has(article.id);
  const isRead       = readArticles.has(article.id);
  const diff         = getDifficultyConfig(article.difficulty_level);

  const share = async () => {
    const text =
      `📚 ${article.title}\n\n` +
      `${article.description ?? ''}\n\n` +
      `${article.content.slice(0, 400)}…\n\n` +
      `By Hamduk Islamic Foundation`;

    if (navigator.share) {
      try { await navigator.share({ title: article.title, text }); } catch {}
    } else {
      await navigator.clipboard.writeText(text);
      toast({ title: 'Copied to clipboard!' });
    }
  };

  const whatsapp = () => {
    const text = encodeURIComponent(
      `📚 *${article.title}*\n\n` +
      `${article.description ?? ''}\n\n` +
      `${article.content.slice(0, 400)}…\n\n` +
      `By Hamduk Islamic Foundation`,
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden border backdrop-blur-sm transition-all duration-300"
      style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
    >
      {/* Gold top strip */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }}
      />

      {/* Card header — always visible, clickable to expand */}
      <div
        className="px-6 pt-5 pb-5 cursor-pointer select-none"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex items-start justify-between gap-3">
          {/* Left: emoji + title */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ background: '#d4af3715', border: '1px solid #d4af3730' }}
            >
              {getCategoryEmoji(article.category)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                {/* Difficulty badge */}
                <span
                  className="text-xs font-bold tracking-wide px-2 py-0.5 rounded-full"
                  style={{ background: diff.bg, color: diff.color, border: `1px solid ${diff.color}33` }}
                >
                  {diff.label}
                </span>
                {/* Category badge */}
                {article.category && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{ background: T.insetBg, color: T.subtext, border: `1px solid ${T.insetBorder}` }}
                  >
                    {article.category}
                  </span>
                )}
                {/* Read tick */}
                {isRead && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Read
                  </span>
                )}
              </div>

              <h3
                className="font-bold text-lg leading-snug"
                style={{ color: T.text, fontFamily: 'Georgia, serif' }}
              >
                {article.title}
              </h3>

              {article.description && (
                <p className="text-sm mt-1 leading-relaxed" style={{ color: T.subtext }}>
                  {article.description}
                </p>
              )}

              {/* Meta row */}
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                {article.read_time_minutes && (
                  <span className="flex items-center gap-1 text-xs" style={{ color: T.subtext }}>
                    <Clock className="w-3 h-3" />
                    {article.read_time_minutes} min read
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
            {/* Bookmark */}
            <button
              onClick={() => onBookmark(article.id)}
              className="w-8 h-8 rounded-full flex items-center justify-center border transition-all"
              style={{
                background: isBookmarked ? '#d4af3722' : T.insetBg,
                border:     isBookmarked ? '1px solid #d4af3755' : `1px solid ${T.insetBorder}`,
              }}
            >
              {isBookmarked
                ? <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                : <Bookmark      className="w-3.5 h-3.5" style={{ color: T.subtext }} />
              }
            </button>

            {/* Expand chevron */}
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

      {/* Expanded article content */}
      {expanded && (
        <div
          className="px-6 pb-6 border-t space-y-5"
          style={{ borderColor: T.insetBorder }}
        >
          {/* Article image */}
          {article.image_url && (
            <div className="pt-5">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-52 object-cover rounded-2xl"
                style={{ border: `1px solid ${T.cardBorder}` }}
              />
            </div>
          )}

          {/* Gold ornament */}
          <div className="flex items-center gap-3 pt-3">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,#d4af3744,transparent)' }} />
            <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
            <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,#d4af3744,transparent)' }} />
          </div>

          {/* Article content */}
          <div
            className="rounded-2xl p-5 border"
            style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}
          >
            <p
              className="leading-loose text-sm md:text-base whitespace-pre-wrap"
              style={{ color: T.prose, fontFamily: 'Georgia, serif', lineHeight: 1.9 }}
            >
              {article.content}
            </p>
          </div>

          {/* Reading progress observer — marks read after 4s visible */}
          <ReadingProgress articleId={article.id} onRead={onRead} />

          {/* Share actions */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={share}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
              style={{ border: `1px solid ${T.insetBorder}`, color: T.subtext }}
            >
              <Share2 className="w-4 h-4" /> Share
            </button>
            <button
              onClick={whatsapp}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95 border"
              style={{ background: '#25D36615', border: '1px solid #25D36644', color: '#25D366' }}
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Gold bottom strip */}
      <div
        className="h-0.5 w-full"
        style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }}
      />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function RamadanKnowledgePage() {
  const [articles,     setArticles]     = useState<KnowledgeArticle[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [bookmarks,    setBookmarks]    = useState<Set<string>>(new Set());
  const [readArticles, setReadArticles] = useState<Set<string>>(new Set());
  const [theme,        setTheme]        = useState<'dark' | 'light'>('dark');
  const [searchQuery,  setSearchQuery]  = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'beginner' | 'intermediate' | 'advanced'>('all');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTab,    setActiveTab]    = useState<'browse' | 'saved'>('browse');
  const { toast } = useToast();

  // ── Bootstrap localStorage ────────────────────────────────────────────────
  useEffect(() => {
    try {
      setBookmarks(new Set(JSON.parse(localStorage.getItem(LS.BOOKMARKS) ?? '[]')));
      setReadArticles(new Set(JSON.parse(localStorage.getItem(LS.READ) ?? '[]')));
      setTheme((localStorage.getItem(LS.THEME) as 'dark' | 'light') ?? 'dark');
    } catch {}
  }, []);

  // ── Fetch articles ────────────────────────────────────────────────────────
  useEffect(() => {
    fetch('/api/ramadan/content?type=ramadan_knowledge')
      .then((r) => r.json())
      .then((data: KnowledgeArticle[]) => setArticles(data.sort((a, b) => a.order_rank - b.order_rank)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // ── Bookmark toggle ───────────────────────────────────────────────────────
  const toggleBookmark = (id: string) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); toast({ title: 'Removed from saved' }); }
      else              { next.add(id);    toast({ title: '🔖 Article saved!' }); }
      localStorage.setItem(LS.BOOKMARKS, JSON.stringify([...next]));
      return next;
    });
  };

  // ── Mark as read ──────────────────────────────────────────────────────────
  const markRead = (id: string) => {
    setReadArticles((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      localStorage.setItem(LS.READ, JSON.stringify([...next]));
      return next;
    });
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const categories = ['all', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean) as string[]))];

  const filtered = articles.filter((a) => {
    const matchSearch = searchQuery.trim().length < 2 ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDiff = activeFilter === 'all' || a.difficulty_level === activeFilter;
    const matchCat  = activeCategory === 'all' || a.category === activeCategory;

    return matchSearch && matchDiff && matchCat;
  });

  const savedArticles = articles.filter((a) => bookmarks.has(a.id));

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
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
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
                <span className="text-amber-400">Knowledge Base</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: T.subtext }}>
                Understand the spiritual significance and practice of Ramadan
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
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* ── Stats row ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <BookOpen className="w-4 h-4 text-amber-400" />,      value: articles.length,      label: 'Articles'  },
              { icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />, value: readArticles.size,    label: 'Read'      },
              { icon: <Bookmark className="w-4 h-4 text-amber-400" />,       value: bookmarks.size,       label: 'Saved'     },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 text-center border backdrop-blur-sm"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
              >
                <div className="flex items-center justify-center gap-1.5 mb-1">
                  {s.icon}
                  <span
                    className="text-2xl font-bold text-amber-400"
                    style={{ fontFamily: 'Georgia, serif' }}
                  >
                    {s.value}
                  </span>
                </div>
                <p className="text-xs" style={{ color: T.subtext }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* ── Overall reading progress bar ── */}
          <div
            className="rounded-2xl p-4 border backdrop-blur-sm"
            style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-amber-300 text-sm font-semibold">Reading Progress</span>
              <span className="text-xs" style={{ color: T.subtext }}>
                {readArticles.size} / {articles.length} articles
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: T.insetBg }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width:      articles.length ? `${(readArticles.size / articles.length) * 100}%` : '0%',
                  background: 'linear-gradient(90deg,#92400e,#d4af37)',
                }}
              />
            </div>
            {readArticles.size === articles.length && articles.length > 0 && (
              <p className="text-emerald-400 text-xs mt-2 text-center font-semibold">
                🎉 You've read all articles! Masha'Allah!
              </p>
            )}
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
              placeholder="Search articles by title, description or content…"
              className="w-full bg-transparent pl-11 pr-10 py-3.5 text-sm outline-none placeholder:opacity-40"
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

          {/* ── Browse / Saved tabs ── */}
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
                  background:  activeTab === tab ? 'linear-gradient(135deg,#92400e44,#d4af3722)' : T.insetBg,
                  color:       activeTab === tab ? '#fbbf24' : T.subtext,
                  borderRight: i === 0 ? `1px solid ${T.cardBorder}` : 'none',
                }}
              >
                {tab === 'browse'
                  ? <><BookOpen className="w-3.5 h-3.5" /> Browse Articles</>
                  : <><Bookmark className="w-3.5 h-3.5" /> Saved ({bookmarks.size})</>
                }
              </button>
            ))}
          </div>

          {/* ═══ BROWSE TAB ═══ */}
          {activeTab === 'browse' && (
            <>
              {/* ── Difficulty filter pills ── */}
              <div className="flex gap-2 flex-wrap">
                {(['all', 'beginner', 'intermediate', 'advanced'] as const).map((level) => {
                  const active = activeFilter === level;
                  const cfg    = level === 'all' ? null : getDifficultyConfig(level);
                  return (
                    <button
                      key={level}
                      onClick={() => setActiveFilter(level)}
                      className="px-3 py-1.5 rounded-full text-xs font-bold transition-all border whitespace-nowrap capitalize"
                      style={{
                        background: active ? (cfg ? cfg.bg : '#d4af3722') : T.insetBg,
                        border:     active ? `1px solid ${cfg ? cfg.color : '#d4af37'}` : `1px solid ${T.insetBorder}`,
                        color:      active ? (cfg ? cfg.color : '#d4af37') : T.subtext,
                      }}
                    >
                      {level === 'all' ? '🌟 All Levels' : level}
                    </button>
                  );
                })}
              </div>

              {/* ── Category filter pills ── */}
              {categories.length > 1 && (
                <div className="overflow-x-auto pb-1 -mx-1">
                  <div className="flex gap-2 px-1 w-max">
                    {categories.map((cat) => {
                      const active = cat === activeCategory;
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap"
                          style={{
                            background: active ? 'linear-gradient(135deg,#92400e,#d4af37)' : T.insetBg,
                            border:     active ? '1px solid #d4af37' : `1px solid ${T.insetBorder}`,
                            color:      active ? '#0c1a2e' : T.subtext,
                            boxShadow:  active ? '0 0 14px #d4af3744' : 'none',
                          }}
                        >
                          {cat === 'all' ? '📚 All Topics' : `${getCategoryEmoji(cat)} ${cat}`}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Result count ── */}
              {(searchQuery.trim().length > 1 || activeFilter !== 'all' || activeCategory !== 'all') && (
                <p className="text-xs" style={{ color: T.subtext }}>
                  Showing {filtered.length} of {articles.length} article{articles.length !== 1 ? 's' : ''}
                </p>
              )}

              {/* ── Article list ── */}
              {loading ? (
                <div className="flex flex-col items-center py-20 gap-4">
                  <Moon className="w-10 h-10 text-amber-400 animate-pulse" />
                  <p className="text-sm" style={{ color: T.subtext }}>Loading articles…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div
                  className="rounded-3xl border p-12 text-center"
                  style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                >
                  <BookOpen className="w-10 h-10 mx-auto mb-4" style={{ color: T.subtext }} />
                  <p className="font-semibold mb-1" style={{ color: T.text, fontFamily: 'Georgia, serif' }}>
                    No articles found
                  </p>
                  <p className="text-sm" style={{ color: T.subtext }}>
                    Try adjusting your search or filters.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {filtered.map((article) => (
                    <ArticleCard
                      key={article.id}
                      article={article}
                      bookmarks={bookmarks}
                      readArticles={readArticles}
                      onBookmark={toggleBookmark}
                      onRead={markRead}
                      T={T}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {/* ═══ SAVED TAB ═══ */}
          {activeTab === 'saved' && (
            <div className="space-y-5">
              {savedArticles.length === 0 ? (
                <div
                  className="rounded-3xl border p-14 text-center"
                  style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}
                >
                  <Bookmark className="w-10 h-10 mx-auto mb-4" style={{ color: T.subtext }} />
                  <p
                    className="font-semibold mb-1"
                    style={{ color: T.text, fontFamily: 'Georgia, serif' }}
                  >
                    No saved articles yet
                  </p>
                  <p className="text-sm" style={{ color: T.subtext }}>
                    Tap the 🔖 icon on any article to save it here.
                  </p>
                </div>
              ) : (
                savedArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    bookmarks={bookmarks}
                    readArticles={readArticles}
                    onBookmark={toggleBookmark}
                    onRead={markRead}
                    T={T}
                  />
                ))
              )}
            </div>
          )}

          {/* ── Motivational footer card ── */}
          <div
            className="rounded-2xl px-5 py-4 border text-center"
            style={{ background: '#d4af3708', border: '1px solid #d4af3720' }}
          >
            <p className="text-sm italic" style={{ color: T.subtext, fontFamily: 'Georgia, serif' }}>
              "Seeking knowledge is an obligation upon every Muslim."
            </p>
            <p className="text-xs mt-1 text-amber-400/50">— Ibn Majah</p>
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
