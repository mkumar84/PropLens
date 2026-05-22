import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { ArrowRight, Zap, MapPin, BarChart2, Shield, ChevronDown } from 'lucide-react';

const TYPEWRITER_PROMPTS = [
  'Find me a 3-bed in Leslieville under $900K',
  'What\'s the market like in Oakville right now?',
  'Is this asking price fair for East York?',
  'Show me investment properties near a GO station',
  'Condos under $600K with a locker and parking',
  'What\'s the average sold price in Riverdale this year?',
];

const NEIGHBOURHOODS = [
  'Leslieville', 'Riverdale', 'The Annex', 'Roncesvalles', 'Danforth Village',
  'Oakville', 'Mississauga', 'Etobicoke', 'North York', 'Scarborough',
  'Pickering', 'Whitby', 'Ajax', 'Burlington', 'Hamilton',
  'Corktown', 'Trinity Bellwoods', 'Kensington', 'Liberty Village', 'Parkdale',
];

const STATS = [
  { value: '95K+', label: 'active Ontario properties' },
  { value: '<8s',  label: 'average CMA time' },
  { value: '22yr', label: 'market history' },
  { value: 'RECO', label: 'licensed realtor' },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'You talk.', desc: 'Ask like you\'d text a friend. No filters, no forms — just tell us what you want.' },
  { step: '02', title: 'We find.', desc: 'Real MLS data, live market signals, and 22 years of Ontario sales history.' },
  { step: '03', title: 'You decide.', desc: 'Full context. No pressure. No one\'s chasing a commission on your search.' },
];

const PERSONAS = [
  {
    tab: 'Buying',
    headline: 'Know before you bid.',
    body: 'See what homes actually sold for — not just what they\'re listed at. Run a CMA in seconds. Spot negotiation room before your offer goes in.',
    cta: 'Start searching',
    href: '/chat',
  },
  {
    tab: 'Investing',
    headline: 'Numbers, not hype.',
    body: 'Gross yield, cap rate, cash flow — built into every listing. Filter by GO distance, appreciation grade, and absorption rate.',
    cta: 'Run the numbers',
    href: '/cma',
  },
  {
    tab: 'Selling',
    headline: 'Price it right the first time.',
    body: 'See what\'s sold nearby, what\'s sitting, and what buyers are actually paying. Know your number before you list.',
    cta: 'Get a CMA',
    href: '/cma',
  },
  {
    tab: 'Renting',
    headline: 'Is the rent worth it?',
    body: 'Compare rental costs to ownership. See neighbourhood scores, transit access, and school ratings side by side.',
    cta: 'Explore the map',
    href: '/map',
  },
];

const TESTIMONIALS = [
  {
    quote: "I ran a CMA on a place in Leslieville before our offer. It showed the listing was $40K overpriced for the area. We walked. Saved ourselves a headache.",
    name: 'Priya S.',
    detail: 'First-time buyer, Toronto',
  },
  {
    quote: "The chat feels like texting a realtor friend. I asked about cap rates in Hamilton and got actual numbers — not a call request.",
    name: 'Marcus T.',
    detail: 'Investor, Hamilton–Toronto',
  },
  {
    quote: "Walked into an open house with the checklist pre-filled based on the listing. The agent was surprised I knew about the roof age.",
    name: 'Diane L.',
    detail: 'Upsizing buyer, Oakville',
  },
];

const FAQS = [
  {
    q: 'Is PropertyLens a real estate brokerage?',
    a: 'No. PropertyLens is an AI-powered information platform. Mahesh Kumar is a licensed Ontario realtor (RECO) affiliated with [BROKERAGE NAME]. Any professional advice or representation happens through that relationship, not through the platform itself.',
  },
  {
    q: 'Where does the listing data come from?',
    a: 'Active and sold listings come from the Toronto Regional Real Estate Board (TRREB) via Repliers.io, a licensed MLS data provider. Data is refreshed in real time.',
  },
  {
    q: 'Are the AI price estimates accurate?',
    a: 'They\'re a strong starting point — based on actual comparable solds and market conditions. But they\'re estimates, not certified appraisals. Always verify with a professional before making a major financial decision.',
  },
  {
    q: 'Do I need to create an account?',
    a: 'No. You get 3 free searches — no account, no card. After that, creating a free account unlocks unlimited searches, saved properties, and market alerts.',
  },
  {
    q: 'Is my data shared or sold?',
    a: 'Never. Your search history and personal details are used only to respond to your inquiry and improve your experience. We don\'t sell data to third parties. See our Privacy Policy for details.',
  },
  {
    q: 'What areas does PropertyLens cover?',
    a: 'All of Ontario — from Toronto and the GTA to Hamilton, Niagara, Ottawa, and beyond. If it\'s on TRREB/MLS, we see it.',
  },
];

