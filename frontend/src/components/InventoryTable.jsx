import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag, ShoppingCart, Eye, Edit2, Trash2,
  ArrowUp, ArrowDown, ArrowUpDown, FileSpreadsheet,
  Calendar, MoreVertical, X
} from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import { Badge } from './ui/Badge';

/**
 * Internal Action Menu Component
 * Manages the popover state for each row
 */
const RowActions = ({ onEdit, onDelete, onView }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-xl transition-all duration-300 active:scale-90 ${isOpen
          ? 'bg-slate-900 text-white shadow-lg rotate-90'
          : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 border border-slate-100'
          }`}
      >
        {isOpen ? <X className="w-4 h-4" /> : <MoreVertical className="w-4 h-4" />}
      </button>

      {isOpen && (
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 z-50 flex items-center gap-1 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-right-4 duration-200">
          <button onClick={() => { onView(); setIsOpen(false); }} className="p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-colors" title="View"><Eye className="w-4 h-4" /></button>
          <button onClick={() => { onEdit(); setIsOpen(false); }} className="p-2.5 text-slate-900 hover:bg-slate-50 rounded-xl transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button>
          <div className="w-[1px] h-4 bg-slate-100 mx-1" />
          <button onClick={() => { onDelete(); setIsOpen(false); }} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>
          <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-white border-r border-t border-slate-100 rotate-45" />
        </div>
      )}
    </div>
  );
};

export function InventoryTable({ onEdit, onDelete, onView, onExport }) {
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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 px-2">
        <div className="space-y-1">
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none">Stock Inventory</h3>
          <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em]">Manage Assets & Supply Chain</p>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Enhanced Sort Bar (Visible on all screens to replace table headers) */}
          <div className="flex items-center gap-2 bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm flex-1 lg:flex-none overflow-x-auto scrollbar-hide">
            {[
              { id: 'name', label: 'Name' },
              { id: 'category', label: 'Cat' },
              { id: 'stock', label: 'Stock' },
              { id: 'price', label: 'Price' },
              { id: 'expiryDate', label: 'Expiry' }
            ].map(sort => (
              <button
                key={sort.id}
                onClick={() => handleSort(sort.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${sortConfig.key === sort.id
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'
                  }`}
              >
                {sort.label} {getSortIcon(sort.id)}
              </button>
            ))}
          </div>
          <button
            onClick={onExport}
            disabled={products.length === 0}
            className="flex items-center gap-2 px-5 py-3 bg-emerald-600 text-white hover:bg-emerald-700 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/10 disabled:opacity-50 active:scale-95 ml-auto"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Mobile & Tablet Card Grid View (Visible below 1024px) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
          {products.length === 0 ? (
            <div className="col-span-full bg-white rounded-[2.5rem] border border-slate-100 p-16 text-center shadow-sm">
              <ShoppingBag className="w-10 h-10 text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Empty Inventory</p>
            </div>
          ) : (
            products.map((product) => {
              const status = getStockStatus(product.stock, product.minStock);
              const today = new Date();
              const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
              const isExpired = expiryDate && expiryDate < today;
              const isNearExpiry = expiryDate && !isExpired && (expiryDate - today) < (15 * 24 * 60 * 60 * 1000);

              return (
                <div key={product._id} className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col gap-5">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden shrink-0 shadow-inner">
                      {product.images?.[0] ? (
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ShoppingBag className="w-6 h-6 text-slate-300" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-black uppercase tracking-widest truncate">{product.category}</span>
                        <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">ID:{product._id?.slice(-4).toUpperCase()}</span>
                      </div>
                      <h4 className="text-base font-black text-slate-900 truncate tracking-tight">{product.name}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4 py-4 border-y border-slate-50">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Current Stock</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className={`text-lg font-black ${product.stock <= product.minStock ? 'text-rose-600' : 'text-slate-900'}`}>{product.stock}U</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Min: {product.minStock}</span>
                      </div>
                    </div>
                    <div className="space-y-1 text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Price</p>
                      <p className="text-lg font-black text-blue-600 font-mono tracking-tighter">Rs.{product.price.toLocaleString('en-PK')}</p>
                    </div>
                    {product.expiryDate && (
                      <div className={`col-span-2 flex items-center justify-between pt-3 border-t border-slate-50`}>
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-3.5 h-3.5 ${isExpired ? 'text-rose-500' : isNearExpiry ? 'text-amber-500' : 'text-slate-400'}`} />
                          <div className="flex flex-col gap-0.5">
                            <span className="text-[7px] text-slate-400 font-black uppercase tracking-widest">Expiry Date</span>
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isExpired ? 'text-rose-600' : isNearExpiry ? 'text-amber-600' : 'text-slate-700'}`}>
                              {new Date(product.expiryDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        {isNearExpiry && (
                          <span className="text-[8px] font-black bg-amber-50 text-amber-600 px-3 py-1 rounded-full uppercase tracking-tighter border border-amber-100 flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Expiring Soon
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <Badge variant={status.color.includes('red') ? 'danger' : status.color.includes('amber') ? 'warning' : 'success'} className="px-3 py-1 text-[10px]">
                      {status.label}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <button onClick={() => addToCart(product)} className="p-3 text-white bg-slate-900 hover:bg-blue-600 rounded-xl active:scale-90 transition-all shadow-lg shadow-slate-900/10"><ShoppingCart className="w-4 h-4" /></button>
                      <RowActions
                        onView={() => onView(product)}
                        onEdit={() => onEdit(product)}
                        onDelete={() => onDelete(product._id)}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (lg breakpoint: 1024px+) */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden hidden lg:block transition-all">
          <div className="w-full overflow-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <thead className="bg-slate-50/50 border-b border-slate-100">
                <tr>
                  <th className="w-[30%] pl-8 pr-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600" onClick={() => handleSort("name")}>
                    <div className="flex items-center gap-2">Details {getSortIcon("name")}</div>
                  </th>
                  <th className="w-[12%] px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600" onClick={() => handleSort("category")}>
                    <div className="flex items-center gap-2">Cat. {getSortIcon("category")}</div>
                  </th>
                  <th className="w-[12%] px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600" onClick={() => handleSort("stock")}>
                    <div className="flex items-center gap-2">Stock {getSortIcon("stock")}</div>
                  </th>
                  <th className="w-[13%] px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600" onClick={() => handleSort("price")}>
                    <div className="flex items-center gap-2">Price {getSortIcon("price")}</div>
                  </th>
                  <th className="w-[15%] px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] cursor-pointer hover:text-blue-600" onClick={() => handleSort("expiryDate")}>
                    <div className="flex items-center gap-2">Expiry {getSortIcon("expiryDate")}</div>
                  </th>
                  <th className="w-[10%] px-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="w-[8%] pr-8 pl-2 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Ops</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-5 bg-slate-50 rounded-full"><ShoppingBag className="w-10 h-10 text-slate-200" /></div>
                        <p className="text-slate-400 font-black text-xs uppercase tracking-widest">No Matches Found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const status = getStockStatus(product.stock, product.minStock);
                    const today = new Date();
                    const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;
                    const isExpired = expiryDate && expiryDate < today;
                    const isNearExpiry = expiryDate && !isExpired && (expiryDate - today) < (15 * 24 * 60 * 60 * 1000);

                    return (
                      <tr key={product._id} className="hover:bg-blue-50/30 transition-all duration-300 group">
                        <td className="pl-8 pr-2 py-5 whitespace-nowrap overflow-hidden">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                              {product.images?.[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <ShoppingBag className="w-4 h-4 text-slate-200" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate" title={product.name}>{product.name}</div>
                              <div className="text-[8px] text-slate-400 font-black tracking-widest mt-0.5 uppercase">ID: {product._id?.slice(-4).toUpperCase()}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap overflow-hidden">
                          <span className="text-[9px] font-black text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-full truncate inline-block max-w-full">{product.category}</span>
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap">
                          <div className={`text-sm font-black ${product.stock <= product.minStock ? 'text-rose-600' : 'text-slate-900'}`}>{product.stock}Items</div>
                          <div className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">Min: {product.minStock}</div>
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap">
                          <div className="text-sm font-black text-blue-600 font-mono tracking-tighter">Rs. {product.price.toLocaleString('en-PK')}</div>
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap overflow-hidden">
                          {product.expiryDate ? (
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1.5">
                                <Calendar className={`w-3 h-3 shrink-0 ${isExpired ? 'text-rose-500' : isNearExpiry ? 'text-amber-500' : 'text-slate-400'}`} />
                                <span className={`text-[10px] font-black uppercase tracking-tighter truncate ${isExpired ? 'text-rose-600' : isNearExpiry ? 'text-amber-600' : 'text-slate-900'}`}>
                                  {new Date(product.expiryDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' })}
                                </span>
                              </div>
                              {isNearExpiry && <span className="text-[7px] font-black text-amber-600 uppercase tracking-widest pl-4.5">Expiring Soon</span>}
                            </div>
                          ) : (
                            <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">N/A</span>
                          )}
                        </td>
                        <td className="px-2 py-5 whitespace-nowrap overflow-hidden">
                          <Badge variant={status.color.includes('red') ? 'danger' : status.color.includes('amber') ? 'warning' : 'success'} className="px-2 py-0.5 text-[8px] truncate">
                            {status.label}
                          </Badge>
                        </td>
                        <td className="pr-8 pl-2 py-5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button onClick={() => addToCart(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all active:scale-90" title="Add to Cart">
                              <ShoppingCart className="w-3.5 h-3.5" />
                            </button>
                            <RowActions
                              onView={() => onView(product)}
                              onEdit={() => onEdit(product)}
                              onDelete={() => onDelete(product._id)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-slate-50/30 px-8 py-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Density</span>
              <select
                value={itemsPerPage}
                onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-[10px] font-black text-slate-900 uppercase outline-none focus:ring-4 focus:ring-blue-600/5 transition-all cursor-pointer shadow-sm"
              >
                {[10, 20, 50].map(val => (<option key={val} value={val}>{val} Rows</option>))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm active:scale-90"
              >
                <ArrowUp className="w-4 h-4 -rotate-90" />
              </button>
              <div className="px-6 py-2 bg-slate-900 rounded-2xl shadow-lg">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Page {currentPage}</span>
              </div>
              <button
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={products.length < itemsPerPage}
                className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-600 hover:text-blue-600 disabled:opacity-30 transition-all shadow-sm active:scale-90"
              >
                <ArrowUp className="w-4 h-4 rotate-90" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}