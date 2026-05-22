export function formatPrice(price) {
  if (!price) return 'Price N/A';
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceShort(price) {
  if (!price) return 'N/A';
  if (price >= 1_000_000) return `$${(price / 1_000_000).toFixed(2)}M`;
  if (price >= 1_000) return `$${(price / 1_000).toFixed(0)}K`;
  return `$${price}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

export function formatDaysAgo(days) {
  if (days === 0) return 'Listed today';
  if (days === 1) return '1 day listed';
  return `${days} days listed`;
}

export function formatSqft(sqft) {
  if (!sqft) return 'N/A';
  return `${Number(sqft).toLocaleString('en-CA')} sqft`;
}

export function formatPercent(value, decimals = 1) {
  if (value == null) return 'N/A';
  const sign = value > 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(decimals)}%`;
}

export function getSignalColour(verdict) {
  switch (verdict) {
    case 'below_average': return 'text-green bg-greenl';
    case 'above_average': return 'text-warm bg-warml';
    case 'at_average':    return 'text-ink2 bg-cream2';
    default:              return 'text-ink3 bg-cream2';
  }
}

export function getMarketConditionLabel(condition) {
  switch (condition) {
    case 'sellers': return "Seller's Market";
    case 'buyers':  return "Buyer's Market";
    case 'balanced': return 'Balanced Market';
    default: return condition || 'Unknown';
  }
}
