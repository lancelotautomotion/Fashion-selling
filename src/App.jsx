import { useState, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage.js';
import { SEED_ITEMS } from './data/initialData.js';
import { fmtEUR, daysBetween, parseDate } from './utils/formatters.js';
import StatCard from './components/StatCard.jsx';
import ItemRow from './components/ItemRow.jsx';
import AddItemModal from './components/AddItemModal.jsx';
import EditItemModal from './components/EditItemModal.jsx';
import ImportModal from './components/ImportModal.jsx';
import Icon from './components/Icon.jsx';

export default function App() {
  const [items, setItems] = useLocalStorage('fashion-selling-items', SEED_ITEMS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  /* ── Filtering ── */
  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (filter === 'listed' && it.sold) return false;
      if (filter === 'sold'   && !it.sold) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return it.name.toLowerCase().includes(q) || it.brand.toLowerCase().includes(q);
      }
      return true;
    });
  }, [items, search, filter]);

  /* ── KPIs ── */
  const kpis = useMemo(() => {
    const stock      = items.filter((i) => !i.sold).length;
    const soldItems  = items.filter((i) => i.sold);
    const revenue    = soldItems.reduce((s, i) => s + i.salePrice, 0);
    const margin     = soldItems.reduce((s, i) => s + (i.salePrice - i.purchasePrice), 0);
    const avgDays    = soldItems.length
      ? Math.round(soldItems.reduce((s, i) => s + daysBetween(parseDate(i.listedDate), parseDate(i.soldDate)), 0) / soldItems.length)
      : 0;
    return { stock, revenue, margin, avgDays, soldCount: soldItems.length };
  }, [items]);

  /* ── Handlers ── */
  const handleToggleSold = (id, v) => {
    const today = new Date().toISOString().slice(0, 10);
    setItems(items.map((it) =>
      it.id === id
        ? { ...it, sold: v, soldDate: v ? (it.soldDate || today) : null, salePrice: v ? (it.salePrice ?? it.listedPrice) : null }
        : it
    ));
  };

  const handleUpdateSalePrice = (id, price) =>
    setItems(items.map((it) => it.id === id ? { ...it, salePrice: price } : it));

  const handleDelete = (id) =>
    setItems(items.filter((it) => it.id !== id));

  const handleAdd = (item) =>
    setItems([{ ...item, id: Math.max(0, ...items.map((i) => i.id)) + 1 }, ...items]);

  const handleEdit = (updatedItem) =>
    setItems(items.map((it) => it.id === updatedItem.id ? updatedItem : it));

  const handleUpdateImage = (id, image) =>
    setItems(items.map((it) => it.id === id ? { ...it, image } : it));

  const handleImport = (newItems) => {
    const maxId = Math.max(0, ...items.map((i) => i.id));
    setItems([
      ...newItems.map((item, idx) => ({ ...item, id: maxId + idx + 1 })),
      ...items,
    ]);
  };

  const counts = {
    all:    items.length,
    listed: items.filter((i) => !i.sold).length,
    sold:   items.filter((i) => i.sold).length,
  };

  const rentabilite = kpis.revenue > 0
    ? `+${((kpis.margin / kpis.revenue) * 100).toFixed(0)}% de rentabilité`
    : 'Aucune vente encore';

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-ink-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ink-900 text-white flex items-center justify-center font-semibold tracking-tight">
              FS
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink-900 leading-none">Fashion Selling</div>
              <div className="text-[11px] text-ink-400 mt-1">Tableau de bord revente</div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-[13px]">
            {['Tableau de bord', 'Statistiques', 'Catalogue', 'Paramètres'].map((l, i) => (
              <a
                key={l}
                href="#"
                className={'px-3 py-1.5 rounded-lg transition-colors ' + (i === 0 ? 'bg-ink-100 text-ink-900 font-medium' : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50')}
              >
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button className="text-ink-500 hover:text-ink-900 hover:bg-ink-50 rounded-lg p-2 transition-colors relative">
              <Icon name="bell" size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-brand-500" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white flex items-center justify-center text-[12px] font-semibold">
              CL
            </div>
          </div>
        </div>
      </header>

      {/* ── Main ── */}
      <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">

        {/* Title row */}
        <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
          <div>
            <h1 className="text-[26px] font-semibold text-ink-900 tracking-tight">Bonjour Camille 👋</h1>
            <p className="text-[14px] text-ink-500 mt-1">
              Voici un aperçu de votre activité de revente ce mois-ci.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[12px] text-ink-400">
            <Icon name="calendar" size={14} />
            <span className="num">
              {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Articles en stock"
            value={kpis.stock}
            sub={`${kpis.soldCount} déjà vendu${kpis.soldCount > 1 ? 's' : ''}`}
            icon="package"
            tone="brand"
          />
          <StatCard
            label="Total des ventes"
            value={fmtEUR(kpis.revenue)}
            sub="Chiffre d'affaires cumulé"
            icon="trending-up"
            tone="brand"
          />
          <StatCard
            label="Marge nette totale"
            value={fmtEUR(kpis.margin)}
            sub={rentabilite}
            icon="coins"
            tone="success"
          />
          <StatCard
            label="Temps de vente moyen"
            value={kpis.avgDays > 0 ? `${kpis.avgDays} j` : '—'}
            sub="Entre mise en ligne et vente"
            icon="clock"
            tone="ink"
          />
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden">

          {/* Action bar */}
          <div className="px-5 py-4 border-b border-ink-100 flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400">
                <Icon name="search" size={16} />
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou marque…"
                className="w-full pl-9 pr-3 py-2 border border-ink-200 rounded-lg text-sm bg-ink-50/50 focus-ring transition-all placeholder:text-ink-400"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center bg-ink-100 rounded-lg p-0.5">
              {[
                { id: 'all',    label: 'Tous'     },
                { id: 'listed', label: 'En vente' },
                { id: 'sold',   label: 'Vendus'   },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id)}
                  className={
                    'px-3 py-1.5 text-[13px] font-medium rounded-md transition-all flex items-center gap-1.5 ' +
                    (filter === f.id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700')
                  }
                >
                  {f.label}
                  <span className={
                    'num text-[11px] px-1.5 py-0.5 rounded-full ' +
                    (filter === f.id ? 'bg-brand-50 text-brand-700' : 'bg-white/60 text-ink-400')
                  }>
                    {counts[f.id]}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex-1" />

            {/* Import */}
            <button
              onClick={() => setShowImport(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-ink-700 bg-white border border-ink-200 hover:border-ink-300 hover:bg-ink-50 rounded-lg transition-colors"
            >
              <Icon name="camera" size={15} />
              Importer capture
            </button>

            {/* Add */}
            <button
              onClick={() => setShowAdd(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-[13px] font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-lg transition-colors shadow-sm"
            >
              <Icon name="plus" size={15} />
              Ajouter un article
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50/40">
                  {['Statut', 'Produit', 'Marque', 'Achat', 'Mise en ligne', 'Vente', 'Performances', ''].map((h) => (
                    <th
                      key={h}
                      className="py-2.5 px-3 text-left text-[11px] font-medium text-ink-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-2 text-ink-400">
                        <Icon name="package-search" size={28} />
                        <div className="text-sm font-medium text-ink-500">Aucun article trouvé</div>
                        <div className="text-[12px]">Essayez de modifier vos filtres ou votre recherche.</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggleSold={handleToggleSold}
                      onUpdateSalePrice={handleUpdateSalePrice}
                      onUpdateImage={handleUpdateImage}
                      onEdit={setEditingItem}
                      onDelete={handleDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-ink-100 flex items-center justify-between text-[12px] text-ink-400">
            <span>
              {filtered.length} article{filtered.length > 1 ? 's' : ''} affiché{filtered.length > 1 ? 's' : ''}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Icon name="info" size={12} />
              Astuce : cliquez sur la photo d'un article pour la modifier
            </span>
          </div>
        </div>
      </main>

      <AddItemModal open={showAdd}    onClose={() => setShowAdd(false)}    onAdd={handleAdd} />
      <ImportModal  open={showImport} onClose={() => setShowImport(false)} onImport={handleImport} />
      <EditItemModal
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEdit}
      />
    </div>
  );
}
