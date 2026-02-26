'use client';

import { useState, useRef } from 'react';
import {
  Moon, CheckCircle2, ChevronRight, ChevronLeft,
  Building2, Users, User, BookOpen,
  AlertCircle, Loader2, ImagePlus, X,
  Shield, Send, Globe, Instagram, Mail, Trophy, Star,
} from 'lucide-react';
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// ─── Types ────────────────────────────────────────────────────────────────────
interface Female {
  full_name:   string;
  age:         string;
  phone:       string;
  is_competitor: boolean; // only one will be true
}

interface FormData {
  mosque_name:      string;
  mosque_address:   string;
  mosque_lga:       string;
  mosque_state:     string;
  mosque_phone:     string;
  mosque_email:     string;
  mosque_website:   string;
  mosque_instagram: string;
  mosque_facebook:  string;
  logo_url:         string;
  contact_name:     string;
  contact_phone:    string;
  contact_email:    string;
  contact_role:     string;
  ustaz1_name:      string;
  ustaz1_phone:     string;
  ustaz1_email:     string;
  ustaz2_name:      string;
  ustaz2_phone:     string;
  ustaz2_email:     string;
  females:          Female[];   // 6 females, index 0 is always the competitor
  agree_terms:      boolean;
  agree_rules:      boolean;
}

// ─── Static ───────────────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

const STEPS = [
  { id: 1, label: 'Mosque',      icon: '🕌' },
  { id: 2, label: 'Contact',     icon: '📞' },
  { id: 3, label: 'Competitor',  icon: '🏆' },
  { id: 4, label: 'Team',        icon: '👥' },
  { id: 5, label: 'Scholars',    icon: '📚' },
  { id: 6, label: 'Review',      icon: '✅' },
];

// ─── Design ───────────────────────────────────────────────────────────────────
const G = {
  gold:   '#d4af37',
  goldDim:'#d4af3760',
  green:  '#15803d',
  bg:     '#060d1a',
  card:   '#0f1930',
  input:  'rgba(255,255,255,0.05)',
  border: 'rgba(255,255,255,0.1)',
  text:   '#f1f5f9',
  muted:  '#94a3b8',
};

// ─── Default form ─────────────────────────────────────────────────────────────
function defaultForm(): FormData {
  return {
    mosque_name: '', mosque_address: '', mosque_lga: '', mosque_state: '',
    mosque_phone: '', mosque_email: '', mosque_website: '', mosque_instagram: '',
    mosque_facebook: '', logo_url: '',
    contact_name: '', contact_phone: '', contact_email: '', contact_role: '',
    ustaz1_name: '', ustaz1_phone: '', ustaz1_email: '',
    ustaz2_name: '', ustaz2_phone: '', ustaz2_email: '',
    females: Array.from({ length: 6 }, (_, i) => ({
      full_name: '', age: '', phone: '', is_competitor: i === 0,
    })),
    agree_terms: false, agree_rules: false,
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function digitsOnly(v: string) { return v.replace(/\D/g, '').slice(0, 11); }
function isEmail(v: string)    { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); }
function genCode(name: string) {
  const p = name.replace(/\s+/g,'').slice(0,3).toUpperCase() || 'MSQ';
  const r = Math.random().toString(36).slice(2,6).toUpperCase();
  return `HIF${new Date().getFullYear().toString().slice(2)}-${p}-${r}`;
}

// ─── Tiny UI atoms ────────────────────────────────────────────────────────────
const Label = ({ children, req }: { children: React.ReactNode; req?: boolean }) => (
  <p className="text-xs font-semibold uppercase tracking-widest mb-1.5 flex gap-1" style={{ color: G.muted }}>
    {children}{req && <span style={{ color: '#f87171' }}>*</span>}
  </p>
);

const Err = ({ msg }: { msg?: string }) =>
  msg ? (
    <p className="flex items-center gap-1 text-xs mt-1" style={{ color: '#f87171' }}>
      <AlertCircle className="w-3 h-3 shrink-0" />{msg}
    </p>
  ) : null;

// Standard text input
function TInput({
  value, onChange, placeholder, type = 'text', err, icon,
}: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; err?: string; icon?: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40 pointer-events-none">{icon}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl py-3 text-sm outline-none transition-all"
          style={{
            background:   G.input,
            border:       `1px solid ${err ? '#f87171' : focused ? G.gold + '88' : G.border}`,
            color:        G.text,
            paddingLeft:  icon ? '2.25rem' : '1rem',
            paddingRight: '1rem',
            boxShadow:    focused ? `0 0 0 3px ${err ? '#f8717118' : G.gold + '18'}` : 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <Err msg={err} />
    </div>
  );
}

// Phone input — digits only, live counter
function PhoneInput({ value, onChange, err }: { value: string; onChange: (v: string) => void; err?: string }) {
  const [focused, setFocused] = useState(false);
  const digits = digitsOnly(value);
  return (
    <div>
      <div className="relative">
        <input
          type="tel"
          inputMode="numeric"
          value={digits}
          onChange={e => onChange(digitsOnly(e.target.value))}
          placeholder="e.g. 08012345678"
          maxLength={11}
          className="w-full rounded-xl py-3 pl-4 text-sm outline-none transition-all"
          style={{
            background:   G.input,
            border:       `1px solid ${err ? '#f87171' : focused ? G.gold + '88' : G.border}`,
            color:        G.text,
            paddingRight: '3.5rem',
            boxShadow:    focused ? `0 0 0 3px ${G.gold}18` : 'none',
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums"
          style={{ color: digits.length === 11 ? '#34d399' : G.muted }}>
          {digits.length === 11 ? '✓' : `${digits.length}/11`}
        </span>
      </div>
      <Err msg={err} />
    </div>
  );
}

function SelectState({ value, onChange, err }: { value: string; onChange: (v: string) => void; err?: string }) {
  return (
    <div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl px-4 py-3 text-sm outline-none border appearance-none cursor-pointer"
        style={{
          background: G.input,
          border:     `1px solid ${err ? '#f87171' : G.border}`,
          color:      value ? G.text : G.muted,
        }}
      >
        <option value="" disabled style={{ color: G.muted, background: '#0f1930' }}>Select your state</option>
        {NIGERIAN_STATES.map(s => (
          <option key={s} value={s} style={{ background: '#0f1930', color: G.text }}>{s}</option>
        ))}
      </select>
      <Err msg={err} />
    </div>
  );
}

// Card wrapper
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl p-5 ${className ?? ''}`}
      style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${G.border}` }}>
      {children}
    </div>
  );
}

