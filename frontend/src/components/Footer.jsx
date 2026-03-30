import React from 'react';
import { Package, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

          {/* Brand/Logo Section */}
          <div className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity">
            <div className="p-1.5 bg-blue-100 rounded-md">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900 tracking-tight leading-none">NexFlow</h2>
              <p className="text-[10px] text-blue-600 font-bold uppercase tracking-widest leading-none mt-0.5">Inventory Platform</p>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-sm text-gray-500 font-medium">
            &copy; {currentYear} NexFlow. All rights reserved.
          </div>

          {/* Credits or Links */}
          <div className="flex items-center gap-1.5 text-sm text-gray-400 font-medium">
            Built with <Heart className="w-4 h-4 text-red-400 fill-current" /> for Business
          </div>

        </div>
      </div>
    </footer>
  );
}
