import React, { useState } from 'react';
import { X, Play, StopCircle, Wallet, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';

export function ShiftModal({ isOpen, onClose }) {
  const { currentSession, startShift, endShift } = useShift();
  const [cash, setCash] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!currentSession) {
        await startShift(Number(cash));
      } else {
        await endShift(Number(cash), notes);
      }
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setCash('');
        setNotes('');
      }, 1500);
    } catch (err) {
      setError(err.message || "Action failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md min-w-[350px] relative overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header Decor */}
        <div className={`h-2 ${currentSession ? 'bg-red-500' : 'bg-blue-600'}`}></div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-8">
            <div className="space-y-1">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                {currentSession ? 'Close Shift' : 'Open Shift'}
              </h2>
              <p className="text-sm text-slate-400 font-bold">
                {currentSession ? 'End your session and record totals' : 'Enter starting cash to begin'}
              </p>
            </div>
            {!loading && !success && (
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center animate-bounce shadow-xl ${currentSession ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <p className="text-xl font-black text-slate-900 leading-none">
                Shift {currentSession ? 'Closed' : 'Started'}!
              </p>
              <p className="text-sm text-slate-400 font-medium">Session records updated successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleAction} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              {currentSession && (
                <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Expected Cash</span>
                    <span className="text-lg font-black text-slate-900">Rs. {currentSession.expectedCash.toLocaleString('en-PK')}</span>
                  </div>
                  <div className="h-px bg-slate-200"></div>
                  <div className="flex justify-between items-center text-blue-600">
                    <span className="text-xs font-black uppercase tracking-widest">Shift Sales</span>
                    <span className="text-sm font-black">+{currentSession.totalSales.toLocaleString('en-PK')}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="relative group">
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">
                    {currentSession ? 'Actual Cash in Drawer' : 'Opening Cash Amount'}
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 font-black">Rs.</div>
                    <input
                      type="number"
                      required
                      value={cash}
                      onChange={(e) => setCash(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-2xl py-4 pl-12 pr-4 text-xl font-black text-slate-900 outline-none transition-all shadow-sm group-focus-within:shadow-md"
                    />
                  </div>
                </div>

                {currentSession && (
                  <div className="relative group">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 px-1">Session Notes (Optional)</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any discrepancies or notes..."
                      className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-2xl py-4 px-4 text-sm font-bold text-slate-900 outline-none transition-all shadow-sm min-h-[100px]"
                    />
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl disabled:opacity-50 ${currentSession
                    ? 'bg-slate-900 text-white hover:bg-black shadow-slate-900/20'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20'
                  }`}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <>
                    {currentSession ? <StopCircle className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    {currentSession ? 'Confirm & Close Shift' : 'Begin Day Shift'}
                  </>
                )}
              </button>
            </form>
          )}

          {/* Tips Section */}
          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center gap-3 text-slate-400">
            <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0">
              <Wallet className="w-4 h-4" />
            </div>
            <p className="text-[10px] font-bold leading-tight">
              Recording accurate opening and closing cash is critical for preventing theft and maintaining balanced reports.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
