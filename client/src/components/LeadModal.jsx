import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { X, Check } from 'lucide-react';
import { DISCLAIMERS, BROKERAGE_LOGO } from '../constants/compliance';
import { Link } from 'react-router-dom';

const MODAL_CONFIG = {
  tour: {
    title: 'Book a showing',
    subtitle: "Mahesh will confirm within 2 hours.",
    fields: ['name', 'email', 'phone', 'preferredTime', 'message'],
    cta: 'Request showing →',
  },
  cma: {
    title: 'Get your full CMA report',
    subtitle: 'Full PDF — price history, neighbourhood data, investment summary.',
    fields: ['email'],
    cta: 'Send my report →',
  },
  recommendation: {
    title: 'Get a personal recommendation',
    subtitle: "Mahesh will personally review your search and send his top picks.",
    fields: ['name', 'email', 'budget', 'timeline', 'brief'],
    cta: 'Send my details →',
  },
  alert: {
    title: 'Save this search',
    subtitle: "We'll notify you when similar properties hit the market.",
    fields: ['email'],
    cta: 'Save & get alerts →',
  },
};

const FIELD_CONFIG = {
  name:          { label: 'your name',           type: 'text',   placeholder: 'Jane Smith' },
  email:         { label: 'email address',        type: 'email',  placeholder: 'jane@example.com' },
  phone:         { label: 'phone (optional)',     type: 'tel',    placeholder: '+1 (416) 555-0100' },
  preferredTime: { label: 'preferred time',       type: 'text',   placeholder: 'e.g. Saturday afternoon' },
  message:       { label: 'anything to add?',     type: 'textarea', placeholder: 'optional note' },
  budget:        { label: 'budget range',         type: 'text',   placeholder: 'e.g. $700K–$900K' },
  timeline:      { label: 'timeline',             type: 'text',   placeholder: 'e.g. 3–6 months' },
  brief:         { label: 'what are you looking for?', type: 'textarea', placeholder: 'neighbourhood, must-haves, etc.' },
};

export default function LeadModal({ type, propertyAddress, conversationHistory, onSubmit, onClose }) {
  const config = MODAL_CONFIG[type] || MODAL_CONFIG.cma;
  const [form, setForm]     = useState({});
  const [loading, setLoading] = useState(false);
  const [done, setDone]     = useState(false);
  const [error, setError]   = useState('');

  const handleChange = (field, value) => setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onSubmit({ type, propertyAddress, conversationHistory, ...form });
      setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm"
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-cream w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-6 pb-4">
            <div>
              <p className="font-serif text-2xl text-ink">{config.title}</p>
              <p className="text-sm text-ink3 font-sans mt-1">{config.subtitle}</p>
              {propertyAddress && (
                <p className="text-xs text-ink4 font-sans mt-1 bg-cream2 px-2 py-1 rounded-md inline-block">
                  {propertyAddress}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-ink3 hover:text-ink hover:bg-cream2 rounded-lg transition-colors ml-4 shrink-0 min-h-[36px] min-w-[36px] flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {done ? (
            <div className="px-6 pb-6 text-center">
              <div className="w-14 h-14 bg-greenl rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={24} className="text-green" />
              </div>
              <p className="font-serif text-xl text-ink mb-2">sent.</p>
              <p className="text-sm text-ink2 font-sans">
                {type === 'tour'
                  ? "Mahesh will be in touch within 2 hours to confirm."
                  : type === 'cma' || type === 'alert'
                  ? "Check your inbox — your report is on its way."
                  : "Mahesh will personally review and send you his top picks."}
              </p>
              <button onClick={onClose} className="btn-primary mt-6 w-full">
                close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
              {config.fields.map(field => {
                const f = FIELD_CONFIG[field];
                if (!f) return null;
                return (
                  <div key={field}>
                    <label className="block text-xs text-ink3 font-sans mb-1">{f.label}</label>
                    {f.type === 'textarea' ? (
                      <textarea
                        value={form[field] || ''}
                        onChange={e => handleChange(field, e.target.value)}
                        placeholder={f.placeholder}
                        rows={3}
                        className="input-base resize-none"
                      />
                    ) : (
                      <input
                        type={f.type}
                        value={form[field] || ''}
                        onChange={e => handleChange(field, e.target.value)}
                        placeholder={f.placeholder}
                        required={!['phone', 'message', 'brief'].includes(field)}
                        className="input-base"
                      />
                    )}
                  </div>
                );
              })}

              {error && <p className="text-sm text-red-500 font-sans">{error}</p>}

              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'sending...' : config.cta}
              </button>

              {/* Compliance footer */}
              <div className="pt-2 border-t border-cream3">
                <p className="disclaimer-text">
                  {DISCLAIMERS['lead-modal']}{' '}
                  <Link to="/privacy" className="underline" onClick={onClose}>See our Privacy Policy.</Link>
                </p>
                {/* TODO: MAHESH TO PROVIDE brokerage logo */}
                <img src={BROKERAGE_LOGO} alt="Brokerage" className="h-6 object-contain mt-2 opacity-60" onError={e => { e.target.style.display='none'; }} />
              </div>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
