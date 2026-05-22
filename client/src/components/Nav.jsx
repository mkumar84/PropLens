import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BROKERAGE_LOGO } from '../constants/compliance';

const links = [
  { to: '/chat',       label: 'search' },
  { to: '/map',        label: 'map' },
  { to: '/cma',        label: 'cma' },
  { to: '/open-house', label: 'open house' },
  { to: '/about',      label: 'about' },
];

export default function Nav() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-cream/90 backdrop-blur-md border-b border-cream3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 bg-green rounded-lg flex items-center justify-center">
            <span className="text-white font-serif text-sm font-bold">PL</span>
          </div>
          <span className="font-serif text-xl text-ink hidden sm:block">PropertyLens</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-4 py-2 rounded-lg text-sm font-sans transition-all duration-200 min-h-[44px] flex items-center ${
                pathname === to
                  ? 'text-green bg-greenl font-medium'
                  : 'text-ink2 hover:text-ink hover:bg-cream2'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right: Brokerage logo + CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* TODO: MAHESH TO PROVIDE brokerage logo */}
          <img src={BROKERAGE_LOGO} alt="Brokerage" className="h-8 object-contain opacity-70" onError={e => { e.target.style.display='none'; }} />
          <Link to="/chat" className="btn-primary text-sm">
            let's find your place →
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 rounded-lg text-ink2 hover:bg-cream2 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-cream3 bg-cream overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {links.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`px-4 py-3 rounded-xl text-sm font-sans ${
                    pathname === to
                      ? 'text-green bg-greenl font-medium'
                      : 'text-ink2 hover:bg-cream2'
                  }`}
                >
                  {label}
                </Link>
              ))}
              <Link
                to="/chat"
                onClick={() => setOpen(false)}
                className="btn-primary text-sm mt-2"
              >
                let's find your place →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
