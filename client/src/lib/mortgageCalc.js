// Canadian mortgage calculator utilities

const STRESS_TEST_BUFFER = 0.02; // qualifying rate = contract + 2%
const CMHC_THRESHOLD = 1_000_000;

export function calculateMonthlyPayment(principal, annualRate, amortizationYears) {
  const monthlyRate = annualRate / 100 / 12;
  const n = amortizationYears * 12;
  if (monthlyRate === 0) return principal / n;
  return principal * (monthlyRate * Math.pow(1 + monthlyRate, n)) /
    (Math.pow(1 + monthlyRate, n) - 1);
}

export function stressTestRate(contractRate) {
  return Math.max(contractRate + STRESS_TEST_BUFFER, 0.0525);
}

export function cmhcRequired(purchasePrice, downPaymentPct) {
  if (purchasePrice >= CMHC_THRESHOLD) return false;
  return downPaymentPct < 0.2;
}

export function cmhcPremium(purchasePrice, downPaymentPct) {
  const loan = purchasePrice * (1 - downPaymentPct);
  const ltv = loan / purchasePrice;
  let rate = 0;
  if (ltv <= 0.65) rate = 0.006;
  else if (ltv <= 0.75) rate = 0.017;
  else if (ltv <= 0.80) rate = 0.024;
  else if (ltv <= 0.85) rate = 0.028;
  else if (ltv <= 0.90) rate = 0.031;
  else rate = 0.04;
  return loan * rate;
}

export function ontarioLandTransferTax(price) {
  let tax = 0;
  const brackets = [
    { limit: 55_000,    rate: 0.005 },
    { limit: 250_000,   rate: 0.01 },
    { limit: 400_000,   rate: 0.015 },
    { limit: 2_000_000, rate: 0.02 },
    { limit: Infinity,  rate: 0.025 },
  ];
  let prev = 0;
  for (const { limit, rate } of brackets) {
    if (price <= prev) break;
    const taxable = Math.min(price, limit) - prev;
    tax += taxable * rate;
    prev = limit;
  }
  return tax;
}

export function firstTimeBuyerRebate(price) {
  const tax = ontarioLandTransferTax(price);
  return Math.min(tax, 4_000);
}
