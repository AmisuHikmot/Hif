'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ramadanService, type ReflectionVerse } from '@/lib/services/ramadan-service';
import { ArrowRight } from 'lucide-react';

export default function RamadanHome() {
  const [showAyah, setShowAyah] = useState(false);
  const [verse, setVerse] = useState<ReflectionVerse | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the featured verse
    const fetchVerse = async () => {
      const reflectionVerse = await ramadanService.getFeaturedReflectionVerse();
      setVerse(reflectionVerse);
      setLoading(false);
    };

    fetchVerse();

    // Cleanup audio on unmount
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [audio]);

  const handleBeginReflection = () => {
    setShowAyah(true);
    playAudio();
  };

  const playAudio = () => {
    try {
      const audioElement = new Audio(
        'https://wnumzpiahvnuofdoetil.supabase.co/storage/v1/object/public/Ramadan/YASEER-AL-DOSSARI.mp3'
      );
      audioElement.loop = true;
      audioElement.volume = 0.5;
      audioElement.play().catch((error) => {
        console.error('[v0] Error playing audio:', error);
      });
      setAudio(audioElement);
      setAudioPlaying(true);
    } catch (error) {
      console.error('[v0] Failed to initialize audio:', error);
    }
  };

  const stopAudio = () => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      setAudioPlaying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800">
      {/* Stars background effect */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: scale(1); }
          to { opacity: 0; transform: scale(0.95); }
        }
        .fade-in {
          animation: fadeIn 0.8s ease-out;
        }
        .fade-out {
          animation: fadeOut 0.6s ease-in forwards;
        }
      `}</style>

      {!showAyah ? (
        // Initial Welcome View
        <div className="relative z-10 h-screen flex flex-col items-center justify-center px-4">
          <div className="text-center fade-in">
            {/* Crescent Moon SVG */}
            <div className="mb-12 flex justify-center">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                className="text-yellow-200"
              >
                <path
                  fill="currentColor"
                  d="M60 10c27.6 0 50 22.4 50 50s-22.4 50-50 50S10 87.6 10 60s22.4-50 50-50m0-5C31 5 10 26 10 60s21 55 50 55 50-21 50-55S89 5 60 5z"
                />
                <circle cx="65" cy="55" r="48" fill="rgb(15 23 42)" />
              </svg>
            </div>

            {/* Text Content */}
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
              Ramadan Kareem
            </h1>
            <p className="text-xl text-slate-300 mb-3">
              A month of fasting, mercy, and reflection
            </p>
            <p className="text-base text-slate-400 mb-12 italic">
              "Ramadan is a return to Allah."
            </p>

            {/* CTA Button */}
            <Button
              onClick={handleBeginReflection}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg rounded-lg"
            >
              Begin the Reflection
            </Button>
          </div>
        </div>
      ) : (
        // Ayah View
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
          {loading ? (
            <div className="animate-pulse text-slate-300">Loading reflection...</div>
          ) : verse ? (
            <div className="fade-in max-w-3xl w-full">
              {/* Ayah Card */}
              <Card className="bg-slate-900/50 border-slate-700 backdrop-blur">
                <CardContent className="p-8 md:p-12">
                  {/* Arabic Text */}
                  <div className="text-center mb-8">
                    <p className="text-2xl md:text-3xl leading-relaxed text-white font-arabic mb-8">
                      {verse.arabic_text}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent mb-8" />

                  {/* English Translation */}
                  <div className="text-center mb-8">
                    <p className="text-lg leading-relaxed text-slate-200">
                      {verse.english_translation}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="text-center border-t border-slate-700 pt-6 mt-8">
                    <p className="text-sm text-slate-400">
                      Qur'an {verse.surah_number}:{verse.ayah_number}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Ramadan Reflection by Hamduk Islamic Foundation
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Navigation CTAs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                <Link href="/ramadan/daily-reminder">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                  >
                    Daily Reminder
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/ramadan/knowledge">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                  >
                    Learn About Ramadan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/ramadan/duas">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                  >
                    Dua Corner
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/ramadan/charity">
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-400 hover:bg-emerald-600/10"
                  >
                    Ramadan Charity
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>

              {/* Stop Audio Button */}
              {audioPlaying && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={stopAudio}
                    variant="ghost"
                    className="text-slate-400 hover:text-slate-300"
                  >
                    Stop Recitation
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-300">Failed to load reflection verse</div>
          )}
        </div>
      )}
    </div>
  );
}
