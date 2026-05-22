import { useState, useMemo } from 'react';
import Icon from './Icon.jsx';
import StatusBadge from './StatusBadge.jsx';
import EditItemModal from './EditItemModal.jsx';
import { fmtEUR, fmtDate, parseDate, daysBetween } from '../utils/formatters.js';

/* ── Constants ─────────────────────────────────────────────────── */

const STATUS_TABS = [
  { id: 'listed', label: 'En stock', icon: 'package' },
  { id: 'sold',   label: 'Vendus',   icon: 'check-circle' },
  { id: 'all',    label: 'Tous',     icon: 'layers' },
];

const SORT_OPTIONS = [
  { value: 'date-desc',  label: 'Plus récent' },
  { value: 'date-asc',   label: 'Plus ancien' },
  { value: 'price-asc',  label: 'Prix croissant' },
  { value: 'price-desc', label: 'Prix décroissant' },
];

/* ── EmptyState ─────────────────────────────────────────────────── */

function EmptyState({ hasFilters }) {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center">
      <div className="w-16 h-16 rounded-2xl bg-ink-100 flex items-center justify-center mb-5">
        <Icon name="folder-search" size={28} className="text-ink-300" />
      </div>
      <div className="text-[15px] font-semibold text-ink-700 mb-2">
        {hasFilters ? 'Aucun article ne correspond' : 'Catalogue vide'}
      </div>
      <div className="text-[13px] text-ink-400 max-w-[280px] leading-relaxed">
        {hasFilters
          ? "Essayez de modifier ou d'effacer vos filtres pour voir plus d'articles."
          : 'Commencez par ajouter des articles depuis le tableau de bord.'}
      </div>
    </div>
  );
}

/* ── ItemCard (Grid view) ───────────────────────────────────────── */

