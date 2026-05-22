import { useState, useEffect, useRef } from 'react';
import Icon from './Icon.jsx';
import Toggle from './Toggle.jsx';
import { CATEGORIES } from '../data/initialData.js';
import { resizeImageFile } from '../utils/imageUtils.js';

const TODAY = new Date().toISOString().slice(0, 10);
const INPUT = 'w-full border border-ink-200 rounded-lg px-3 py-2 text-sm bg-white focus-ring transition-all';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium text-ink-600">{label}</span>
      {children}
    </label>
  );
}

export default function EditItemModal({ open, onClose, item, onSave }) {
  const [form,            setForm]            = useState(null);
  const [image,           setImage]           = useState(null);
  const [listingDeferred, setListingDeferred] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (open && item) {
      setForm({ ...item });
      setImage(item.image ?? null);
      setListingDeferred(!item.listedDate);
    }
  }, [open, item]);

  if (!open || !form) return null;

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const resized = await resizeImageFile(file);
    setImage(resized);
    e.target.value = '';
  };

  const handleSoldToggle = (v) => {
    set('sold', v);
    if (v && !form.soldDate) set('soldDate', TODAY);
    if (!v) { set('soldDate', null); set('salePrice', null); }
  };

  const submit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      purchasePrice: parseFloat(form.purchasePrice) || 0,
      listedPrice:   parseFloat(form.listedPrice)   || 0,
      listedDate:    listingDeferred ? null : form.listedDate,
      salePrice:     form.sold ? (parseFloat(form.salePrice) || 0) : null,
      image,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 anim-fade p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-float w-full max-w-xl anim-slide max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Icon name="pencil" size={16} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-ink-900">Modifier l'article</h2>
              <p className="text-[12px] text-ink-400">Tous les champs sont modifiables</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg">
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Scrollable form */}
        <form onSubmit={submit} className="overflow-y-auto flex-1 p-6 grid grid-cols-2 gap-4">

          {/* Photo */}
          <div className="col-span-2">
            <span className="text-[12px] font-medium text-ink-600 block mb-2">Photo (optionnelle)</span>
            <div className="flex items-center gap-3">
              <div
                className="relative w-16 h-16 rounded-xl overflow-hidden border border-ink-200 cursor-pointer group shrink-0"
                onClick={() => fileRef.current?.click()}
              >
                {image
                  ? <img src={image} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full thumb-stripe flex items-center justify-center">
                      <Icon name="camera" size={16} className="text-ink-400" />
                    </div>
                }
                <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/30 transition-colors flex items-center justify-center">
                  <Icon name="camera" size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="text-[12px] font-medium text-brand-600 hover:text-brand-700 hover:underline text-left"
                >
                  {image ? 'Changer la photo' : 'Ajouter une photo'}
                </button>
                {image && (
                  <button
                    type="button"
                    onClick={() => setImage(null)}
                    className="text-[12px] text-danger-500 hover:text-danger-600 hover:underline text-left"
                  >
                    Supprimer la photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Name */}
          <div className="col-span-2">
            <Field label="Nom du produit">
              <input className={INPUT} value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </Field>
          </div>

          <Field label="Catégorie">
            <select className={INPUT} value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </Field>

          <Field label="Marque">
            <input className={INPUT} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
          </Field>

          <Field label="Prix d'achat (€)">
            <input type="number" step="0.5" className={INPUT + ' num'} value={form.purchasePrice}
              onChange={(e) => set('purchasePrice', e.target.value)} />
          </Field>

          <Field label="Prix de mise en ligne (€)">
            <input type="number" step="0.5" className={INPUT + ' num'} value={form.listedPrice}
              onChange={(e) => set('listedPrice', e.target.value)} />
          </Field>

          <div className="col-span-2">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[12px] font-medium text-ink-600">Date de mise en ligne</span>
              <button
                type="button"
                onClick={() => setListingDeferred((v) => !v)}
                className={
                  'flex items-center gap-1.5 text-[11px] font-medium rounded-full px-2.5 py-1 border transition-colors ' +
                  (listingDeferred
                    ? 'bg-rose-50 text-rose-600 border-rose-300'
                    : 'bg-ink-50 text-ink-500 border-ink-200 hover:bg-ink-100 hover:text-ink-700')
                }
              >
                <Icon name="hourglass" size={11} />
                Mettre en ligne plus tard
              </button>
            </div>
            {listingDeferred ? (
              <div className="w-full border border-rose-200 rounded-lg px-3 py-2.5 text-[13px] bg-rose-50 text-rose-600 flex items-center gap-2">
                <Icon name="hourglass" size={14} />
                Sera mis en ligne ultérieurement
              </div>
            ) : (
              <input type="date" className={INPUT} value={form.listedDate ?? TODAY}
                onChange={(e) => set('listedDate', e.target.value)} />
            )}
          </div>

          {/* Sold toggle */}
          <div className="col-span-2 flex items-center justify-between p-3 rounded-xl bg-ink-50 border border-ink-100">
            <div>
              <div className="text-[13px] font-medium text-ink-800">Marquer comme vendu</div>
              <div className="text-[11px] text-ink-400">Active les champs de vente</div>
            </div>
            <Toggle on={form.sold} onChange={handleSoldToggle} />
          </div>

          {/* Sold fields */}
          {form.sold && (
            <>
              <Field label="Date de vente">
                <input type="date" className={INPUT} value={form.soldDate || TODAY}
                  onChange={(e) => set('soldDate', e.target.value)} />
              </Field>
              <Field label="Prix de vente (€)">
                <input type="number" step="0.5" className={INPUT + ' num'}
                  value={form.salePrice ?? form.listedPrice}
                  onChange={(e) => set('salePrice', e.target.value)} />
              </Field>
            </>
          )}

          {/* Buttons */}
          <div className="col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-ink-100 mt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 rounded-lg transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
