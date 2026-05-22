import { Link } from 'react-router-dom';
import { FOOTER_LINES, DISCLAIMERS, AGENT_NAME, BROKERAGE_NAME, RECO_REG, BROKERAGE_LOGO, CONTACT_EMAIL, CURRENT_YEAR } from '../constants/compliance';

export default function Footer({ lastUpdated }) {
  return (
    <footer className="bg-ink text-cream/80 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center shrink-0">
                <span className="text-white font-serif text-sm font-bold">PL</span>
              </div>
              <span className="font-serif text-xl text-cream">PropertyLens</span>
            </div>
            {/* TODO: MAHESH TO PROVIDE brokerage logo */}
            <img src={BROKERAGE_LOGO} alt="Brokerage" className="h-8 object-contain mb-3 opacity-80" onError={e => { e.target.style.display='none'; }} />
            <p className="text-xs text-cream/50 leading-relaxed">
              Ontario's AI-powered real estate assistant. Built by a licensed realtor, for people who hate being sold to.
            </p>
          </div>

          {/* Search */}
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">explore</p>
            <div className="flex flex-col gap-2">
              {[['/', 'home'], ['/chat', 'search'], ['/map', 'map view'], ['/cma', 'run a cma'], ['/open-house', 'open house']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-cream/60 hover:text-cream transition-colors">{label}</Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">company</p>
            <div className="flex flex-col gap-2">
              {[['/about', 'about'], ['/privacy', 'privacy policy'], ['/terms', 'terms of use']].map(([to, label]) => (
                <Link key={to} to={to} className="text-sm text-cream/60 hover:text-cream transition-colors">{label}</Link>
              ))}
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-cream/60 hover:text-cream transition-colors">contact</a>
            </div>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-cream/40 mb-4">contact</p>
            <p className="text-sm text-cream/60 mb-1">{AGENT_NAME}</p>
            {/* TODO: MAHESH TO PROVIDE brokerage name */}
            <p className="text-sm text-cream/40 mb-3">{BROKERAGE_NAME}</p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-green hover:text-greenm transition-colors">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>

        {/* Compliance block */}
        <div className="border-t border-cream/10 pt-8 space-y-2">
          {FOOTER_LINES.map((line, i) => (
            <p key={i} className="disclaimer-text text-cream/40">{line}</p>
          ))}
          {lastUpdated && (
            <p className="disclaimer-text text-cream/40">
              Listing information last updated {lastUpdated}. {DISCLAIMERS['mls-data']}
            </p>
          )}
          {!lastUpdated && (
            <p className="disclaimer-text text-cream/40">{DISCLAIMERS['mls-data']}</p>
          )}
          <div className="flex gap-4 pt-2">
            <Link to="/privacy" className="text-[10px] text-cream/30 hover:text-cream/50 transition-colors">Privacy Policy</Link>
            <Link to="/terms"   className="text-[10px] text-cream/30 hover:text-cream/50 transition-colors">Terms of Use</Link>
            <span className="text-[10px] text-cream/30">© {CURRENT_YEAR} PropertyLens</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
