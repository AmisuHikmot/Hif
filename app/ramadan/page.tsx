'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, Moon, Star, BookOpen, Heart, Scroll, Volume2, VolumeX } from 'lucide-react';
import type { Metadata } from 'next';

// This export is handled by metadata in layout, but here for SEO reference
export const metadata: Metadata = {
  title: "Ramadan Kareem | Daily Reflections, Duas & Charity | Hamduk Islamic Foundation",
  description: "Experience Ramadan with Hamduk Islamic Foundation. Daily Qur'anic reflections, authentic duas, charitable giving, and spiritual reminders throughout the blessed month.",
  keywords: ["Ramadan", "Islamic reflection", "Quran", "Duas", "Charity", "Hamduk", "Fasting", "Spiritual development"],
  openGraph: {
    title: "Ramadan Kareem - Daily Reflections & Duas",
    description: "Experience sacred moments with daily Qur'anic reflections and authentic duas this Ramadan",
    url: "https://www.hif.com.ng/ramadan",
    type: "website",
    siteName: "Hamduk Islamic Foundation",
  },
};

interface ReflectionVerse {
  id: string;
  surah_number: number;
  ayah_number: number;
  arabic_text: string;
  english_translation: string;
  theme: string | null;
  reflection_note: string | null;
}

// ─── Islamic geometric background ────────────────────────────────────────────
const IslamicPattern = () => (
  <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]" aria-hidden>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="home-ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon
            points="40,4 49,28 74,28 54,44 61,68 40,54 19,68 26,44 6,28 31,28"
            fill="none" stroke="#d4af37" strokeWidth="0.8"
          />
          <rect x="28" y="28" width="24" height="24" fill="none" stroke="#d4af37"
            strokeWidth="0.5" transform="rotate(45 40 40)" />
          <circle cx="40" cy="40" r="5" fill="none" stroke="#d4af37" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#home-ip)" />
    </svg>
  </div>
);

// ─── Twinkling stars ──────────────────────────────────────────────────────────
const Stars = () => {
  const stars = Array.from({ length: 55 }, (_, i) => ({
    id: i,
    top:   `${(i * 37 + 11) % 100}%`,
    left:  `${(i * 53 + 7)  % 100}%`,
    size:  i % 5 === 0 ? 2 : 1,
    delay: `${(i * 0.37) % 4}s`,
    dur:   `${2.5 + (i % 3)}s`,
  }));

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {stars.map((s) => (
        <div
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            top: s.top, left: s.left,
            width: s.size, height: s.size,
            animation: `starTwinkle ${s.dur} ${s.delay} infinite`,
          }}
        />
      ))}
      {/* Ambient glows */}
      <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full blur-3xl opacity-10"
        style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
    </div>
  );
};

// ─── Animated crescent ────────────────────────────────────────────────────────
const Crescent = ({ glow }: { glow?: boolean }) => (
  <div className="relative flex items-center justify-center" style={{ filter: glow ? 'drop-shadow(0 0 32px #d4af3799)' : 'none' }}>
    <svg width="130" height="130" viewBox="0 0 130 130" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow ring */}
      <circle cx="65" cy="65" r="62" fill="none" stroke="#d4af3730" strokeWidth="1" />
      <circle cx="65" cy="65" r="58" fill="none" stroke="#d4af3720" strokeWidth="0.5" />
      {/* Crescent */}
      <path
        d="M65 15 A50 50 0 1 1 65 115 A35 35 0 1 0 65 15 Z"
        fill="#d4af37"
        style={{ filter: 'drop-shadow(0 0 8px #d4af3799)' }}
      />
      {/* Small star */}
      <polygon
        points="98,45 101,54 111,54 103,60 106,69 98,63 90,69 93,60 85,54 95,54"
        fill="#d4af37"
        transform="scale(0.5) translate(98,42)"
      />
    </svg>
  </div>
);

// ─── Nav card ─────────────────────────────────────────────────────────────────
interface NavCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay?: string;
}

