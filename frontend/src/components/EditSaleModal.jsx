import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function EditSaleModal({ isOpen, onClose, sale, onSave }) {
  // --- ORIGINAL LOGIC START ---
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sale && isOpen) {
      setItems(JSON.parse(JSON.stringify(sale.items)));
    }
  }, [sale, isOpen]);

  if (!isOpen || !sale) return null;

  const handleQuantityChange = (index, newQty) => {
    if (newQty < 1) return;
    const newItems = [...items];
    newItems[index].quantity = newQty;
    newItems[index].subtotal = newItems[index].price * newQty;
    newItems[index].profit = (newItems[index].price - (newItems[index].costPrice || 0)) * newQty;
    setItems(newItems);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      const totalAmount = items.reduce((sum, item) => sum + item.subtotal, 0);
      const totalProfit = items.reduce((sum, item) => sum + (item.profit || 0), 0);
      
      const updatedSaleData = {
        ...sale,
        items,
        totalAmount,
        totalProfit
      };

      await onSave(updatedSaleData);
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to edit sale");
    } finally {
      setIsSubmitting(false);
    }
  };

  const originalTotal = sale.totalAmount;
  const newTotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  // --- ORIGINAL LOGIC END ---

  return (
    /* FIX: 'grid place-items-center' and 'z-50' to maintain modal hierarchy */
    <div className="fixed inset-0 z-50 grid place-items-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-hidden">
      <div className="absolute inset-0" onClick={onClose} />
      
      {/* FIX: Explicit max-width and flex-col to prevent width collapse (Pill effect) */}
      <div className="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col max-h-[90svh]">
        
        {/* Header - Fixed height */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0 bg-white">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">Edit Sale</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID: #{sale._id.slice(-6).toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Area */}
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
          <div className="bg-amber-50 border border-amber-100 rounded-[1.5rem] p-4 flex gap-3 text-amber-800 text-xs">
            <ShieldAlert className="w-5 h-5 flex-shrink-0 text-amber-500" />
            <p className="font-medium">
              <strong>Inventory Warning:</strong> Increasing quantity reduces stock. Reducing quantity returns items to your inventory.
            </p>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => {
              const originalItem = sale.items[idx];
              const diff = item.quantity - originalItem.quantity;
              
              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 border border-slate-100 rounded-2xl gap-4 group hover:bg-white hover:shadow-sm transition-all">
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900">{item.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Price: Rs. {item.price.toLocaleString('en-PK')}</p>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <label className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-tighter">Adjust Qty</label>
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <button 
                          onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-slate-50 text-slate-600 font-bold border-r border-slate-200 transition-colors"
                        >-</button>
                        <span className="w-10 text-center font-black text-xs text-slate-900">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-slate-50 text-slate-600 font-bold border-l border-slate-200 transition-colors"
                        >+</button>
                      </div>
                      {diff !== 0 && (
                        <span className={`text-[9px] font-black mt-1 uppercase ${diff > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                          {diff > 0 ? 'Stock -' : 'Stock +'}{Math.abs(diff)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end min-w-[100px]">
                      <label className="text-[9px] uppercase font-black text-slate-400 mb-1 tracking-tighter">Line Total</label>
                      <span className="font-black text-sm text-blue-600">Rs. {item.subtotal.toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Fixed/Sticky */}
        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Original</p>
              <p className="font-bold text-slate-400 line-through text-sm">Rs. {originalTotal.toLocaleString('en-PK')}</p>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div>
              <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Revised Total</p>
              <p className="text-xl font-black text-slate-900">Rs. {newTotal.toLocaleString('en-PK')}</p>
            </div>
          </div>
          
          <div className="flex gap-3 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-6 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting || originalTotal === newTotal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed shadow-premium transition-all"
            >
              {isSubmitting ? <span className="animate-spin">⟳</span> : <Save className="w-4 h-4" />}
              Update Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}