import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bed, Bath, Maximize2, Clock, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatPrice, formatDaysAgo, getSignalColour } from '../lib/formatters';
import Disclaimer from './Disclaimer';

export default function PropertyCard({ property, inline = false, onRunCMA, onSave }) {
  const {
    id, price, address, beds, baths, sqft, daysListed,
    tags = [], signal, verdict = 'at_average',
    imageUrl,
  } = property;

  const signalColour = getSignalColour(verdict);
  const VerdictIcon  = verdict === 'below_average' ? TrendingDown
    : verdict === 'above_average' ? TrendingUp : Minus;

  return (
    <motion.div
      initial={inline ? { opacity: 0, x: 20 } : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.3 }}
      className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-200 max-w-sm"
    >
      {/* Image */}
      <div className="relative h-44 bg-gradient-to-br from-greenl to-greenm overflow-hidden">
        {imageUrl
          ? <img src={imageUrl} alt={address} className="w-full h-full object-cover" />
          : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-green/20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-green">
                    <path d="M3 10L10 3l7 7v7H13v-4H7v4H3V10z" stroke="#2A7A55" strokeWidth="1.5" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-green/60 text-xs font-sans">photo coming soon</p>
              </div>
            </div>
          )
        }
        {/* Days listed badge */}
        <div className="absolute top-2 right-2 bg-ink/80 text-white text-[10px] font-sans px-2 py-1 rounded-md flex items-center gap-1">
          <Clock size={10} />
          {formatDaysAgo(daysListed)}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <p className="font-serif text-2xl text-ink">{formatPrice(price)}</p>
          {verdict !== 'at_average' && (
            <span className={`inline-flex items-center gap-1 text-[10px] font-sans px-2 py-1 rounded-full font-medium ${signalColour}`}>
              <VerdictIcon size={10} />
              {verdict === 'below_average' ? 'below avg' : 'above avg'}
            </span>
          )}
        </div>

        <p className="text-sm text-ink2 font-sans mb-3 leading-snug">{address}</p>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-ink3 font-sans mb-3">
          <span className="flex items-center gap-1"><Bed size={13} />{beds} bd</span>
          <span className="flex items-center gap-1"><Bath size={13} />{baths} ba</span>
          {sqft && <span className="flex items-center gap-1"><Maximize2 size={13} />{sqft?.toLocaleString()}</span>}
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map(tag => (
              <span key={tag} className="text-[10px] font-sans bg-cream2 text-ink2 px-2 py-1 rounded-md">{tag}</span>
            ))}
          </div>
        )}

        {/* Signal */}
        {signal && (
          <p className="text-[11px] text-ink3 font-sans mb-3 italic">{signal}</p>
        )}

        <Disclaimer type="ai-estimate" className="mb-3" />

        {/* Actions */}
        <div className="flex gap-2">
          {id && (
            <Link
              to={`/property/${id}`}
              className="flex-1 text-center text-sm font-sans font-medium py-2 px-3 bg-green text-white rounded-lg hover:bg-greend transition-colors min-h-[36px] flex items-center justify-center"
            >
              View Details
            </Link>
          )}
          {onRunCMA && (
            <button
              onClick={() => onRunCMA(property)}
              className="flex-1 text-sm font-sans font-medium py-2 px-3 bg-cream2 text-ink2 rounded-lg hover:bg-cream3 transition-colors min-h-[36px]"
            >
              Run CMA
            </button>
          )}
          {onSave && (
            <button
              onClick={() => onSave(property)}
              className="p-2 bg-cream2 text-ink2 rounded-lg hover:bg-cream3 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
              aria-label="Save property"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 12L1.5 7A3.5 3.5 0 017 2.01 3.5 3.5 0 0112.5 7L7 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