// Gold info banner
function InfoBanner({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-start gap-2.5 rounded-xl px-4 py-3"
      style={{ background: '#d4af3710', border: '1px solid #d4af3728' }}>
      <span className="text-base shrink-0">{icon}</span>
      <p className="text-sm leading-relaxed" style={{ color: '#fde68a' }}>{text}</p>
    </div>
  );
}

// Section title
function STitle({ emoji, title, sub }: { emoji: string; title: string; sub?: string }) {
  return (
    <div className="mb-5">
      <div className="flex items-center gap-2.5 mb-1">
        <span className="text-xl">{emoji}</span>
        <h2 className="text-lg font-bold" style={{ color: G.text, fontFamily: 'Georgia,serif' }}>{title}</h2>
      </div>
      {sub && <p className="text-sm ml-9" style={{ color: G.muted }}>{sub}</p>}
    </div>
  );
}

// Step indicator (simplified)
function Steps({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-between px-1">
      {STEPS.map((s, i) => {
        const done   = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-1 shrink-0">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                style={{
                  background: done   ? 'linear-gradient(135deg,#92400e,#d4af37)'
                            : active ? '#d4af3722'
                            : 'rgba(255,255,255,0.04)',
                  border:     `2px solid ${done || active ? G.gold : G.border}`,
                  boxShadow:  active ? `0 0 14px ${G.goldDim}` : 'none',
                  color:      done ? '#0c1a2e' : active ? G.gold : G.muted,
                }}
              >
                {done ? '✓' : s.icon}
              </div>
              <span className="text-center leading-tight font-medium"
                style={{ fontSize: '9px', color: active ? G.gold : G.muted, maxWidth: '44px' }}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 mb-4 rounded-full transition-all duration-500"
                style={{ background: done ? `linear-gradient(90deg,${G.gold},${G.goldDim})` : G.border }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Review row
function RRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start gap-3 py-2 border-b last:border-0"
      style={{ borderColor: G.border }}>
      <span className="text-xs shrink-0" style={{ color: G.muted }}>{label}</span>
      <span className="text-sm font-medium text-right" style={{ color: G.text }}>{value}</span>
    </div>
  );
}

// Logo uploader
function LogoUpload({ preview, uploading, onUpload, onClear }:
  { preview: string; uploading: boolean; onUpload: (f: File) => void; onClear: () => void }) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div>
      <Label>Mosque Logo / Photo <span style={{ color: G.muted, textTransform: 'none', fontSize: '11px', fontWeight: 400 }}>(optional)</span></Label>
      {preview ? (
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2" style={{ borderColor: G.goldDim }}>
          <img src={preview} alt="logo" className="w-full h-full object-cover" />
          <button onClick={onClear} type="button"
            className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)' }}>
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          className="w-full rounded-2xl py-7 border-2 border-dashed flex flex-col items-center gap-2 transition-all"
          style={{ borderColor: G.goldDim, background: 'rgba(212,175,55,0.04)' }}>
          {uploading
            ? <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
            : <ImagePlus className="w-6 h-6" style={{ color: G.goldDim }} />
          }
          <p className="text-sm" style={{ color: G.muted }}>
            {uploading ? 'Uploading…' : 'Tap to upload (PNG/JPG, optional)'}
          </p>
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) onUpload(f); }} />
    </div>
  );
}

