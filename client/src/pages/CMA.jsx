import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, TrendingUp, TrendingDown, Minus, Download } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { useLeadCapture } from '../hooks/useLeadCapture';
import LeadModal from '../components/LeadModal';
import Disclaimer from '../components/Disclaimer';
import { formatPrice, formatDaysAgo } from '../lib/formatters';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function AutocompleteInput({ value, onChange, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const { autocomplete } = useListings();
  const debounce = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      const results = await autocomplete(v);
      setSuggestions(results);
      setOpen(results.length > 0);
    }, 300);
  };

  const pick = (item) => {
    onChange(typeof item === 'string' ? item : item.address || item.value || item);
    setOpen(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        placeholder={placeholder}
        className="input-base"
      />
      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white rounded-xl border border-cream3 shadow-lg z-10 max-h-48 overflow-y-auto">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onMouseDown={() => pick(s)}
              className="w-full text-left px-4 py-3 text-sm font-sans text-ink2 hover:bg-cream2 transition-colors"
            >
              {typeof s === 'string' ? s : s.address || s.value || JSON.stringify(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CMA() {
  const [form, setForm] = useState({ address: '', postalCode: '', propertyType: 'Detached', beds: '', baths: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { submitLead } = useLeadCapture();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.address) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/cma`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('CMA failed');
      const data = await res.json();
      setResult(data);
    } catch {
      setError('Could not generate CMA. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (data) => {
    await submitLead({ type: 'cma', propertyAddress: form.address, ...data });
  };

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="section-tag mb-4 block">comparative market analysis</span>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink mb-4">
            Is it worth it?<br /><em>Let's find out.</em>
          </h1>
          <p className="text-ink2 font-sans text-lg">
            Enter any Ontario address — get real comps, market signals, and a price verdict in seconds.
          </p>
        </motion.div>

        {/* CMA disclaimer - ABOVE form */}
        <div className="mb-6">
          <Disclaimer type="cma" />
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-cream3 p-6 sm:p-8 mb-8"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-ink3 font-sans mb-1">property address</label>
              <AutocompleteInput
                value={form.address}
                onChange={v => setForm(f => ({ ...f, address: v }))}
                placeholder="47 Driftwood Cres, Mississauga"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink3 font-sans mb-1">postal code (optional)</label>
                <input
                  type="text"
                  value={form.postalCode}
                  onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                  placeholder="L5A 2E7"
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-xs text-ink3 font-sans mb-1">property type</label>
                <select
                  value={form.propertyType}
                  onChange={e => setForm(f => ({ ...f, propertyType: e.target.value }))}
                  className="input-base"
                >
                  {['Detached', 'Semi-Detached', 'Townhouse', 'Condo', 'Duplex', 'Other'].map(t => (
                    <option key={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-ink3 font-sans mb-1">bedrooms</label>
                <input
                  type="number"
                  value={form.beds}
                  onChange={e => setForm(f => ({ ...f, beds: e.target.value }))}
                  placeholder="3"
                  min="0" max="10"
                  className="input-base"
                />
              </div>
              <div>
                <label className="block text-xs text-ink3 font-sans mb-1">bathrooms</label>
                <input
                  type="number"
                  value={form.baths}
                  onChange={e => setForm(f => ({ ...f, baths: e.target.value }))}
                  placeholder="2"
                  min="0" max="10"
                  className="input-base"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-500 font-sans">{error}</p>}

            <button
              type="submit"
              disabled={loading || !form.address}
              className="btn-primary w-full"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                  />
                  running analysis...
                </span>
              ) : (
                <>
                  <Search size={16} />
                  run CMA →
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* CMA disclaimer - ABOVE results */}
            <Disclaimer type="cma" />

            {/* Analysis text */}
            <div className="bg-white rounded-2xl border border-cream3 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-2xl text-ink">analysis</h3>
                <span className="text-xs text-ink4 font-sans">{form.address}</span>
              </div>
              <div className="prose prose-sm max-w-none">
                {result.analysis?.split('\n').filter(Boolean).map((line, i) => (
                  <p key={i} className="text-sm text-ink2 font-sans leading-relaxed mb-3">{line}</p>
                ))}
              </div>
            </div>

            {/* Comparables */}
            {result.comparables?.length > 0 && (
              <div className="bg-white rounded-2xl border border-cream3 p-6 sm:p-8">
                <h3 className="font-serif text-2xl text-ink mb-4">comparable solds</h3>
                <div className="space-y-3">
                  {result.comparables.map((comp, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-cream2 last:border-0">
                      <div>
                        <p className="text-sm font-sans font-medium text-ink">
                          {comp.address || `${comp.streetNumber} ${comp.streetName}`}
                        </p>
                        <p className="text-xs text-ink3 font-sans">
                          {comp.numBedrooms} bd · {comp.numBathrooms} ba · {formatDaysAgo(comp.daysOnMarket)}
                        </p>
                      </div>
                      <p className="font-serif text-xl text-ink">{formatPrice(comp.soldPrice || comp.listPrice)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lead capture */}
            <div className="bg-greenl rounded-2xl border border-greenm p-6 text-center">
              <p className="font-serif text-2xl text-ink mb-2">Want to keep this?</p>
              <p className="text-sm text-ink2 font-sans mb-4">
                Full PDF — price history chart, neighbourhood data, investment summary.
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="btn-primary"
              >
                <Download size={16} />
                send me the report →
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {showModal && (
        <LeadModal
          type="cma"
          propertyAddress={form.address}
          onSubmit={handleLeadSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
