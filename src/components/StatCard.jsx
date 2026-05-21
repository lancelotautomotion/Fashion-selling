import Icon from './Icon.jsx';

const TONE = {
  brand:   'bg-brand-50 text-brand-700',
  success: 'bg-success-50 text-success-700',
  ink:     'bg-ink-100 text-ink-700',
  warm:    'bg-amber-50 text-amber-700',
};

export default function StatCard({ label, value, sub, icon, tone = 'brand' }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 p-5 shadow-card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-ink-500 tracking-wide">{label}</span>
        <span className={`w-9 h-9 rounded-xl flex items-center justify-center ${TONE[tone]}`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <div className="num text-[28px] leading-none font-semibold text-ink-900 tracking-tight">
        {value}
      </div>
      {sub && <div className="text-[12px] text-ink-400 num">{sub}</div>}
    </div>
  );
}
