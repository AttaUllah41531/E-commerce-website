import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { Lock, User, ShieldCheck, AlertCircle, ShoppingBag } from 'lucide-react';

export function LoginView() {
  const { login } = useUser();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-10">
          <div className="inline-flex p-4 bg-white rounded-3xl shadow-xl shadow-blue-500/10 mb-6 group hover:scale-110 transition-transform duration-500">
            <ShoppingBag className="w-10 h-10 text-blue-600 group-hover:rotate-12 transition-transform" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">NexFlow POS</h1>
          <p className="text-slate-400 font-bold tracking-widest uppercase text-[10px] mt-2">Smart Inventory & Retail Management</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
          
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Staff Login</h2>
            <p className="text-slate-400 text-sm font-medium">Please sign in to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <User className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Username"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-sm"
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Start Session"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-300" />
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Secure NexFlow Engine v2.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
