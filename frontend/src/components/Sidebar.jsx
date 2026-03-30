import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { LayoutDashboard, Store, AlertTriangle, XCircle, Settings, PackageOpen, ChevronRight } from 'lucide-react';

export function Sidebar() {
  const { categories } = useProducts();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItemClass = (path) => {
    const active = isActive(path);
    return `flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${
      active 
        ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40 translate-x-1" 
        : "text-slate-400 hover:text-white hover:bg-slate-800/50"
    }`;
  };

  return (
    <aside className="w-64 h-screen bg-slate-950 text-white flex flex-col shadow-2xl flex-shrink-0 sticky top-0 overflow-y-auto hidden md:flex border-r border-slate-900">
      {/* Brand */}
      <div className="p-8 mb-2">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl shadow-lg rotate-3 group-hover:rotate-0 transition-transform">
            <PackageOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-white">NexFlow</h1>
            <p className="text-[10px] text-blue-500 font-black uppercase tracking-[0.2em] -mt-1">Inventory Pro</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 flex flex-col gap-2">
        
        {/* Section: Overview */}
        <div className="mb-6">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Main Dashboard</p>
          <div className="space-y-1.5">
            <Link to="/" className={navItemClass('/')}>
              <div className="flex items-center gap-3">
                <LayoutDashboard className="w-5 h-5" />
                <span>Overview</span>
              </div>
              {isActive('/') && <ChevronRight className="w-4 h-4 text-white/50" />}
            </Link>
            <Link to="/store" className={navItemClass('/store')}>
              <div className="flex items-center gap-3">
                <Store className="w-5 h-5" />
                <span>Product Catalog</span>
              </div>
              {isActive('/store') && <ChevronRight className="w-4 h-4 text-white/50" />}
            </Link>
          </div>
        </div>

        {/* Section: Categories */}
        <div className="mb-6">
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Categories</p>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1 scrollbar-hide">
            {categories.filter(c => c !== "All").map((cat) => (
              <Link
                key={cat}
                to={`/store/category/${cat}`}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                  isActive(`/store/category/${cat}`)
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/30"
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${isActive(`/store/category/${cat}`) ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-slate-700'}`}></div>
                <span className="capitalize">{cat}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Section: Alerts */}
        <div>
          <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Health Checks</p>
          <div className="space-y-1.5">
            <Link to="/store/status/low" className={navItemClass('/store/status/low')}>
              <div className="flex items-center gap-3">
                <AlertTriangle className={`w-5 h-5 ${isActive('/store/status/low') ? 'text-white' : 'text-amber-500'}`} />
                <span>Low Stock</span>
              </div>
            </Link>
            <Link to="/store/status/out" className={navItemClass('/store/status/out')}>
              <div className="flex items-center gap-3">
                <XCircle className={`w-5 h-5 ${isActive('/store/status/out') ? 'text-white' : 'text-red-500'}`} />
                <span>Deficit List</span>
              </div>
            </Link>
          </div>
        </div>

      </nav>

      {/* Logout / Settings */}
      <div className="p-4 mt-auto border-t border-slate-900">
        <button className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-900 hover:text-white transition-all group">
          <Settings className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