// ─── Send emails (fire-and-forget) ───────────────────────────────────────────
async function sendEmails(form: FormData, code: string) {
  const targets: { email: string; name: string; role: string }[] = [];
  if (form.contact_email)  targets.push({ email: form.contact_email,  name: form.contact_name,  role: 'Contact Representative' });
  if (form.ustaz1_email)   targets.push({ email: form.ustaz1_email,   name: form.ustaz1_name,   role: 'Ustaz (1st)' });
  if (form.ustaz2_email)   targets.push({ email: form.ustaz2_email,   name: form.ustaz2_name,   role: 'Ustaz (2nd)' });
  if (form.mosque_email)   targets.push({ email: form.mosque_email,   name: form.mosque_name,   role: 'Mosque' });
  if (targets.length === 0) return;
  await fetch('/api/mosque-registration/confirm-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targets, mosque_name: form.mosque_name, reg_code: code,
      contact_name: form.contact_name, contact_phone: form.contact_phone,
      ustaz_name: form.ustaz1_name, competitors: form.females, state: form.mosque_state,
    }),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export default function MosqueRegistrationPage() {
  const [step,     setStep]     = useState(1);
  const [form,     setForm]     = useState<FormData>(defaultForm);
  const [errs,     setErrs]     = useState<Record<string, string>>({});
  const [femErrs,  setFemErrs]  = useState<Partial<{ full_name: string; age: string }>[]>(Array(6).fill({}));
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [code,     setCode]     = useState('');
  const [logoPrev, setLogoPrev] = useState('');
  const [logoLoad, setLogoLoad] = useState(false);

  // ── Field helpers ────────────────────────────────────────────────────────
  function set<K extends keyof FormData>(k: K, v: FormData[K]) {
    setForm(p => ({ ...p, [k]: v }));
    setErrs(p => { const n = { ...p }; delete n[k as string]; return n; });
  }

  function setFem(i: number, k: keyof Female, v: string) {
    setForm(p => {
      const f = [...p.females];
      f[i] = { ...f[i], [k]: v };
      return { ...p, females: f };
    });
    setFemErrs(p => {
      const n = [...p]; n[i] = { ...n[i] }; delete (n[i] as any)[k]; return n;
    });
  }

  // ── Logo upload ──────────────────────────────────────────────────────────
  async function uploadLogo(file: File) {
    setLogoLoad(true);
    try {
      const ext  = file.name.split('.').pop();
      const path = `mosque-logos/${Date.now()}.${ext}`;
      const { data, error } = await supabase.storage.from('registrations').upload(path, file, { upsert: false });
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('registrations').getPublicUrl(data.path);
      set('logo_url', publicUrl);
      setLogoPrev(URL.createObjectURL(file));
    } catch { setErrs(p => ({ ...p, logo: 'Upload failed — please try again' })); }
    finally   { setLogoLoad(false); }
  }

  // ── Validation per step ──────────────────────────────────────────────────
  function validate(s: number): boolean {
    const e: Record<string, string> = {};

    if (s === 1) {
      if (!form.mosque_name.trim())    e.mosque_name    = 'Mosque name is required';
      if (!form.mosque_address.trim()) e.mosque_address = 'Address is required';
      if (!form.mosque_lga.trim())     e.mosque_lga     = 'LGA is required';
      if (!form.mosque_state)          e.mosque_state   = 'Please select a state';
      if (!form.mosque_phone.trim())   e.mosque_phone   = 'Phone number is required';
      if (form.mosque_phone && digitsOnly(form.mosque_phone).length < 10) e.mosque_phone = 'Enter a valid Nigerian phone number';
      if (form.mosque_email && !isEmail(form.mosque_email)) e.mosque_email = 'Enter a valid email address';
    }

    if (s === 2) {
      if (!form.contact_name.trim())  e.contact_name  = 'Full name is required';
      if (!form.contact_phone.trim()) e.contact_phone = 'Phone number is required';
      if (form.contact_phone && digitsOnly(form.contact_phone).length < 10) e.contact_phone = 'Enter a valid phone number';
      if (!form.contact_role.trim())  e.contact_role  = 'Please enter their role or position';
      if (form.contact_email && !isEmail(form.contact_email)) e.contact_email = 'Enter a valid email address';
    }

    if (s === 3) {
      // Only validate the competitor (index 0)
      const c = form.females[0];
      const fe = [...femErrs];
      fe[0] = {};
      if (!c.full_name.trim()) fe[0].full_name = 'Required';
      if (!c.age.trim())       fe[0].age       = 'Required';
      setFemErrs(fe);
      if (Object.keys(fe[0]).length > 0) return false;
    }

    if (s === 4) {
      // Validate the 5 supporting females (index 1–5)
      const fe = [...femErrs];
      let anyErr = false;
      for (let i = 1; i <= 5; i++) {
        fe[i] = {};
        if (!form.females[i].full_name.trim()) { fe[i].full_name = 'Required'; anyErr = true; }
        if (!form.females[i].age.trim())       { fe[i].age       = 'Required'; anyErr = true; }
      }
      setFemErrs(fe);
      if (anyErr) return false;
    }

    if (s === 5) {
      if (!form.ustaz1_name.trim())  e.ustaz1_name  = 'Ustaz name is required';
      if (!form.ustaz1_phone.trim()) e.ustaz1_phone = 'Phone number is required';
      if (form.ustaz1_phone && digitsOnly(form.ustaz1_phone).length < 10) e.ustaz1_phone = 'Enter a valid phone number';
      if (form.ustaz1_email && !isEmail(form.ustaz1_email)) e.ustaz1_email = 'Enter a valid email address';
      if (!form.ustaz2_name.trim())  e.ustaz2_name  = 'Second Ustaz name is required';
      if (!form.ustaz2_phone.trim()) e.ustaz2_phone = 'Phone number is required';
      if (form.ustaz2_phone && digitsOnly(form.ustaz2_phone).length < 10) e.ustaz2_phone = 'Enter a valid phone number';
      if (form.ustaz2_email && !isEmail(form.ustaz2_email)) e.ustaz2_email = 'Enter a valid email address';
    }

    setErrs(e);
    return Object.keys(e).length === 0;
  }

  const next = () => { if (validate(step)) setStep(s => s + 1); };
  const back = () => setStep(s => Math.max(1, s - 1));

  // ── Submit ───────────────────────────────────────────────────────────────
  async function handleSubmit() {
    if (!form.agree_terms || !form.agree_rules) {
      setErrs({ agree: 'Please tick both boxes before submitting.' });
      return;
    }
    setSubmitting(true);
    const newCode = genCode(form.mosque_name);
    try {
      const { error } = await supabase.from('mosque_registrations').insert({
        registration_code:  newCode,
        mosque_name:        form.mosque_name,
        mosque_address:     form.mosque_address,
        mosque_lga:         form.mosque_lga,
        mosque_state:       form.mosque_state,
        mosque_phone:       digitsOnly(form.mosque_phone),
        mosque_email:       form.mosque_email   || null,
        mosque_website:     form.mosque_website  || null,
        mosque_instagram:   form.mosque_instagram || null,
        mosque_facebook:    form.mosque_facebook  || null,
        logo_url:           form.logo_url         || null,
        contact_name:       form.contact_name,
        contact_phone:      digitsOnly(form.contact_phone),
        contact_email:      form.contact_email   || null,
        contact_role:       form.contact_role,
        ustaz_name:         form.ustaz1_name,
        ustaz_phone:        digitsOnly(form.ustaz1_phone),
        ustaz_email:        form.ustaz1_email    || null,
        extra_person_name:  form.ustaz2_name     || null,
        extra_person_phone: digitsOnly(form.ustaz2_phone) || null,
        extra_person_email: form.ustaz2_email    || null,
        extra_person_role:  'Ustaz (2nd)',
        competitors:        form.females,
        status:             'pending',
        submitted_at:       new Date().toISOString(),
      });
      if (error) throw error;
      // Fire emails non-blocking — never block success screen for email failures
      sendEmails(form, newCode).catch(console.error);
      setCode(newCode);
      setSubmitted(true);
    } catch (err) {
      console.error('[submit]', err);
      setErrs({ submit: 'Could not save your registration. Please check your internet and try again.' });
    } finally {
      setSubmitting(false);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // SUCCESS SCREEN
  // ─────────────────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12"
        style={{ background: 'linear-gradient(160deg,#060d1a,#0f172a,#130a05)' }}>
        {/* Glows */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-24 right-0 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
          <div className="absolute bottom-0 -left-24 w-72 h-72 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
        </div>

        <div className="relative max-w-md w-full space-y-5">
          {/* Big tick */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', boxShadow: '0 0 40px #d4af3766' }}>
              <CheckCircle2 className="w-10 h-10" style={{ color: '#0c1a2e' }} />
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: G.goldDim }}>Registration Complete</p>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Georgia,serif' }}>
              Baarakallahu Feekum! 🌙
            </h1>
            <p className="text-sm" style={{ color: G.muted }}>
              <span className="font-semibold" style={{ color: '#fde68a' }}>{form.mosque_name}</span> has been registered for the HIF Quiz Programme.
            </p>
          </div>

          {logoPrev && (
            <div className="flex justify-center">
              <img src={logoPrev} alt="Mosque" className="w-16 h-16 rounded-2xl object-cover border-2" style={{ borderColor: G.gold }} />
            </div>
          )}

          {/* Code card */}
          <div className="rounded-2xl p-5 text-center space-y-3"
            style={{ background: G.card, border: '1px solid #d4af3744' }}>
            <div className="h-px" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
            <p className="text-xs font-bold tracking-widest uppercase mt-3" style={{ color: G.muted }}>Your Registration Code</p>
            <p className="text-2xl font-bold tracking-widest" style={{ color: G.gold, fontFamily: 'Georgia,serif' }}>{code}</p>
            <p className="text-xs" style={{ color: G.muted }}>Keep this safe. Confirmation emails have been sent.</p>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="text-xs px-5 py-2 rounded-full font-semibold transition-all"
              style={{ background: '#d4af3715', border: '1px solid #d4af3744', color: G.gold }}>
              📋 Copy Code
            </button>
            <div className="h-px mt-2" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
          </div>

          {/* Next steps */}
          <Card>
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>What Happens Next</p>
            {[
              'Confirmation emails sent to all addresses provided.',
              'Our team will review and contact you within 48 hours.',
              'You will be called on the phone numbers provided.',
              'All 8 participants must be present on the quiz day.',
            ].map((t, i) => (
              <div key={i} className="flex items-start gap-2.5 py-1.5">
                <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5"
                  style={{ background: '#d4af3720', color: G.gold, border: '1px solid #d4af3740' }}>
                  {i + 1}
                </div>
                <p className="text-sm leading-relaxed" style={{ color: G.text }}>{t}</p>
              </div>
            ))}
          </Card>

          {/* WhatsApp */}
          <button
            onClick={() => {
              const txt = encodeURIComponent(
                `🕌 *Mosque Quiz Registered!*\n\nMosque: ${form.mosque_name}\nState: ${form.mosque_state}\nCode: *${code}*\n\nAlhamdulillah — registered for the HIF Knowledge Quiz Programme! 🌙`
              );
              window.open(`https://wa.me/?text=${txt}`, '_blank');
            }}
            className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            style={{ background: '#25D36618', border: '1px solid #25D36640', color: '#25D366' }}>
            📲 Share on WhatsApp
          </button>

          <p className="text-center text-xs" style={{ color: '#d4af3730' }}>
            🌙 Hamduk Islamic Foundation · Quiz Programme
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // FORM
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg,#060d1a,#0f172a,#130a05)' }}>
      {/* Islamic pattern */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" aria-hidden>
        <svg width="100%" height="100%">
          <defs>
            <pattern id="ip" width="70" height="70" patternUnits="userSpaceOnUse">
              <polygon points="35,3 43,25 65,25 47,38 54,60 35,47 16,60 23,38 5,25 27,25"
                fill="none" stroke="#d4af37" strokeWidth="0.7" />
              <circle cx="35" cy="35" r="4" fill="none" stroke="#d4af37" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ip)" />
        </svg>
      </div>
      {/* Glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
      </div>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-10 space-y-6">

        {/* ── Header ── */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold tracking-widest uppercase" style={{ color: G.goldDim }}>Hamduk Islamic Foundation</p>
          <h1 className="text-3xl font-bold" style={{ fontFamily: 'Georgia,serif', color: G.text }}>
            Mosque <span style={{ color: G.gold }}>Quiz Registration</span>
          </h1>
          <p className="text-sm" style={{ color: G.muted }}>
            Fill in your mosque details step by step. Takes about 5 minutes.
          </p>
        </div>

        {/* ── Team summary badges ── */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { emoji: '🏆', count: '1',  label: 'Competitor',  color: G.gold  },
            { emoji: '🧕', count: '5',  label: 'Supporters',  color: '#ec4899' },
            { emoji: '📚', count: '2',  label: 'Ustaz',       color: '#60a5fa' },
            { emoji: '👥', count: '8',  label: 'Total',       color: '#34d399' },
          ].map(b => (
            <div key={b.label} className="rounded-2xl p-2.5 text-center"
              style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${b.color}30` }}>
              <div className="text-xl mb-0.5">{b.emoji}</div>
              <p className="text-base font-bold" style={{ color: b.color }}>{b.count}</p>
              <p className="text-xs" style={{ color: G.muted }}>{b.label}</p>
            </div>
          ))}
        </div>

        {/* ── Step tracker ── */}
        <div className="rounded-2xl p-4" style={{ background: G.card, border: `1px solid ${G.border}` }}>
          <Steps current={step} />
          <div className="mt-3">
            <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg,#92400e,#d4af37)' }} />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs" style={{ color: G.muted }}>Step {step} of {STEPS.length}</span>
              <span className="text-xs font-medium" style={{ color: G.gold }}>{STEPS[step - 1].label}</span>
            </div>
          </div>
        </div>

        {/* ── Form card ── */}
        <div className="rounded-3xl overflow-hidden" style={{ background: G.card, border: `1px solid ${G.border}` }}>
          {/* Gold top strip */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

          <div className="p-6 space-y-5">

            {/* ════ STEP 1: Mosque Info ════ */}
            {step === 1 && (
              <>
                <STitle emoji="🕌" title="Mosque Information" sub="Tell us about your mosque" />

                <LogoUpload preview={logoPrev} uploading={logoLoad} onUpload={uploadLogo}
                  onClear={() => { setLogoPrev(''); set('logo_url', ''); }} />
                {errs.logo && <Err msg={errs.logo} />}

                <div>
                  <Label req>Mosque Name</Label>
                  <TInput value={form.mosque_name} onChange={v => set('mosque_name', v)}
                    placeholder="e.g. Central Masjid Ikeja" err={errs.mosque_name} />
                </div>

                <div>
                  <Label req>Full Address</Label>
                  <TInput value={form.mosque_address} onChange={v => set('mosque_address', v)}
                    placeholder="Street, area, nearest landmark" err={errs.mosque_address} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label req>LGA</Label>
                    <TInput value={form.mosque_lga} onChange={v => set('mosque_lga', v)}
                      placeholder="e.g. Ikeja" err={errs.mosque_lga} />
                  </div>
                  <div>
                    <Label req>State</Label>
                    <SelectState value={form.mosque_state} onChange={v => set('mosque_state', v)} err={errs.mosque_state} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label req>Mosque Phone</Label>
                    <PhoneInput value={form.mosque_phone} onChange={v => set('mosque_phone', v)} err={errs.mosque_phone} />
                  </div>
                  <div>
                    <Label>Email <span style={{ color: G.muted, textTransform: 'none', fontSize: '11px' }}>(optional)</span></Label>
                    <TInput value={form.mosque_email} onChange={v => set('mosque_email', v)}
                      placeholder="mosque@email.com" type="email" err={errs.mosque_email}
                      icon={<Mail className="w-3.5 h-3.5" />} />
                  </div>
                </div>

                {/* Social — collapsible feel with subtle card */}
                <div className="rounded-xl p-4 space-y-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${G.border}` }}>
                  <p className="text-xs font-bold tracking-widest uppercase" style={{ color: G.goldDim }}>
                    Social Media & Website <span style={{ fontWeight: 400 }}>(all optional)</span>
                  </p>
                  <div>
                    <Label>Website</Label>
                    <TInput value={form.mosque_website} onChange={v => set('mosque_website', v)}
                      placeholder="https://yourmasjid.org" icon={<Globe className="w-3.5 h-3.5" />} />
                  </div>
                  <div>
                    <Label>Instagram</Label>
                    <TInput value={form.mosque_instagram} onChange={v => set('mosque_instagram', v)}
                      placeholder="@yourmasjid" icon={<Instagram className="w-3.5 h-3.5" />} />
                  </div>
                  <div>
                    <Label>Facebook</Label>
                    <TInput value={form.mosque_facebook} onChange={v => set('mosque_facebook', v)}
                      placeholder="facebook.com/yourmasjid" icon={<Globe className="w-3.5 h-3.5" />} />
                  </div>
                </div>
              </>
            )}

            {/* ════ STEP 2: Contact Rep ════ */}
            {step === 2 && (
              <>
                <STitle emoji="📞" title="Contact Representative"
                  sub="Who should we call or email about this registration?" />

                <InfoBanner icon="ℹ️" text="This is the person we will contact with programme updates, venue details, and confirmation." />

                <div>
                  <Label req>Full Name</Label>
                  <TInput value={form.contact_name} onChange={v => set('contact_name', v)}
                    placeholder="e.g. Alhaji Musa Ibrahim" err={errs.contact_name} />
                </div>

                <div>
                  <Label req>Role / Position</Label>
                  <TInput value={form.contact_role} onChange={v => set('contact_role', v)}
                    placeholder="e.g. Chief Imam, Secretary, Coordinator" err={errs.contact_role} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label req>Phone Number</Label>
                    <PhoneInput value={form.contact_phone} onChange={v => set('contact_phone', v)} err={errs.contact_phone} />
                  </div>
                  <div>
                    <Label>Email <span style={{ color: G.muted, fontSize: '11px', textTransform: 'none' }}>(optional)</span></Label>
                    <TInput value={form.contact_email} onChange={v => set('contact_email', v)}
                      placeholder="email@example.com" type="email" err={errs.contact_email}
                      icon={<Mail className="w-3.5 h-3.5" />} />
                  </div>
                </div>
              </>
            )}

            {/* ════ STEP 3: The ONE Competitor ════ */}
            {step === 3 && (
              <>
                <STitle emoji="🏆" title="The Quiz Competitor"
                  sub="Only 1 female participant will actually compete in the quiz" />

                <InfoBanner icon="🏆"
                  text="This is the lady who will sit and answer quiz questions on stage. She represents your entire mosque." />

                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', color: '#0c1a2e' }}>
                      1
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: G.gold, fontFamily: 'Georgia,serif' }}>Quiz Competitor</p>
                      <p className="text-xs" style={{ color: G.muted }}>The lady who will answer the questions</p>
                    </div>
                    <div className="ml-auto px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{ background: '#d4af3720', color: G.gold, border: '1px solid #d4af3740' }}>
                      COMPETITOR
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <Label req>Full Name</Label>
                      <TInput value={form.females[0].full_name}
                        onChange={v => setFem(0, 'full_name', v)}
                        placeholder="e.g. Fatima Abdullahi"
                        err={femErrs[0]?.full_name} />
                    </div>
                    <div>
                      <Label req>Age</Label>
                      <TInput value={form.females[0].age}
                        onChange={v => setFem(0, 'age', v)}
                        placeholder="e.g. 42" type="number"
                        err={femErrs[0]?.age} />
                    </div>
                    <div>
                      <Label>Phone <span style={{ color: G.muted, fontSize: '11px', textTransform: 'none' }}>(optional)</span></Label>
                      <PhoneInput value={form.females[0].phone}
                        onChange={v => setFem(0, 'phone', v)} />
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ════ STEP 4: 5 Supporting Females ════ */}
            {step === 4 && (
              <>
                <STitle emoji="🧕" title="Supporting Female Members"
                  sub="5 female members who will accompany the competitor — they do not compete" />

                <InfoBanner icon="🧕"
                  text="These 5 ladies attend and support the competitor but will not answer quiz questions." />

                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Card key={i}>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                          style={{ background: 'rgba(236,72,153,0.15)', color: '#ec4899', border: '1px solid #ec489930' }}>
                          {i + 1}
                        </div>
                        <p className="text-sm font-semibold" style={{ color: G.muted }}>Supporting Member {i}</p>
                        <span className="ml-auto text-xs px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid #ec489925' }}>
                          Non-competing
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-1">
                          <Label req>Full Name</Label>
                          <TInput value={form.females[i].full_name}
                            onChange={v => setFem(i, 'full_name', v)}
                            placeholder="Full name"
                            err={femErrs[i]?.full_name} />
                        </div>
                        <div>
                          <Label req>Age</Label>
                          <TInput value={form.females[i].age}
                            onChange={v => setFem(i, 'age', v)}
                            placeholder="Age" type="number"
                            err={femErrs[i]?.age} />
                        </div>
                        <div>
                          <Label>Phone <span style={{ color: G.muted, fontSize: '11px', textTransform: 'none' }}>(optional)</span></Label>
                          <PhoneInput value={form.females[i].phone}
                            onChange={v => setFem(i, 'phone', v)} />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* ════ STEP 5: 2 Ustaz ════ */}
            {step === 5 && (
              <>
                <STitle emoji="📚" title="Islamic Scholars (Ustaz)"
                  sub="Two Ustaz must accompany the team on the day of the programme" />

                <InfoBanner icon="📚" text="Both Ustaz are required to be present at the venue on the day of the quiz." />

                {/* Ustaz 1 */}
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid #60a5fa30' }}>
                      1
                    </div>
                    <p className="font-bold text-sm" style={{ color: '#60a5fa' }}>First Ustaz</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label req>Full Name</Label>
                      <TInput value={form.ustaz1_name} onChange={v => set('ustaz1_name', v)}
                        placeholder="e.g. Sheikh Abdullahi Hassan" err={errs.ustaz1_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label req>Phone</Label>
                        <PhoneInput value={form.ustaz1_phone} onChange={v => set('ustaz1_phone', v)} err={errs.ustaz1_phone} />
                      </div>
                      <div>
                        <Label>Email <span style={{ color: G.muted, fontSize: '11px', textTransform: 'none' }}>(optional)</span></Label>
                        <TInput value={form.ustaz1_email} onChange={v => set('ustaz1_email', v)}
                          placeholder="email@example.com" type="email" err={errs.ustaz1_email}
                          icon={<Mail className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Ustaz 2 */}
                <Card>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid #60a5fa30' }}>
                      2
                    </div>
                    <p className="font-bold text-sm" style={{ color: '#60a5fa' }}>Second Ustaz</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Label req>Full Name</Label>
                      <TInput value={form.ustaz2_name} onChange={v => set('ustaz2_name', v)}
                        placeholder="e.g. Mallam Ibrahim Yusuf" err={errs.ustaz2_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label req>Phone</Label>
                        <PhoneInput value={form.ustaz2_phone} onChange={v => set('ustaz2_phone', v)} err={errs.ustaz2_phone} />
                      </div>
                      <div>
                        <Label>Email <span style={{ color: G.muted, fontSize: '11px', textTransform: 'none' }}>(optional)</span></Label>
                        <TInput value={form.ustaz2_email} onChange={v => set('ustaz2_email', v)}
                          placeholder="email@example.com" type="email" err={errs.ustaz2_email}
                          icon={<Mail className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                  </div>
                </Card>
              </>
            )}

            {/* ════ STEP 6: Review & Submit ════ */}
            {step === 6 && (
              <>
                <STitle emoji="✅" title="Review & Submit"
                  sub="Check everything below before you submit — you cannot make changes after" />

                {/* Mosque */}
                <Card>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>🕌 Mosque</p>
                  {logoPrev && <img src={logoPrev} alt="logo" className="w-12 h-12 rounded-xl object-cover mb-3 border-2" style={{ borderColor: G.goldDim }} />}
                  <RRow label="Name"      value={form.mosque_name} />
                  <RRow label="Address"   value={form.mosque_address} />
                  <RRow label="LGA"       value={form.mosque_lga} />
                  <RRow label="State"     value={form.mosque_state} />
                  <RRow label="Phone"     value={digitsOnly(form.mosque_phone)} />
                  <RRow label="Email"     value={form.mosque_email} />
                  <RRow label="Website"   value={form.mosque_website} />
                  <RRow label="Instagram" value={form.mosque_instagram} />
                  <RRow label="Facebook"  value={form.mosque_facebook} />
                </Card>

                {/* Contact */}
                <Card>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>📞 Contact Person</p>
                  <RRow label="Name"  value={form.contact_name} />
                  <RRow label="Role"  value={form.contact_role} />
                  <RRow label="Phone" value={digitsOnly(form.contact_phone)} />
                  <RRow label="Email" value={form.contact_email} />
                </Card>

                {/* Competitor */}
                <Card>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>🏆 Quiz Competitor</p>
                  <div className="inline-flex items-center gap-1.5 mb-3 px-2 py-1 rounded-full text-xs font-bold"
                    style={{ background: '#d4af3715', color: G.gold, border: '1px solid #d4af3730' }}>
                    <Trophy className="w-3 h-3" /> Will compete on stage
                  </div>
                  <RRow label="Name"  value={form.females[0].full_name} />
                  <RRow label="Age"   value={form.females[0].age} />
                  <RRow label="Phone" value={form.females[0].phone || '—'} />
                </Card>

                {/* Supporting */}
                <Card>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>🧕 Supporting Members (5)</p>
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${G.border}` }}>
                        <p className="text-xs font-bold mb-1.5" style={{ color: '#ec4899' }}>Member {i}</p>
                        <RRow label="Name"  value={form.females[i].full_name} />
                        <RRow label="Age"   value={form.females[i].age} />
                        <RRow label="Phone" value={form.females[i].phone || '—'} />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Ustaz */}
                <Card>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: G.gold }}>📚 Ustaz (2)</p>
                  <div className="space-y-3">
                    {[
                      { label: '1st Ustaz', name: form.ustaz1_name, phone: digitsOnly(form.ustaz1_phone), email: form.ustaz1_email },
                      { label: '2nd Ustaz', name: form.ustaz2_name, phone: digitsOnly(form.ustaz2_phone), email: form.ustaz2_email },
                    ].map(u => (
                      <div key={u.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${G.border}` }}>
                        <p className="text-xs font-bold mb-1.5" style={{ color: '#60a5fa' }}>{u.label}</p>
                        <RRow label="Name"  value={u.name} />
                        <RRow label="Phone" value={u.phone} />
                        <RRow label="Email" value={u.email} />
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Declarations */}
                <div className="rounded-2xl p-5 space-y-4"
                  style={{ background: 'rgba(212,175,55,0.04)', border: '1px solid rgba(212,175,55,0.2)' }}>
                  <p className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5" style={{ color: G.gold }}>
                    <Shield className="w-3.5 h-3.5" /> Declarations
                  </p>
                  {[
                    { k: 'agree_terms', text: 'All the information I have entered above is true and correct. I understand that false information will lead to disqualification.' },
                    { k: 'agree_rules', text: 'All 8 participants (1 competitor, 5 supporting members, and 2 Ustaz) will be present on the day of the quiz programme.' },
                  ].map(({ k, text }) => (
                    <label key={k} className="flex items-start gap-3 cursor-pointer">
                      <button type="button"
                        onClick={() => set(k as keyof FormData, !(form as any)[k])}
                        className="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={{
                          background: (form as any)[k] ? 'linear-gradient(135deg,#92400e,#d4af37)' : G.input,
                          border:     `1px solid ${(form as any)[k] ? G.gold : G.border}`,
                        }}>
                        {(form as any)[k] && <CheckCircle2 className="w-3 h-3" style={{ color: '#0c1a2e' }} />}
                      </button>
                      <p className="text-sm leading-relaxed" style={{ color: G.text }}>{text}</p>
                    </label>
                  ))}
                  {errs.agree && <Err msg={errs.agree} />}
                </div>

                {/* Submit error */}
                {errs.submit && (
                  <div className="rounded-xl px-4 py-3 flex items-center gap-2"
                    style={{ background: '#f8717115', border: '1px solid #f8717144', color: '#fca5a5' }}>
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <p className="text-sm">{errs.submit}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ── Navigation ── */}
          <div className="px-6 pb-6 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button onClick={back}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${G.border}`, color: G.muted }}>
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : <div />}

            {step < STEPS.length ? (
              <button onClick={next}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', color: '#0c1a2e' }}>
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={submitting}
                className="flex items-center gap-2 px-7 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', color: '#0c1a2e' }}>
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : <><Send className="w-4 h-4" /> Submit Registration</>
                }
              </button>
            )}
          </div>

          {/* Gold bottom strip */}
          <div className="h-1" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
        </div>

        <p className="text-center text-xs pb-4" style={{ color: '#d4af3730' }}>
          🌙 Hamduk Islamic Foundation · Quiz Programme
        </p>
      </div>
    </div>
  );
}
