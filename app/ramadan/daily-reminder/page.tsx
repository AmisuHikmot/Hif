'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Share2 } from 'lucide-react';
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

export default function DailyReminderPage() {
  const [reminder, setReminder] = useState<DailyReminder | null>(null);
  const [allReminders, setAllReminders] = useState<DailyReminder[]>([]);
  const [currentDay, setCurrentDay] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        // Fetch all reminders
        const response = await fetch('/api/ramadan/content?type=ramadan_daily-reminders');
        const allRemindersList = await response.json();
        setAllReminders(allRemindersList);
        
        // Set current day reminder
        const current = allRemindersList.find((r: DailyReminder) => r.day_number === currentDay);
        setReminder(current || null);
      } catch (error) {
        console.error('[v0] Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();
  }, [currentDay]);

  const handleShareAsImage = async () => {
    if (!reminder) return;

    try {
      // Create canvas for sharing
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1080, 1080);

      // Text styling
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.font = 'bold 48px Arial';

      // Title
      ctx.fillText('Ramadan Reminder', 540, 150);

      // Day number
      ctx.font = 'bold 72px Arial';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`Day ${reminder.day_number}`, 540, 280);

      // Reminder type
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 32px Arial';
      ctx.fillText(reminder.reminder_type.toUpperCase(), 540, 350);

      // Content
      ctx.fillStyle = '#e2e8f0';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      const lines = reminder.english_text.match(/.{1,40}/g) || [];
      let y = 500;
      lines.forEach((line) => {
        ctx.fillText(line, 540, y);
        y += 40;
      });

      // Watermark
      ctx.fillStyle = '#64748b';
      ctx.font = '20px Arial';
      ctx.fillText('By Hamduk Islamic Foundation', 540, 1000);

      // Download the image
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `ramadan-reminder-day-${reminder.day_number}.png`;
          a.click();
          URL.revokeObjectURL(url);

          toast({
            title: 'Success',
            description: 'Reminder image downloaded',
          });
        }
      });
    } catch (error) {
      console.error('[v0] Error sharing image:', error);
      toast({
        title: 'Error',
        description: 'Failed to download reminder',
        variant: 'destructive',
      });
    }
  };

  const handleShare = async () => {
    if (!reminder) return;

    const shareText = `Ramadan Reminder - Day ${reminder.day_number}: ${reminder.title}\n\n${reminder.english_text}\n\nBy Hamduk Islamic Foundation`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ramadan Reminder - Day ${reminder.day_number}`,
          text: shareText,
        });
      } catch (error) {
        console.error('[v0] Share error:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        toast({
          title: 'Copied',
          description: 'Reminder copied to clipboard',
        });
      } catch (error) {
        console.error('[v0] Copy error:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 flex items-center justify-center">
        <div className="text-slate-300">Loading reminder...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Daily Ramadan Reminder</h1>
          <p className="text-slate-400">Unlock a new reminder every day</p>
        </div>

        {/* Current Reminder */}
        {reminder ? (
          <div>
            <Card className="bg-slate-900/50 border-slate-700 backdrop-blur mb-8">
              <CardHeader className="border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-emerald-400">
                      Day {reminder.day_number} - {reminder.title}
                    </CardTitle>
                    <CardDescription>{reminder.reminder_type.toUpperCase()}</CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-6">
                {/* Arabic Text */}
                {reminder.arabic_text && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Arabic</p>
                    <p className="text-xl leading-relaxed text-white font-arabic">
                      {reminder.arabic_text}
                    </p>
                  </div>
                )}

                {/* Transliteration */}
                {reminder.transliteration && (
                  <div>
                    <p className="text-slate-400 text-sm mb-2">Transliteration</p>
                    <p className="text-base leading-relaxed text-slate-300 italic">
                      {reminder.transliteration}
                    </p>
                  </div>
                )}

                {/* English Translation */}
                <div>
                  <p className="text-slate-400 text-sm mb-2">English</p>
                  <p className="text-lg leading-relaxed text-slate-200">
                    {reminder.english_text}
                  </p>
                </div>

                {/* Reference and Author */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-700">
                  {reminder.reference && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Reference</p>
                      <p className="text-slate-300">{reminder.reference}</p>
                    </div>
                  )}
                  {reminder.author && (
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Author</p>
                      <p className="text-slate-300">{reminder.author}</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-700">
                  <Button
                    onClick={handleShareAsImage}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-400"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>

                {/* Watermark */}
                <p className="text-center text-xs text-slate-500 pt-4">
                  By Hamduk Islamic Foundation
                </p>
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between gap-4">
              <Button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay <= 1}
                variant="outline"
                className="border-slate-700"
              >
                Previous Day
              </Button>

              <span className="text-slate-300">
                Day {currentDay} of {Math.max(currentDay, allReminders.length)}
              </span>

              <Button
                onClick={() => setCurrentDay(Math.min(30, currentDay + 1))}
                disabled={currentDay >= 30}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Next Day
              </Button>
            </div>
          </div>
        ) : (
          <Card className="bg-slate-900/50 border-slate-700">
            <CardContent className="py-12 text-center text-slate-300">
              <p>No reminder available for today. Check back tomorrow!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
