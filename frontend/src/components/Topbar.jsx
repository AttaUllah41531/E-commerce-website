import React from 'react';
import { Search, Plus, ShoppingCart, Download, Bell } from 'lucide-react';

export function Topbar({ onAddProduct, onNewSale, onExport }) {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Global Search */}
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search products, records, analytics..." 
            className="w-full bg-gray-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onAddProduct}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-sm shadow-blue-200"
        >
          <Plus className="w-4 h-4" />
          Product
        </button>
        <button 
          onClick={onNewSale}
          className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Sale
        </button>
        <button 
          onClick={onExport}
          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          title="Export Reports"
        >
          <Download className="w-5 h-5" />
        </button>
        <div className="h-6 w-[1px] bg-gray-200 mx-1"></div>
        <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border-2 border-white shadow-sm cursor-pointer ml-2 overflow-hidden ring-1 ring-gray-100">
           {/* Avatar Placeholder */}
        </div>
      </div>
    </div>
  );
}
