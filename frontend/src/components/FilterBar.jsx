import React from 'react';
import { Search, Filter } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';

export function FilterBar() {
  const { 
    searchTerm, setSearchTerm, 
    categoryFilter, setCategoryFilter, 
    statusFilter, setStatusFilter, 
    categories 
  } = useProducts();
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search products by name or ID..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <Filter className="w-3.5 h-3.5 text-gray-500" />
            <select
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
            <select
              className="bg-transparent border-none focus:ring-0 text-sm font-medium text-gray-700 cursor-pointer"
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

      {/* Active Filters */}
      {(searchTerm || categoryFilter !== "All" || statusFilter !== "All") && (
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Active:</span>
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md border border-blue-100">
              {searchTerm}
              <button onClick={() => setSearchTerm("")} className="hover:text-blue-900 ml-1">×</button>
            </span>
          )}
          {categoryFilter !== "All" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-50 text-gray-700 text-[10px] font-bold rounded-md border border-gray-200 uppercase">
              {categoryFilter}
              <button onClick={() => setCategoryFilter("All")} className="hover:text-gray-900 ml-1">×</button>
            </span>
          )}
          {statusFilter !== "All" && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-100 uppercase">
              {statusFilter}
              <button onClick={() => setStatusFilter("All")} className="hover:text-amber-900 ml-1">×</button>
            </span>
          )}
          <button
            onClick={() => {
              setSearchTerm("");
              setCategoryFilter("All");
              setStatusFilter("All");
            }}
            className="text-[10px] font-bold text-blue-600 hover:text-blue-800 underline underline-offset-2 ml-auto"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
