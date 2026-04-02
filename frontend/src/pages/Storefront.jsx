import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../contexts/ProductContext';
import { FilterBar } from '../components/FilterBar';
import { ProductCard } from '../components/ProductCard';
import { Plus } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export function Storefront({ onAdd }) {
  const { category, status } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const {
    filteredProducts,
    setCategoryFilter,
    setStatusFilter,
    loading
  } = useProducts();

  // Sync URL params with global context filters automatically
  useEffect(() => {
    if (category) {
      setCategoryFilter(category);
      setStatusFilter("All"); // Reset status if category clicked
    } else if (status) {
      setCategoryFilter("All");
      setStatusFilter(status === "low" ? "Low Stock" : status === "out" ? "Out of Stock" : "All");
    } else {
      // Base /store page
      setCategoryFilter("All");
      setStatusFilter("All");
    }

    // Cleanup if leaving store
    return () => {
      setCategoryFilter("All");
      setStatusFilter("All");
    };
  }, [category, status, setCategoryFilter, setStatusFilter]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 py-4">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-blue-600 rounded-full"></div>
            <h2 className="text-xl font-black text-slate-900 tracking-tighter capitalize leading-none">
              {category ? `${category}` : status ? `${status}` : "Master Catalog"}
            </h2>
          </div>
          <p className="text-[11px] text-slate-500 font-medium pl-4 uppercase tracking-wider">Manage stock and add items to sales cart.</p>
        </div>
        {user?.role === 'admin' && (
          <button
            onClick={() => onAdd(category || null)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 w-full md:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            {category ? `New ${category} Product` : 'New Product'}
          </button>
        )}
      </div>

      <div className="bg-white p-1 rounded-xl border border-slate-100 shadow-sm mb-3">
        <FilterBar />
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm mt-6">
          <p className="text-gray-500 font-medium">No products match your criteria.</p>
          <button
            onClick={() => navigate('/store')}
            className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 mt-2">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      )}
    </div>
  );
}
