import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function LeadGate({ onSubmit, onDismiss }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    await onSubmit({ email });
    setLoading(false);
    setDone(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-20 flex items-end justify-center pb-8"
      style={{ backdropFilter: 'blur(8px)', backgroundColor: 'rgba(245,242,235,0.7)' }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-2xl shadow-2xl p-6 mx-4 w-full max-w-sm border border-cream3"
      >
        {done ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-greenl rounded-full flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} className="text-green" />
            </div>
            <p className="font-serif text-xl text-ink mb-2">you're in.</p>
            <p className="text-sm text-ink2 font-sans">keep searching — we'll send you matching alerts.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-greenl rounded-xl flex items-center justify-center shrink-0">
                <Sparkles size={18} className="text-green" />
              </div>
              <div>
                <p className="font-sans font-medium text-ink text-sm">you've used your 3 free searches.</p>
                <p className="text-xs text-ink3 font-sans">create a free account to keep going — no card, no pressure.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your email"
                required
                className="input-base"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'saving...' : 'continue searching →'}
              </button>
            </form>

            <button
              onClick={onDismiss}
              className="mt-3 w-full text-center text-xs text-ink4 font-sans hover:text-ink3 transition-colors"
            >
              maybe later
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
