'use client';

import { useState, useEffect } from 'react';
import { Copy, Check, Heart, Building2, ShieldCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// ── Types matching the actual DB columns ─────────────────────────────────────
interface CharityInfo {
  id: string;
  section_name: string; // NOT "title"
  content: string;      // NOT "description"
  icon: string | null;
  order_rank: number;
}

interface BankAccount {
  id: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  account_type: string | null;
  currency: string;
  is_active: boolean;
  display_order: number;
}

// ── Islamic geometric SVG pattern ────────────────────────────────────────────
const IslamicPattern = () => (
  <div className="pointer-events-none fixed inset-0 opacity-[0.035] z-0" aria-hidden>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon
            points="40,4 49,28 74,28 54,44 61,68 40,54 19,68 26,44 6,28 31,28"
            fill="none" stroke="#d4af37" strokeWidth="0.8"
          />
          <rect x="28" y="28" width="24" height="24" fill="none" stroke="#d4af37"
            strokeWidth="0.5" transform="rotate(45 40 40)" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#ip)" />
    </svg>
  </div>
);

// ── Copy button with feedback ────────────────────────────────────────────────
function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast({ title: 'Copied!', description: `${label} copied to clipboard.` });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
      style={
        copied
          ? { background: '#16a34a33', color: '#4ade80', border: '1px solid #16a34a55' }
          : { background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3744' }
      }
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function RamadanCharityPage() {
  const [charityInfo, setCharityInfo] = useState<CharityInfo[]>([]);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ramadan/content?type=ramadan_charity');
        const json = await res.json();
        // API now returns { charityInfo: [...], bankAccounts: [...] }
        setCharityInfo(json.charityInfo ?? []);
        setBankAccounts(json.bankAccounts ?? []);
      } catch (error) {
        console.error('[v0] Error fetching charity info:', error);
        toast({ title: 'Error', description: 'Failed to load charity information.', variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0f172a 40%, #130a05 100%)' }}
      >
        <div className="flex flex-col items-center gap-3">
          <Heart className="w-8 h-8 text-amber-400 animate-pulse" />
          <p className="text-slate-400 text-sm">Loading charity information...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen"
      style={{ background: 'linear-gradient(160deg, #060d1a 0%, #0f172a 40%, #130a05 100%)' }}
    >
      <IslamicPattern />

      {/* Ambient glows */}
      <div className="pointer-events-none fixed inset-0 z-0" aria-hidden>
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #d4af37, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #15803d, transparent)' }} />
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-3xl mx-auto space-y-10">

          {/* ── Header ── */}
          <div className="text-center space-y-4">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-2"
              style={{
                background: 'radial-gradient(circle, #d4af3733, #d4af3711)',
                border: '1px solid #d4af3755',
              }}
            >
              <Heart className="w-9 h-9 text-amber-400" fill="#d4af3766" />
            </div>
            <h1
              className="text-4xl md:text-5xl font-bold text-white"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              Ramadan <span className="text-amber-400">Charity</span>
            </h1>
            <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
              Support our mission during the blessed month. Every contribution is an act of worship multiplied.
            </p>
            {/* Gold divider */}
            <div className="flex items-center gap-3 justify-center pt-2">
              <div className="h-px w-16" style={{ background: 'linear-gradient(90deg, transparent, #d4af37)' }} />
              <span className="text-amber-400 text-lg">☽</span>
              <div className="h-px w-16" style={{ background: 'linear-gradient(270deg, transparent, #d4af37)' }} />
            </div>
          </div>

          {/* ── Charity Info Sections ── */}
          {charityInfo.length > 0 && (
            <div className="space-y-4">
              {charityInfo.map((section, i) => (
                <div
                  key={section.id}
                  className="rounded-2xl p-6 border backdrop-blur-sm"
                  style={{
                    background: i === 0
                      ? 'linear-gradient(135deg, #d4af3715, #d4af370a)'
                      : 'rgba(255,255,255,0.02)',
                    border: i === 0 ? '1px solid #d4af3740' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-lg mt-0.5"
                      style={{ background: '#d4af3722', border: '1px solid #d4af3444' }}
                    >
                      {section.icon ?? '🌙'}
                    </div>
                    <div>
                      <h3
                        className="text-amber-300 font-bold text-lg mb-2"
                        style={{ fontFamily: 'Georgia, serif' }}
                      >
                        {section.section_name}
                      </h3>
                      <p className="text-slate-300 leading-relaxed text-sm md:text-base">
                        {section.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Bank Accounts ── */}
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h2
                className="text-2xl font-bold text-white"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Donation Account Details
              </h2>
            </div>

            {bankAccounts.length > 0 ? (
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div
                    key={account.id}
                    className="rounded-2xl overflow-hidden border backdrop-blur-sm"
                    style={{
                      background: 'linear-gradient(145deg, #0f1e35 0%, #0c1520 100%)',
                      border: '1px solid #d4af3730',
                    }}
                  >
                    {/* Gold top bar */}
                    <div
                      className="h-1 w-full"
                      style={{ background: 'linear-gradient(90deg, transparent, #d4af37, transparent)' }}
                    />

                    <div className="p-6 space-y-5">
                      {/* Account name + currency badge */}
                      <div className="flex items-start justify-between gap-3">
                        <h3
                          className="text-amber-300 font-bold text-xl"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          {account.account_name}
                        </h3>
                        <span
                          className="shrink-0 text-xs font-bold px-3 py-1 rounded-full"
                          style={{
                            background: '#d4af3722',
                            color: '#d4af37',
                            border: '1px solid #d4af3744',
                          }}
                        >
                          {account.currency}
                        </span>
                      </div>

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                          <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Bank</p>
                          <p className="text-white font-semibold text-sm">{account.bank_name}</p>
                        </div>
                        {account.account_type && (
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <p className="text-slate-500 text-xs mb-1 uppercase tracking-wide">Type</p>
                            <p className="text-white font-semibold text-sm">{account.account_type}</p>
                          </div>
                        )}
                      </div>

                      {/* Account number — hero field */}
                      <div
                        className="rounded-xl p-4 flex items-center justify-between gap-3"
                        style={{
                          background: 'linear-gradient(135deg, #d4af3715, #d4af370a)',
                          border: '1px solid #d4af3740',
                        }}
                      >
                        <div>
                          <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Account Number</p>
                          <p className="text-white font-mono text-xl md:text-2xl font-bold tracking-widest">
                            {account.account_number}
                          </p>
                        </div>
                        <CopyButton value={account.account_number} label="Account number" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Integrity note */}
                <div
                  className="flex gap-3 rounded-2xl p-5 border"
                  style={{
                    background: 'rgba(21, 128, 61, 0.08)',
                    border: '1px solid rgba(21, 128, 61, 0.25)',
                  }}
                >
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-emerald-200/80 text-sm leading-relaxed">
                    All donations are managed by <strong className="text-emerald-300">Hamduk Islamic Foundation</strong> with
                    full transparency and integrity. Your contribution supports Islamic education,
                    community Iftars, and welfare programs throughout Ramadan and beyond.
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="rounded-2xl p-10 text-center border"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-slate-400">Bank account details will be available soon.</p>
              </div>
            )}
          </div>

          {/* ── Call to action ── */}
          <div
            className="rounded-3xl p-8 text-center border relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #0f2a1a 0%, #0c1f14 100%)',
              border: '1px solid rgba(21,128,61,0.3)',
            }}
          >
            <div
              className="absolute inset-0 opacity-5 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, #22c55e, transparent)' }}
            />
            <div className="relative z-10">
              <p className="text-3xl mb-3">🤲</p>
              <h3
                className="text-2xl font-bold text-white mb-3"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                Your Sadaqah Changes Lives
              </h3>
              <p className="text-slate-300 mb-2 max-w-md mx-auto text-sm leading-relaxed">
                The Prophet ﷺ said: <em className="text-emerald-300">"Sadaqah extinguishes sin as water extinguishes fire."</em>
              </p>
              <p className="text-slate-400 text-xs mb-6">— Tirmidhi 2616</p>
              <p className="text-slate-300 text-sm">
                Use the account details above to make your contribution. May Allah accept it and multiply it for you.
              </p>
            </div>
          </div>

          {/* ── Footer ── */}
          <div className="text-center pb-6">
            <div className="inline-flex items-center gap-2 text-amber-400/40 text-xs">
              <span>☽</span>
              <span>Hamduk Islamic Foundation · Ramadan Kareem</span>
              <span>☽</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
