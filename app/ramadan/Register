'use client';

import { useState, useRef } from 'react';
import {
  Moon, CheckCircle2, ChevronRight, ChevronLeft,
  Building2, Users, User, BookOpen,
  AlertCircle, Loader2, Star, ImagePlus, X,
  Shield, Send, Globe, Instagram, Phone, Mail,
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// ─── Supabase ─────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// ─── Types ────────────────────────────────────────────────────────────────────
interface Competitor {
  full_name: string;
  age:       string;
  phone:     string;
}

interface FormData {
  // Mosque
  mosque_name:     string;
  mosque_address:  string;
  mosque_lga:      string;
  mosque_state:    string;
  mosque_phone:    string;
  mosque_email:    string;
  mosque_website:  string;
  mosque_instagram:string;
  mosque_facebook: string;
  logo_url:        string; // stored after upload to Supabase Storage

  // Contact representative
  contact_name:    string;
  contact_phone:   string;
  contact_email:   string;
  contact_role:    string;

  // Ustaz
  ustaz_name:  string;
  ustaz_phone: string;
  ustaz_email: string;

  // Extra person
  extra_name:  string;
  extra_phone: string;
  extra_email: string;
  extra_role:  string;

  // 4 female competitors
  competitors: Competitor[];

  // Agreements
  agree_terms: boolean;
  agree_rules: boolean;
}

// ─── Static data ──────────────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe','Imo',
  'Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa',
  'Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba',
  'Yobe','Zamfara',
];

const STEPS = [
  { id: 1, title: 'Mosque Info',     icon: Building2,  description: 'Mosque details & socials'  },
  { id: 2, title: 'Contact Rep',     icon: User,        description: 'Primary contact person'    },
  { id: 3, title: 'Participants',    icon: Users,       description: '4 female competitors'      },
  { id: 4, title: 'Ustaz & Extra',   icon: BookOpen,    description: 'Scholar & extra member'    },
  { id: 5, title: 'Review & Submit', icon: Send,        description: 'Confirm & submit'          },
];

// ─── Design tokens (same as rest of app) ─────────────────────────────────────
const T = {
  bg:          'linear-gradient(160deg,#060d1a 0%,#0f172a 40%,#130a05 100%)',
  cardBg:      'linear-gradient(145deg,#0f1e35 0%,#0c1520 100%)',
  cardBorder:  '#d4af3730',
  text:        '#e2e8f0',
  subtext:     '#94a3b8',
  insetBg:     'rgba(255,255,255,0.02)',
  insetBorder: 'rgba(255,255,255,0.08)',
  inputBg:     'rgba(255,255,255,0.04)',
};

// ─── Islamic pattern ──────────────────────────────────────────────────────────
const IslamicPattern = () => (
  <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.035]" aria-hidden>
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="reg-ip" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
          <polygon points="40,4 49,28 74,28 54,44 61,68 40,54 19,68 26,44 6,28 31,28"
            fill="none" stroke="#d4af37" strokeWidth="0.8" />
          <rect x="28" y="28" width="24" height="24" fill="none" stroke="#d4af37"
            strokeWidth="0.5" transform="rotate(45 40 40)" />
          <circle cx="40" cy="40" r="5" fill="none" stroke="#d4af37" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#reg-ip)" />
    </svg>
  </div>
);

// ─── Reusable field components ────────────────────────────────────────────────
const FieldLabel = ({ children, required }: { children: React.ReactNode; required?: boolean }) => (
  <p className="text-xs font-semibold tracking-wide uppercase mb-1.5 flex items-center gap-1" style={{ color: T.subtext }}>
    {children}{required && <span className="text-red-400 text-sm leading-none">*</span>}
  </p>
);

