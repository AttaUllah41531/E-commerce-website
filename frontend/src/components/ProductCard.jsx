import React from 'react';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function ProductCard({ product }) {
  const { getStockStatus, addToCart } = useProducts();
  const status = getStockStatus(product.stock, product.minStock);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col">
      {/* Product Image Area */}
      <div className="relative w-full h-48 bg-gray-50 flex-shrink-0">
        {product.images && product.images[0] ? (
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-200">
            <ShoppingBag className="w-12 h-12" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border uppercase tracking-wide backdrop-blur-md bg-white/90 ${status.color}`}>
            {status.label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-4">
          <p className="text-[10px] text-blue-600 font-black tracking-widest uppercase mb-1">{product.category}</p>
          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-2">{product.name}</h3>
        </div>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xl font-black text-gray-900">Rs. {product.price.toLocaleString('en-PK')}</p>
            <p className="text-xs font-bold text-gray-500">{product.stock} left</p>
          </div>

          <button 
            onClick={() => addToCart(product)} 
            disabled={product.stock === 0}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${
              product.stock === 0 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10 active:scale-[0.98]'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
