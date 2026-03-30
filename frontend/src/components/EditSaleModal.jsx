import React, { useState, useEffect } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function EditSaleModal({ isOpen, onClose, sale, onSave }) {
  const [items, setItems] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sale && isOpen) {
      // Deep copy to avoid mutating the original prop
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl relative animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Edit Sale #{sale._id.slice(-6)}</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-3 mb-5 text-amber-800 text-sm">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p><strong>Note:</strong> Increasing quantity will reduce current inventory stock. Reducing quantity will return items to stock.</p>
          </div>

          <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {items.map((item, idx) => {
              const originalItem = sale.items[idx];
              const diff = item.quantity - originalItem.quantity;
              
              return (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg gap-3">
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">Rs. {item.price.toLocaleString('en-PK')} each</p>
                  </div>
                  
                  <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-gray-200 pt-3 sm:pt-0 sm:pl-4">
                    <div className="flex flex-col items-center">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1">Quantity</label>
                      <div className="flex items-center bg-white border border-gray-300 rounded-lg overflow-hidden">
                        <button 
                          onClick={() => handleQuantityChange(idx, item.quantity - 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-r border-gray-300"
                        >-</button>
                        <span className="w-12 text-center font-bold text-sm">{item.quantity}</span>
                        <button 
                          onClick={() => handleQuantityChange(idx, item.quantity + 1)}
                          className="px-3 py-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold border-l border-gray-300"
                        >+</button>
                      </div>
                      {diff !== 0 && (
                        <span className={`text-[10px] font-bold mt-1 ${diff > 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {diff > 0 ? '-' : '+'}{Math.abs(diff)} to stock
                        </span>
                      )}
                    </div>
                    
                    <div className="flex flex-col items-end w-24">
                      <label className="text-[10px] uppercase font-bold text-gray-400 mb-1">Subtotal</label>
                      <span className="font-bold text-gray-900">Rs. {item.subtotal.toLocaleString('en-PK')}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-5 border-t border-gray-200 bg-gray-50 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <p className="text-xs text-gray-500">Original Total</p>
              <p className="font-bold text-gray-500 line-through">Rs. {originalTotal.toLocaleString('en-PK')}</p>
            </div>
            <div className="h-8 w-px bg-gray-300"></div>
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">New Total</p>
              <p className="text-xl font-black text-gray-900">Rs. {newTotal.toLocaleString('en-PK')}</p>
            </div>
          </div>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <button onClick={onClose} className="flex-1 sm:flex-none px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg hover:bg-gray-50 font-medium">
              Cancel
            </button>
            <button 
              onClick={handleSave}
              disabled={isSubmitting || originalTotal === newTotal}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-sm"
            >
              {isSubmitting ? <span className="animate-spin text-xl leading-none">⟳</span> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
