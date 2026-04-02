import { useState } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { AnalyticsCards } from '../components/AnalyticsCards';
import { InventoryTable } from '../components/InventoryTable';
import { SalesHistory } from '../components/SalesHistory';
import { LowStockBanner } from '../components/LowStockBanner';
import { TeamManagement } from '../components/TeamManagement';
import { useUser } from '../contexts/UserContext';
import { Users, LayoutDashboard, Plus } from 'lucide-react';

export function AdminDashboard({ onAddProduct, onEditProduct, onDeleteProduct, onViewProduct, onExport, onEditSale, onDeleteSale, onReturnSale, onViewSale }) {
  const [activeTab, setActiveTab] = useState('inventory');
  const { user } = useUser();

  const {
    products, loading,
    sales, getStockStatus
  } = useProducts();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Calculate top level sums directly from products state for AnalyticsCards
  const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-700">

      {/* Main Overview Section - Upgraded with @container and Premium Tokens */}
      <div className="@container mb-10 flex flex-col @md:flex-row @md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {/* The "Branding" accent bar */}
            <div className="w-2 h-10 bg-primary rounded-full shadow-[0_0_15px_rgba(37,99,235,0.4)]"></div>
            <h2 className="text-3xl @lg:text-4xl font-black text-dark tracking-tighter leading-none">
              Business Overview
            </h2>
          </div>
          <p className="text-muted font-medium pl-5 max-w-2xl leading-relaxed">
            Real-time summary of your inventory health, sales performance, and recent activity levels.
          </p>
        </div>

        {user?.role === 'admin' && (
          <button
            onClick={onAddProduct}
            className="group flex items-center gap-2 px-6 py-3 bg-primary text-white hover:bg-primary-hover rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-premium active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Add Product
          </button>
        )}
      </div>

      {/* Tab Switcher - Upgraded with Glassmorphism feel */}
      {user?.role === 'admin' && (
        <div className="flex items-center gap-1 bg-slate-200/50 backdrop-blur-md p-1.5 rounded-2xl w-fit mb-8 border border-border animate-in slide-in-from-left-4">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'inventory' 
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
              : 'text-muted hover:text-dark'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Inventory & Sales
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === 'team' 
              ? 'bg-white text-primary shadow-sm ring-1 ring-black/5' 
              : 'text-muted hover:text-dark'
            }`}
          >
            <Users className="w-4 h-4" />
            Team Management
          </button>
        </div>
      )}

      {/* Logic Branching (Kept exactly as provided) */}
      {activeTab === 'team' && user?.role === 'admin' ? (
        <TeamManagement />
      ) : (
        <>
          <AnalyticsCards
            totalProducts={products.length}
            totalValue={totalValue}
            lowStockProducts={products.filter(p => p.stock > 0 && p.stock <= p.minStock)}
            outOfStockProducts={products.filter(p => p.stock === 0)}
          />

          {/* Low Stock Banner - With the NEW Pulse Animation */}
          <div className="mt-8 animate-pulse-soft">
            <LowStockBanner
              products={products}
              getStockStatus={getStockStatus}
              totalValue={totalValue}
            />
          </div>

          {/* Vertical Stack: Table & Activity - Upgraded spacing and card containers */}
          <div className="flex flex-col gap-12 mt-10">

            {/* Inventory Table Section */}
            <section className="w-full space-y-4">
              <div className="flex items-center gap-2 px-2">
                 <div className="w-1.5 h-6 bg-primary/30 rounded-full"></div>
                 <h3 className="text-xl font-black text-dark uppercase tracking-widest">Global Inventory</h3>
              </div>
              <div className="bg-card rounded-premium shadow-premium border border-border overflow-hidden">
                <InventoryTable
                  onEdit={onEditProduct}
                  onDelete={onDeleteProduct}
                  onView={onViewProduct}
                  onExport={onExport}
                />
              </div>
            </section>

            {/* Recent Activity Section */}
            <section className="w-full space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-dark uppercase tracking-widest">Recent Shop Activity</h3>
                  <p className="text-[10px] text-muted font-bold tracking-widest">SYNCED WITH CLOUD</p>
                </div>
              </div>
              <div className="bg-card rounded-premium shadow-premium border border-border overflow-hidden">
                <SalesHistory
                  sales={sales}
                  handleDeleteSale={onDeleteSale}
                  openEditSaleModal={onEditSale}
                  onReturnSale={onReturnSale}
                  onViewSale={onViewSale}
                  onExport={onExport}
                />
              </div>
            </section>
          </div>
        </>
      )}

    </div>
  );
}
