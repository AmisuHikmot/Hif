import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ramadan Kareem - Daily Reflections, Duas & Community Impact | Hamduk Islamic Foundation',
  description: 'Experience a sacred Ramadan with Hamduk Islamic Foundation. Daily Qur\'anic reflections, authentic duas, charitable giving opportunities, and spiritual reminders throughout the blessed month.',
  keywords: ['Ramadan', 'Ramadan Kareem', 'Islamic reflection', 'Quran', 'Duas', 'Charity', 'Fasting', 'Spiritual', 'Daily Reminder', 'Islamic community', 'Hamduk', 'HIF'],
  openGraph: {
    title: 'Ramadan Kareem - Sacred Moments & Reflections',
    description: 'Experience daily Qur\'anic reflections, duas, and community impact this Ramadan',
    url: 'https://www.hif.com.ng/ramadan',
    type: 'website',
    siteName: 'Hamduk Islamic Foundation',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RamadanLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
      {children}
    </div>
  );
}
