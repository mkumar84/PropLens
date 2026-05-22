import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bed, Bath, Maximize2, Clock, AlertTriangle, ArrowRight, Calendar, Phone } from 'lucide-react';
import { useListings } from '../hooks/useListings';
import { useLeadCapture } from '../hooks/useLeadCapture';
import LeadModal from '../components/LeadModal';
import Disclaimer from '../components/Disclaimer';
import {
  formatPrice, formatDaysAgo, formatSqft, formatPercent,
} from '../lib/formatters';
import {
  calculateMonthlyPayment, stressTestRate, cmhcRequired, cmhcPremium,
  ontarioLandTransferTax, firstTimeBuyerRebate,
} from '../lib/mortgageCalc';
import {
  AGENT_NAME, BROKERAGE_NAME, RECO_REG, BROKERAGE_LOGO,
} from '../constants/compliance';

const TABS = ['overview', 'cma analysis', 'investment', 'mortgage'];

function TabBar({ active, onChange }) {
  return (
    <div className="sticky top-16 z-10 bg-cream border-b border-cream3 overflow-x-auto">
      <div className="flex gap-1 px-4 sm:px-6 max-w-5xl mx-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`shrink-0 px-4 py-3 text-sm font-sans font-medium border-b-2 transition-all min-h-[44px] ${
              active === tab
                ? 'border-green text-green'
                : 'border-transparent text-ink3 hover:text-ink'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ listing, onAskFollowUp }) {
  const flags = listing?.redFlags || [];
  return (
    <div className="space-y-6">
      {/* AI summary */}
      <div className="bg-greenl rounded-2xl border border-greenm p-6">
        <p className="text-xs uppercase tracking-widest text-green font-sans mb-3">what we noticed</p>
        <p className="text-sm text-ink font-sans leading-relaxed">
          {listing?.aiSummary || `This ${listing?.numBedrooms}-bed ${listing?.type || 'property'} in ${listing?.city || 'Ontario'} has been listed for ${listing?.daysOnMarket || 0} days. ${listing?.daysOnMarket > 21 ? 'The extended time on market suggests potential negotiation room.' : 'Relatively fresh listing — worth moving quickly if it checks out.'}`}
        </p>
        <Disclaimer type="ai-estimate" className="mt-3 block" />
      </div>

      {/* Specs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: 'bedrooms',    value: listing?.numBedrooms || '—' },
          { label: 'bathrooms',   value: listing?.numBathrooms || '—' },
          { label: 'size',        value: listing?.sqft ? formatSqft(listing.sqft) : '—' },
          { label: 'lot size',    value: listing?.lotWidth ? `${listing.lotWidth}×${listing.lotDepth} ft` : '—' },
          { label: 'year built',  value: listing?.yearBuilt || '—' },
          { label: 'days listed', value: formatDaysAgo(listing?.daysOnMarket || 0) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-cream3 p-4">
            <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">{label}</p>
            <p className="font-serif text-xl text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Red flags */}
      {flags.length > 0 && (
        <div className="bg-warml rounded-2xl border border-warm/30 p-5 space-y-2">
          <p className="text-xs uppercase tracking-widest text-warm font-sans mb-3 flex items-center gap-2">
            <AlertTriangle size={12} />
            potential flags
          </p>
          {flags.map((flag, i) => (
            <p key={i} className="text-sm text-ink2 font-sans leading-relaxed flex items-start gap-2">
              <span className="text-warm mt-0.5">·</span>
              {flag}
            </p>
          ))}
        </div>
      )}

      <button onClick={onAskFollowUp} className="btn-secondary w-full sm:w-auto">
        ask a follow-up in chat <ArrowRight size={14} />
      </button>
    </div>
  );
}

