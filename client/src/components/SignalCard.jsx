import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity } from 'lucide-react';
import { formatPercent } from '../lib/formatters';

export default function SignalCard({ signal }) {
  const {
    neighbourhood, avgDOM, overAskingPct, absorptionChange,
    growthGrade, headline, activeListings, marketCondition,
  } = signal;

  const isHot    = typeof absorptionChange === 'string'
    ? absorptionChange.startsWith('+')
    : absorptionChange > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-xl border border-warm/30 bg-warml p-4 max-w-sm"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest font-sans text-warm mb-1">market signal</p>
          <p className="font-sans font-medium text-ink text-sm">{neighbourhood}</p>
        </div>
        <div className={`p-2 rounded-lg ${isHot ? 'bg-warm/20' : 'bg-ink/10'}`}>
          {isHot ? <TrendingUp size={16} className="text-warm" /> : <Activity size={16} className="text-ink3" />}
        </div>
      </div>

      {headline && (
        <p className="text-sm font-sans text-ink mb-3 leading-snug">{headline}</p>
      )}

      <div className="grid grid-cols-2 gap-2">
        {avgDOM != null && (
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-ink3 font-sans">avg days on market</p>
            <p className="font-serif text-lg text-ink">{avgDOM}</p>
          </div>
        )}
        {overAskingPct != null && (
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-ink3 font-sans">over asking</p>
            <p className={`font-serif text-lg ${overAskingPct >= 0 ? 'text-warm' : 'text-green'}`}>
              {formatPercent(overAskingPct)}
            </p>
          </div>
        )}
        {absorptionChange != null && (
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-ink3 font-sans">absorption MoM</p>
            <p className={`font-serif text-lg ${isHot ? 'text-warm' : 'text-green'}`}>{absorptionChange}</p>
          </div>
        )}
        {growthGrade && (
          <div className="bg-white/60 rounded-lg p-2">
            <p className="text-[10px] text-ink3 font-sans">growth grade</p>
            <p className="font-serif text-lg text-ink">{growthGrade}</p>
          </div>
        )}
      </div>

      {marketCondition && (
        <div className="mt-3 pt-3 border-t border-warm/20">
          <span className={`text-[11px] font-sans font-medium px-2 py-1 rounded-full ${
            marketCondition === 'sellers' ? 'bg-warm/20 text-warm'
            : marketCondition === 'buyers' ? 'bg-greenl text-green'
            : 'bg-cream2 text-ink3'
          }`}>
            {marketCondition === 'sellers' ? "Seller's Market"
             : marketCondition === 'buyers' ? "Buyer's Market"
             : 'Balanced Market'}
          </span>
        </div>
      )}
    </motion.div>
  );
}
