export default function StatusBadge({ sold }) {
  if (sold) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-success-50 text-success-700 text-[11px] font-medium border border-success-100">
        <span className="w-1.5 h-1.5 rounded-full bg-success-500" />
        Vendu
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 text-[11px] font-medium border border-brand-100">
      <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
      En vente
    </span>
  );
}