function CMATab({ listing }) {
  const price = listing?.listPrice || 0;
  return (
    <div className="space-y-6">
      <Disclaimer type="cma" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'avg DOM area',    value: `${listing?.areaAvgDOM || '—'} days` },
          { label: 'over asking %',   value: `${listing?.areaOverAskingPct != null ? formatPercent(listing.areaOverAskingPct) : '—'}` },
          { label: 'active listings', value: listing?.areaActiveCount || '—' },
          { label: 'absorption',      value: listing?.absorptionChange || '—' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-cream3 p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">{label}</p>
            <p className="font-serif text-2xl text-ink">{value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-cream3 p-6">
        <p className="text-sm text-ink2 font-sans leading-relaxed">
          Run a full CMA on this property to see comparable solds, price history, and a negotiation verdict.
        </p>
        <Link to="/cma" className="btn-primary mt-4 inline-flex">
          run full CMA →
        </Link>
      </div>
    </div>
  );
}

function InvestmentTab({ listing }) {
  const price    = listing?.listPrice || 800000;
  const rent     = Math.round(price * 0.004); // ~0.4% monthly gross yield estimate
  const grossYield  = (rent * 12 / price * 100).toFixed(2);
  const expenses    = rent * 0.45;
  const noi         = rent - expenses;
  const capRate     = (noi * 12 / price * 100).toFixed(2);
  const cashflow    = noi - calculateMonthlyPayment(price * 0.8, 5.5, 25);

  return (
    <div className="space-y-6">
      <Disclaimer type="investment" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'est. monthly rent', value: formatPrice(rent) },
          { label: 'gross yield',       value: `${grossYield}%` },
          { label: 'cap rate (est.)',   value: `${capRate}%` },
          { label: 'monthly cashflow',  value: formatPrice(Math.round(cashflow)) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-cream3 p-4 text-center">
            <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">{label}</p>
            <p className={`font-serif text-2xl ${label === 'monthly cashflow' ? (cashflow >= 0 ? 'text-green' : 'text-warm') : 'text-ink'}`}>{value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-cream3 p-6">
        <h4 className="font-serif text-lg text-ink mb-4">monthly cash flow breakdown</h4>
        <div className="space-y-2">
          {[
            { label: 'gross rent',         value: formatPrice(rent),            positive: true },
            { label: 'vacancy (5%)',        value: `−${formatPrice(Math.round(rent*0.05))}` },
            { label: 'property mgmt (8%)', value: `−${formatPrice(Math.round(rent*0.08))}` },
            { label: 'maintenance',        value: `−${formatPrice(Math.round(rent*0.08))}` },
            { label: 'insurance/tax',      value: `−${formatPrice(Math.round(rent*0.12))}` },
            { label: 'mortgage payment',   value: `−${formatPrice(Math.round(calculateMonthlyPayment(price*0.8, 5.5, 25)))}` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between py-2 border-b border-cream2 last:border-0 text-sm font-sans">
              <span className="text-ink2">{label}</span>
              <span className="text-ink font-medium">{value}</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 text-sm font-sans font-medium">
            <span className="text-ink">net cash flow</span>
            <span className={cashflow >= 0 ? 'text-green' : 'text-warm'}>
              {cashflow >= 0 ? '+' : ''}{formatPrice(Math.round(cashflow))}
            </span>
          </div>
        </div>
        <p className="disclaimer-text mt-3">Estimates assume 20% down, 5.5% rate, 25yr amortization. Not financial advice.</p>
      </div>
    </div>
  );
}

function MortgageTab({ listing }) {
  const [rate, setRate]     = useState(5.5);
  const [down, setDown]     = useState(20);
  const [amort, setAmort]   = useState(25);
  const price = listing?.listPrice || 800000;
  const downAmt   = price * down / 100;
  const principal = price - downAmt;
  const monthly   = calculateMonthlyPayment(principal, rate, amort);
  const stressRate = stressTestRate(rate / 100);
  const stressMonthly = calculateMonthlyPayment(principal, stressRate * 100, amort);
  const needsCMHC = cmhcRequired(price, down / 100);
  const cmhc      = needsCMHC ? cmhcPremium(price, down / 100) : 0;
  const ltt       = ontarioLandTransferTax(price);
  const ftbRebate = firstTimeBuyerRebate(price);

  return (
    <div className="space-y-6">
      <Disclaimer type="mortgage" />
      <div className="bg-white rounded-2xl border border-cream3 p-6">
        <h4 className="font-serif text-2xl text-ink mb-2">{formatPrice(Math.round(monthly))}<span className="text-base text-ink3 font-sans">/mo</span></h4>
        <p className="text-xs text-ink4 font-sans mb-6">estimated qualifying amount at {rate}% — not a mortgage commitment</p>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-ink3 font-sans">interest rate</label>
              <span className="text-xs font-medium text-ink font-sans">{rate}%</span>
            </div>
            <input type="range" min="3" max="10" step="0.1" value={rate}
              onChange={e => setRate(+e.target.value)}
              className="w-full accent-green" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-ink3 font-sans">down payment</label>
              <span className="text-xs font-medium text-ink font-sans">{down}% ({formatPrice(downAmt)})</span>
            </div>
            <input type="range" min="5" max="50" step="1" value={down}
              onChange={e => setDown(+e.target.value)}
              className="w-full accent-green" />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <label className="text-xs text-ink3 font-sans">amortization</label>
              <span className="text-xs font-medium text-ink font-sans">{amort} years</span>
            </div>
            <input type="range" min="5" max="30" step="5" value={amort}
              onChange={e => setAmort(+e.target.value)}
              className="w-full accent-green" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-cream3 p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">stress test rate</p>
          <p className="font-serif text-2xl text-ink">{(stressRate * 100).toFixed(2)}%</p>
          <p className="text-xs text-ink3 font-sans mt-1">est. qualifying: {formatPrice(Math.round(stressMonthly))}/mo</p>
        </div>
        <div className={`rounded-xl border p-4 ${needsCMHC ? 'bg-warml border-warm/30' : 'bg-greenl border-greenm'}`}>
          <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">CMHC insurance</p>
          <p className="font-serif text-2xl text-ink">{needsCMHC ? formatPrice(Math.round(cmhc)) : 'not required'}</p>
          <p className="text-xs text-ink3 font-sans mt-1">{needsCMHC ? 'Added to mortgage' : 'Down ≥ 20%'}</p>
        </div>
        <div className="bg-white rounded-xl border border-cream3 p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">Ontario LTT</p>
          <p className="font-serif text-2xl text-ink">{formatPrice(Math.round(ltt))}</p>
        </div>
        <div className="bg-greenl rounded-xl border border-greenm p-4">
          <p className="text-[10px] uppercase tracking-wider text-ink4 font-sans mb-1">first-time buyer rebate</p>
          <p className="font-serif text-2xl text-green">{formatPrice(ftbRebate)}</p>
          <p className="text-xs text-ink3 font-sans mt-1">if eligible</p>
        </div>
      </div>
    </div>
  );
}

export default function Property() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [modalType, setModalType] = useState(null);
  const { getListing } = useListings();
  const { submitLead } = useLeadCapture();

  useEffect(() => {
    getListing(id).then(data => {
      setListing(data);
      setLoading(false);
    });
  }, [id]);

  const handleLeadSubmit = async (data) => {
    await submitLead({ ...data, propertyAddress: listing?.address });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-8 h-8 border-2 border-cream3 border-t-green rounded-full"
        />
      </div>
    );
  }

  const price   = listing?.listPrice || 0;
  const address = listing?.address || `${listing?.streetNumber || ''} ${listing?.streetName || ''}, ${listing?.city || 'Ontario'}`;

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      {/* Hero band */}
      <div className="bg-gradient-to-r from-greend to-green text-white px-4 sm:px-6 lg:px-8 py-10">
        <div className="max-w-5xl mx-auto">
          <p className="text-white/60 font-sans text-xs mb-2">{listing?.city}, Ontario</p>
          <h1 className="font-serif text-3xl sm:text-4xl mb-3">{address}</h1>
          <div className="flex items-center gap-4 flex-wrap">
            <p className="font-serif text-4xl">{formatPrice(price)}</p>
            <div className="flex gap-2 flex-wrap">
              {listing?.daysOnMarket != null && (
                <span className="bg-white/20 text-white text-xs font-sans px-3 py-1 rounded-full flex items-center gap-1">
                  <Clock size={10} />
                  {formatDaysAgo(listing.daysOnMarket)}
                </span>
              )}
              {listing?.type && (
                <span className="bg-white/20 text-white text-xs font-sans px-3 py-1 rounded-full">{listing.type}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Photo strip */}
      <div className="grid grid-cols-5 gap-1 max-w-5xl mx-auto px-4 sm:px-6 mt-4">
        <div className="col-span-3 h-52 sm:h-72 bg-gradient-to-br from-greenl to-greenm rounded-xl flex items-center justify-center">
          <p className="text-green/50 text-sm font-sans">main photo</p>
        </div>
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-[calc(50%-2px)] bg-cream2 rounded-lg flex items-center justify-center first:mt-0" style={{ height: i < 2 ? 'calc(136px - 2px)' : 'calc(136px - 2px)', marginTop: i >= 2 ? '4px' : 0 }}>
            <p className="text-ink4 text-xs font-sans">{['bedroom', 'kitchen', 'bathroom', 'backyard'][i]}</p>
          </div>
        ))}
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 mt-6 lg:grid lg:grid-cols-[1fr_296px] lg:gap-8">
        {/* Main content */}
        <div>
          <TabBar active={activeTab} onChange={setActiveTab} />
          <div className="py-6">
            {activeTab === 'overview'     && <OverviewTab listing={listing} onAskFollowUp={() => window.location.href = '/chat'} />}
            {activeTab === 'cma analysis' && <CMATab listing={listing} />}
            {activeTab === 'investment'   && <InvestmentTab listing={listing} />}
            {activeTab === 'mortgage'     && <MortgageTab listing={listing} />}
          </div>
        </div>

        {/* Sticky sidebar */}
        <div className="hidden lg:block">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white rounded-2xl border border-cream3 p-6">
              <p className="font-serif text-xl text-ink mb-4">Interested in this one?</p>
              <div className="space-y-3">
                <button
                  onClick={() => setModalType('tour')}
                  className="btn-primary w-full"
                >
                  <Calendar size={16} />
                  book a showing
                </button>
                <button
                  onClick={() => setModalType('cma')}
                  className="btn-secondary w-full"
                >
                  full CMA report
                </button>
                <Link to="/chat" className="btn-ghost w-full">
                  ask a question
                </Link>
              </div>

              {/* Agent card */}
              <div className="mt-6 pt-5 border-t border-cream2">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-greenl rounded-full flex items-center justify-center shrink-0">
                    <span className="font-serif text-green text-sm font-bold">MK</span>
                  </div>
                  <div>
                    <p className="font-sans font-medium text-ink text-sm">{AGENT_NAME}</p>
                    {/* TODO: MAHESH TO PROVIDE brokerage name */}
                    <p className="text-xs text-ink3 font-sans">Salesperson, {BROKERAGE_NAME}</p>
                    {/* TODO: MAHESH TO PROVIDE RECO reg number */}
                    <p className="text-[10px] text-ink4 font-sans">RECO Reg. #{RECO_REG}</p>
                  </div>
                </div>
                {/* TODO: MAHESH TO PROVIDE brokerage logo */}
                <img src={BROKERAGE_LOGO} alt="Brokerage" className="h-6 object-contain mb-3 opacity-60" onError={e => { e.target.style.display='none'; }} />
                <p className="text-xs text-ink3 font-sans">Happy to jump on a free 15-min call.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTA */}
      <div className="lg:hidden fixed bottom-16 left-0 right-0 p-4 bg-cream border-t border-cream3">
        <button onClick={() => setModalType('tour')} className="btn-primary w-full">
          book a showing
        </button>
      </div>

      {modalType && (
        <LeadModal
          type={modalType}
          propertyAddress={address}
          onSubmit={handleLeadSubmit}
          onClose={() => setModalType(null)}
        />
      )}
    </div>
  );
}
