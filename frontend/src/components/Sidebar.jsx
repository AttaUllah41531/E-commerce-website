import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { useUser } from '../contexts/UserContext';
import {
  LayoutDashboard,
  Store,
  AlertTriangle,
  XCircle,
  Settings,
  Users,
  LogOut,
  HelpCircle,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  UserCircle2
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Sidebar({ isMobileOpen, onCloseMobile }) {
  const { categories } = useProducts();
  const { user, isAdmin } = useUser();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  // Sidebar expanded/collapsed state
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Default theme handles hydration, ensure window is defined
  const currentTheme = theme === 'system' && typeof window !== 'undefined'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;

  const isActive = (path) => location.pathname === path;

  const toggleTheme = () => {
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleLinkClick = () => {
    if (window.innerWidth < 768 && onCloseMobile) {
      onCloseMobile();
    }
  };

  // Modern pill-shaped Nav Item taking inspiration from provided design
  const NavItem = ({ to, icon: Icon, label, alert = false, onClick }) => {
    const active = isActive(to);

    return (
      <Link
        to={to}
        onClick={(e) => {
          handleLinkClick();
          if (onClick) onClick(e);
        }}
        className={`flex items-center group px-3 py-3 mx-4 rounded-2xl text-[13px] font-bold transition-all duration-300 ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          } ${isCollapsed ? 'justify-center mx-auto w-12 h-12 px-0 md:flex hidden' : 'gap-4'}
        ${!active && !isCollapsed ? 'hover:translate-x-1' : ''}`}
        title={isCollapsed ? label : undefined}
      >
        <div className="relative flex items-center justify-center">
          <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? "text-white" : "group-hover:scale-110"}`} />
          {alert && (
            <div className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-[#030213] ${alert === 'low' ? 'bg-amber-500' : 'bg-red-500'}`}></div>
          )}
        </div>
        <span className={`flex-1 whitespace-nowrap tracking-wide ${isCollapsed ? 'md:hidden' : ''}`}>{label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed md:relative h-screen flex flex-col bg-white dark:bg-[#030213] text-slate-900 dark:text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-200/60 dark:border-slate-800/60 z-50 md:z-20 scrollbar-hide ${isCollapsed ? 'w-72 md:w-24' : 'w-72'
          } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className={`pt-8 pb-6 flex items-center ${isCollapsed ? 'justify-center' : 'px-8 gap-3'}`}>
          <div className="bg-blue-600 rounded-2xl w-10 h-10 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
            {/* Infinity / OO Custom Logo to match the exact "enjooy" feeling in user's image */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 1 0 0-8c-2 0-4 1.33-6 4Z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-500">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white -mb-1">NexFlow</h1>
            </div>
          )}
        </div>

        {/* User Profile matching the image */}
        <div className={`mx-4 mb-6 rounded-2xl flex items-center ${isCollapsed ? 'justify-center mx-auto w-12 h-12' : 'px-3 py-3 gap-3'} transition-all duration-300`}>
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              {/* Using a sleek user icon since we don't have an image avatar */}
              <UserCircle2 className="w-6 h-6 text-indigo-500 dark:text-indigo-400" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#030213] rounded-full"></div>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.fullName || "Jhon Doe"}</span>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">{user?.username || "jhon@nexflow.design"}</span>
            </div>
          )}
        </div>

        {/* Navigation Main Block */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide py-2">

          {/* Menu Section */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="px-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider uppercase">Menu</p>
            )}
            <div className="space-y-1">
              <NavItem to="/" icon={LayoutDashboard} label="Dashboard" />
              <NavItem to="/store" icon={Store} label="My Product" />
              {isAdmin() && (
                <NavItem to="/team" icon={Users} label="Team Management" />
              )}
            </div>
          </div>

          {/* Categories Section (Only if filtering makes sense, mapped logically to "Order History/Sales" from img) */}
          {categories.filter(c => c !== "All").length > 0 && (
            <div className="mb-6">
              {!isCollapsed && (
                <p className="px-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider uppercase">Categories</p>
              )}
              <div className="space-y-1">
                {categories.filter(c => c !== "All").map(cat => {
                  const active = isActive(`/store/category/${cat}`);
                  return (
                    <Link
                      key={cat}
                      to={`/store/category/${cat}`}
                      onClick={handleLinkClick}
                      className={`flex items-center group px-3 py-2.5 mx-4 rounded-xl text-[13px] font-bold transition-all duration-300 ${active
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                        } ${isCollapsed ? 'justify-center mx-auto w-10 h-10 px-0 md:flex hidden' : 'gap-4'}
                      ${!active && !isCollapsed ? 'hover:translate-x-1' : ''}`}
                      title={isCollapsed ? cat : undefined}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <AlertTriangle className={`w-4 h-4 transition-opacity ${active ? 'text-white' : 'opacity-0'}`} />
                        {!active && (
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700 group-hover:bg-slate-500 dark:group-hover:bg-slate-400 transition-colors"></div>
                        )}
                      </div>
                      {!isCollapsed && <span className="capitalize whitespace-nowrap tracking-wide">{cat}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Health / Notifications like in image */}
          <div className="mb-6">
            {!isCollapsed && (
              <p className="px-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider uppercase">Notifications</p>
            )}
            <div className="space-y-1">
              <NavItem to="/store/status/low" icon={AlertTriangle} label="Low Stock Alerts" alert="low" />
              <NavItem to="/store/status/out" icon={XCircle} label="Deficit List" alert="high" />
            </div>
          </div>

        </div>

        {/* Settings / Footer Area */}
        <div className={`mt-auto pb-6 pt-4`}>
          {!isCollapsed && (
            <p className="px-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider uppercase">Settings</p>
          )}

          <div className="space-y-1">
            <NavItem to="#" icon={HelpCircle} label="Help" />
            <NavItem to="/settings" icon={Settings} label="Settings" />
            <NavItem to="#" icon={LogOut} label="Logout" />
          </div>

          {/* The Toggle Footer (Sun/Moon and Sidebar expand/collapse) */}
          <div className={`flex flex-col items-center mt-6 ${isCollapsed ? 'gap-6' : 'px-8 flex-row justify-between'}`}>
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 shadow-sm`}
              title={currentTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {currentTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`h-7 w-12 bg-slate-200 dark:bg-slate-800 rounded-full cursor-pointer hidden md:flex items-center p-1 transition-colors relative hover:bg-slate-300 dark:hover:bg-slate-700 ${isCollapsed ? 'rotate-90 origin-center translate-y-2' : ''}`}
            >
              <div
                className={`w-5 h-5 bg-white dark:bg-slate-400 rounded-full shadow-md transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-center ${isCollapsed ? 'translate-x-0' : 'translate-x-5'}`}
              >
                {isCollapsed
                  ? <ChevronRight className="w-3 h-3 text-slate-600 dark:text-slate-900" />
                  : <ChevronLeft className="w-3 h-3 text-slate-600 dark:text-slate-900" />
                }
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
