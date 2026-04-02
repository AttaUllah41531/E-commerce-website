import React from 'react';
import { Search, Plus, ShoppingCart, Download, Bell, TrendingUp, PackageSearch, LogOut, User as UserIcon, Menu } from 'lucide-react';
import { useShift } from '../contexts/ShiftContext';
import { useUser } from '../contexts/UserContext';
import { useSettings } from '../contexts/SettingsContext';

export function Navbar({
  cartCount,
  onCartClick,
  onAddProduct,
  onNewSale,
  onExport,
  onShiftClick,
  dailySales,
  monthlySales,
  yearlySales,
  dailyProfit,
  monthlyProfit,
  yearlyProfit,
  onMenuClick,
  onToggleSidebar,
  isCollapsed
}) {
  const { currentSession } = useShift();
  const { user, logout } = useUser();
  const { settings } = useSettings();
  const fmt = (n) => `${settings.currency || 'Rs.'} ${(n || 0).toLocaleString('en-PK')}`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-blue-600 dark:bg-blue-900 border-b border-blue-500/30 dark:border-blue-800/60 shadow-lg px-2 md:px-4 backdrop-blur-md transition-all duration-300">
      <div className="flex items-center justify-between h-20 gap-4">

        {/* Left: Logo & Search Bar & Toggle */}
        <div className="flex items-center gap-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white rounded-2xl w-10 h-10 flex items-center justify-center shrink-0 shadow-lg shadow-white/10 transition-transform hover:scale-105 active:scale-95 cursor-pointer">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
              </svg>
            </div>
            <h1 className="text-xl font-black tracking-tight text-white hidden xl:block">NexFlow</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Desktop Sidebar Toggle */}
            <button
              onClick={onToggleSidebar}
              className="hidden md:flex p-2.5 text-white/80 hover:text-white hover:bg-blue-500/50 rounded-xl bg-blue-700/30 border border-blue-500/30 transition-all hover:shadow-md active:scale-95"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              <Menu className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
            </button>

            <button
              onClick={onMenuClick}
              className="md:hidden p-2 text-white/80 hover:text-white hover:bg-blue-500/50 rounded-xl bg-blue-700/30 border border-blue-500/30 transition-all"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="relative group w-full hidden sm:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-full bg-blue-700/20 dark:bg-blue-800/30 border border-blue-500/30 rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/20 focus:bg-blue-700/40 transition-all outline-none"
              />
            </div>
          </div>
        </div>

        {/* Center: Stats Belt */}
        <div className="hidden lg:flex items-center gap-2 bg-blue-700/20 dark:bg-blue-800/20 border border-blue-500/20 rounded-2xl px-2 py-1.5 shadow-inner">
          {/* Daily */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white/10 transition-all cursor-default group">
            <p className="text-[9px] text-white/70 font-black uppercase tracking-[0.1em] mb-0.5">Today</p>
            <p className="text-sm font-black text-white leading-none">{fmt(dailySales)}</p>
            <p className="text-[9px] text-emerald-300 font-bold mt-1.5 leading-none">+{fmt(dailyProfit)} profit</p>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          {/* Monthly */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white/10 transition-all cursor-default">
            <p className="text-[9px] text-blue-100 font-black uppercase tracking-[0.1em] mb-0.5">Monthly</p>
            <p className="text-sm font-black text-blue-50 leading-none">{fmt(monthlySales)}</p>
            <p className="text-[9px] text-emerald-300 font-bold mt-1.5 leading-none">+{fmt(monthlyProfit)} profit</p>
          </div>
          <div className="h-6 w-px bg-white/10"></div>
          {/* Yearly */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white/10 transition-all cursor-default">
            <p className="text-[9px] text-indigo-100 font-black uppercase tracking-[0.1em] mb-0.5">Yearly</p>
            <p className="text-sm font-black text-indigo-50 leading-none">{fmt(yearlySales)}</p>
            <p className="text-[9px] text-emerald-300 font-bold mt-1.5 leading-none">+{fmt(yearlyProfit)} profit</p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">

          <button
            onClick={onExport}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
            title="Export Reports"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={onShiftClick}
            className={`p-2.5 rounded-xl transition-all flex items-center gap-2 border ${currentSession
              ? "text-red-600 bg-red-50 border-red-100 hover:bg-red-100"
              : "text-slate-400 border-transparent hover:text-blue-600 hover:bg-blue-50"
              }`}
            title={currentSession ? "Close Current Shift" : "Open New Shift"}
          >
            <TrendingUp className={`w-5 h-5 ${currentSession ? "animate-pulse" : ""}`} />
            {currentSession && <span className="text-[10px] font-black uppercase">Shift Active</span>}
          </button>

          <div className="h-8 w-px bg-slate-100 mx-1"></div>

          {/* Quick Sale / Cart Button - Refined for reliability */}
          <button
            onClick={() => {
              console.log('Opening Cart...');
              onCartClick();
            }}
            className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative z-50"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline font-bold text-sm">Sales Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-4 border-l border-blue-400/30">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-white leading-none uppercase tracking-tighter">{user?.fullName}</span>
              <span className="text-[8px] font-black text-blue-200 uppercase tracking-widest">{user?.role}</span>
            </div>

            <button
              onClick={logout}
              className="group relative w-10 h-10 bg-blue-700/30 hover:bg-red-500/20 rounded-xl flex items-center justify-center transition-all border border-blue-500/20 hover:border-red-500/40"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-blue-100 group-hover:text-red-200 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </nav >
  );
}
