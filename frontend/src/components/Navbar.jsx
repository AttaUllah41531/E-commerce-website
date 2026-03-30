import React from 'react';
import { Search, Plus, ShoppingCart, Download, Bell, TrendingUp, PackageSearch, LogOut, User as UserIcon } from 'lucide-react';
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
  yearlyProfit
}) {
  const { currentSession } = useShift();
  const { user, logout } = useUser();
  const { settings } = useSettings();
  const fmt = (n) => `${settings.currency || 'Rs.'} ${(n || 0).toLocaleString('en-PK')}`;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm px-6">
      <div className="flex items-center justify-between h-20 gap-8">

        {/* Left: Search Bar */}
        <div className="flex-1 max-w-sm">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full bg-slate-50 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
            />
          </div>
        </div>

        {/* Center: Stats Belt (The User's Favorite Section) */}
        <div className="hidden xl:flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-2 py-1.5 overflow-hidden">
          {/* Daily */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white transition-all cursor-default group">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.1em] mb-0.5">Today</p>
            <p className="text-sm font-black text-slate-900 leading-none">{fmt(dailySales)}</p>
            <p className="text-[9px] text-green-600 font-bold mt-1.5 leading-none">+{fmt(dailyProfit)} profit</p>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          {/* Monthly */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white transition-all cursor-default">
            <p className="text-[9px] text-blue-500 font-black uppercase tracking-[0.1em] mb-0.5">Monthly</p>
            <p className="text-sm font-black text-blue-700 leading-none">{fmt(monthlySales)}</p>
            <p className="text-[9px] text-green-600 font-bold mt-1.5 leading-none">+{fmt(monthlyProfit)} profit</p>
          </div>
          <div className="h-6 w-px bg-slate-200"></div>
          {/* Yearly */}
          <div className="flex flex-col items-center px-5 py-1 rounded-xl hover:bg-white transition-all cursor-default">
            <p className="text-[9px] text-indigo-500 font-black uppercase tracking-[0.1em] mb-0.5">Yearly</p>
            <p className="text-sm font-black text-indigo-700 leading-none">{fmt(yearlySales)}</p>
            <p className="text-[9px] text-green-600 font-bold mt-1.5 leading-none">+{fmt(yearlyProfit)} profit</p>
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

          {/* Quick Sale / Cart Button */}
          <button
            onClick={onCartClick}
            className="group flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 relative"
          >
            <PackageSearch className="w-5 h-5" />
            <span className="hidden md:inline font-bold text-sm">Sales Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {cartCount}
              </span>
            )}
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2 pl-4 border-l border-slate-100">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-900 leading-none uppercase tracking-tighter">{user?.fullName}</span>
              <span className="text-[8px] font-black text-blue-600 uppercase tracking-widest">{user?.role}</span>
            </div>

            <button
              onClick={logout}
              className="group relative w-10 h-10 bg-slate-50 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all border border-transparent hover:border-red-100"
              title="Logout"
            >
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
