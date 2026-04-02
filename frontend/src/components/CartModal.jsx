import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function CartModal({ isOpen, onClose, onCheckout }) {
  // --- ORIGINAL LOGIC UNTOUCHED ---
  const { cart, products, addToCart, removeFromCart: onRemove, clearCart: onClear, updateQuantity: onUpdateQuantity } = useProducts();
  const [searchQuery, setSearchQuery] = React.useState('');

  if (!isOpen) return null;

  const filteredProducts = searchQuery.trim()
    ? products.filter(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p._id.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5)
    : [];

  const handleAddFromSearch = (product) => {
    addToCart(product);
    setSearchQuery('');
  };

  const total = (cart || []).reduce((sum, item) => sum + (item.price * item.quantity), 0);
  // --- END LOGIC ---

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Sidebar Container */}
      <div className="relative w-full max-w-md h-full bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] flex flex-col">

        {/* Header - Fixed/Non-shrinking */}
        <div className="shrink-0 px-6 py-6 border-b border-slate-100 bg-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 rounded-2xl">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">Sales Cart</h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {cart.length} items staged
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search product or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-100 focus:border-blue-600/20 focus:bg-white rounded-2xl py-3 px-4 text-sm font-bold placeholder:text-slate-400 outline-none transition-all shadow-sm"
            />

            {filteredProducts.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-[2rem] shadow-premium z-50 overflow-hidden animate-in zoom-in-95">
                {filteredProducts.map(p => (
                  <button
                    key={p._id}
                    onClick={() => handleAddFromSearch(p)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    <div className="text-left">
                      <p className="text-sm font-black text-slate-900">{p.name}</p>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">SKU: {p._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-black text-blue-600">Rs. {p.price.toLocaleString('en-PK')}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart Items Area - Scrollable */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 custom-scrollbar">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <ShoppingBag className="w-12 h-12 text-slate-200 mb-4" />
              <p className="text-sm font-bold text-slate-400">Cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.productId} className="flex gap-4 p-4 bg-slate-50/50 rounded-[1.5rem] border border-slate-100 group transition-all">
                <div className="w-14 h-14 bg-white rounded-xl border border-slate-100 overflow-hidden shrink-0">
                  {item.images && item.images[0] ? (
                    <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-200">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black text-slate-900 truncate pr-2">{item.name}</h4>
                    <button onClick={() => onRemove(item.productId)} className="text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex justify-between items-end">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                      <button
                        onClick={() => onUpdateQuantity(item.productId, -1, 999)}
                        disabled={item.quantity <= 1}
                        className="p-1 hover:bg-slate-50 text-slate-400 disabled:opacity-20"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-black text-slate-900 min-w-[20px] text-center">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.productId, 1, item.stock)}
                        disabled={item.quantity >= item.stock}
                        className="p-1 hover:bg-slate-50 text-slate-400 disabled:opacity-20"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <p className="text-sm font-black text-blue-600">Rs. {(item.price * item.quantity).toLocaleString('en-PK')}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer - Fixed/Non-shrinking */}
        {cart.length > 0 && (
          <div className="shrink-0 px-6 py-6 bg-white border-t border-slate-100 space-y-4">
            <div className="flex justify-between items-center px-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuation</p>
              <p className="text-xl font-black text-slate-900">Rs. {total.toLocaleString('en-PK')}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onClear}
                className="flex-1 py-4 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Clear
              </button>
              <button
                onClick={onCheckout}
                className="flex-[2.5] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-premium transition-all active:scale-95"
              >
                Complete Sale
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}