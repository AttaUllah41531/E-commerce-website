import React from 'react';
import { ShoppingBag, ShoppingCart, Calendar } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function ProductCard({ product }) {
  const { getStockStatus, addToCart } = useProducts();
  const status = getStockStatus(product.stock, product.minStock);

  const today = new Date();
  const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
  const isExpired = expiryDate && expiryDate < today;
  const isNearExpiry = expiryDate && !isExpired && (expiryDate - today) < (15 * 24 * 60 * 60 * 1000);

  return (
    <div className="bg-white p-0.5 rounded-[1.8rem] shadow-sm hover:shadow-md transition-all duration-500 group overflow-hidden">
      <div
        onClick={() => addToCart(product)}
        /* Triple-Color Border Effect (Blue, Orange, Green) using layered shadows */
        className="bg-amber-50/40 backdrop-blur-xl rounded-[1.5rem] overflow-hidden transition-all duration-500 flex flex-col relative hover:-translate-y-1.5 border border-transparent cursor-pointer active:scale-95 shadow-[0_0_0_1.5px_#3b82f6,0_0_0_3px_#f97316,0_0_0_4.5px_#22c55e,0_10px_30px_rgba(0,0,0,0.06)]"
      >
        {/* Product Image Area - Compact & Warm Glassy Style */}
        <div className="relative w-full h-28 bg-white/40 flex-shrink-0 overflow-hidden">
          {product.images && product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-amber-200">
              <ShoppingBag className="w-7 h-7" />
            </div>
          )}

          {/* Status Badge - Tiny & Warm */}
          <div className="absolute top-2 right-2">
            <span className={`px-1.5 py-0.5 text-[6px] font-black rounded-md border border-amber-100 uppercase tracking-widest bg-white/90 text-amber-700 shadow-sm backdrop-blur-sm`}>
              {status.label}
            </span>
          </div>
        </div>

        {/* Product Info - Ultra-Compact Text */}
        <div className="p-2 flex-1 flex flex-col">
          <div className="mb-1.5">
            <p className="text-[6px] text-amber-600/80 font-black tracking-[0.2em] uppercase truncate mb-0.5">{product.category}</p>
            <h3 className="text-[10px] font-bold text-slate-800 leading-tight line-clamp-1 group-hover:text-amber-800 transition-colors uppercase tracking-tight">{product.name}</h3>
          </div>

          <div className="mt-auto space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-black text-slate-900 tracking-tighter">Rs.{product.price}</p>
              <div className="flex items-center gap-1 px-1 py-0.5 bg-amber-100/20 rounded-full border border-amber-100/30">
                <div className={`w-1 h-1 rounded-full ${product.stock > 0 ? 'bg-amber-500' : 'bg-rose-400'}`}></div>
                <span className="text-[6.5px] font-black text-amber-800">{product.stock}</span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product);
              }}
              disabled={product.stock === 0}
              className={`w-full flex items-center justify-center gap-2 py-1.5 rounded-xl text-[7.5px] font-black uppercase tracking-widest transition-all ${product.stock === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed border-none'
                : 'bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-600/20 active:scale-95'
                }`}
            >
              <ShoppingCart className="w-2.5 h-2.5" />
              {product.stock === 0 ? 'Empty' : 'Add'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
