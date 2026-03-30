import React from 'react';
import { ShoppingBag, ShoppingCart, Eye, Edit2, Trash2, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { Badge } from './ui/Badge';

export function InventoryTable({ 
  onEdit, 
  onDelete,
  onView
}) {
  const { 
    filteredProducts: products, 
    handleSort, 
    sortConfig,
    getStockStatus,
    addToCart,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage
  } = useProducts();

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="w-3 h-3 opacity-30" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp className="w-3 h-3 text-blue-600" /> 
      : <ArrowDown className="w-3 h-3 text-blue-600" />;
  };

  const handleSale = (product) => {
    addToCart(product);
  };

  const handleView = (product) => {
    if (onView) onView(product);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hidden sm:block">
      <div className="overflow-x-auto scrollbar-hide">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead className="bg-slate-50/50 border-b border-gray-100">
            <tr>
              <th className="w-[35%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Product Info</th>
              <th className="w-[15%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("category")}>
                <div className="flex items-center gap-2">Category {getSortIcon("category")}</div>
              </th>
              <th className="w-[15%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("stock")}>
                <div className="flex items-center gap-2">Stock {getSortIcon("stock")}</div>
              </th>
              <th className="w-[12%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort("price")}>
                <div className="flex items-center gap-2">Price {getSortIcon("price")}</div>
              </th>
              <th className="w-[12%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Expiry</th>
              <th className="w-[10%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status</th>
              <th className="w-[10%] px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                       <ShoppingBag className="w-8 h-8 text-slate-200" />
                    </div>
                    <p className="text-slate-400 font-bold text-sm">No products matching your search</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getStockStatus(product.stock, product.minStock);
                return (
                  <tr key={product._id} className="hover:bg-slate-50/80 transition-all duration-200 group">
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 shadow-sm overflow-hidden group-hover:scale-110 transition-transform duration-300">
                          {product.images && product.images[0] ? (
                            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <ShoppingBag className="w-5 h-5 text-gray-200" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate">{product.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold tracking-tighter">SKU: {product._id?.slice(-8).toUpperCase()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <Badge variant="neutral">{product.category}</Badge>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-slate-900">{product.stock}</div>
                      <div className="text-[10px] text-slate-400 font-bold">Limit: {product.minStock}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <div className="text-sm font-black text-blue-600 font-mono">{product.price.toLocaleString('en-PK')}</div>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      {product.expiryDate ? (
                        <div className="flex flex-col">
                          <span className={`text-[10px] font-black uppercase tracking-tight ${
                            new Date(product.expiryDate) < new Date() ? 'text-red-600' : 
                            new Date(product.expiryDate) < new Date(Date.now() + 30*24*60*60*1000) ? 'text-amber-600' : 'text-slate-500'
                          }`}>
                            {new Date(product.expiryDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                          {new Date(product.expiryDate) < new Date() && <span className="text-[8px] font-black text-red-500 uppercase">EXPIRED</span>}
                        </div>
                      ) : (
                         <span className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.15em]">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap">
                      <Badge variant={status.color.includes('red') ? 'danger' : status.color.includes('amber') ? 'warning' : 'success'}>
                        {status.label}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => addToCart(product)} className="p-2 text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100 rounded-xl transition-all" title="Add to Cart">
                          <ShoppingCart className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleView(product)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 rounded-xl transition-all" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => onEdit(product)} className="p-2 text-blue-600 hover:bg-white hover:shadow-sm border border-transparent hover:border-blue-100 rounded-xl transition-all" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(product._id)} className="p-2 text-red-500 hover:bg-white hover:shadow-sm border border-transparent hover:border-red-100 rounded-xl transition-all" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="bg-slate-50/50 px-6 py-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Rows per page</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all cursor-pointer shadow-sm"
          >
            {[10, 20, 50, 100].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-white border border-gray-100 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
          >
            <ArrowUp className="w-4 h-4 -rotate-90 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center px-4 py-1.5 bg-white border border-gray-100 rounded-xl shadow-sm">
            <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">Page {currentPage}</span>
          </div>

          <button
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={products.length < itemsPerPage}
            className="p-2 bg-white border border-gray-100 rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm group"
          >
            <ArrowUp className="w-4 h-4 rotate-90 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
