import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertTriangle, Search, Send } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { useLeadCapture } from '../hooks/useLeadCapture';
import LeadModal from '../components/LeadModal';
import Disclaimer from '../components/Disclaimer';
import { formatPrice } from '../lib/formatters';

const CHECKLIST = [
  {
    section: 'Structural & Exterior',
    items: [
      { id: 'roof',        label: 'Roof condition (age, materials, visible damage)',        flagged: true },
      { id: 'foundation',  label: 'Foundation — visible cracks, water staining, settling', flagged: true },
      { id: 'eavestroughs',label: 'Eavestroughs and downspouts secured and draining',      flagged: false },
      { id: 'windows',     label: 'Window seals, frames, and operation',                   flagged: false },
    ],
  },
  {
    section: 'Interior & Systems',
    items: [
      { id: 'hvac',        label: 'Furnace and A/C age, last service date',                flagged: true },
      { id: 'electrical',  label: 'Electrical panel — breakers, amperage, knob-and-tube',  flagged: true },
      { id: 'plumbing',    label: 'Water pressure, drain speed, visible rust or leaks',    flagged: false },
      { id: 'basement',    label: 'Basement — signs of moisture, efflorescence, musty odour', flagged: false },
      { id: 'attic',       label: 'Attic — insulation depth, ventilation, mould signs',    flagged: false },
    ],
  },
];

function AnimatedScore({ score }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (display === score) return;
    const dir = score > display ? 1 : -1;
    const interval = setInterval(() => {
      setDisplay(prev => {
        const next = prev + dir;
        if ((dir > 0 && next >= score) || (dir < 0 && next <= score)) {
          clearInterval(interval);
          return score;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(interval);
  }, [score]);

  const colour = score >= 70 ? '#2A7A55' : score >= 40 ? '#C47B2C' : '#EF4444';

  return (
    <span style={{ color: colour }} className="font-serif text-6xl">
      {display}
    </span>
  );
}

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
      const res = await autocomplete(v);
      setSuggestions(res);
      setOpen(res.length > 0);
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
              className="w-full text-left px-4 py-3 text-sm font-sans text-ink2 hover:bg-cream2"
            >
              {typeof s === 'string' ? s : s.address || s.value || ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OpenHouse() {
  const [address, setAddress]   = useState('');
  const [listing, setListing]   = useState(null);
  const [checked, setChecked]   = useState({});
  const [loading, setLoading]   = useState(false);
  const [showModal, setShowModal] = useState(false);
  const { autocomplete } = useListings();
  const { submitLead } = useLeadCapture();

  const allItems = CHECKLIST.flatMap(s => s.items);
  const score = Math.round((Object.keys(checked).length / allItems.length) * 100);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!address) return;
    setLoading(true);
    // Pre-populate checklist from address context (AI flags already in CHECKLIST)
    setTimeout(() => {
      const preChecked = {};
      allItems.filter(i => !i.flagged).forEach(i => { preChecked[i.id] = false; });
      setChecked({});
      setLoading(false);
    }, 800);
  };

  const toggle = (id) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLeadSubmit = async (data) => {
    await submitLead({ type: 'cma', propertyAddress: address, ...data });
  };

  return (
    <div className="min-h-screen bg-cream pb-20 md:pb-0">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <span className="section-tag mb-4 block">open house toolkit</span>
          <h1 className="font-serif text-5xl sm:text-6xl text-ink mb-4">
            Walk in like you've already<br /><em>done the research.</em>
          </h1>
          <p className="text-ink2 font-sans text-lg">
            Enter the address. Get a pre-filled checklist with flagged items — before you step inside.
          </p>
        </motion.div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="flex-1">
            <AutocompleteInput
              value={address}
              onChange={setAddress}
              placeholder="47 Driftwood Cres, Mississauga"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !address}
            className="btn-primary shrink-0"
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
            ) : (
              <><Search size={16} /> load</>
            )}
          </button>
        </form>

        {/* Checklist */}
        <div className="space-y-8">
          {CHECKLIST.map((section) => (
            <div key={section.section}>
              <h3 className="font-serif text-xl text-ink mb-4">{section.section}</h3>
              <div className="space-y-2">
                {section.items.map((item) => (
                  <motion.button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all min-h-[56px] border ${
                      checked[item.id]
                        ? 'bg-greenl border-greenm'
                        : item.flagged
                        ? 'bg-warml border-warm/30'
                        : 'bg-white border-cream3 hover:border-cream2'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md shrink-0 mt-0.5 flex items-center justify-center transition-all ${
                      checked[item.id]
                        ? 'bg-green'
                        : item.flagged
                        ? 'bg-warm/20 border border-warm/40'
                        : 'border border-cream3 bg-white'
                    }`}>
                      {checked[item.id] && <Check size={11} className="text-white" />}
                      {!checked[item.id] && item.flagged && <AlertTriangle size={10} className="text-warm" />}
                    </div>
                    <span className={`text-sm font-sans leading-snug ${
                      checked[item.id] ? 'text-green' : item.flagged ? 'text-ink' : 'text-ink2'
                    }`}>
                      {item.label}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Score card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-10 bg-ink rounded-2xl p-8 text-center"
        >
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-sans mb-4">inspection score</p>
          <AnimatedScore score={score} />
          <p className="text-white/50 font-sans text-sm mb-6">/ 100</p>
          <p className="text-white/70 font-sans text-sm mb-6">
            {score >= 70 ? 'Solid walkthrough. A few things to confirm.' :
             score >= 40 ? 'Halfway through — keep checking.' :
             'Start checking items as you walk through.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary w-full"
            >
              get full CMA on this property →
            </button>
            <p className="text-white/30 text-xs font-sans">
              save checklist and get CMA by email
            </p>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-8">
          <Disclaimer type="open-house" />
        </div>
      </div>

      {showModal && (
        <LeadModal
          type="cma"
          propertyAddress={address}
          onSubmit={handleLeadSubmit}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
