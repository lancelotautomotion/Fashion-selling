import { daysBetween, parseDate } from './formatters.js';

const MONTH_LABELS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

function monthKey(isoDate) {
  const [y, m] = isoDate.split('-');
  return `${y}-${m}`;
}

function monthLabel(key) {
  const [y, m] = key.split('-');
  return `${MONTH_LABELS[parseInt(m, 10) - 1]} ${y.slice(2)}`;
}

/* Returns sorted list of unique month keys present in items */
export function getAvailableMonths(items) {
  const keys = new Set();
  items.forEach((it) => {
    if (it.purchaseDate) keys.add(monthKey(it.purchaseDate));
    if (it.soldDate)     keys.add(monthKey(it.soldDate));
  });
  return [...keys].sort();
}

/* Filter items based on selected period value */
export function filterByPeriod(items, period) {
  if (period === 'all') return items;

  const now = new Date();
  const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  if (period === 'thisMonth') {
    return items.filter(
      (it) => (it.soldDate && monthKey(it.soldDate) === currentKey) ||
               (!it.sold && it.listedDate && monthKey(it.listedDate) === currentKey)
    );
  }

  if (period === 'last3') {
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - 3);
    return items.filter((it) => {
      const ref = it.soldDate || it.listedDate || it.purchaseDate;
      return ref && new Date(ref) >= cutoff;
    });
  }

  if (period === 'last6') {
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - 6);
    return items.filter((it) => {
      const ref = it.soldDate || it.listedDate || it.purchaseDate;
      return ref && new Date(ref) >= cutoff;
    });
  }

  /* specific month key like "2026-04" */
  if (/^\d{4}-\d{2}$/.test(period)) {
    return items.filter(
      (it) => (it.soldDate && monthKey(it.soldDate) === period) ||
               (!it.sold && it.listedDate && monthKey(it.listedDate) === period)
    );
  }

  return items;
}

/*
  Returns array of monthly buckets:
  [{ key, label, revenue, investment, profit, soldCount, stockCount, avgDays }]
*/
export function aggregateByMonth(items) {
  const map = new Map();

  const ensure = (key) => {
    if (!map.has(key)) {
      map.set(key, {
        key,
        label:       monthLabel(key),
        revenue:     0,
        investment:  0,
        profit:      0,
        soldCount:   0,
        stockCount:  0,
        totalDays:   0,
        daysCount:   0,
        avgDays:     0,
      });
    }
    return map.get(key);
  };

  items.forEach((it) => {
    /* Sold items → bucket by soldDate month */
    if (it.sold && it.soldDate) {
      const b = ensure(monthKey(it.soldDate));
      b.revenue    += it.salePrice ?? 0;
      b.investment += it.purchasePrice;
      b.profit     += (it.salePrice ?? 0) - it.purchasePrice;
      b.soldCount  += 1;

      if (it.listedDate && it.soldDate) {
        const d = daysBetween(parseDate(it.listedDate), parseDate(it.soldDate));
        if (d >= 0) {
          b.totalDays += d;
          b.daysCount += 1;
        }
      }
    }

    /* Unsold items → bucket by listedDate month for stock count */
    if (!it.sold && it.listedDate) {
      const b = ensure(monthKey(it.listedDate));
      b.stockCount += 1;
    }
  });

  /* Finalise avgDays */
  map.forEach((b) => {
    b.avgDays = b.daysCount > 0 ? Math.round(b.totalDays / b.daysCount) : null;
  });

  return [...map.values()].sort((a, b) => a.key.localeCompare(b.key));
}

/* Summary KPIs for the filtered item set */
export function computeSummaryKpis(items) {
  const sold = items.filter((it) => it.sold);
  const revenue    = sold.reduce((s, it) => s + (it.salePrice ?? 0), 0);
  const investment = items.reduce((s, it) => s + it.purchasePrice, 0);
  const profit     = sold.reduce((s, it) => s + ((it.salePrice ?? 0) - it.purchasePrice), 0);
  const margin     = revenue > 0 ? (profit / revenue) * 100 : 0;

  const daysArr = sold
    .filter((it) => it.listedDate && it.soldDate)
    .map((it) => daysBetween(parseDate(it.listedDate), parseDate(it.soldDate)))
    .filter((d) => d >= 0);
  const avgDays = daysArr.length > 0
    ? Math.round(daysArr.reduce((s, d) => s + d, 0) / daysArr.length)
    : null;

  return {
    revenue,
    investment,
    profit,
    margin,
    soldCount:  sold.length,
    stockCount: items.filter((it) => !it.sold).length,
    avgDays,
  };
}
