import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ramadan | Hamduk Islamic Foundation',
  description: 'Experience a spiritual journey during Ramadan with daily reminders, Duas, knowledge articles, and charity information from Hamduk Islamic Foundation.',
  keywords: ['Ramadan', 'Islamic', 'Duas', 'Spiritual', 'Daily Reminder', 'Charity'],
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
