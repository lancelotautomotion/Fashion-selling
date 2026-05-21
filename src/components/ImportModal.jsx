import { useState, useEffect } from 'react';
import Icon from './Icon.jsx';
import { fmtEUR } from '../utils/formatters.js';

const TODAY = new Date().toISOString().slice(0, 10);

export default function ImportModal({ open, onClose, onImport }) {
  const [stage, setStage] = useState('drop');
  const [extracted, setExtracted] = useState(null);

  useEffect(() => {
    if (open) { setStage('drop'); setExtracted(null); }
  }, [open]);

  if (!open) return null;

  const simulateScan = () => {
    setStage('scanning');
    setTimeout(() => {
      setExtracted({ name: 'Blazer croisé laine', category: 'Manteaux & Vestes', brand: 'Zara', listedPrice: 45, confidence: 0.92 });
      setStage('review');
    }, 1800);
  };

  const confirm = () => {
    onImport({
      ...extracted,
      purchaseDate: TODAY,
      purchasePrice: 12,
      listedDate: TODAY,
      sold: false, soldDate: null, salePrice: null,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 anim-fade p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-float w-full max-w-lg anim-slide"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ink-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Icon name="camera" size={18} />
            </div>
            <div>
              <h2 className="text-[16px] font-semibold text-ink-900">Importer une capture d'écran</h2>
              <p className="text-[12px] text-ink-400">Détection automatique des champs</p>
            </div>
          </div>
          <button onClick={onClose} className="text-ink-400 hover:text-ink-700 p-1 rounded-lg">
            <Icon name="x" size={18} />
          </button>
        </div>

        <div className="p-6">
          {stage === 'drop' && (
            <button
              onClick={simulateScan}
              className="w-full border-2 border-dashed border-ink-200 hover:border-brand-400 hover:bg-brand-50/30 rounded-xl p-10 flex flex-col items-center gap-3 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
                <Icon name="upload-cloud" size={22} />
              </div>
              <div className="text-center">
                <div className="text-sm font-medium text-ink-900">Glissez une capture ici</div>
                <div className="text-[12px] text-ink-400 mt-1">PNG, JPG — ou cliquez pour parcourir</div>
              </div>
              <div className="text-[11px] text-brand-600 font-medium mt-2">
                Simuler une capture de démonstration
              </div>
            </button>
          )}

          {stage === 'scanning' && (
            <div className="py-10 flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center animate-pulse">
                <Icon name="scan-line" size={22} />
              </div>
              <div className="text-sm font-medium text-ink-900">Analyse de l'image…</div>
              <div className="w-full max-w-xs bg-ink-100 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-brand-500 rounded-full animate-pulse" style={{ width: '70%' }} />
              </div>
              <div className="text-[12px] text-ink-400">
                Détection de la marque, du prix et de la catégorie
              </div>
            </div>
          )}

          {stage === 'review' && extracted && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-success-700 bg-success-50 border border-success-100 rounded-lg px-3 py-2 text-[13px]">
                <Icon name="check-circle-2" size={16} />
                <span className="font-medium">Champs détectés</span>
                <span className="ml-auto num text-success-600">
                  {Math.round(extracted.confidence * 100)}% de confiance
                </span>
              </div>

              <div className="border border-ink-100 rounded-xl divide-y divide-ink-100">
                {[
                  ['Produit',              extracted.name],
                  ['Catégorie',            extracted.category],
                  ['Marque',               extracted.brand],
                  ['Prix de mise en ligne', fmtEUR(extracted.listedPrice)],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-[12px] text-ink-500">{k}</span>
                    <span className="text-[13px] font-medium text-ink-900">{v}</span>
                  </div>
                ))}
              </div>

              <p className="text-[12px] text-ink-400">
                Vous pourrez compléter les informations d'achat après l'import.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm inline-flex items-center gap-1.5"
                >
                  <Icon name="check" size={15} />
                  Confirmer l'import
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
