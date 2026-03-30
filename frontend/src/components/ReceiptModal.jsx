import React, { useRef } from 'react';
import { X, Printer, ShoppingBag, Download } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

export function ReceiptModal({ isOpen, onClose, sale }) {
  const printRef = useRef(null);
  const { settings } = useSettings();

  if (!isOpen || !sale) return null;

  const currency = settings.currency || 'Rs.';

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${new Date(sale.saleDate).toLocaleDateString()}</title>
          <style>
            @page { margin: 10mm; }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 10px; max-width: 380px; margin: auto; font-size: 13px; line-height: 1.4; color: #000; background: white; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 15px; }
            .shop-name { font-size: 24px; font-weight: bold; margin-bottom: 4px; text-transform: uppercase; }
            .subtitle { font-size: 11px; color: #000; margin-top: 2px; }
            .meta { margin: 12px 0; font-size: 12px; }
            .flex { display: flex; }
            .justify-between { justify-content: space-between; }
            .flex-col { flex-direction: column; }
            .items-center { align-items: center; }
            .text-left { text-align: left; }
            .text-center { text-align: center; }
            .text-right { text-align: right; }
            .font-bold { font-weight: bold; }
            .font-black { font-weight: 900; }
            .uppercase { text-transform: uppercase; }
            
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { border-bottom: 1px dashed #000; padding: 8px 2px; font-size: 11px; font-weight: bold; }
            td { padding: 8px 2px; font-size: 12px; vertical-align: top; border-bottom: 1px dotted #eee; }
            
            .total-row { font-weight: bold; font-size: 20px; border-top: 2px dashed #000; padding-top: 10px; margin-top: 10px; display: flex; justify-content: space-between; width: 100%; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            
            .footer { text-align: center; margin-top: 25px; padding-top: 15px; border-top: 1px dashed #000; display: flex; flex-direction: column; align-items: center; }
            .footer img { width: 90px; height: 90px; margin-bottom: 12px; border: 1px solid #000; padding: 2px; }
            .footer p { font-size: 11px; }

            @media print { 
              body { padding: 0; width: 100%; } 
              .no-print { display: none; } 
              img { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            }
          </style>
        </head>
        <body>
          ${content}
          <script>window.onload = () => { window.print(); window.close(); }<\/script>
        </body>
      </html>
    `);
    win.document.close();
  };

  const handleDownload = () => {
    if (!sale.invoiceUrl) return;
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
    window.open(`${apiUrl}${sale.invoiceUrl}`, '_blank');
  };

  const saleDate = new Date(sale.saleDate);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200 sticky top-0 bg-white z-10 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-4 h-4 text-blue-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Sale Receipt</h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Preview */}
        <div className="p-5">
          <div ref={printRef} className="bg-white border border-gray-100 rounded-xl p-6 font-mono text-sm shadow-inner text-slate-950">
            {/* Header */}
            <div className="header text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
              <div className="shop-name text-2xl font-black tracking-wide text-black">{settings.shopName}</div>
              <div className="subtitle text-gray-500 text-xs">{settings.address || 'Inventory Management System'}</div>
              {settings.phone && <div className="subtitle text-gray-600 text-[11px] mt-1 font-bold">Contact: {settings.phone}</div>}
            </div>

            {/* Meta */}
            <div className="meta mb-2 space-y-0.5 text-slate-900">
              <div className="flex justify-between items-center h-5">
                <span className="text-gray-500 text-[11px] uppercase tracking-wider">Date:</span>
                <span className="font-bold text-[12px]">{saleDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between items-center h-5">
                <span className="text-gray-500 text-[11px] uppercase tracking-wider">Time:</span>
                <span className="font-bold text-[12px]">{saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between items-center h-5">
                <span className="text-gray-500 text-[11px] uppercase tracking-wider">Cashier:</span>
                <span className="font-bold text-[12px]">{sale.cashierName || "System Admin"}</span>
              </div>
              <div className="flex justify-between items-center h-5">
                <span className="text-gray-500 text-[11px] uppercase tracking-wider">Receipt #:</span>
                <span className="font-bold text-[12px]">{sale._id?.slice(-8).toUpperCase() || 'N/A'}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>

            {/* Items Table */}
            <table className="w-full text-slate-950">
              <thead>
                <tr className="border-b border-dashed border-gray-300">
                  <th className="text-left py-1.5 text-[10px] uppercase text-gray-500 font-bold w-[45%]">Item</th>
                  <th className="text-center py-1.5 text-[10px] uppercase text-gray-500 font-bold w-[15%]">Qty</th>
                  <th className="text-right py-1.5 text-[10px] uppercase text-gray-500 font-bold w-[20%]">Price</th>
                  <th className="text-right py-1.5 text-[10px] uppercase text-gray-500 font-bold w-[20%]">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-dotted border-gray-200">
                    <td className="py-2 text-[11px] font-bold text-slate-900 max-w-[120px] truncate">{item.name}</td>
                    <td className="py-2 text-center text-[11px] font-bold text-slate-900">{item.quantity}</td>
                    <td className="py-2 text-right text-[11px] text-slate-700">{currency} {item.price?.toLocaleString('en-PK')}</td>
                    <td className="py-2 text-right text-[11px] font-black text-black">{currency} {item.subtotal?.toLocaleString('en-PK')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Divider */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>

            {/* Totals */}
            <div className="space-y-1 text-black">
              <div className="flex justify-between total-row text-lg font-black">
                <span>TOTAL</span>
                <span>{currency} {sale.totalAmount?.toLocaleString('en-PK')}</span>
              </div>
            </div>

            {/* Footer */}
            <div className="footer text-center mt-4 pt-3 border-t border-dashed border-gray-300 flex flex-col items-center">
              <div className="mb-3 px-1 py-1 border border-gray-200 rounded-lg inline-block bg-white">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${sale._id}`}
                  alt="QR Code"
                  className="w-20 h-20"
                />
              </div>
              <p className="text-sm text-gray-700 font-bold">Thank you for your business!</p>
              <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-black">Powered by {settings.shopName}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-md"
            >
              <Printer className="w-4 h-4" />
              Print
            </button>
            {sale.invoiceUrl && (
              <button
                onClick={handleDownload}
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all active:scale-95 shadow-md"
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="px-5 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