const TextInput = ({
  value, onChange, placeholder, type = 'text', error, prefix,
}: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  type?: string; error?: string; prefix?: React.ReactNode;
}) => (
  <div>
    <div className="relative">
      {prefix && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50">{prefix}</div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl py-3 text-sm outline-none border transition-all placeholder:opacity-30"
        style={{
          background:  T.inputBg,
          border:      error ? '1px solid #f87171' : `1px solid ${T.insetBorder}`,
          color:       T.text,
          paddingLeft: prefix ? '2.25rem' : '1rem',
          paddingRight: '1rem',
          boxShadow:   error ? '0 0 0 3px #f8717118' : 'none',
        }}
        onFocus={(e) => { e.target.style.border = '1px solid #d4af3755'; e.target.style.boxShadow = '0 0 0 3px #d4af3718'; }}
        onBlur={(e)  => { e.target.style.border = error ? '1px solid #f87171' : `1px solid ${T.insetBorder}`; e.target.style.boxShadow = error ? '0 0 0 3px #f8717118' : 'none'; }}
      />
    </div>
    {error && (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" /> {error}
      </p>
    )}
  </div>
);

const SelectInput = ({
  value, onChange, options, placeholder, error,
}: {
  value: string; onChange: (v: string) => void; options: string[]; placeholder?: string; error?: string;
}) => (
  <div>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl px-4 py-3 text-sm outline-none border appearance-none cursor-pointer"
      style={{
        background: T.inputBg,
        border:     error ? '1px solid #f87171' : `1px solid ${T.insetBorder}`,
        color:      value ? T.text : T.subtext,
      }}
    >
      {placeholder && <option value="" disabled style={{ color: T.subtext }}>{placeholder}</option>}
      {options.map((o) => <option key={o} value={o} style={{ background: '#0f1e35', color: T.text }}>{o}</option>)}
    </select>
    {error && (
      <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1">
        <AlertCircle className="w-3 h-3 shrink-0" /> {error}
      </p>
    )}
  </div>
);

// ─── Logo uploader ────────────────────────────────────────────────────────────
const LogoUploader = ({
  onUpload, uploading, preview, onClear,
}: {
  onUpload:  (file: File) => void;
  uploading: boolean;
  preview:   string;
  onClear:   () => void;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <FieldLabel>Mosque Logo / Photo (optional)</FieldLabel>
      {preview ? (
        <div className="relative w-32 h-32 rounded-2xl overflow-hidden border" style={{ border: '1px solid #d4af3744' }}>
          <img src={preview} alt="Mosque logo" className="w-full h-full object-cover" />
          <button
            onClick={onClear}
            className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)' }}
          >
            <X className="w-3 h-3 text-white" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full rounded-2xl border-2 border-dashed py-8 flex flex-col items-center gap-2 transition-all disabled:opacity-50"
          style={{ borderColor: '#d4af3740', background: T.insetBg }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#d4af3799')}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#d4af3740')}
        >
          {uploading ? (
            <Loader2 className="w-7 h-7 text-amber-400 animate-spin" />
          ) : (
            <ImagePlus className="w-7 h-7 text-amber-400/60" />
          )}
          <p className="text-sm font-medium" style={{ color: T.subtext }}>
            {uploading ? 'Uploading…' : 'Tap to upload logo or photo'}
          </p>
          <p className="text-xs" style={{ color: T.subtext }}>PNG, JPG up to 5MB</p>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onUpload(f); }}
      />
    </div>
  );
};

// ─── Step progress bar ────────────────────────────────────────────────────────
const StepProgress = ({ current }: { current: number }) => (
  <div className="flex items-start justify-between w-full">
    {STEPS.map((step, i) => {
      const done = current > step.id, active = current === step.id;
      const Icon = step.icon;
      return (
        <div key={step.id} className="flex items-center flex-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 shrink-0"
              style={{
                background:  done ? 'linear-gradient(135deg,#92400e,#d4af37)' : active ? '#d4af3722' : T.insetBg,
                borderColor: done || active ? '#d4af37' : T.insetBorder,
                boxShadow:   active ? '0 0 16px #d4af3744' : 'none',
              }}
            >
              {done
                ? <CheckCircle2 className="w-4 h-4 text-slate-900" />
                : <Icon className="w-4 h-4" style={{ color: active ? '#d4af37' : T.subtext }} />
              }
            </div>
            <p className="text-center font-semibold leading-tight"
              style={{ color: active ? '#d4af37' : done ? '#d4af3799' : T.subtext, fontSize: '9px', maxWidth: '52px' }}>
              {step.title}
            </p>
          </div>
          {i < STEPS.length - 1 && (
            <div className="flex-1 h-0.5 mx-1 mb-4 transition-all duration-500"
              style={{ background: done ? 'linear-gradient(90deg,#d4af37,#d4af3744)' : T.insetBorder }} />
          )}
        </div>
      );
    })}
  </div>
);

// ─── Section heading ──────────────────────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle }: { icon: any; title: string; subtitle?: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
      style={{ background: '#d4af3718', border: '1px solid #d4af3740' }}>
      <Icon className="w-5 h-5 text-amber-400" />
    </div>
    <div>
      <h3 className="font-bold text-base" style={{ color: T.text, fontFamily: 'Georgia,serif' }}>{title}</h3>
      {subtitle && <p className="text-xs mt-0.5" style={{ color: T.subtext }}>{subtitle}</p>}
    </div>
  </div>
);

// ─── Review row ───────────────────────────────────────────────────────────────
const ReviewRow = ({ label, value }: { label: string; value?: string | null }) =>
  value ? (
    <div className="flex items-start justify-between gap-3 py-2 border-b last:border-0" style={{ borderColor: T.insetBorder }}>
      <p className="text-xs shrink-0" style={{ color: T.subtext }}>{label}</p>
      <p className="text-sm font-medium text-right" style={{ color: T.text }}>{value}</p>
    </div>
  ) : null;

