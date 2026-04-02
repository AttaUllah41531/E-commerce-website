import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function FilterBar() {
  const {
    searchTerm, setSearchTerm,
    categoryFilter, setCategoryFilter,
    statusFilter, setStatusFilter,
    categories
  } = useProducts();

  return (
    /* FIX: Added 'w-full' and 'min-h' to prevent layout shifts when active filters appear/disappear */
    <div className="w-full bg-white rounded-xl border border-slate-900/5 p-1.5 space-y-2 transition-all duration-300">
      <div className="flex flex-col lg:flex-row gap-1.5">

        {/* Search - Ultra Compact & Bold */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-900 rounded-lg focus:outline-none focus:ring-4 focus:ring-slate-900/5 transition-all text-xs font-bold text-slate-900 placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Wrapper */}
        <div className="flex flex-wrap sm:flex-nowrap gap-1.5">
          {/* Category Select */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-slate-900 uppercase tracking-wider cursor-pointer outline-none"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Status Select */}
          <div className="flex items-center gap-1.5 bg-white px-3 py-1 rounded-lg border border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/5 transition-all">
            <div className={`w-1.5 h-1.5 rounded-full ${statusFilter === 'All' ? 'bg-blue-500' : statusFilter === 'Low Stock' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <select
              className="bg-transparent border-none focus:ring-0 text-[10px] font-black text-slate-900 uppercase tracking-wider cursor-pointer outline-none"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Status</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filters Area - Logic remains same, layout improved */}
      {
        (searchTerm || categoryFilter !== "All" || statusFilter !== "All") && (
          <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-50 animate-in fade-in slide-in-from-top-2 duration-300">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mr-1">Active Filters:</span>

            {searchTerm && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black rounded-full border border-blue-100">
                "{searchTerm}"
                <button onClick={() => setSearchTerm("")} className="hover:text-blue-900"><X className="w-3 h-3" /></button>
              </span>
            )}

            {categoryFilter !== "All" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-full border border-slate-200 uppercase">
                {categoryFilter}
                <button onClick={() => setCategoryFilter("All")} className="hover:text-slate-900"><X className="w-3 h-3" /></button>
              </span>
            )}

            {statusFilter !== "All" && (
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 text-[10px] font-black rounded-full border border-amber-100 uppercase">
                {statusFilter}
                <button onClick={() => setStatusFilter("All")} className="hover:text-amber-900"><X className="w-3 h-3" /></button>
              </span>
            )}

            <button
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("All");
                setStatusFilter("All");
              }}
              className="text-[10px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest ml-auto"
            >
              Reset All
            </button>
          </div>
        )
      }
    </div >
  );
}