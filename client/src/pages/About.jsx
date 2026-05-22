import { motion } from 'framer-motion';
import { Shield, Database, Brain, Scale } from 'lucide-react';
import { AGENT_NAME, BROKERAGE_NAME, BROKERAGE_LOGO, RECO_REG, BROKERAGE_ADDRESS, CURRENT_YEAR } from '../constants/compliance';

const DATA_SOURCES = [
  { name: 'Repliers / TRREB', desc: 'Live Ontario MLS listings and sold history' },
  { name: 'Statistics Canada', desc: 'Census, population, income, housing data' },
  { name: 'CMHC',             desc: 'Mortgage rules, housing market reports' },
  { name: 'Walk Score',       desc: 'Walkability, transit, and bike scores' },
  { name: 'Fraser Institute', desc: 'School performance rankings' },
  { name: 'Claude AI',        desc: 'Anthropic · language and analysis engine' },
];

const COMPLIANCE_CARDS = [
  {
    icon: Shield,
    title: 'RECO / REBBA 2002',
    desc: `${AGENT_NAME} is a registered salesperson under the Real Estate and Business Brokers Act, 2002. Registration #${RECO_REG}.`,
  },
  {
    icon: Scale,
    title: 'PIPEDA',
    desc: 'Personal information is collected and used in accordance with the Personal Information Protection and Electronic Documents Act.',
  },
  {
    icon: Database,
    title: 'MLS Data Usage',
    desc: 'Listing data is provided under license from TRREB and CREA. Data may not be reproduced or redistributed without permission.',
  },
  {
    icon: Brain,
    title: 'AI Disclaimers',
    desc: 'AI valuations are estimates and do not constitute appraisals. Investment projections are not guarantees. Always consult professionals.',
  },
];

function FadeUp({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export default function About() {
  return (
    <div className="min-h-screen bg-cream pb-16">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="section-tag mb-4 block">about</span>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-ink leading-tight">
            Built by someone who's been on<br /><em>both sides of the table.</em>
          </h1>
        </motion.div>

        {/* Two-column body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Data sources */}
          <FadeUp>
            <div>
              <p className="section-tag mb-6">data sources</p>
              <div className="space-y-4">
                {DATA_SOURCES.map(s => (
                  <div key={s.name} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 bg-green rounded-full mt-2 shrink-0" />
                    <div>
                      <p className="font-sans font-medium text-ink text-sm">{s.name}</p>
                      <p className="text-xs text-ink3 font-sans">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>

          {/* What PropertyLens isn't + bio */}
          <FadeUp delay={0.1}>
            <div className="space-y-8">
              <div>
                <p className="section-tag mb-4">what we're not</p>
                <div className="space-y-2">
                  {[
                    'Not a replacement for a licensed home inspector',
                    'Not a certified appraiser',
                    'Not a mortgage broker or financial advisor',
                    'Not a brokerage — this is a tool, not a transaction',
                  ].map(item => (
                    <p key={item} className="text-sm text-ink2 font-sans flex items-start gap-2">
                      <span className="text-ink4 mt-0.5">—</span>
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-cream3 p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-greenl rounded-full flex items-center justify-center shrink-0">
                    <span className="font-serif text-green text-lg font-bold">MK</span>
                  </div>
                  <div>
                    <p className="font-sans font-medium text-ink">{AGENT_NAME}</p>
                    {/* TODO: MAHESH TO PROVIDE brokerage name */}
                    <p className="text-sm text-ink3 font-sans">Salesperson, {BROKERAGE_NAME}</p>
                    {/* TODO: MAHESH TO PROVIDE RECO reg number */}
                    <p className="text-[10px] text-ink4 font-sans">RECO Reg. #{RECO_REG}</p>
                  </div>
                </div>
                {/* TODO: MAHESH TO PROVIDE brokerage logo */}
                <img src={BROKERAGE_LOGO} alt="Brokerage" className="h-7 object-contain mb-4 opacity-70" onError={e => { e.target.style.display='none'; }} />
                <p className="text-sm text-ink2 font-sans leading-relaxed">
                  Licensed Ontario realtor. Lead Product Owner AI at RBC Insurance. Master of Management in AI from Queen's University. I built PropertyLens because buyers deserve the same quality of insight that institutional investors have — without paying for a data subscription.
                </p>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* Compliance band */}
      <section className="bg-ink py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <FadeUp>
            <p className="section-tag text-white/40 text-center mb-10">regulatory compliance</p>
          </FadeUp>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COMPLIANCE_CARDS.map((card, i) => (
              <FadeUp key={card.title} delay={i * 0.08}>
                <div className="bg-white/5 rounded-2xl p-5 border border-white/10 h-full">
                  <div className="w-9 h-9 bg-green/20 rounded-xl flex items-center justify-center mb-4">
                    <card.icon size={16} className="text-green" />
                  </div>
                  <p className="font-sans font-medium text-white text-sm mb-2">{card.title}</p>
                  <p className="text-xs text-white/50 font-sans leading-relaxed">{card.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
