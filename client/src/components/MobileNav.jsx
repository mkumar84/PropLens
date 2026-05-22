import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, Map, BarChart2, Search } from 'lucide-react';

const tabs = [
  { to: '/',           label: 'home',    icon: Home },
  { to: '/chat',       label: 'search',  icon: MessageCircle },
  { to: '/map',        label: 'map',     icon: Map },
  { to: '/cma',        label: 'cma',     icon: BarChart2 },
  { to: '/open-house', label: 'houses',  icon: Search },
];

export default function MobileNav() {
  const { pathname } = useLocation();

  return (
    <nav className="mobile-nav fixed bottom-0 left-0 right-0 z-40 bg-cream border-t border-cream3 md:hidden">
      <div className="flex">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 min-h-[56px] transition-colors ${
                active ? 'text-green' : 'text-ink3'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className={`text-[10px] font-sans ${active ? 'font-medium' : ''}`}>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
