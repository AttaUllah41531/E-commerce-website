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
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Main Overview Section */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-2 h-10 bg-slate-900 rounded-full"></div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter leading-none">
              Business Overview
            </h2>
          </div>
          <p className="text-slate-500 font-medium pl-5 max-w-2xl">
            Real-time summary of your inventory health, sales performance, and recent activity levels.
          </p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={onAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-sm shadow-blue-600/20 active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        )}
      </div>

      {user?.role === 'admin' && (
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl w-fit mb-8 animate-in fade-in zoom-in-95">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'inventory' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            Inventory & Sales
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'team' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Users className="w-4 h-4" />
            Team Management
          </button>
        </div>
      )}

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

          <div className="mt-8">
            <LowStockBanner
              products={products}
              getStockStatus={getStockStatus}
              totalValue={totalValue}
            />
          </div>

          {/* Vertical Stack: Table & Activity */}
          <div className="flex flex-col gap-10 mt-10">

            {/* Inventory Table */}
            <div className="w-full">
              <InventoryTable
                onEdit={onEditProduct}
                onDelete={onDeleteProduct}
                onView={onViewProduct}
                onExport={onExport}
              />
            </div>

            {/* Recent Activity Section */}
            <div className="w-full">
              <div className="mb-6 space-y-1">
                <h3 className="text-2xl font-black text-slate-800 uppercase tracking-widest px-2">Recent Shop Activity</h3>
              </div>
              <SalesHistory
                sales={sales}
                handleDeleteSale={onDeleteSale}
                openEditSaleModal={onEditSale}
                onReturnSale={onReturnSale}
                onViewSale={onViewSale}
                onExport={onExport}
              />
            </div>
          </div>
        </>
      )}

    </div>
  );
}
