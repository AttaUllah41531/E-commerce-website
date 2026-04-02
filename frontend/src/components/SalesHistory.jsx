import { Trash2, Edit, Download, Receipt, ShoppingBag, RotateCcw, Eye, FileSpreadsheet, Calendar } from 'lucide-react';

export function SalesHistory({
  sales,
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-1">
        {sales.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-100 text-center space-y-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-200 shadow-sm">
              <Receipt className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-black text-slate-900 uppercase tracking-tight">No Transactions</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">History is currently empty</p>
            </div>
          </div>
        ) : (
          sales.map((sale, index) => (
            <div
              key={sale._id}
              className="group bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-in fade-in zoom-in-95"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Card Header: Metadata */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale No.</span>
                    <span className="text-xs font-black text-slate-900">#{sale._id.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    <p className="text-[9px] font-bold uppercase tracking-widest leading-none">
                      {new Date(sale.saleDate).toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: '2-digit' })} • {new Date(sale.saleDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {sale.status === 'returned' ? (
                  <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[9px] font-black rounded-full border border-rose-100 uppercase tracking-widest shadow-sm">Returned</span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-full border border-emerald-100 uppercase tracking-widest shadow-sm">Completed</span>
                )}
              </div>

              {/* Card Body: Valuation & Items */}
              <div className="space-y-5">
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Transaction</p>
                  <p className={`text-2xl font-black font-mono tracking-tighter ${sale.status === 'returned' ? 'text-rose-400 line-through' : 'text-blue-600'}`}>
                    {fmt(sale.totalAmount)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Purchase Details</p>
                  <div className="flex flex-wrap gap-2">
                    {sale.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-100 rounded-xl shadow-sm transition-colors group-hover:border-blue-100">
                        <span className="text-[10px] font-black text-slate-700">{item.name}</span>
                        <div className="w-[1px] h-3 bg-slate-100" />
                        <span className="text-[10px] font-black text-blue-600">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer: Detailed Actions */}
              <div className="flex items-center justify-between pt-5 mt-5 border-t border-slate-50">
                <div className="flex items-center gap-1.5">
                  <button onClick={() => onViewSale(sale)} className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-90 shadow-sm" title="View"><Eye className="w-4 h-4" /></button>
                  {sale.status !== 'returned' && (
                    <button onClick={() => onReturnSale(sale._id)} className="p-2.5 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-xl transition-all active:scale-90 shadow-sm" title="Return"><RotateCcw className="w-4 h-4" /></button>
                  )}
                  <button onClick={() => openEditSaleModal(sale)} className="p-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm" title="Edit"><Edit className="w-4 h-4" /></button>
                </div>
                <div className="flex items-center gap-1.5">
                  {sale.invoiceUrl && (
                    <button
                      onClick={() => {
                        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
                        window.open(`${apiUrl}${sale.invoiceUrl}`, '_blank');
                      }}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm border border-emerald-100/50"
                      title="Receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                  <button onClick={() => handleDeleteSale(sale._id)} className="p-2.5 bg-slate-50 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl transition-all active:scale-90 shadow-sm" title="Delete"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
