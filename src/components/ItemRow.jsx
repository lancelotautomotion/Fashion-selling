import Toggle from './Toggle.jsx';
import StatusBadge from './StatusBadge.jsx';
import EditablePrice from './EditablePrice.jsx';
import Icon from './Icon.jsx';
import { fmtDate, fmtEUR, daysBetween, parseDate } from '../utils/formatters.js';

export default function ItemRow({ item, onToggleSold, onUpdateSalePrice, onDelete }) {
  const purchase = parseDate(item.purchaseDate);
  const listed   = parseDate(item.listedDate);
  const sold     = item.sold ? parseDate(item.soldDate) : null;

  const margin = item.sold ? (item.salePrice - item.purchasePrice) : null;
  const days   = item.sold ? daysBetween(listed, sold) : null;
  const marginPositive = margin !== null && margin >= 0;

  return (
    <tr
      className={
        'border-b border-ink-100 last:border-b-0 transition-colors ' +
        (item.sold ? 'row-sold' : 'hover:bg-ink-50/40')
      }
    >
      {/* Status */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-2.5">
          <Toggle on={item.sold} onChange={(v) => onToggleSold(item.id, v)} />
          <StatusBadge sold={item.sold} />
        </div>
      </td>

      {/* Product */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg thumb-stripe border border-ink-100 shrink-0" />
          <div className="min-w-0">
            <div className={'text-[14px] font-medium truncate row-text ' + (item.sold ? '' : 'text-ink-900')}>
              {item.name}
            </div>
            <div className="text-[12px] text-ink-400 truncate">{item.category}</div>
          </div>
        </div>
      </td>

      {/* Brand */}
      <td className="py-4 px-3">
        <span className="text-[13px] text-ink-700 row-text">{item.brand}</span>
      </td>

      {/* Purchase */}
      <td className="py-4 px-3">
        <div className="text-[13px] text-ink-700 row-text num">{fmtEUR(item.purchasePrice)}</div>
        <div className="text-[11px] text-ink-400 num">{fmtDate(purchase)}</div>
      </td>

      {/* Listed */}
      <td className="py-4 px-3">
        <div className="text-[13px] text-ink-700 row-text num">{fmtEUR(item.listedPrice)}</div>
        <div className="text-[11px] text-ink-400 num">{fmtDate(listed)}</div>
      </td>

      {/* Sale */}
      <td className="py-4 px-3">
        {item.sold ? (
          <div>
            <EditablePrice
              value={item.salePrice}
              onChange={(v) => onUpdateSalePrice(item.id, v)}
            />
            <div className="text-[11px] text-ink-400 num mt-0.5">{fmtDate(sold)}</div>
          </div>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>

      {/* Performance */}
      <td className="py-4 px-3">
        {item.sold ? (
          <div className="flex flex-col gap-0.5">
            <div className={'text-[14px] font-semibold num ' + (marginPositive ? 'text-success-600' : 'text-danger-600')}>
              {marginPositive ? '+' : ''}{fmtEUR(margin)}
            </div>
            <div className="text-[11px] text-ink-500 num font-medium">
              {days} jour{days > 1 ? 's' : ''} de vente
            </div>
          </div>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-3 text-right">
        <button
          onClick={() => onDelete(item.id)}
          className="text-ink-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg p-1.5 transition-colors"
          title="Supprimer"
        >
          <Icon name="trash-2" size={15} />
        </button>
      </td>
    </tr>
  );
}
