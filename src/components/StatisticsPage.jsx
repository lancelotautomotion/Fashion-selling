import { useMemo, useState } from 'react';
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, LineChart, ReferenceLine,
} from 'recharts';
import Icon from './Icon.jsx';
import { fmtEUR } from '../utils/formatters.js';
import {
  aggregateByMonth,
  filterByPeriod,
  computeSummaryKpis,
  getAvailableMonths,
} from '../utils/statsHelpers.js';

/* ── Design tokens ── */
const C = {
  brand:   '#b56b2b',
  brandLt: '#e9caa3',
  success: '#4a8742',
  ink:     '#5d5d57',
  inkLt:   '#dededb',
  inkXlt:  '#f7f7f6',
  grid:    '#eeeeec',
  white:   '#ffffff',
};

/* ── Shared tooltip style ── */
const tooltipStyle = {
  backgroundColor: C.white,
  border: `1px solid ${C.inkLt}`,
  borderRadius: 10,
  boxShadow: '0 4px 16px rgb(15 15 13 / 0.08)',
  fontSize: 12,
  fontFamily: '"DM Sans", system-ui, sans-serif',
};
const tooltipLabelStyle = { color: C.ink, fontWeight: 600, marginBottom: 4 };

/* ── Period options ── */
const PERIOD_OPTIONS = [
  { value: 'thisMonth', label: 'Ce mois-ci' },
  { value: 'last3',     label: '3 derniers mois' },
  { value: 'last6',     label: '6 derniers mois' },
  { value: 'all',       label: 'Tout l\'historique' },
];