function ItemCard({ item, onEdit, onDelete, onToggleSold }) {
  const margin = item.sold ? (item.salePrice ?? 0) - item.purchasePrice : null;
  const days   = item.sold && item.listedDate && item.soldDate
    ? daysBetween(parseDate(item.listedDate), parseDate(item.soldDate))
    : null;

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden group flex flex-col transition-shadow hover:shadow-float">

      {/* ── Thumbnail ── */}
      <div className="relative w-full bg-ink-50 overflow-hidden" style={{ paddingTop: '75%' }}>
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 thumb-stripe flex items-center justify-center">
            <Icon name="shirt" size={32} className="text-ink-200" strokeWidth={1.5} />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <StatusBadge sold={item.sold} />
        </div>

        {/* Action buttons — visible on hover */}
        <div className="absolute inset-0 bg-ink-900/0 group-hover:bg-ink-900/25 transition-all duration-200" />
        <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          {!item.sold && (
            <button
              onClick={() => onToggleSold(item.id, true)}
              title="Marquer comme vendu"
              className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm shadow text-success-600 hover:bg-success-50 flex items-center justify-center transition-colors"
            >
              <Icon name="check" size={14} />
            </button>
          )}
          <button
            onClick={() => onEdit(item)}
            title="Modifier"
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm shadow text-ink-600 hover:text-brand-600 hover:bg-brand-50 flex items-center justify-center transition-colors"
          >
            <Icon name="pencil" size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Supprimer"
            className="w-8 h-8 rounded-lg bg-white/95 backdrop-blur-sm shadow text-ink-600 hover:text-danger-600 hover:bg-danger-50 flex items-center justify-center transition-colors"
          >
            <Icon name="trash-2" size={14} />
          </button>
        </div>
      </div>

      {/* ── Info ── */}
      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="flex-1">
          <div className="text-[10px] font-bold tracking-[0.12em] uppercase text-ink-400 mb-0.5">
            {item.brand || '—'}
          </div>
          <div className="text-[13px] font-semibold text-ink-900 leading-snug line-clamp-2">
            {item.name}
          </div>
          <div className="text-[11px] text-ink-400 mt-1">{item.category}</div>
        </div>

        {/* ── Prices ── */}
        <div className="border-t border-ink-50 pt-3">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[10px] font-medium text-ink-400 uppercase tracking-wide mb-0.5">Achat</div>
              <div className="num text-[13px] font-semibold text-ink-600">
                {fmtEUR(item.purchasePrice)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-medium text-ink-400 uppercase tracking-wide mb-0.5">
                {item.sold ? 'Vendu' : 'En ligne'}
              </div>
              <div className="num text-[16px] font-bold text-ink-900">
                {item.sold ? fmtEUR(item.salePrice) : fmtEUR(item.listedPrice)}
              </div>
            </div>
          </div>

          {/* Performance pill */}
          {item.sold && margin !== null && (
            <div className={
              'flex items-center justify-center gap-2 text-[11px] font-semibold num mt-2.5 py-1.5 rounded-lg ' +
              (margin >= 0
                ? 'bg-success-50 text-success-700'
                : 'bg-danger-50 text-danger-600')
            }>
              <span>{margin >= 0 ? '+' : ''}{fmtEUR(margin)}</span>
              {days !== null && (
                <span className="opacity-60 font-normal">· {days} j</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── GridView ───────────────────────────────────────────────────── */

function GridView({ items, onEdit, onDelete, onToggleSold }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggleSold={onToggleSold}
        />
      ))}
    </div>
  );
}

/* ── ListView ───────────────────────────────────────────────────── */

function ListRow({ item, onEdit, onDelete, onToggleSold }) {
  const margin        = item.sold ? (item.salePrice ?? 0) - item.purchasePrice : null;
  const marginPositive = margin !== null && margin >= 0;
  const days          = item.sold && item.listedDate && item.soldDate
    ? daysBetween(parseDate(item.listedDate), parseDate(item.soldDate))
    : null;

  return (
    <tr className={
      'border-b border-ink-100 last:border-0 transition-colors ' +
      (item.sold ? 'row-sold' : 'hover:bg-ink-50/40')
    }>
      {/* Produit */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl shrink-0 overflow-hidden border border-ink-100 bg-ink-50">
            {item.image ? (
              <img src={item.image} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full thumb-stripe flex items-center justify-center">
                <Icon name="shirt" size={14} className="text-ink-300" strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-ink-900 row-text truncate max-w-[200px]">
              {item.name}
            </div>
            <div className="mt-0.5">
              <StatusBadge sold={item.sold} />
            </div>
          </div>
        </div>
      </td>

      {/* Catégorie */}
      <td className="py-3 px-4 text-[12px] text-ink-500 whitespace-nowrap">{item.category}</td>

      {/* Marque */}
      <td className="py-3 px-4">
        <span className="text-[12px] font-semibold text-ink-700 row-text uppercase tracking-wide">
          {item.brand}
        </span>
      </td>

      {/* Achat */}
      <td className="py-3 px-4 num text-[13px] text-ink-600 row-text whitespace-nowrap">
        {fmtEUR(item.purchasePrice)}
      </td>

      {/* Mise en ligne */}
      <td className="py-3 px-4">
        <div className="num text-[13px] font-medium text-ink-800 row-text">{fmtEUR(item.listedPrice)}</div>
        <div className="num text-[11px] text-ink-400">{fmtDate(parseDate(item.listedDate))}</div>
      </td>

      {/* Vente */}
      <td className="py-3 px-4">
        {item.sold ? (
          <>
            <div className="num text-[13px] font-semibold text-ink-900">{fmtEUR(item.salePrice)}</div>
            <div className="num text-[11px] text-ink-400">{fmtDate(parseDate(item.soldDate))}</div>
          </>
        ) : (
          <span className="text-ink-300 text-[13px]">—</span>
        )}
      </td>

      {/* Marge */}
      <td className="py-3 px-4">
        {margin !== null ? (
          <div>
            <div className={
              'num text-[13px] font-bold ' +
              (marginPositive ? 'text-success-600' : 'text-danger-600')
            }>
              {marginPositive ? '+' : ''}{fmtEUR(margin)}
            </div>
            {days !== null && (
              <div className="num text-[11px] text-ink-400">{days} jour{days > 1 ? 's' : ''}</div>
            )}
          </div>
        ) : (
          <span className="text-ink-300 text-[13px]">—</span>
        )}
      </td>

      {/* Actions */}
      <td className="py-3 px-4">
        <div className="flex items-center justify-end gap-0.5">
          {!item.sold && (
            <button
              onClick={() => onToggleSold(item.id, true)}
              title="Marquer comme vendu"
              className="p-1.5 rounded-lg text-ink-400 hover:text-success-600 hover:bg-success-50 transition-colors"
            >
              <Icon name="check-circle" size={15} />
            </button>
          )}
          <button
            onClick={() => onEdit(item)}
            title="Modifier"
            className="p-1.5 rounded-lg text-ink-400 hover:text-brand-600 hover:bg-brand-50 transition-colors"
          >
            <Icon name="pencil" size={15} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            title="Supprimer"
            className="p-1.5 rounded-lg text-ink-400 hover:text-danger-600 hover:bg-danger-50 transition-colors"
          >
            <Icon name="trash-2" size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ListView({ items, onEdit, onDelete, onToggleSold }) {
  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-100 bg-ink-50/40">
              {['Produit', 'Catégorie', 'Marque', 'Achat', 'Mise en ligne', 'Vente', 'Marge', ''].map((h) => (
                <th
                  key={h}
                  className="py-2.5 px-4 text-left text-[10px] font-semibold text-ink-500 uppercase tracking-widest whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <ListRow
                key={item.id}
                item={item}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleSold={onToggleSold}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ── CataloguePage ──────────────────────────────────────────────── */

export default function CataloguePage({ items, toggleSold, deleteItem, updateItem }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [brandFilter,  setBrandFilter]  = useState('');
  const [catFilter,    setCatFilter]    = useState('');
  const [search,       setSearch]       = useState('');
  const [sortBy,       setSortBy]       = useState('date-desc');
  const [view,         setView]         = useState('grid');
  const [editingItem,  setEditingItem]  = useState(null);

  /* Dynamic filter options */
  const brands = useMemo(
    () => [...new Set(items.map((i) => i.brand).filter(Boolean))].sort(),
    [items],
  );
  const categories = useMemo(
    () => [...new Set(items.map((i) => i.category).filter(Boolean))].sort(),
    [items],
  );

  /* Tab counts */
  const counts = useMemo(() => ({
    all:    items.length,
    listed: items.filter((i) => !i.sold).length,
    sold:   items.filter((i) => i.sold).length,
  }), [items]);

  /* Combined filtering + sorting */
  const filtered = useMemo(() => {
    let result = items;

    if (statusFilter === 'listed') result = result.filter((i) => !i.sold);
    else if (statusFilter === 'sold') result = result.filter((i) => i.sold);

    if (brandFilter) result = result.filter((i) => i.brand === brandFilter);
    if (catFilter)   result = result.filter((i) => i.category === catFilter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.brand.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q),
      );
    }

    return [...result].sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.listedDate) - new Date(a.listedDate);
      if (sortBy === 'date-asc')  return new Date(a.listedDate) - new Date(b.listedDate);

      /* Smart price: use sale price for sold items, listed price otherwise */
      const priceA = a.sold ? (a.salePrice ?? a.listedPrice) : a.listedPrice;
      const priceB = b.sold ? (b.salePrice ?? b.listedPrice) : b.listedPrice;
      if (sortBy === 'price-asc')  return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      return 0;
    });
  }, [items, statusFilter, brandFilter, catFilter, search, sortBy]);

  const hasActiveFilters = !!(brandFilter || catFilter || search.trim());

  const clearFilters = () => {
    setBrandFilter('');
    setCatFilter('');
    setSearch('');
  };

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-10 py-8">

      {/* ── Page header ── */}
      <div className="flex items-end justify-between flex-wrap gap-4 mb-7">
        <div>
          <h1 className="text-[26px] font-semibold text-ink-900 tracking-tight">Catalogue</h1>
          <p className="text-[14px] text-ink-500 mt-1">
            Votre inventaire complet — filtrez, triez et gérez chaque article.
          </p>
        </div>
        <div className="num text-[12px] text-ink-400 flex items-center gap-1.5">
          <Icon name="layers" size={13} />
          {counts.all} article{counts.all > 1 ? 's' : ''} au total
        </div>
      </div>

      {/* ── Status tabs ── */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        {STATUS_TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setStatusFilter(id)}
            className={
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-[13px] font-medium border transition-all ' +
              (statusFilter === id
                ? 'bg-ink-900 text-white border-ink-900 shadow-sm'
                : 'bg-white text-ink-600 border-ink-200 hover:border-ink-300 hover:bg-ink-50 shadow-card')
            }
          >
            <Icon name={icon} size={15} />
            {label}
            <span className={
              'num text-[11px] px-1.5 py-0.5 rounded-full leading-none ' +
              (statusFilter === id
                ? 'bg-white/20 text-white'
                : 'bg-ink-100 text-ink-500')
            }>
              {counts[id]}
            </span>
          </button>
        ))}
      </div>

      {/* ── Toolbar ── */}
      <div className="bg-white rounded-xl border border-ink-100 shadow-card px-4 py-3 mb-5 flex flex-wrap items-center gap-2.5">

        {/* Brand */}
        <div className="relative">
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className={
              'pl-3 pr-8 py-2 text-[13px] rounded-lg border cursor-pointer focus-ring appearance-none bg-white transition-colors ' +
              (brandFilter
                ? 'border-brand-400 text-brand-700 bg-brand-50'
                : 'border-ink-200 text-ink-700')
            }
          >
            <option value="">Toutes les marques</option>
            {brands.map((b) => <option key={b}>{b}</option>)}
          </select>
          <Icon name="layers" size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>

        {/* Category */}
        <div className="relative">
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className={
              'pl-3 pr-8 py-2 text-[13px] rounded-lg border cursor-pointer focus-ring appearance-none bg-white transition-colors ' +
              (catFilter
                ? 'border-brand-400 text-brand-700 bg-brand-50'
                : 'border-ink-200 text-ink-700')
            }
          >
            <option value="">Toutes les catégories</option>
            {categories.map((c) => <option key={c}>{c}</option>)}
          </select>
          <Icon name="layers" size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none" />
        </div>

        {/* Search */}
        <div className="relative flex-1 min-w-[180px] max-w-sm">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400 pointer-events-none">
            <Icon name="search" size={14} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Chercher un article…"
            className="w-full pl-8 pr-7 py-2 border border-ink-200 rounded-lg text-[13px] bg-white focus-ring placeholder:text-ink-400 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700 transition-colors"
            >
              <Icon name="x" size={13} />
            </button>
          )}
        </div>

        <div className="flex-1" />

        {/* Sort */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="pl-3 pr-3 py-2 text-[13px] rounded-lg border border-ink-200 text-ink-700 cursor-pointer focus-ring bg-white"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex items-center bg-ink-100 rounded-lg p-0.5">
          {[
            { id: 'grid', icon: 'layout-grid', title: 'Vue grille' },
            { id: 'list', icon: 'list',         title: 'Vue liste'  },
          ].map(({ id, icon, title }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              title={title}
              className={
                'p-2 rounded-md transition-all ' +
                (view === id
                  ? 'bg-white text-ink-900 shadow-sm'
                  : 'text-ink-500 hover:text-ink-700')
              }
            >
              <Icon name={icon} size={15} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Results bar ── */}
      <div className="flex items-center justify-between mb-4 min-h-[24px]">
        <div className="text-[13px] text-ink-500">
          <span className="num font-semibold text-ink-900">{filtered.length}</span>
          {' '}article{filtered.length !== 1 ? 's' : ''}
          {(hasActiveFilters || statusFilter !== 'all') && ' · filtré'}
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-[12px] text-brand-600 hover:text-brand-700 transition-colors"
          >
            <Icon name="x-circle" size={13} />
            Effacer les filtres
          </button>
        )}
      </div>

      {/* ── Content ── */}
      {filtered.length === 0 ? (
        <EmptyState hasFilters={hasActiveFilters || statusFilter !== 'all'} />
      ) : view === 'grid' ? (
        <GridView
          items={filtered}
          onEdit={setEditingItem}
          onDelete={deleteItem}
          onToggleSold={toggleSold}
        />
      ) : (
        <ListView
          items={filtered}
          onEdit={setEditingItem}
          onDelete={deleteItem}
          onToggleSold={toggleSold}
        />
      )}

      {/* ── Edit modal ── */}
      <EditItemModal
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={updateItem}
      />
    </main>
  );
}
