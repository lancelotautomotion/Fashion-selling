import { useState } from 'react';
import { supabase } from '../lib/supabase.js';
import Icon from './Icon.jsx';

export default function LoginPage() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState(null);
  const [loading, setLoading]   = useState(false);

  const INPUT = 'w-full border border-ink-200 rounded-lg px-3 py-2.5 text-[14px] bg-white focus-ring transition-all placeholder:text-ink-400';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-[360px]">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-ink-900 text-white flex items-center justify-center font-semibold text-[18px] tracking-tight mb-4">
            FS
          </div>
          <h1 className="text-[22px] font-semibold text-ink-900 tracking-tight">Fashion Selling</h1>
          <p className="text-[13px] text-ink-400 mt-1">Connectez-vous à votre tableau de bord</p>
        </div>

        <div className="bg-white rounded-2xl border border-ink-100 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[12px] font-medium text-ink-600 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT}
                placeholder="vous@email.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-ink-600 mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-[12px] text-danger-600 bg-danger-50 rounded-lg px-3 py-2">
                <Icon name="alert-circle" size={14} />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-[14px] font-medium text-white bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              {loading && <Icon name="loader" size={16} className="animate-spin" />}
              {loading ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
