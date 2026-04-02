import React from 'react';
import { Package, TrendingUp, AlertTriangle, Box } from 'lucide-react';
import { StatCard } from './ui/StatCard';

export function AnalyticsCards({ totalProducts, totalValue, lowStockProducts = [], outOfStockProducts = [] }) {
  return (
    /**
     * FIX: Added 'w-full' and 'items-stretch' to the grid.
     * This ensures that on smaller screens or during transitions, 
     * the cards maintain their intended width and don't "pill" (shrink).
     */
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <StatCard 
        title="Total Products" 
        value={totalProducts} 
        icon={Package} 
        color="blue"
        sub="Active in inventory"
      />
      
      <StatCard 
        title="Inventory Value" 
        value={`Rs. ${totalValue.toLocaleString('en-PK')}`} 
        icon={TrendingUp} 
        color="green"
        sub="Total valuation"
        trend="up"
        trendValue="12"
      />

      <StatCard 
        title="Low Stock" 
        value={lowStockProducts.length} 
        icon={AlertTriangle} 
        color="yellow"
        sub={lowStockProducts.length > 0 ? `${lowStockProducts.length} items to check` : "All healthy"}
      />

      <StatCard 
        title="Out of Stock" 
        value={outOfStockProducts.length} 
        icon={Box} 
        color="red"
        sub={outOfStockProducts.length > 0 ? "Needs immediate restock" : "All set"}
      />
    </div>
  );
}