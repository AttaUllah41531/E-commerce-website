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
  UserCircle2,
  // Category Icons
  ShoppingBasket,
  Shirt,
  Home,
  Watch,
  Smartphone,
  Layers,
  Footprints,
  Package
} from 'lucide-react';
import { useTheme } from 'next-themes';

export function Sidebar({ isMobileOpen, onCloseMobile, isCollapsed }) {
  const { categories } = useProducts();
  const { user, isAdmin, logout } = useUser();
  const location = useLocation();
  const { theme, setTheme } = useTheme();

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

  // Helper to get category-specific icon
  const getCategoryIcon = (category) => {
    const cat = category.toLowerCase();
    if (cat.includes('grocery')) return ShoppingBasket;
    if (cat.includes('apparel') || cat.includes('cloth')) return Shirt;
    if (cat.includes('home') || cat.includes('decor')) return Home;
    if (cat.includes('accessories')) return Watch;
    if (cat.includes('electronic') || cat.includes('tech')) return Smartphone;
    if (cat.includes('footwear') || cat.includes('shoe')) return Footprints;
    if (cat.includes('package') || cat.includes('acc')) return Package;
    return Layers;
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
        className={`flex items-center group px-3 py-3 mx-4 rounded-2xl text-[13px] font-bold transition-all duration-500 ease-out ${active
          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
          : "text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 hover:bg-blue-600/10 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] border border-transparent hover:border-blue-500/20"
          } ${isCollapsed ? 'justify-center mx-auto w-12 h-12 px-0 md:flex hidden' : 'gap-4'}
        ${!active && !isCollapsed ? 'hover:translate-x-1' : ''}`}
        title={isCollapsed ? label : undefined}
      >
        <div className="relative flex items-center justify-center">
          <Icon className={`w-5 h-5 transition-all duration-500 ${active ? "text-white" : "group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"}`} />
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
        className={`fixed md:relative top-20 md:top-0 h-[calc(100vh-80px)] md:h-full flex flex-col bg-white dark:bg-[#030213] text-slate-900 dark:text-white transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border-r border-slate-200/60 dark:border-slate-800/60 z-30 md:z-20 overflow-hidden ${isCollapsed ? 'w-0' : 'w-56'
          } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Removed Brand Header because it moved to Navbar */}

        {/* User Profile moved down and renamed */}
        <div className={`mx-4 mb-6 mt-4 rounded-2xl flex items-center ${isCollapsed ? 'justify-center mx-auto w-12 h-12' : 'px-3 py-3 gap-3'} transition-all duration-300 border border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20`}>
          <div className="relative">
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#030213] rounded-full"></div>
            <UserCircle2 className="w-8 h-8 text-slate-400" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col flex-1 overflow-hidden min-w-0">
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{user?.fullName || "Jhon Doe"}</span>
              <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 truncate">Super Admin</span>
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
                      className={`flex items-center group px-3 py-2.5 mx-4 rounded-xl text-[13px] font-bold transition-all duration-500 ease-out ${active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-600/10 hover:shadow-[0_0_20px_-5px_rgba(37,99,235,0.4)] border border-transparent hover:border-blue-500/20"
                        } ${isCollapsed ? 'justify-center mx-auto w-10 h-10 px-0 md:flex hidden' : 'gap-4'}
                      ${!active && !isCollapsed ? 'hover:translate-x-1' : ''}`}
                      title={isCollapsed ? cat : undefined}
                    >
                      <div className="relative flex items-center justify-center w-5 h-5">
                        {(() => {
                          const CategoryIcon = getCategoryIcon(cat);
                          return <CategoryIcon className={`w-4 h-4 transition-all duration-300 ${active ? "text-white" : "group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]"}`} />;
                        })()}
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

          {/* Settings / Footer Area - now part of the scroll flow */}
          <div className="pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/50 mt-4">
            {!isCollapsed && (
              <p className="px-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-4 tracking-wider uppercase">Settings</p>
            )}

            <div className="space-y-1">
              <NavItem to="#" icon={HelpCircle} label="Help" />
              <NavItem to="/settings" icon={Settings} label="Settings" />
              <NavItem to="#" icon={LogOut} label="Logout" onClick={logout} />
            </div>

            {/* The Theme Toggle  */}
            <div className={`flex flex-col items-center mt-6 ${isCollapsed ? 'gap-6' : 'px-8 flex-row justify-between'}`}>
              <button
                onClick={toggleTheme}
                type="button"
                className={`p-2.5 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 shadow-sm`}
                title={currentTheme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {currentTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
