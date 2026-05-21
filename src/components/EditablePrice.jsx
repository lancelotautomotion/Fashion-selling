import { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { fmtEUR } from '../utils/formatters.js';

export default function EditablePrice({ value, onChange, disabled }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  useEffect(() => { setDraft(value); }, [value]);

  if (disabled) return <span className="text-ink-300">—</span>;

  if (editing) {
    return (
      <span className="inline-flex items-center gap-1 bg-white border border-brand-400 rounded-md px-1.5 py-0.5 shadow-sm">
        <input
          type="number"
          step="0.5"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => { setEditing(false); onChange(parseFloat(draft) || 0); }}
          onKeyDown={(e) => {
            if (e.key === 'Enter')  { setEditing(false); onChange(parseFloat(draft) || 0); }
            if (e.key === 'Escape') { setEditing(false); setDraft(value); }
          }}
          className="w-16 text-right num text-sm bg-transparent focus:outline-none"
        />
        <span className="text-ink-400 text-xs">€</span>
      </span>
    );
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="num text-sm text-ink-900 font-medium hover:bg-brand-50 hover:text-brand-700 rounded-md px-1.5 py-0.5 transition-colors inline-flex items-center gap-1 group"
    >
      {fmtEUR(value)}
      <Icon name="pencil" size={11} className="opacity-0 group-hover:opacity-60 transition-opacity" />
    </button>
  );
}