function FadeUp({ children, delay = 0 }) {
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

function TypewriterBar() {
  const [idx, setIdx]   = useState(0);
  const [text, setText] = useState('');
  const [del, setDel]   = useState(false);

  useEffect(() => {
    const target = TYPEWRITER_PROMPTS[idx];
    let timeout;
    if (!del && text.length < target.length) {
      timeout = setTimeout(() => setText(target.slice(0, text.length + 1)), 45);
    } else if (!del && text.length === target.length) {
      timeout = setTimeout(() => setDel(true), 2200);
    } else if (del && text.length > 0) {
      timeout = setTimeout(() => setText(text.slice(0, -1)), 22);
    } else if (del && text.length === 0) {
      setDel(false);
      setIdx(i => (i + 1) % TYPEWRITER_PROMPTS.length);
    }
    return () => clearTimeout(timeout);
  }, [text, del, idx]);

  return (
    <div className="flex items-center bg-white rounded-2xl shadow-lg border border-cream3 px-5 py-4 gap-3 max-w-2xl mx-auto">
      <div className="w-2 h-2 bg-green rounded-full shrink-0 animate-pulse" />
      <span className="font-sans text-ink text-base flex-1 min-h-[24px]">
        {text}
        <span className="animate-pulse text-green font-light">|</span>
      </span>
      <Link to="/chat" className="btn-primary shrink-0 text-sm whitespace-nowrap">
        Ask →
      </Link>
    </div>
  );
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-cream3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 min-h-[44px]"
      >
        <span className="font-sans font-medium text-ink text-sm">{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.25 }}>
          <ChevronDown size={16} className="text-ink3 shrink-0" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-ink2 font-sans leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  const [activePersona, setActivePersona] = useState(0);

  return (
    <div className="overflow-x-hidden">
      {/* HERO */}
      <section className="min-h-[92vh] flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="section-tag mb-6 block"
          >
            Ontario real estate · AI-powered
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="font-serif text-5xl sm:text-7xl lg:text-8xl text-ink mb-6 leading-[0.95]"
          >
            Your next home.<br />
            <em>Ask for it.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-ink2 font-sans text-lg sm:text-xl mb-4 max-w-md mx-auto leading-relaxed"
          >
            Search like you text a friend.<br />
            Get answers like you hired a pro.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="text-ink4 font-sans text-sm mb-10"
          >
            3 searches on us. No card, no catch.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
          >
            <TypewriterBar />
          </motion.div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto w-full"
        >
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              whileHover={{ y: -4, boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl p-4 text-center border border-cream3"
            >
              <p className="font-serif text-3xl text-ink mb-1">{s.value}</p>
              <p className="text-[11px] text-ink3 font-sans leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* MARQUEE */}
      <section className="bg-green py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...NEIGHBOURHOODS, ...NEIGHBOURHOODS].map((n, i) => (
            <span key={i} className="text-white/80 font-sans text-sm mx-6">
              {n} <span className="text-white/30 mx-1">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp>
          <p className="section-tag text-center mb-4">how it works</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink text-center mb-16">
            You talk. We find. You decide.
          </h2>
        </FadeUp>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((item, i) => (
            <FadeUp key={item.step} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group bg-white rounded-2xl p-8 border border-cream3 h-full"
              >
                <p className="font-serif text-5xl text-cream3 group-hover:text-greenm transition-colors duration-200 mb-4">
                  {item.step}
                </p>
                <p className="font-serif text-2xl text-ink mb-3">{item.title}</p>
                <p className="text-sm text-ink2 font-sans leading-relaxed">{item.desc}</p>
              </motion.div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* DARK DEMO STRIP */}
      <section className="bg-ink py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <FadeUp>
            <p className="section-tag text-cream/40 text-center mb-4">live preview</p>
            <h2 className="font-serif text-4xl text-cream text-center mb-10">
              Search like a conversation.
            </h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <div className="bg-ink2/40 rounded-2xl p-6 border border-white/10 space-y-4">
              {[
                { role: 'user',      text: 'Show me 3-beds in Riverdale under $1.1M with good schools' },
                { role: 'assistant', text: 'Found 6 matches. Top pick: 142 Pape Ave — $1.05M, schools rated 8.4/10, listed 12 days. Room to negotiate.' },
                { role: 'user',      text: 'Is $1.05M fair for that area?' },
                { role: 'assistant', text: "Comparable solds in the last 90 days: avg $1.08M. That one's priced slightly below average — decent entry point if it checks out on inspection." },
              ].map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-3'}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-7 h-7 bg-green rounded-full flex items-center justify-center shrink-0">
                      <span className="text-white font-serif text-xs font-bold">PL</span>
                    </div>
                  )}
                  <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm font-sans leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-white/15 text-white rounded-br-sm'
                      : 'bg-white/10 text-cream/90 rounded-tl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </motion.div>
              ))}
            </div>
          </FadeUp>
          <div className="text-center mt-8">
            <Link to="/chat" className="btn-primary">
              try it now →
            </Link>
          </div>
        </div>
      </section>

      {/* PERSONA TABS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <FadeUp>
          <p className="section-tag text-center mb-4">built for you</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink text-center mb-10">
            Whoever you are in this market.
          </h2>
        </FadeUp>

        <div className="flex justify-center gap-2 mb-10 flex-wrap">
          {PERSONAS.map((p, i) => (
            <button
              key={p.tab}
              onClick={() => setActivePersona(i)}
              className={`px-5 py-2 rounded-full text-sm font-sans font-medium transition-all duration-200 min-h-[44px] ${
                activePersona === i
                  ? 'bg-green text-white'
                  : 'bg-white text-ink2 border border-cream3 hover:border-green hover:text-green'
              }`}
            >
              {p.tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 sm:p-12 border border-cream3 max-w-2xl mx-auto text-center"
          >
            <h3 className="font-serif text-3xl sm:text-4xl text-ink mb-4">
              {PERSONAS[activePersona].headline}
            </h3>
            <p className="text-ink2 font-sans text-base leading-relaxed mb-8">
              {PERSONAS[activePersona].body}
            </p>
            <Link to={PERSONAS[activePersona].href} className="btn-primary">
              {PERSONAS[activePersona].cta} →
            </Link>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-cream2">
        <div className="max-w-7xl mx-auto">
          <FadeUp>
            <p className="section-tag text-center mb-4">what people say</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink text-center mb-12">
              Honest feedback.
            </h2>
          </FadeUp>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <FadeUp key={i} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4, backgroundColor: '#ffffff' }}
                  transition={{ duration: 0.2 }}
                  className="bg-cream rounded-2xl p-6 border border-cream3 h-full"
                >
                  <p className="text-ink font-sans text-sm leading-relaxed mb-6 italic">
                    "{t.quote}"
                  </p>
                  <div>
                    <p className="font-sans font-medium text-ink text-sm">{t.name}</p>
                    <p className="text-xs text-ink3 font-sans">{t.detail}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <FadeUp>
          <p className="section-tag text-center mb-4">questions</p>
          <h2 className="font-serif text-4xl sm:text-5xl text-ink text-center mb-12">
            The honest answers.
          </h2>
        </FadeUp>
        <div>
          {FAQS.map((faq, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <FAQItem {...faq} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="bg-green py-20 px-4 sm:px-6 lg:px-8">
        <FadeUp>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-serif text-4xl sm:text-5xl text-white mb-4">
              Stop scrolling listings.
            </h2>
            <p className="text-white/70 font-sans text-lg mb-8">
              Ask the question. Get the answer. No filter dropdowns, no booking a call.
            </p>
            <Link to="/chat" className="inline-flex items-center gap-2 bg-white text-green font-sans font-medium px-8 py-4 rounded-xl hover:bg-cream transition-colors text-base">
              let's find your place <ArrowRight size={18} />
            </Link>
            <p className="text-white/40 font-sans text-xs mt-4">3 searches free · no card required</p>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}
