import { Trash2, Edit, Download, Receipt, ShoppingBag, RotateCcw, Eye, FileSpreadsheet } from 'lucide-react';

export function SalesHistory({
  sales,
  showSalesHistory,
  setShowSalesHistory,
  handleDeleteSale,
  openEditSaleModal,
  onReturnSale,
  onViewSale,
  onExport
}) {
  const fmt = (n) => `Rs. ${(n || 0).toLocaleString('en-PK')}`;

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            All History
            <span className="text-[10px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 uppercase tracking-wider">
              {sales.length} Sales
            </span>
          </h3>
          <p className="text-xs text-slate-400 font-medium">Real-time transaction history</p>
        </div>
        <button
          onClick={onExport}
          disabled={sales.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-xl font-bold text-xs transition-all border border-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet className="w-4 h-4 ml-1" />
          Export Excel
        </button>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide">
        {sales.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
              <Receipt className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-400">No transactions recorded yet.</p>
          </div>
        ) : (
          sales.map((sale, index) => (
            <div key={sale._id} className="relative group animate-in fade-in slide-in-from-right-4 duration-300" style={{ animationDelay: `${index * 50}ms` }}>
              <div className="flex gap-4">
                {/* Timeline Line */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${sale.status === 'returned' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                    }`}>
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  {index !== sales.length - 1 && <div className="w-0.5 grow bg-slate-100 my-2"></div>}
                </div>

                {/* Content */}
                <div className="flex-1 pb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-black text-slate-900 leading-none">
                          Sale #{sale._id.slice(-4).toUpperCase()}
                        </p>
                        {sale.status === 'returned' && (
                          <span className="text-[8px] font-black bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100 uppercase">Returned</span>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {new Date(sale.saleDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' })} • {new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className={`text-sm font-black font-mono ${sale.status === 'returned' ? 'text-red-400 line-through' : 'text-blue-600'}`}>
                      {fmt(sale.totalAmount)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {sale.items.map((item, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-50 text-slate-600 border border-slate-100">
                        {item.name} <span className="text-slate-400 ml-1">×{item.quantity}</span>
                      </span>
                    ))}
                  </div>

                  {/* Quick Actions (Always Visible) */}
                  <div className="flex items-center gap-2 mt-4 transition-all">
                    <button
                      onClick={() => onViewSale(sale)}
                      className="p-2 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {sale.status !== 'returned' && (
                      <button
                        onClick={() => onReturnSale(sale._id)}
                        className="p-2 bg-slate-50 hover:bg-orange-50 text-slate-400 hover:text-orange-600 rounded-lg transition-all"
                        title="Return Sale"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => openEditSaleModal(sale)}
                      className="p-2 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {sale.invoiceUrl && (
                      <button
                        onClick={() => {
                          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                          window.open(`${apiUrl}${sale.invoiceUrl}`, '_blank');
                        }}
                        className="p-2 bg-slate-50 hover:bg-green-50 text-slate-400 hover:text-green-600 rounded-lg transition-all"
                        title="Receipt"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteSale(sale._id)}
                      className="p-2 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