const NavCard = ({ href, icon, title, subtitle, delay = '0s' }: NavCardProps) => (
  <Link href={href}>
    <div
      className="group relative rounded-2xl border p-5 transition-all duration-300 cursor-pointer overflow-hidden"
      style={{
        background: 'linear-gradient(145deg,#0f1e35,#0c1520)',
        border: '1px solid #d4af3730',
        animation: `cardReveal 0.6s ease-out ${delay} both`,
      }}
    >
      {/* Hover shimmer */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(135deg,#d4af3710,#d4af3705)' }}
      />
      {/* Gold top strip on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }}
      />
      <div className="relative z-10 flex items-center gap-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 group-hover:scale-110"
          style={{ background: '#d4af3718', border: '1px solid #d4af3740' }}
        >
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm" style={{ color: '#e2e8f0', fontFamily: 'Georgia, serif' }}>{title}</p>
          <p className="text-xs mt-0.5 truncate" style={{ color: '#64748b' }}>{subtitle}</p>
        </div>
        <ArrowRight
          className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1"
          style={{ color: '#d4af3788' }}
        />
      </div>
    </div>
  </Link>
);

// ─── Main component ───────────────────────────────────────────────────────────
export default function RamadanHome() {
  const [phase, setPhase]           = useState<'welcome' | 'verse'>('welcome');
  const [verse, setVerse]           = useState<ReflectionVerse | null>(null);
  const [loading, setLoading]       = useState(true);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Fetch verse on mount
  useEffect(() => {
    fetch('/api/ramadan/content?type=ramadan_reflection-verse')
      .then((r) => r.json())
      .then(setVerse)
      .catch(console.error)
      .finally(() => setLoading(false));

    // Pre-init audio element
    const el = new Audio('https://wnumzpiahvnuofdoetil.supabase.co/storage/v1/object/public/Ramadan/YASEER-AL-DOSSARI.mp3');
    el.loop   = true;
    el.volume = 0.4;
    el.addEventListener('canplaythrough', () => setAudioReady(true));
    audioRef.current = el;

    return () => { el.pause(); };
  }, []);

  const handleBeginReflection = () => {
    setPhase('verse');
    if (audioRef.current) {
      audioRef.current.play().then(() => setAudioPlaying(true)).catch(() => {});
    }
  };

  const toggleAudio = () => {
    const el = audioRef.current;
    if (!el) return;
    if (audioPlaying) {
      el.pause(); setAudioPlaying(false);
    } else {
      el.play().then(() => setAudioPlaying(true)).catch(() => {});
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'linear-gradient(160deg,#060d1a 0%,#0f172a 45%,#130a05 100%)' }}
    >
      <style>{`
        @keyframes starTwinkle {
          0%,100% { opacity:0.2; transform:scale(1); }
          50%      { opacity:0.9; transform:scale(1.4); }
        }
        @keyframes welcomeIn {
          0%   { opacity:0; transform:translateY(24px) scale(0.97); }
          100% { opacity:1; transform:translateY(0)    scale(1); }
        }
        @keyframes verseIn {
          0%   { opacity:0; transform:translateY(20px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes cardReveal {
          0%   { opacity:0; transform:translateY(16px); }
          100% { opacity:1; transform:translateY(0); }
        }
        @keyframes crescentFloat {
          0%,100% { transform:translateY(0px); }
          50%     { transform:translateY(-10px); }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow:0 0 0 0 #d4af3700; }
          50%     { box-shadow:0 0 30px 6px #d4af3733; }
        }
        .crescent-float { animation: crescentFloat 5s ease-in-out infinite; }
        .welcome-in     { animation: welcomeIn 0.9s cubic-bezier(0.16,1,0.3,1) both; }
        .verse-in       { animation: verseIn  0.8s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <IslamicPattern />
      <Stars />

      {/* ═══════════ WELCOME PHASE ═══════════ */}
      {phase === 'welcome' && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="welcome-in w-full max-w-lg text-center space-y-8">

            {/* Foundation label */}
            <p className="text-amber-400/60 text-xs font-bold tracking-[0.25em] uppercase">
              Hamduk Islamic Foundation
            </p>

            {/* Crescent */}
            <div className="crescent-float flex justify-center">
              <Crescent glow />
            </div>

            {/* Heading */}
            <div className="space-y-3">
              <h1
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: 'Georgia, serif', textShadow: '0 0 40px #d4af3733' }}
              >
                Ramadan<br />
                <span className="text-amber-400">Kareem</span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed">
                A month of fasting, mercy, and reflection
              </p>
            </div>

            {/* Hadith quote */}
            <div
              className="rounded-2xl px-6 py-5 mx-auto border text-center"
              style={{
                background: 'linear-gradient(135deg,#d4af3715,#d4af370a)',
                border: '1px solid #d4af3740',
                maxWidth: '380px',
              }}
            >
              <p className="text-amber-200/80 text-sm italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                "When Ramadan comes, the gates of Paradise are opened, the gates of Hell are closed, and the devils are chained."
              </p>
              <p className="text-amber-400/50 text-xs mt-2">— Sahih Bukhari</p>
            </div>

            {/* Gold ornamental divider */}
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg,transparent,#d4af37)' }} />
              <span className="text-amber-400 text-xl">✦</span>
              <div className="h-px w-16" style={{ background: 'linear-gradient(270deg,transparent,#d4af37)' }} />
            </div>

            {/* CTA button */}
            <button
              onClick={handleBeginReflection}
              className="relative group inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 active:scale-95"
              style={{
                background: 'linear-gradient(135deg,#92400e,#d4af37)',
                color: '#0c1a2e',
                fontFamily: 'Georgia, serif',
                boxShadow: '0 0 0 0 #d4af3700',
                animation: 'goldPulse 3s ease-in-out infinite',
              }}
            >
              <Moon className="w-5 h-5" />
              Begin the Reflection
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            <p className="text-slate-600 text-xs">
              Explore duas, knowledge, charity & daily reminders
            </p>
          </div>
        </div>
      )}

      {/* ═══════════ VERSE PHASE ═══════════ */}
      {phase === 'verse' && (
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          <div className="verse-in w-full max-w-2xl space-y-8">

            {/* Header */}
            <div className="text-center space-y-1">
              <p className="text-amber-400/60 text-xs font-bold tracking-widest uppercase">
                Hamduk Islamic Foundation
              </p>
              <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
                Ramadan Reflection
              </h2>
            </div>

            {/* Verse card */}
            <div
              className="relative rounded-3xl overflow-hidden border backdrop-blur-sm"
              style={{
                background: 'linear-gradient(145deg,#0f1e35 0%,#0c1520 100%)',
                border: '1px solid #d4af3730',
              }}
            >
              {/* Gold top strip */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

              <div className="px-6 md:px-10 py-8 md:py-12 space-y-8">
                {loading ? (
                  <div className="flex flex-col items-center py-10 gap-3">
                    <Moon className="w-8 h-8 text-amber-400 animate-pulse" />
                    <p className="text-slate-400 text-sm">Loading reflection…</p>
                  </div>
                ) : verse ? (
                  <>
                    {/* Theme badge */}
                    {verse.theme && (
                      <div className="flex justify-center">
                        <span
                          className="text-xs font-bold tracking-widest uppercase px-4 py-1.5 rounded-full"
                          style={{ background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }}
                        >
                          {verse.theme}
                        </span>
                      </div>
                    )}

                    {/* Arabic */}
                    <div
                      className="rounded-2xl p-6 md:p-8 text-center border"
                      style={{ background: '#d4af370a', border: '1px solid #d4af3720' }}
                    >
                      <p
                        className="text-2xl md:text-3xl leading-loose text-amber-100"
                        dir="rtl"
                        style={{ lineHeight: 2.3, fontFamily: 'Arial, sans-serif' }}
                      >
                        {verse.arabic_text}
                      </p>
                    </div>

                    {/* Gold divider */}
                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,transparent,#d4af3766)' }} />
                      <Star className="w-3 h-3 text-amber-400" fill="currentColor" />
                      <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,transparent,#d4af3766)' }} />
                    </div>

                    {/* English translation */}
                    <div className="relative px-2">
                      <span className="absolute -top-6 left-0 text-6xl text-amber-500/10 font-serif leading-none select-none">"</span>
                      <p
                        className="text-lg md:text-xl leading-relaxed text-slate-200 text-center"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {verse.english_translation}
                      </p>
                      <span className="absolute -bottom-6 right-0 text-6xl text-amber-500/10 font-serif leading-none select-none rotate-180">"</span>
                    </div>

                    {/* Reflection note */}
                    {verse.reflection_note && (
                      <div
                        className="rounded-xl p-4 border"
                        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                      >
                        <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#64748b' }}>
                          Reflection
                        </p>
                        <p className="text-slate-400 text-sm leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                          {verse.reflection_note}
                        </p>
                      </div>
                    )}

                    {/* Reference + audio */}
                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
                      <p className="text-amber-400/60 text-sm italic" style={{ fontFamily: 'Georgia, serif' }}>
                        Qur'an {verse.surah_number}:{verse.ayah_number}
                      </p>
                      <button
                        onClick={toggleAudio}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border"
                        style={
                          audioPlaying
                            ? { background: '#d4af3722', border: '1px solid #d4af3755', color: '#d4af37' }
                            : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#64748b' }
                        }
                      >
                        {audioPlaying
                          ? <><VolumeX className="w-3.5 h-3.5" /> Stop recitation</>
                          : <><Volume2 className="w-3.5 h-3.5" /> Play recitation</>
                        }
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-slate-400 text-center py-8">Failed to load reflection verse.</p>
                )}
              </div>

              {/* Gold bottom strip */}
              <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
            </div>

            {/* ── Navigation cards ── */}
            <div>
              <p className="text-xs font-bold tracking-widest uppercase text-center mb-4" style={{ color: '#64748b' }}>
                Explore This Ramadan
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <NavCard
                  href="/ramadan/daily-reminder"
                  icon={<Moon className="w-5 h-5 text-amber-400" />}
                  title="Daily Reminders"
                  subtitle="Unlock a new reminder every day"
                  delay="0.05s"
                />
                <NavCard
                  href="/ramadan/knowledge"
                  icon={<BookOpen className="w-5 h-5 text-amber-400" />}
                  title="Ramadan Knowledge"
                  subtitle="Learn fiqh, history & sunnah"
                  delay="0.1s"
                />
                <NavCard
                  href="/ramadan/duas"
                  icon={<Scroll className="w-5 h-5 text-amber-400" />}
                  title="Dua Corner"
                  subtitle="Essential supplications"
                  delay="0.15s"
                />
                <NavCard
                  href="/ramadan/charity"
                  icon={<Heart className="w-5 h-5 text-amber-400" />}
                  title="Ramadan Charity"
                  subtitle="Support our mission this month"
                  delay="0.2s"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="text-center pb-4">
              <div className="inline-flex items-center gap-2 text-amber-400/30 text-xs">
                <Moon className="w-3 h-3" />
                <span>Hamduk Islamic Foundation · Ramadan Kareem</span>
                <Moon className="w-3 h-3" />
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
