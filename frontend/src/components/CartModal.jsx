import React from 'react';
import { X, ShoppingBag, Trash2, ArrowRight, Plus, Minus } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function CartModal({ isOpen, onClose, onCheckout }) {
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

  return (
    <div className="fixed inset-0 z-100 overflow-hidden">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md pointer-events-auto">
          <div className="h-full flex flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="px-6 py-6 border-b border-gray-100 bg-white sticky top-0 z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Sales Cart</h2>
                    <p className="text-xs text-gray-500">{cart.length} items staged for sale</p>
                  </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Manual Search & Quick Billing */}
              <div className="relative group">
                 <input 
                   type="text" 
                   placeholder="Manual item search or SKU entry..." 
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full bg-slate-50 border-2 border-transparent focus:border-blue-600/10 focus:bg-white rounded-xl py-2.5 px-4 text-sm font-bold placeholder:text-slate-400 outline-none transition-all shadow-sm"
                 />
                 
                 {filteredProducts.length > 0 && (
                   <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                     {filteredProducts.map(p => (
                       <button
                         key={p._id}
                         onClick={() => handleAddFromSearch(p)}
                         className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none"
                       >
                         <div className="text-left">
                           <p className="text-sm font-black text-slate-900">{p.name}</p>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">SKU: {p._id.slice(-6).toUpperCase()}</p>
                         </div>
                         <div className="text-right">
                           <p className="text-xs font-black text-blue-600">Rs. {p.price.toLocaleString('en-PK')}</p>
                           <p className="text-[9px] text-slate-400 font-bold">{p.stock} in stock</p>
                         </div>
                       </button>
                     ))}
                   </div>
                 )}
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-gray-200" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">Your cart is empty</h3>
                  <p className="text-sm text-gray-500 max-w-[200px] mt-2">Add items to process a bulk inventory sale.</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 group transition-all hover:bg-white hover:shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-100 overflow-hidden flex-shrink-0">
                      {item.images && item.images[0] ? (
                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 truncate pr-2">{item.name}</h4>
                        <button onClick={() => onRemove(item.productId)} className="text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{item.category}</p>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.productId, -1, 999)}
                            disabled={item.quantity <= 1}
                            className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-gray-900 min-w-[16px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.productId, 1, item.stock)}
                            disabled={item.quantity >= item.stock}
                            className="p-1 hover:bg-gray-50 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-bold text-blue-600">Rs. {(item.price * item.quantity).toLocaleString('en-PK')}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="px-6 py-6 bg-gray-50 border-t border-gray-200 space-y-4">
                <div className="flex justify-between items-center">
                  <p className="text-base text-gray-600">Total Sale Value</p>
                  <p className="text-2xl font-black text-gray-900">Rs. {total.toLocaleString('en-PK')}</p>
                </div>
                
                <div className="flex gap-3">
                  <button 
                    onClick={onClear}
                    className="flex-1 py-3 text-sm font-bold text-gray-500 hover:text-red-600 transition-colors uppercase tracking-widest"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={onCheckout}
                    className="flex-[2] py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                  >
                    Complete Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
