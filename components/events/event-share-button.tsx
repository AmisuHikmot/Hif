'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Share2, X, Copy, Check, ExternalLink,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface EventShareButtonProps {
  title:       string;
  description: string;
  date:        string;
  time?:       string;
  location?:   string;
  slug:        string;       // event id / slug used in the URL
  imageUrl?:   string;       // optional — used in caption preview
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildEventUrl(slug: string): string {
  const base =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://hamdukislamicfoundation.org';
  return `${base}/events/${slug}`;
}

function buildCaption(
  title: string,
  description: string,
  date: string,
  time: string | undefined,
  location: string | undefined,
  url: string,
): string {
  const lines: string[] = [];
  lines.push(`🕌 *${title}*`);
  lines.push('');
  if (date)     lines.push(`📅 ${date}${time ? ` · ${time}` : ''}`);
  if (location) lines.push(`📍 ${location}`);
  lines.push('');
  // Short description — max 200 chars
  const short = description?.length > 200
    ? description.slice(0, 197) + '…'
    : description;
  if (short) lines.push(short);
  lines.push('');
  lines.push(`🔗 ${url}`);
  lines.push('');
  lines.push('#HamdukIslamicFoundation #IslamicEvents #Nigeria');
  return lines.join('\n');
}

// ─── Twitter caption (shorter, no markdown bold) ──────────────────────────────
function buildTwitterCaption(
  title: string,
  date: string,
  location: string | undefined,
  url: string,
): string {
  const parts: string[] = [];
  parts.push(`🕌 ${title}`);
  if (date)     parts.push(`📅 ${date}`);
  if (location) parts.push(`📍 ${location}`);
  parts.push(url);
  parts.push('#HamdukFoundation #IslamicEvents');
  return parts.join('\n');
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TwitterXIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// ─── Share sheet overlay ──────────────────────────────────────────────────────
function ShareSheet({
  isOpen,
  onClose,
  title,
  description,
  date,
  time,
  location,
  slug,
  imageUrl,
}: EventShareButtonProps & { isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied]   = useState(false);
  const [nativeOk, setNativeOk] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setNativeOk(typeof navigator !== 'undefined' && !!navigator.share);
  }, []);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (sheetRef.current && !sheetRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const url     = buildEventUrl(slug);
  const caption = buildCaption(title, description, date, time, location, url);
  const tweet   = buildTwitterCaption(title, date, location, url);

  // ── Share handlers ──────────────────────────────────────────────────────
  const handleNative = async () => {
    try {
      // Try to share with image if supported and available
      if (imageUrl && navigator.canShare) {
        try {
          const response = await fetch(imageUrl);
          const blob     = await response.blob();
          const file     = new File([blob], 'event.jpg', { type: blob.type });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title,
              text:  caption,
              url,
              files: [file],
            });
            onClose();
            return;
          }
        } catch {
          // Image share failed — fall through to text-only share
        }
      }
      // Text + URL share
      await navigator.share({ title, text: caption, url });
      onClose();
    } catch (err: any) {
      if (err?.name !== 'AbortError') console.error('[share]', err);
    }
  };

  const handleWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(caption)}`,
      '_blank',
    );
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`,
      '_blank',
    );
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${caption}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = caption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // ── Share options ─────────────────────────────────────────────────────
  const options = [
    ...(nativeOk ? [{
      id:      'native',
      label:   'Share via Phone',
      sub:     'Share with any app on your device',
      icon:    <Share2 className="w-5 h-5" />,
      color:   '#16a34a',
      bg:      '#dcfce7',
      action:  handleNative,
      primary: true,
    }] : []),
    {
      id:     'whatsapp',
      label:  'WhatsApp',
      sub:    'Send as a WhatsApp message',
      icon:   <WhatsAppIcon />,
      color:  '#25D366',
      bg:     '#dcfce7',
      action: handleWhatsApp,
    },
    {
      id:     'twitter',
      label:  'Twitter / X',
      sub:    'Post to your timeline',
      icon:   <TwitterXIcon />,
      color:  '#000000',
      bg:     '#f1f5f9',
      action: handleTwitter,
    },
    {
      id:     'copy',
      label:  copied ? 'Copied!' : 'Copy Link & Caption',
      sub:    copied ? 'Paste it anywhere' : 'Copy the event details to clipboard',
      icon:   copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />,
      color:  copied ? '#16a34a' : '#374151',
      bg:     copied ? '#dcfce7' : '#f9fafb',
      action: handleCopy,
    },
  ];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
    >
      {/* Sheet */}
      <div
        ref={sheetRef}
        className="w-full sm:max-w-md mx-auto rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{
          background: '#ffffff',
          boxShadow: '0 -4px 60px rgba(0,0,0,0.18)',
          animation: 'shareSlideUp 0.28s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4"
          style={{ borderBottom: '1px solid #f1f5f9' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: '#dcfce7' }}>
              <Share2 className="w-4 h-4" style={{ color: '#16a34a' }} />
            </div>
            <div>
              <p className="font-bold text-sm text-gray-900">Share Event</p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-[200px] truncate">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
            style={{ background: '#f1f5f9' }}
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Image preview strip (if image available) */}
        {imageUrl && (
          <div className="px-5 pt-4">
            <div className="relative h-32 rounded-xl overflow-hidden"
              style={{ border: '1px solid #e5e7eb' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
              {/* Overlay with event info */}
              <div className="absolute inset-0 flex flex-col justify-end p-3"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 60%)' }}>
                <p className="text-white text-sm font-bold leading-tight line-clamp-1">{title}</p>
                <p className="text-white/80 text-xs mt-0.5">{date}{location ? ` · ${location}` : ''}</p>
              </div>
            </div>
          </div>
        )}

        {/* Caption preview */}
        <div className="px-5 pt-3 pb-2">
          <div className="rounded-xl p-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Caption preview</p>
            <p className="text-xs text-gray-600 leading-relaxed line-clamp-4 whitespace-pre-line">
              {caption}
            </p>
          </div>
        </div>

        {/* Share options */}
        <div className="px-5 pt-2 pb-6 space-y-2">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={opt.action}
              className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl transition-all active:scale-[0.98] text-left"
              style={{
                background:  opt.primary ? '#16a34a' : opt.bg,
                border:      opt.primary ? 'none' : '1px solid #e5e7eb',
                boxShadow:   opt.primary ? '0 4px 14px rgba(22,163,74,0.3)' : 'none',
              }}
            >
              {/* Icon bubble */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: opt.primary ? 'rgba(255,255,255,0.2)' : opt.bg,
                  color:      opt.primary ? '#ffffff' : opt.color,
                  border:     opt.primary ? 'none' : `1px solid ${opt.color}22`,
                }}
              >
                {opt.icon}
              </div>
              {/* Labels */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold leading-tight"
                  style={{ color: opt.primary ? '#ffffff' : '#111827' }}>
                  {opt.label}
                </p>
                <p className="text-xs mt-0.5 leading-tight"
                  style={{ color: opt.primary ? 'rgba(255,255,255,0.75)' : '#6b7280' }}>
                  {opt.sub}
                </p>
              </div>
              {/* Arrow */}
              {!opt.primary && (
                <ExternalLink className="w-4 h-4 shrink-0" style={{ color: '#d1d5db' }} />
              )}
            </button>
          ))}
        </div>

        {/* Bottom safe area */}
        <div className="h-1" style={{ background: 'linear-gradient(90deg,transparent,#16a34a44,transparent)' }} />
      </div>

      {/* Animation keyframes */}
      <style>{`
        @keyframes shareSlideUp {
          from { transform: translateY(32px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Main export — the trigger button ────────────────────────────────────────
export default function EventShareButton(props: EventShareButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 text-sm font-medium transition-all group"
        style={{ color: '#16a34a' }}
      >
        <span
          className="w-8 h-8 rounded-full flex items-center justify-center transition-all group-hover:scale-110"
          style={{ background: '#dcfce7', border: '1px solid #bbf7d0' }}
        >
          <Share2 className="h-4 w-4" style={{ color: '#16a34a' }} />
        </span>
        Share Event
      </button>

      <ShareSheet
        {...props}
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
