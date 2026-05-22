import { DISCLAIMERS } from '../constants/compliance';

const typeStyles = {
  'ai-estimate': 'inline-flex items-center gap-1 text-[10px] text-ink3 font-sans',
  'cma':         'block text-[11px] text-ink3 font-sans leading-relaxed p-3 bg-cream2 rounded-lg border border-cream3',
  'mortgage':    'block text-[11px] text-ink3 font-sans leading-relaxed p-3 bg-cream2 rounded-lg border border-cream3',
  'investment':  'block text-[11px] text-ink3 font-sans leading-relaxed p-3 bg-warml rounded-lg border border-warm/20',
  'mls-data':    'block text-[10px] text-ink4 font-sans leading-relaxed',
  'solicitation':'block text-[10px] text-ink4 font-sans leading-relaxed',
  'open-house':  'block text-[11px] text-ink3 font-sans leading-relaxed p-3 bg-cream2 rounded-lg border border-cream3',
  'chat-bar':    'block text-[10px] text-ink4 font-sans leading-relaxed text-center',
  'lead-modal':  'block text-[10px] text-ink4 font-sans leading-relaxed',
};

export default function Disclaimer({ type, className = '' }) {
  const text = DISCLAIMERS[type];
  if (!text) return null;

  return (
    <span className={`${typeStyles[type] || 'disclaimer-text'} ${className}`}>
      {type === 'ai-estimate' && (
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <circle cx="5" cy="5" r="4.5" stroke="#888892" strokeWidth="1"/>
          <path d="M5 4v3M5 3v.5" stroke="#888892" strokeWidth="1" strokeLinecap="round"/>
        </svg>
      )}
      {text}
    </span>
  );
}
