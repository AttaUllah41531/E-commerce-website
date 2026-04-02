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
    /* Changed to min-h-svh for better mobile/small screen height handling */
    <div className="min-h-svh w-full bg-background grid place-items-center p-4 selection:bg-primary/20 relative overflow-x-hidden overflow-y-auto">

      <div className="w-full max-w-[360px] z-10 animate-in fade-in zoom-in-95 duration-700 flex flex-col py-4">

        {/* Compact Logo Section - Reduced margins and sizes */}
        <div className="text-center mb-6">
          <div className="inline-flex p-3.5 bg-card rounded-2xl shadow-premium mb-3 group hover:scale-105 transition-transform duration-500 border border-border">
            <ShoppingBag className="w-8 h-8 text-primary group-hover:rotate-12 transition-transform" />
          </div>
          <p className="text-muted font-bold tracking-[0.15em] uppercase text-[8px] mt-2 opacity-60">
            Smart Inventory Management
          </p>
        </div>

        {/* Compact Card - Reduced padding from p-10 to p-7 */}
        <div className="w-full bg-card rounded-[2rem] shadow-premium p-7 relative border border-border flex flex-col">

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-primary rounded-b-full"></div>

          <div className="mb-6 text-center">
            <h2 className="text-xl font-black text-dark tracking-tight">Staff Login</h2>
            <p className="text-muted text-[11px] font-medium mt-0.5">Sign in to your session</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 w-full">
            {error && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-600 text-[10px] font-bold">
                <AlertCircle className="w-3 h-3" />
                {error}
              </div>
            )}

            <div className="space-y-3">
              {/* Identification */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest pl-1">Username</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="w-full bg-slate-50/50 border border-border focus:border-primary/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-dark outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              {/* Access Key */}
              <div className="space-y-1">
                <label className="text-[8px] font-black text-muted uppercase tracking-widest pl-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-slate-50/50 border border-border focus:border-primary/40 rounded-xl py-3 pl-11 pr-4 text-xs font-bold text-dark outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-dark hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-premium active:scale-[0.97] transition-all disabled:opacity-50 mt-1"
            >
              {loading ? "Verifying..." : "Start Session"}
            </button>
          </form>

          {/* Secure Footer - More compact */}
          <div className="mt-8 pt-5 border-t border-border flex items-center justify-center gap-2">
            <ShieldCheck className="w-3 h-3 text-primary/50" />
            <span className="text-[8px] font-black text-muted uppercase tracking-widest leading-none">
              Nexus Engine v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Background Blobs - Reduced opacity for cleaner look */}
      <div className="fixed inset-0 -z-10 pointer-events-none opacity-[0.07]">
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}