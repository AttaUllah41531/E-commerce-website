import React, { useState } from 'react';
import { X, ShieldCheck, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export function AuthGuardModal({ isOpen, onClose, onConfirm, title = "Authorization Required", message = "Please enter the owner password to proceed with this sensitive action." }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // In a real app, this would be a backend call, but for MVP anti-theft requirements:
    const correctPassword = "admin123"; // Owner's static or configurable password
    
    if (password === correctPassword) {
      setSuccess(true);
      setTimeout(() => {
        onConfirm(password);
        setSuccess(false);
        setPassword('');
        onClose();
      }, 800);
    } else {
      setError("Incorrect Owner Password");
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl shadow-sm">
                <ShieldCheck className="w-6 h-6" />
            </div>
            {!loading && !success && (
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="space-y-2 mb-8">
             <h2 className="text-2xl font-black text-slate-900 tracking-tighter">{title}</h2>
             <p className="text-xs text-slate-400 font-bold leading-relaxed">{message}</p>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-6 text-center animate-in zoom-in-90">
               <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8" />
               </div>
               <p className="text-sm font-black text-slate-900 uppercase tracking-widest">Owner Verified</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-[10px] font-black uppercase tracking-wider">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {error}
                </div>
              )}

              <div className="relative group">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600">
                    <Lock className="w-4 h-4" />
                 </div>
                 <input
                   type="password"
                   autoFocus
                   required
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="Enter owner password"
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-sm"
                 />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-900/20 active:scale-95 transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Authorize Action"}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">NexFlow Security Protocol v2.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
