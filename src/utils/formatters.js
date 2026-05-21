export const fmtDate = (date) =>
  date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: '2-digit' });

export const fmtEUR = (n) =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 2,
  }).format(n);

export const daysBetween = (a, b) =>
  Math.max(0, Math.round((b - a) / (1000 * 60 * 60 * 24)));

export const parseDate = (iso) => new Date(iso);
