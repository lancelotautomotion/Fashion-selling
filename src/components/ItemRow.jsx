import { useRef } from 'react';
import Toggle from './Toggle.jsx';
import StatusBadge from './StatusBadge.jsx';
import EditablePrice from './EditablePrice.jsx';
import Icon from './Icon.jsx';
import { fmtDate, fmtEUR, daysBetween, parseDate } from '../utils/formatters.js';
import { resizeImageFile } from '../utils/imageUtils.js';

export default function ItemRow({ item, onToggleSold, onUpdateSalePrice, onUpdateImage, onEdit, onDelete }) {
  const fileRef = useRef(null);

  const listed   = item.listedDate ? parseDate(item.listedDate) : null;
  const sold     = item.sold && item.soldDate ? parseDate(item.soldDate) : null;

  const margin = item.sold ? (item.salePrice - item.purchasePrice) : null;
  const days   = listed && sold ? daysBetween(listed, sold) : null;
  const marginPositive = margin !== null && margin >= 0;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resized = await resizeImageFile(file);
    onUpdateImage(item.id, resized);
    e.target.value = '';
  };

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
          <StatusBadge sold={item.sold} deferred={!item.sold && !item.listedDate} />
        </div>
      </td>

      {/* Product */}
      <td className="py-4 px-3">
        <div className="flex items-center gap-3">
          {/* Clickable thumbnail */}
          <div
            className="relative w-10 h-10 rounded-lg shrink-0 cursor-pointer group overflow-hidden border border-ink-100"
            onClick={() => fileRef.current?.click()}
            title="Changer la photo"
          >
            {item.image
              ? <img src={item.image} alt="" className="w-full h-full object-cover" />
              : <div className="w-full h-full thumb-stripe" />
            }
            <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/35 transition-colors flex items-center justify-center">
              <Icon name="camera" size={13} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

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
      </td>

      {/* Listed */}
      <td className="py-4 px-3">
        <div className="text-[13px] text-ink-700 row-text num">{fmtEUR(item.listedPrice)}</div>
        {listed
          ? <div className="text-[11px] text-ink-400 num">{fmtDate(listed)}</div>
          : <div className="text-[11px] text-rose-500 flex items-center gap-1 mt-0.5">
              <Icon name="hourglass" size={10} />En attente
            </div>
        }
      </td>

      {/* Sale */}
      <td className="py-4 px-3">
        {item.sold ? (
          <div>
            <EditablePrice value={item.salePrice} onChange={(v) => onUpdateSalePrice(item.id, v)} />
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
            <div className="text-[11px] num font-medium text-success-600">
              {days} jour{days > 1 ? 's' : ''} de vente
            </div>
          </div>
        ) : (
          <span className="text-ink-300">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-4 px-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(item)}
            className="text-ink-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg p-1.5 transition-colors"
            title="Modifier"
          >
            <Icon name="pencil" size={15} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="text-ink-400 hover:text-danger-600 hover:bg-danger-50 rounded-lg p-1.5 transition-colors"
            title="Supprimer"
          >
            <Icon name="trash-2" size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