/* ── Summary KPI card ── */
function MiniKpi({ icon, label, value, sub, accent = false }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent ? 'bg-brand-100 text-brand-600' : 'bg-ink-100 text-ink-500'}`}>
        <Icon name={icon} size={18} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-medium text-ink-400 uppercase tracking-wider mb-0.5">{label}</div>
        <div className={`text-[22px] font-semibold tracking-tight leading-none num ${accent ? 'text-brand-700' : 'text-ink-900'}`}>{value}</div>
        {sub && <div className="text-[12px] text-ink-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}

/* ── Chart card wrapper ── */
function ChartCard({ title, subtitle, icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-6">
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
          <Icon name={icon} size={15} />
        </div>
        <div>
          <div className="text-[14px] font-semibold text-ink-900 leading-tight">{title}</div>
          {subtitle && <div className="text-[12px] text-ink-400 mt-0.5">{subtitle}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ── Custom Euro tooltip formatter ── */
function eurFormatter(v) { return [fmtEUR(v), '']; }

export default function StatisticsPage({ items }) {
  const [period, setPeriod] = useState('all');

  const filteredItems = useMemo(() => filterByPeriod(items, period), [items, period]);
  const monthlyData   = useMemo(() => aggregateByMonth(items), [items]);
  const kpis          = useMemo(() => computeSummaryKpis(filteredItems), [filteredItems]);

  /* For the charts, always show all months so axes are stable;
     but summary KPIs reflect the selected period */
  const chartData = monthlyData;

  /* Determine if there's enough data to show charts */
  const hasData = chartData.length > 0;

  const avgDaysData = chartData.filter((d) => d.avgDays !== null);

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-[26px] font-semibold text-ink-900 tracking-tight">Statistiques</h1>
          <p className="text-[14px] text-ink-500 mt-1">Analyse de vos performances de revente dans le temps.</p>
        </div>

        {/* Period filter */}
        <div className="flex items-center gap-2">
          <Icon name="calendar-range" size={15} className="text-ink-400" />
          <div className="flex items-center bg-ink-100 rounded-lg p-0.5">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setPeriod(opt.value)}
                className={
                  'px-3 py-1.5 text-[12px] font-medium rounded-md transition-all whitespace-nowrap ' +
                  (period === opt.value
                    ? 'bg-white text-ink-900 shadow-sm'
                    : 'text-ink-500 hover:text-ink-700')
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Summary KPIs ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <MiniKpi
          icon="trending-up" label="Chiffre d'affaires" accent
          value={fmtEUR(kpis.revenue)}
          sub={`${kpis.soldCount} article${kpis.soldCount > 1 ? 's' : ''} vendu${kpis.soldCount > 1 ? 's' : ''}`}
        />
        <MiniKpi
          icon="coins" label="Bénéfice net" accent
          value={fmtEUR(kpis.profit)}
          sub={kpis.margin > 0 ? `+${kpis.margin.toFixed(0)}% de marge` : '—'}
        />
        <MiniKpi
          icon="shopping-bag" label="Investi"
          value={fmtEUR(kpis.investment)}
          sub="Total des achats"
        />
        <MiniKpi
          icon="package" label="En stock"
          value={kpis.stockCount}
          sub="Articles disponibles"
        />
        <MiniKpi
          icon="clock" label="Temps moyen"
          value={kpis.avgDays !== null ? `${kpis.avgDays} j` : '—'}
          sub="Pour vendre un article"
        />
      </div>

      {!hasData ? (
        <div className="bg-white rounded-2xl border border-ink-100 shadow-card py-20 flex flex-col items-center gap-3 text-ink-400">
          <Icon name="bar-chart-2" size={32} />
          <div className="text-sm font-medium text-ink-500">Aucune donnée disponible</div>
          <div className="text-[12px]">Ajoutez des articles pour voir vos statistiques apparaître ici.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* ── Chart 1 : Évolution financière (full width) ── */}
          <div className="lg:col-span-2">
            <ChartCard
              icon="bar-chart-3"
              title="Évolution financière"
              subtitle="Chiffre d'affaires, investissement et bénéfice net par mois"
            >
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={C.grid} strokeDasharray="0" />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}€`}
                    tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                    axisLine={false}
                    tickLine={false}
                    width={48}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    formatter={(v, name) => {
                      const labels = { revenue: "CA", investment: "Investi", profit: "Bénéfice" };
                      return [fmtEUR(v), labels[name] ?? name];
                    }}
                  />
                  <Legend
                    formatter={(v) => {
                      const labels = { revenue: "Chiffre d'affaires", investment: "Investi", profit: "Bénéfice net" };
                      return <span style={{ fontSize: 11, color: C.ink }}>{labels[v] ?? v}</span>;
                    }}
                  />
                  <Bar dataKey="revenue"    fill={C.brand}   radius={[4, 4, 0, 0]} maxBarSize={40} name="revenue" />
                  <Bar dataKey="investment" fill={C.inkLt}   radius={[4, 4, 0, 0]} maxBarSize={40} name="investment" />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke={C.success}
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: C.success, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                    name="profit"
                  />
                  <ReferenceLine y={0} stroke={C.inkLt} strokeDasharray="4 2" />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          {/* ── Chart 2 : Volume de l'activité ── */}
          <ChartCard
            icon="activity"
            title="Volume de l'activité"
            subtitle="Articles vendus vs articles en stock par mois"
          >
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradSold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.brand}   stopOpacity={0.18} />
                    <stop offset="95%" stopColor={C.brand}   stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradStock" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={C.ink}     stopOpacity={0.10} />
                    <stop offset="95%" stopColor={C.ink}     stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={C.grid} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={tooltipLabelStyle}
                  formatter={(v, name) => {
                    const labels = { soldCount: 'Vendus', stockCount: 'En stock' };
                    return [`${v} article${v > 1 ? 's' : ''}`, labels[name] ?? name];
                  }}
                />
                <Legend
                  formatter={(v) => {
                    const labels = { soldCount: 'Vendus', stockCount: 'En stock' };
                    return <span style={{ fontSize: 11, color: C.ink }}>{labels[v] ?? v}</span>;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="soldCount"
                  stroke={C.brand}
                  strokeWidth={2}
                  fill="url(#gradSold)"
                  name="soldCount"
                  dot={{ r: 3, fill: C.brand, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
                <Area
                  type="monotone"
                  dataKey="stockCount"
                  stroke={C.ink}
                  strokeWidth={2}
                  fill="url(#gradStock)"
                  name="stockCount"
                  dot={{ r: 3, fill: C.ink, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  strokeDasharray="5 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* ── Chart 3 : Temps de vente moyen ── */}
          <ChartCard
            icon="timer"
            title="Temps de vente moyen"
            subtitle="Nombre de jours entre mise en ligne et vente"
          >
            {avgDaysData.length < 2 ? (
              <div className="h-[240px] flex flex-col items-center justify-center gap-2 text-ink-400">
                <Icon name="info" size={20} />
                <div className="text-[12px] text-center">
                  Pas encore assez de ventes<br />pour afficher une tendance.
                </div>
                {avgDaysData.length === 1 && (
                  <div className="text-[13px] font-semibold text-ink-700 num mt-1">
                    {avgDaysData[0].avgDays} j ({avgDaysData[0].label})
                  </div>
                )}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={avgDaysData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradDays" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor={C.brand} stopOpacity={0.12} />
                      <stop offset="100%" stopColor={C.brand} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke={C.grid} />
                  <XAxis
                    dataKey="label"
                    tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tickFormatter={(v) => `${v}j`}
                    tick={{ fontSize: 11, fill: C.ink, fontFamily: '"DM Sans", system-ui' }}
                    axisLine={false}
                    tickLine={false}
                    width={36}
                  />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={tooltipLabelStyle}
                    formatter={(v) => [`${v} jours`, 'Temps moyen']}
                  />
                  <Line
                    type="monotone"
                    dataKey="avgDays"
                    stroke={C.brand}
                    strokeWidth={2.5}
                    dot={{ r: 5, fill: C.brand, stroke: C.white, strokeWidth: 2 }}
                    activeDot={{ r: 7, stroke: C.brand, strokeWidth: 2, fill: C.white }}
                    name="avgDays"
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

        </div>
      )}
    </main>
  );
}
