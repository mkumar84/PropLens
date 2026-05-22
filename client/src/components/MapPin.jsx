export default function MapPin({ price, active = false, cluster = false, count }) {
  if (cluster) {
    return (
      <div className={`flex items-center justify-center rounded-full font-sans font-medium text-white shadow-lg transition-all ${
        active ? 'w-14 h-14 text-base bg-greend' : 'w-10 h-10 text-sm bg-green'
      }`}>
        {count}
      </div>
    );
  }

  const label = price >= 1_000_000
    ? `$${(price / 1_000_000).toFixed(1)}M`
    : `$${(price / 1_000).toFixed(0)}K`;

  return (
    <div className={`relative group transition-all ${active ? 'z-10' : ''}`}>
      <div className={`
        px-2 py-1 rounded-lg font-sans text-xs font-medium shadow-md transition-all
        ${active
          ? 'bg-greend text-white scale-110 shadow-lg'
          : 'bg-white text-ink border border-cream3 hover:border-green hover:text-green hover:scale-105'
        }
      `}>
        {label}
      </div>
      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-2 h-2 rotate-45 -mt-1 ${
        active ? 'bg-greend' : 'bg-white border-r border-b border-cream3'
      }`} />
    </div>
  );
}
