import React from 'react';
import { Package, TrendingUp, AlertTriangle, Box } from 'lucide-react';
import { StatCard } from './ui/StatCard';

export function AnalyticsCards({ totalProducts, totalValue, lowStockProducts = [], outOfStockProducts = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
