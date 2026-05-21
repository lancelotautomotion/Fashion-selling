import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import { CATEGORIES } from '../data/initialData.js';
import { resizeImageFile } from '../utils/imageUtils.js';

const TODAY = new Date().toISOString().slice(0, 10);

let uid = 0;
const newEntry = () => ({
  _key: ++uid,
  image: null,
  name: '',
  category: CATEGORIES[6], // T-shirts & Tops
  brand: '',
  purchasePrice: '',
  listedPrice: '',
  purchaseDate: TODAY,
  listedDate: TODAY,
});

export default function ImportModal({ open, onClose, onImport }) {
  const [entries, setEntries] = useState([newEntry(), newEntry(), newEntry()]);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) setEntries([newEntry(), newEntry(), newEntry()]);
  }, [open]);

  if (!open) return null;

  /* ── Entry handlers ── */
  const setEntry = (key, field, value) =>
    setEntries((prev) => prev.map((e) => e._key === key ? { ...e, [field]: value } : e));

  const addEntry = () => {
    setEntries((prev) => [...prev, newEntry()]);
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  };

  const removeEntry = (key) =>
    setEntries((prev) => prev.filter((e) => e._key !== key));

  const handleEntryImage = async (key, file) => {
    if (!file) return;
    const resized = await resizeImageFile(file, 160, 0.82);
    setEntry(key, 'image', resized);
  };

  /* ── Submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();
    const valid = entries.filter((e) => e.name.trim());
    if (!valid.length) return;
    onImport(valid.map((e) => ({
      name:          e.name.trim(),
      category:      e.category,
      brand:         e.brand.trim(),
      image:         e.image,
      purchaseDate:  e.purchaseDate || TODAY,
      purchasePrice: parseFloat(e.purchasePrice) || 0,
      listedDate:    e.listedDate || TODAY,
      listedPrice:   parseFloat(e.listedPrice) || 0,
      sold: false, soldDate: null, salePrice: null,
    })));
    onClose();
  };

  const validCount = entries.filter((e) => e.name.trim()).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 anim-fade p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-float w-full max-w-xl anim-slide flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Icon name="plus" size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-ink-900">Ajouter plusieurs articles</h2>
              <p className="text-[12px] text-ink-400">
                Renseignez vos articles en lot, puis importez tout d'un coup
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Scrollable list */}
        <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 flex flex-col">
          <div className="px-6 py-4 space-y-3">

            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-ink-500 uppercase tracking-wide">
                Articles
              </span>
              <span className="text-[11px] text-ink-400">
                {validCount} valide{validCount > 1 ? 's' : ''}
              </span>
            </div>

            {entries.map((entry, idx) => (
              <EntryCard
                key={entry._key}
                entry={entry}
                index={idx}
                onChange={(field, value) => setEntry(entry._key, field, value)}
                onImageChange={(file) => handleEntryImage(entry._key, file)}
                onRemove={entries.length > 1 ? () => removeEntry(entry._key) : null}
              />
            ))}

            <div ref={endRef} />

            <button
              type="button"
              onClick={addEntry}
              className="w-full border-2 border-dashed border-ink-200 hover:border-brand-300 hover:bg-brand-50/30 rounded-xl py-3 flex items-center justify-center gap-2 text-[13px] font-medium text-ink-500 hover:text-brand-600 transition-colors"
            >
              <Icon name="plus" size={15} />
              Ajouter un article
            </button>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-ink-100 flex items-center justify-end gap-3 shrink-0 bg-white">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 rounded-lg transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={validCount === 0}
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm inline-flex items-center gap-2"
            >
              <Icon name="check" size={15} />
              Importer {validCount > 0 ? `${validCount} article${validCount > 1 ? 's' : ''}` : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Single entry card ── */
function EntryCard({ entry, index, onChange, onImageChange, onRemove }) {
  const fileRef = useRef(null);
  const INPUT = 'w-full border border-ink-200 rounded-lg px-2.5 py-1.5 text-[13px] bg-white focus-ring transition-all';

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (file) onImageChange(file);
    e.target.value = '';
  };

  return (
    <div className="border border-ink-100 rounded-xl p-3 bg-ink-50/30 hover:bg-white hover:border-ink-200 transition-colors">
      <div className="flex items-start gap-3">

        {/* Thumbnail */}
        <div
          className="relative w-14 h-14 rounded-lg shrink-0 overflow-hidden border border-ink-200 cursor-pointer group"
          onClick={() => fileRef.current?.click()}
          title="Ajouter une photo"
        >
          {entry.image
            ? <img src={entry.image} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full thumb-stripe flex items-center justify-center">
                <Icon name="camera" size={16} className="text-ink-400" />
              </div>
          }
          <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/30 transition-colors flex items-center justify-center">
            <Icon name="camera" size={14} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />

        {/* Fields */}
        <div className="flex-1 grid grid-cols-2 gap-2 min-w-0">
          <div className="col-span-2">
            <input
              className={INPUT + ' font-medium'}
              placeholder={`Article ${index + 1} — Nom du produit *`}
              value={entry.name}
              onChange={(e) => onChange('name', e.target.value)}
            />
          </div>

          <select
            className={INPUT}
            value={entry.category}
            onChange={(e) => onChange('category', e.target.value)}
          >
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          <input
            className={INPUT}
            placeholder="Marque"
            value={entry.brand}
            onChange={(e) => onChange('brand', e.target.value)}
          />

          <input
            type="number" step="0.5"
            className={INPUT + ' num'}
            placeholder="Prix achat €"
            value={entry.purchasePrice}
            onChange={(e) => onChange('purchasePrice', e.target.value)}
          />

          <input
            type="number" step="0.5"
            className={INPUT + ' num'}
            placeholder="Prix mise en ligne €"
            value={entry.listedPrice}
            onChange={(e) => onChange('listedPrice', e.target.value)}
          />
        </div>

        {/* Remove */}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="text-ink-300 hover:text-danger-500 p-1 rounded-lg transition-colors shrink-0 mt-0.5"
          >
            <Icon name="x" size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
