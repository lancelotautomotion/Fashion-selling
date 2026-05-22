import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase.js';
import { useItems } from './hooks/useItems.js';
import DashboardPage from './components/DashboardPage.jsx';
import StatisticsPage from './components/StatisticsPage.jsx';
import CataloguePage from './components/CataloguePage.jsx';
import LoginPage from './components/LoginPage.jsx';
import Icon from './components/Icon.jsx';

const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Tableau de bord', icon: 'layout-dashboard' },
  { id: 'statistics', label: 'Statistiques',    icon: 'bar-chart-2' },
  { id: 'catalogue',  label: 'Catalogue',        icon: 'layout-grid' },
];

export default function App() {
  const [session,     setSession]     = useState(undefined);
  const [activePage,  setActivePage]  = useState('dashboard');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const userId = session?.user?.id ?? null;
  const itemsApi = useItems(userId);

  /* ── Checking auth ── */
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Icon name="loader" size={28} className="animate-spin text-ink-300" />
      </div>
    );
  }

  if (!session) return <LoginPage />;

  const userEmail = session.user.email ?? '';
  const initials  = userEmail.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen">
      {/* ── Header ── */}
      <header className="bg-white/80 backdrop-blur-md border-b border-ink-100 sticky top-0 z-30">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="w-9 h-9 rounded-xl bg-ink-900 text-white flex items-center justify-center font-semibold tracking-tight">
              FS
            </div>
            <div>
              <div className="text-[15px] font-semibold text-ink-900 leading-none">Fashion Selling</div>
              <div className="text-[11px] text-ink-400 mt-1">Tableau de bord revente</div>
            </div>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-1 text-[13px]">
            {NAV_ITEMS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActivePage(id)}
                className={
                  'px-3 py-1.5 rounded-lg transition-colors ' +
                  (activePage === id
                    ? 'bg-ink-100 text-ink-900 font-medium'
                    : 'text-ink-500 hover:text-ink-900 hover:bg-ink-50')
                }
              >
                {label}
              </button>
            ))}
            {/* Placeholder — not implemented yet */}
            <span
              className="px-3 py-1.5 rounded-lg text-ink-300 cursor-not-allowed select-none"
              title="Bientôt disponible"
            >
              Paramètres
            </span>
          </nav>

          {/* User actions */}
          <div className="flex items-center gap-2">
            {/* Mobile nav toggle */}
            <div className="flex md:hidden items-center bg-ink-100 rounded-lg p-0.5 gap-0.5">
              {NAV_ITEMS.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setActivePage(id)}
                  title={label}
                  className={
                    'p-1.5 rounded-md transition-all ' +
                    (activePage === id ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700')
                  }
                >
                  <Icon name={icon} size={16} />
                </button>
              ))}
            </div>

            <button
              onClick={() => supabase.auth.signOut()}
              className="text-ink-400 hover:text-ink-700 hover:bg-ink-100 rounded-lg p-2 transition-colors"
              title="Se déconnecter"
            >
              <Icon name="log-out" size={17} />
            </button>
            <div
              className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-brand-700 text-white flex items-center justify-center text-[12px] font-semibold"
              title={userEmail}
            >
              {initials}
            </div>
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      {activePage === 'dashboard'  && <DashboardPage {...itemsApi} />}
      {activePage === 'statistics' && <StatisticsPage items={itemsApi.items} />}
      {activePage === 'catalogue'  && (
        <CataloguePage
          items={itemsApi.items}
          toggleSold={itemsApi.toggleSold}
          deleteItem={itemsApi.deleteItem}
          updateItem={itemsApi.updateItem}
        />
      )}
    </div>
  );
}
