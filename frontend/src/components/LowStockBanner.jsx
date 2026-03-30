import { AlertTriangle, MessageCircle } from 'lucide-react';
import { Badge } from './ui/Badge';

export function LowStockBanner({ products }) {
  const lowStockProducts = products.filter(p => p.stock <= p.minStock);

  if (lowStockProducts.length === 0) return null;

  const outOfStock = lowStockProducts.filter(p => p.stock === 0);
  const lowStock = lowStockProducts.filter(p => p.stock > 0);

  // Expiry Alerts
  const today = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);

  const expiringSoon = products.filter(p => {
    if (!p.expiryDate) return false;
    const expDate = new Date(p.expiryDate);
    return expDate <= thirtyDaysFromNow && expDate >= today;
  });

  const expired = products.filter(p => {
    if (!p.expiryDate) return false;
    return new Date(p.expiryDate) < today;
  });

  const handleBulkAlert = () => {
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER;
    let message = `*NexFlow Inventory Alert*\n\n`;
    message += `*Low Stock Warning*\n`;
    lowStock.forEach(p => {
      message += `• ${p.name}: Only ${p.stock} left\n`;
    });
    message += `\n*Out of Stock*\n`;
    outOfStock.forEach(p => {
      message += `• ${p.name}: Out of Stock\n`;
    });
    message += `\nAction: Restock these items immediately\n\nNexFlow Inventory Management System`;
    const url = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="bg-white border border-amber-100 rounded-2xl p-3 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm mb-6 animate-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-4 w-full h-full">
        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full border border-amber-100 shrink-0">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-black uppercase tracking-widest">Stock Alert</span>
        </div>

        <div className="flex flex-wrap gap-2 overflow-x-auto scrollbar-hide py-1">
          {expired.map(p => (
            <Badge key={p._id} variant="danger" className="animate-pulse">
              EXPIRED: {p.name}
            </Badge>
          ))}
          {expiringSoon.map(p => (
            <Badge key={p._id} variant="warning">
              Expiring: {p.name}
            </Badge>
          ))}
          {outOfStock.map(p => (
            <Badge key={p._id} variant="danger">
              Out of Stock: {p.name}
            </Badge>
          ))}
          {lowStock.map(p => (
            <Badge key={p._id} variant="warning">
              Low Stock: {p.name} ({p.stock} left)
            </Badge>
          ))}
        </div>
      </div>

      <button
        onClick={handleBulkAlert}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-sm active:scale-95 whitespace-nowrap"
      >
        <MessageCircle className="w-3.5 h-3.5" />
        WhatsApp Admin
      </button>
    </div>
  );
}
