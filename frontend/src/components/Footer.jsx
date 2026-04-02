import React from 'react';
import { Package, Heart, Zap } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-slate-100 shrink-0">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Brand/Logo Section - Miniatured */}
          <div className="flex items-center gap-2 group cursor-default">
            <div className="p-1 bg-slate-900 rounded-lg group-hover:bg-blue-600 transition-colors duration-500">
              <Package className="w-3 h-3 text-white" />
            </div>
            <div>
              <h2 className="text-[10px] font-black text-slate-900 tracking-tighter leading-none">NEXFLOW</h2>
              <div className="flex items-center gap-1 mt-0.5">
                <Zap className="w-2 h-2 text-blue-600 fill-current" />
                <p className="text-[7px] text-slate-400 font-black uppercase tracking-[0.2em] leading-none">Enterprise OS</p>
              </div>
            </div>
          </div>

          {/* Copyright Section - Minimalist */}
          <div className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
            &copy; {currentYear} <span className="text-slate-900">NexusOS</span>. All rights reserved.
          </div>

          {/* Credits Section - Thin Badge */}
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50/50 rounded-full border border-slate-100">
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-tight">Built for Performance</span>
            <div className="w-1 h-1 rounded-full bg-slate-300"></div>
            <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500 animate-pulse" />
          </div>

        </div>
      </div>
    </footer>
  );
}