// ─── Default form ─────────────────────────────────────────────────────────────
const defaultForm = (): FormData => ({
  mosque_name: '', mosque_address: '', mosque_lga: '', mosque_state: '',
  mosque_phone: '', mosque_email: '', mosque_website: '', mosque_instagram: '',
  mosque_facebook: '', logo_url: '',
  contact_name: '', contact_phone: '', contact_email: '', contact_role: '',
  ustaz_name: '', ustaz_phone: '', ustaz_email: '',
  extra_name: '', extra_phone: '', extra_email: '', extra_role: '',
  competitors: Array.from({ length: 4 }, () => ({ full_name: '', age: '', phone: '' })),
  agree_terms: false, agree_rules: false,
});

// ─── Email helper — calls our API route ──────────────────────────────────────
async function sendConfirmationEmails(form: FormData, regCode: string) {
  // Collect all emails that were filled in
  const emailTargets: { email: string; name: string; role: string }[] = [];

  if (form.contact_email) {
    emailTargets.push({ email: form.contact_email, name: form.contact_name, role: 'Contact Representative' });
  }
  if (form.ustaz_email) {
    emailTargets.push({ email: form.ustaz_email, name: form.ustaz_name, role: 'Ustaz' });
  }
  if (form.extra_email && form.extra_name) {
    emailTargets.push({ email: form.extra_email, name: form.extra_name, role: form.extra_role || 'Team Member' });
  }
  if (form.mosque_email) {
    emailTargets.push({ email: form.mosque_email, name: form.mosque_name, role: 'Mosque' });
  }

  if (emailTargets.length === 0) return;

  await fetch('/api/mosque-registration/confirm-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      targets:        emailTargets,
      mosque_name:    form.mosque_name,
      reg_code:       regCode,
      contact_name:   form.contact_name,
      contact_phone:  form.contact_phone,
      ustaz_name:     form.ustaz_name,
      competitors:    form.competitors,
      state:          form.mosque_state,
    }),
  });
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function MosqueRegistrationPage() {
  const [step,       setStep]       = useState(1);
  const [form,       setForm]       = useState<FormData>(defaultForm);
  const [errors,     setErrors]     = useState<Record<string, string>>({});
  const [compErrors, setCompErrors] = useState<Partial<Competitor>[]>(Array(4).fill({}));
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [regCode,    setRegCode]    = useState('');
  const [logoPreview,setLogoPreview]= useState('');
  const [logoUploading, setLogoUploading] = useState(false);

  // ── Field setters ─────────────────────────────────────────────────────────
  const setField = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const setCompetitorField = (i: number, field: keyof Competitor, value: string) => {
    setForm((prev) => {
      const comps = [...prev.competitors];
      comps[i] = { ...comps[i], [field]: value };
      return { ...prev, competitors: comps };
    });
    setCompErrors((prev) => {
      const n = [...prev]; n[i] = { ...n[i] }; delete (n[i] as any)[field]; return n;
    });
  };

  // ── Logo upload to Supabase Storage ──────────────────────────────────────
  const handleLogoUpload = async (file: File) => {
    setLogoUploading(true);
    try {
      const ext      = file.name.split('.').pop();
      const fileName = `mosque-logos/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { data, error } = await supabase.storage
        .from('registrations')
        .upload(fileName, file, { cacheControl: '3600', upsert: false });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from('registrations').getPublicUrl(data.path);
      setField('logo_url', publicUrl);
      setLogoPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error('[logo upload]', err);
      setErrors((prev) => ({ ...prev, logo: 'Upload failed. Please try again.' }));
    } finally {
      setLogoUploading(false);
    }
  };

  // ── Per-step validation ───────────────────────────────────────────────────
  const validateStep = (s: number): boolean => {
    const e: Record<string, string> = {};

    if (s === 1) {
      if (!form.mosque_name.trim())    e.mosque_name    = 'Mosque name is required';
      if (!form.mosque_address.trim()) e.mosque_address = 'Address is required';
      if (!form.mosque_lga.trim())     e.mosque_lga     = 'LGA is required';
      if (!form.mosque_state)          e.mosque_state   = 'Please select a state';
      if (!form.mosque_phone.trim())   e.mosque_phone   = 'Mosque phone is required';
      if (form.mosque_email && !/\S+@\S+\.\S+/.test(form.mosque_email))
        e.mosque_email = 'Enter a valid email';
    }

    if (s === 2) {
      if (!form.contact_name.trim())  e.contact_name  = 'Full name is required';
      if (!form.contact_phone.trim()) e.contact_phone = 'Phone number is required';
      if (!form.contact_role.trim())  e.contact_role  = 'Role / position is required';
      if (form.contact_email && !/\S+@\S+\.\S+/.test(form.contact_email))
        e.contact_email = 'Enter a valid email';
    }

    if (s === 3) {
      const ce: Partial<Competitor>[] = form.competitors.map((c) => {
        const err: Partial<Competitor> = {};
        if (!c.full_name.trim()) err.full_name = 'Required';
        if (!c.age.trim())       err.age       = 'Required';
        return err;
      });
      const anyError = ce.some((c) => Object.keys(c).length > 0);
      if (anyError) { setCompErrors(ce); return false; }
    }

    if (s === 4) {
      if (!form.ustaz_name.trim())  e.ustaz_name  = 'Ustaz name is required';
      if (!form.ustaz_phone.trim()) e.ustaz_phone = 'Ustaz phone is required';
      if (form.ustaz_email && !/\S+@\S+\.\S+/.test(form.ustaz_email))
        e.ustaz_email = 'Enter a valid email';
      if (form.extra_email && !/\S+@\S+\.\S+/.test(form.extra_email))
        e.extra_email = 'Enter a valid email';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => { if (validateStep(step)) setStep((s) => s + 1); };
  const goBack = () => setStep((s) => Math.max(1, s - 1));

  // ── Generate registration code ────────────────────────────────────────────
  const generateCode = (): string => {
    const prefix = form.mosque_name.replace(/\s+/g, '').substring(0, 3).toUpperCase() || 'MSQ';
    const rand   = Math.random().toString(36).substring(2, 6).toUpperCase();
    const year   = new Date().getFullYear().toString().slice(2);
    return `HIF${year}-${prefix}-${rand}`;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!form.agree_terms || !form.agree_rules) {
      setErrors({ agree: 'Please accept both declarations before submitting.' });
      return;
    }

    setSubmitting(true);
    const code = generateCode();

    try {
      const { error } = await supabase.from('mosque_registrations').insert({
        registration_code:  code,
        mosque_name:        form.mosque_name,
        mosque_address:     form.mosque_address,
        mosque_lga:         form.mosque_lga,
        mosque_state:       form.mosque_state,
        mosque_phone:       form.mosque_phone,
        mosque_email:       form.mosque_email   || null,
        mosque_website:     form.mosque_website  || null,
        mosque_instagram:   form.mosque_instagram || null,
        mosque_facebook:    form.mosque_facebook  || null,
        logo_url:           form.logo_url         || null,
        contact_name:       form.contact_name,
        contact_phone:      form.contact_phone,
        contact_email:      form.contact_email   || null,
        contact_role:       form.contact_role,
        ustaz_name:         form.ustaz_name,
        ustaz_phone:        form.ustaz_phone,
        ustaz_email:        form.ustaz_email     || null,
        extra_person_name:  form.extra_name      || null,
        extra_person_phone: form.extra_phone     || null,
        extra_person_email: form.extra_email     || null,
        extra_person_role:  form.extra_role      || null,
        competitors:        form.competitors,
        status:             'pending',
        submitted_at:       new Date().toISOString(),
      });

      if (error) throw error;

      // Send confirmation emails to all emails provided (non-blocking)
      sendConfirmationEmails(form, code).catch(console.error);

      setRegCode(code);
      setSubmitted(true);
    } catch (err) {
      console.error('[registration]', err);
      setErrors({ submit: 'Submission failed. Please check your connection and try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Success screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="relative min-h-screen overflow-x-hidden" style={{ background: T.bg }}>
        <IslamicPattern />
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
            style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full space-y-6">

            {/* Big checkmark */}
            <div className="flex justify-center">
              <div className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', boxShadow: '0 0 50px #d4af3766' }}>
                <CheckCircle2 className="w-12 h-12 text-slate-900" />
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-amber-400/70 text-xs font-bold tracking-widest uppercase">Registration Successful</p>
              <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Georgia,serif' }}>
                Baarakallahu Feekum! 🌙
              </h1>
              <p className="text-slate-400 text-sm leading-relaxed">
                <span className="text-amber-200 font-semibold">{form.mosque_name}</span> has been successfully
                registered for the Hamduk Islamic Foundation Quiz Programme.
              </p>
            </div>

            {/* Mosque logo if uploaded */}
            {logoPreview && (
              <div className="flex justify-center">
                <img src={logoPreview} alt="Mosque logo"
                  className="w-20 h-20 rounded-2xl object-cover border-2" style={{ borderColor: '#d4af37' }} />
              </div>
            )}

            {/* Registration code */}
            <div className="rounded-2xl border p-5 text-center space-y-2"
              style={{ background: T.cardBg, border: '1px solid #d4af3744' }}>
              <div className="h-0.5 w-full mb-4" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
              <p className="text-xs font-bold tracking-widest uppercase" style={{ color: T.subtext }}>Your Registration Code</p>
              <p className="text-3xl font-bold text-amber-400" style={{ fontFamily: 'Georgia,serif', letterSpacing: '0.12em' }}>
                {regCode}
              </p>
              <p className="text-xs" style={{ color: T.subtext }}>
                Save this code. Confirmation emails have been sent to all emails provided.
              </p>
              <button onClick={() => navigator.clipboard.writeText(regCode)}
                className="mt-2 text-xs px-4 py-1.5 rounded-full border font-semibold transition-all"
                style={{ background: '#d4af3715', border: '1px solid #d4af3744', color: '#d4af37' }}>
                Copy Code
              </button>
              <div className="h-0.5 w-full mt-4" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
            </div>

            {/* What happens next */}
            <div className="rounded-2xl border p-5 space-y-3" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#d4af37' }}>What Happens Next</p>
              {[
                'A confirmation email has been sent to all email addresses provided.',
                'Our team will review your registration within 48 hours.',
                'You will be contacted on the phone number provided for further details.',
                'All 6 participants must be present on the day of the programme.',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs"
                    style={{ background: '#d4af3722', color: '#d4af37', border: '1px solid #d4af3740' }}>
                    {i + 1}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: T.text }}>{item}</p>
                </div>
              ))}
            </div>

            {/* WhatsApp share */}
            <button
              onClick={() => {
                const text = encodeURIComponent(
                  `🕌 *Mosque Quiz Registration Confirmed!*\n\n` +
                  `Mosque: ${form.mosque_name}\n` +
                  `State: ${form.mosque_state}\n` +
                  `Registration Code: *${regCode}*\n\n` +
                  `We have successfully registered for the Hamduk Islamic Foundation Quiz Programme. 🌙`
                );
                window.open(`https://wa.me/?text=${text}`, '_blank');
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-95"
              style={{ background: '#25D36622', border: '1px solid #25D36644', color: '#25D366' }}
            >
              📲 Share on WhatsApp
            </button>

            <div className="text-center pb-4">
              <div className="inline-flex items-center gap-2 text-amber-400/40 text-xs">
                <Moon className="w-3 h-3" /><span>Hamduk Islamic Foundation · Quiz Programme</span><Moon className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Main form ───────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: T.bg }}>
      <IslamicPattern />
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#d4af37,transparent)' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: 'radial-gradient(circle,#15803d,transparent)' }} />
      </div>

      <div className="relative z-10 py-10 px-4">
        <div className="max-w-2xl mx-auto space-y-7">

          {/* ── Page header ── */}
          <div className="text-center space-y-2">
            <p className="text-amber-400/70 text-xs font-bold tracking-widest uppercase">Hamduk Islamic Foundation</p>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight" style={{ fontFamily: 'Georgia,serif', color: T.text }}>
              Mosque <span className="text-amber-400">Quiz Registration</span>
            </h1>
            <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: T.subtext }}>
              Register your mosque for the HIF Knowledge Quiz Programme. Each team brings 6 participants.
            </p>
          </div>

          {/* ── Team structure badges ── */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { emoji: '🧕', label: '4 Female\nParticipants', color: '#ec4899' },
              { emoji: '👳', label: '1\nUstaz',               color: '#d4af37' },
              { emoji: '👤', label: '1 Extra\nMember',        color: '#60a5fa' },
            ].map((b) => (
              <div key={b.label} className="rounded-2xl border p-3 text-center"
                style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
                <div className="text-2xl mb-1">{b.emoji}</div>
                <p className="text-xs font-bold whitespace-pre-line" style={{ color: b.color }}>{b.label}</p>
              </div>
            ))}
          </div>

          {/* ── Step progress card ── */}
          <div className="rounded-2xl border p-5" style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
            <StepProgress current={step} />
            <div className="mt-4">
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: T.insetBg }}>
                <div className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%`, background: 'linear-gradient(90deg,#92400e,#d4af37)' }} />
              </div>
              <div className="flex justify-between mt-1.5">
                <p className="text-xs" style={{ color: T.subtext }}>Step {step} of {STEPS.length}</p>
                <p className="text-xs text-amber-400">{STEPS[step - 1].description}</p>
              </div>
            </div>
          </div>

          {/* ── Form card ── */}
          <div className="rounded-3xl overflow-hidden border" style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}` }}>
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />

            <div className="p-6 space-y-6">

              {/* ════ STEP 1: Mosque Info ════ */}
              {step === 1 && (
                <>
                  <SectionHeader icon={Building2} title="Mosque Information" subtitle="Details about your mosque" />
                  <div className="space-y-4">

                    {/* Logo upload */}
                    <LogoUploader
                      onUpload={handleLogoUpload}
                      uploading={logoUploading}
                      preview={logoPreview}
                      onClear={() => { setLogoPreview(''); setField('logo_url', ''); }}
                    />
                    {errors.logo && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.logo}</p>}

                    <div>
                      <FieldLabel required>Mosque Name</FieldLabel>
                      <TextInput value={form.mosque_name} onChange={(v) => setField('mosque_name', v)}
                        placeholder="e.g. Central Masjid Ikeja" error={errors.mosque_name} />
                    </div>

                    <div>
                      <FieldLabel required>Full Address</FieldLabel>
                      <TextInput value={form.mosque_address} onChange={(v) => setField('mosque_address', v)}
                        placeholder="Street, area, landmark" error={errors.mosque_address} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>LGA</FieldLabel>
                        <TextInput value={form.mosque_lga} onChange={(v) => setField('mosque_lga', v)}
                          placeholder="e.g. Ikeja" error={errors.mosque_lga} />
                      </div>
                      <div>
                        <FieldLabel required>State</FieldLabel>
                        <SelectInput value={form.mosque_state} onChange={(v) => setField('mosque_state', v)}
                          options={NIGERIAN_STATES} placeholder="Select state" error={errors.mosque_state} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Mosque Phone</FieldLabel>
                        <TextInput value={form.mosque_phone} onChange={(v) => setField('mosque_phone', v)}
                          placeholder="08xxxxxxxxx" type="tel" error={errors.mosque_phone} />
                      </div>
                      <div>
                        <FieldLabel>Mosque Email (optional)</FieldLabel>
                        <TextInput value={form.mosque_email} onChange={(v) => setField('mosque_email', v)}
                          placeholder="masjid@example.com" type="email" error={errors.mosque_email} />
                      </div>
                    </div>

                    {/* Social media */}
                    <div className="rounded-2xl border p-4 space-y-4"
                      style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#d4af37' }}>
                        Social Media & Website (optional)
                      </p>
                      <div>
                        <FieldLabel>Website</FieldLabel>
                        <TextInput value={form.mosque_website} onChange={(v) => setField('mosque_website', v)}
                          placeholder="https://yourmasjid.org"
                          prefix={<Globe className="w-3.5 h-3.5" />} />
                      </div>
                      <div>
                        <FieldLabel>Instagram</FieldLabel>
                        <TextInput value={form.mosque_instagram} onChange={(v) => setField('mosque_instagram', v)}
                          placeholder="@yourmasjid"
                          prefix={<Instagram className="w-3.5 h-3.5" />} />
                      </div>
                      <div>
                        <FieldLabel>Facebook</FieldLabel>
                        <TextInput value={form.mosque_facebook} onChange={(v) => setField('mosque_facebook', v)}
                          placeholder="facebook.com/yourmasjid"
                          prefix={<Globe className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 2: Contact Rep ════ */}
              {step === 2 && (
                <>
                  <SectionHeader icon={User} title="Contact Representative"
                    subtitle="The person we'll communicate with about this registration" />
                  <div className="space-y-4">
                    <div>
                      <FieldLabel required>Full Name</FieldLabel>
                      <TextInput value={form.contact_name} onChange={(v) => setField('contact_name', v)}
                        placeholder="e.g. Alhaji Musa Ibrahim" error={errors.contact_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Phone Number</FieldLabel>
                        <TextInput value={form.contact_phone} onChange={(v) => setField('contact_phone', v)}
                          placeholder="08xxxxxxxxx" type="tel" error={errors.contact_phone} />
                      </div>
                      <div>
                        <FieldLabel>Email (optional)</FieldLabel>
                        <TextInput value={form.contact_email} onChange={(v) => setField('contact_email', v)}
                          placeholder="email@example.com" type="email" error={errors.contact_email}
                          prefix={<Mail className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel required>Role / Position</FieldLabel>
                      <TextInput value={form.contact_role} onChange={(v) => setField('contact_role', v)}
                        placeholder="e.g. Chief Imam, Secretary, Coordinator" error={errors.contact_role} />
                    </div>
                    <div
                      className="rounded-xl px-4 py-3 flex items-start gap-2 border text-xs"
                      style={{ background: '#3b82f615', border: '1px solid #3b82f630', color: '#93c5fd' }}
                    >
                      <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                      <p>A confirmation email will be sent to every email address you provide throughout this form.</p>
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 3: Female Participants ════ */}
              {step === 3 && (
                <>
                  <SectionHeader icon={Users} title="Female Participants"
                    subtitle="Register all 4 female participants" />
                  <div
                    className="rounded-xl px-4 py-3 flex items-start gap-2.5 border text-sm mb-2"
                    style={{ background: '#d4af3710', border: '1px solid #d4af3730', color: '#d4af37' }}
                  >
                    <Star className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>This is a knowledge quiz open to all — no Quran memorisation required. All participants must be female.</p>
                  </div>
                  <div className="space-y-4">
                    {form.competitors.map((comp, i) => (
                      <div key={i} className="rounded-2xl border p-5 space-y-4"
                        style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs"
                            style={{ background: 'linear-gradient(135deg,#92400e,#d4af37)', color: '#0c1a2e' }}>
                            {i + 1}
                          </div>
                          <p className="font-semibold text-sm" style={{ color: '#d4af37', fontFamily: 'Georgia,serif' }}>
                            Participant {i + 1}
                          </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="sm:col-span-1">
                            <FieldLabel required>Full Name</FieldLabel>
                            <TextInput value={comp.full_name}
                              onChange={(v) => setCompetitorField(i, 'full_name', v)}
                              placeholder="e.g. Fatima Abdullahi"
                              error={(compErrors[i] ?? {}).full_name} />
                          </div>
                          <div>
                            <FieldLabel required>Age</FieldLabel>
                            <TextInput value={comp.age}
                              onChange={(v) => setCompetitorField(i, 'age', v)}
                              placeholder="e.g. 45" type="number"
                              error={(compErrors[i] ?? {}).age} />
                          </div>
                          <div>
                            <FieldLabel>Phone (optional)</FieldLabel>
                            <TextInput value={comp.phone}
                              onChange={(v) => setCompetitorField(i, 'phone', v)}
                              placeholder="08xxxxxxxxx" type="tel" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* ════ STEP 4: Ustaz + Extra ════ */}
              {step === 4 && (
                <>
                  <SectionHeader icon={BookOpen} title="Ustaz Details"
                    subtitle="The supervising Islamic scholar accompanying your team" />
                  <div className="space-y-4">
                    <div>
                      <FieldLabel required>Ustaz Full Name</FieldLabel>
                      <TextInput value={form.ustaz_name} onChange={(v) => setField('ustaz_name', v)}
                        placeholder="e.g. Sheikh Abdullahi Hassan" error={errors.ustaz_name} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel required>Phone</FieldLabel>
                        <TextInput value={form.ustaz_phone} onChange={(v) => setField('ustaz_phone', v)}
                          placeholder="08xxxxxxxxx" type="tel" error={errors.ustaz_phone} />
                      </div>
                      <div>
                        <FieldLabel>Email (optional)</FieldLabel>
                        <TextInput value={form.ustaz_email} onChange={(v) => setField('ustaz_email', v)}
                          placeholder="ustaz@example.com" type="email" error={errors.ustaz_email}
                          prefix={<Mail className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 my-2">
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(90deg,#d4af3744,transparent)' }} />
                    <p className="text-xs text-amber-400/60">Optional</p>
                    <div className="h-px flex-1" style={{ background: 'linear-gradient(270deg,#d4af3744,transparent)' }} />
                  </div>

                  <SectionHeader icon={User} title="Extra Team Member"
                    subtitle="1 additional non-competing member (optional)" />
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Full Name</FieldLabel>
                      <TextInput value={form.extra_name} onChange={(v) => setField('extra_name', v)}
                        placeholder="e.g. Aminat Bello" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <FieldLabel>Phone</FieldLabel>
                        <TextInput value={form.extra_phone} onChange={(v) => setField('extra_phone', v)}
                          placeholder="08xxxxxxxxx" type="tel" />
                      </div>
                      <div>
                        <FieldLabel>Email (optional)</FieldLabel>
                        <TextInput value={form.extra_email} onChange={(v) => setField('extra_email', v)}
                          placeholder="email@example.com" type="email" error={errors.extra_email}
                          prefix={<Mail className="w-3.5 h-3.5" />} />
                      </div>
                    </div>
                    <div>
                      <FieldLabel>Role</FieldLabel>
                      <TextInput value={form.extra_role} onChange={(v) => setField('extra_role', v)}
                        placeholder="e.g. Chaperone, Coordinator, Observer" />
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 5: Review & Submit ════ */}
              {step === 5 && (
                <>
                  <SectionHeader icon={Send} title="Review Your Registration"
                    subtitle="Check all details before submitting — you cannot edit after" />

                  {/* Mosque */}
                  <div className="rounded-2xl border p-4" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                    <div className="flex items-center gap-3 mb-3">
                      {logoPreview && (
                        <img src={logoPreview} alt="Logo" className="w-10 h-10 rounded-xl object-cover border"
                          style={{ borderColor: '#d4af3744' }} />
                      )}
                      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: '#d4af37' }}>🕌 Mosque</p>
                    </div>
                    <ReviewRow label="Name"      value={form.mosque_name} />
                    <ReviewRow label="Address"   value={form.mosque_address} />
                    <ReviewRow label="LGA"       value={form.mosque_lga} />
                    <ReviewRow label="State"     value={form.mosque_state} />
                    <ReviewRow label="Phone"     value={form.mosque_phone} />
                    <ReviewRow label="Email"     value={form.mosque_email} />
                    <ReviewRow label="Website"   value={form.mosque_website} />
                    <ReviewRow label="Instagram" value={form.mosque_instagram} />
                    <ReviewRow label="Facebook"  value={form.mosque_facebook} />
                  </div>

                  {/* Contact */}
                  <div className="rounded-2xl border p-4" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#d4af37' }}>👤 Contact Rep</p>
                    <ReviewRow label="Name"  value={form.contact_name} />
                    <ReviewRow label="Phone" value={form.contact_phone} />
                    <ReviewRow label="Email" value={form.contact_email} />
                    <ReviewRow label="Role"  value={form.contact_role} />
                  </div>

                  {/* Participants */}
                  <div className="rounded-2xl border p-4 space-y-3" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#d4af37' }}>🧕 Female Participants</p>
                    {form.competitors.map((c, i) => (
                      <div key={i} className="rounded-xl border p-3" style={{ background: T.inputBg, border: `1px solid ${T.insetBorder}` }}>
                        <p className="text-xs font-bold text-amber-400 mb-2">Participant {i + 1}</p>
                        <ReviewRow label="Name"  value={c.full_name} />
                        <ReviewRow label="Age"   value={c.age} />
                        <ReviewRow label="Phone" value={c.phone || '—'} />
                      </div>
                    ))}
                  </div>

                  {/* Ustaz */}
                  <div className="rounded-2xl border p-4" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#d4af37' }}>👳 Ustaz</p>
                    <ReviewRow label="Name"  value={form.ustaz_name} />
                    <ReviewRow label="Phone" value={form.ustaz_phone} />
                    <ReviewRow label="Email" value={form.ustaz_email} />
                  </div>

                  {/* Extra */}
                  {form.extra_name && (
                    <div className="rounded-2xl border p-4" style={{ background: T.insetBg, border: `1px solid ${T.insetBorder}` }}>
                      <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#d4af37' }}>👤 Extra Member</p>
                      <ReviewRow label="Name"  value={form.extra_name} />
                      <ReviewRow label="Phone" value={form.extra_phone} />
                      <ReviewRow label="Email" value={form.extra_email} />
                      <ReviewRow label="Role"  value={form.extra_role} />
                    </div>
                  )}

                  {/* Agreements */}
                  <div className="rounded-2xl border p-5 space-y-4"
                    style={{ background: '#d4af3708', border: '1px solid #d4af3720' }}>
                    <p className="text-xs font-bold tracking-widest uppercase flex items-center gap-1.5" style={{ color: '#d4af37' }}>
                      <Shield className="w-3.5 h-3.5" /> Declaration & Agreements
                    </p>
                    {[
                      {
                        key:   'agree_terms',
                        label: 'I confirm that all information provided above is accurate and truthful. I understand that false information will result in immediate disqualification.',
                      },
                      {
                        key:   'agree_rules',
                        label: 'I agree that all 4 female participants and the Ustaz will be present on the day of the programme, and our team will follow all rules and regulations of the quiz.',
                      },
                    ].map(({ key, label }) => (
                      <label key={key} className="flex items-start gap-3 cursor-pointer">
                        <button type="button"
                          onClick={() => setField(key as keyof FormData, !(form as any)[key])}
                          className="w-5 h-5 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-all"
                          style={{
                            background: (form as any)[key] ? 'linear-gradient(135deg,#92400e,#d4af37)' : T.inputBg,
                            border:     (form as any)[key] ? '1px solid #d4af37' : `1px solid ${T.insetBorder}`,
                          }}>
                          {(form as any)[key] && <CheckCircle2 className="w-3 h-3 text-slate-900" />}
                        </button>
                        <p className="text-sm leading-relaxed" style={{ color: T.text }}>{label}</p>
                      </label>
                    ))}
                    {errors.agree && (
                      <p className="text-red-400 text-xs flex items-center gap-1.5">
                        <AlertCircle className="w-3 h-3 shrink-0" /> {errors.agree}
                      </p>
                    )}
                  </div>

                  {/* Submit error */}
                  {errors.submit && (
                    <div className="rounded-xl border px-4 py-3 flex items-center gap-2"
                      style={{ background: '#f8717115', border: '1px solid #f8717144', color: '#fca5a5' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <p className="text-sm">{errors.submit}</p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* ── Navigation ── */}
            <div className="px-6 pb-6 flex items-center justify-between gap-3">
              {step > 1 ? (
                <button onClick={goBack}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all"
                  style={{ border: `1px solid ${T.insetBorder}`, color: T.subtext }}>
                  <ChevronLeft className="w-4 h-4" /> Back
                </button>
              ) : <div />}

              {step < STEPS.length ? (
                <button onClick={goNext}
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

            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,transparent,#d4af37,transparent)' }} />
          </div>

          {/* Footer */}
          <div className="text-center pb-6">
            <div className="inline-flex items-center gap-2 text-amber-400/40 text-xs">
              <Moon className="w-3 h-3" /><span>Hamduk Islamic Foundation · Quiz Programme</span><Moon className="w-3 h-3" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
