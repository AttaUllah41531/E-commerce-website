import React, { useRef } from 'react';
import { X, Printer, ShoppingBag, Download } from 'lucide-react';

export function ReceiptModal({ isOpen, onClose, sale }) {
  const printRef = useRef(null);

  if (!isOpen || !sale) return null;

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - ${new Date(sale.saleDate).toLocaleDateString()}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Courier New', monospace; padding: 20px; max-width: 400px; margin: auto; font-size: 14px; line-height: 1.4; color: #000; }
            .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 12px; margin-bottom: 15px; }
            .shop-name { font-size: 26px; font-weight: bold; margin-bottom: 4px; }
            .subtitle { font-size: 13px; color: #333; }
            .meta { margin: 12px 0; font-size: 13px; }
            table { width: 100%; border-collapse: collapse; margin: 15px 0; }
            th { text-align: left; border-bottom: 1px dashed #000; padding: 6px 2px; font-size: 12px; text-transform: uppercase; }
            td { padding: 6px 2px; font-size: 13px; vertical-align: top; }
            .text-right { text-align: right; }
            .divider { border-top: 1px dashed #000; margin: 12px 0; }
            .total-row { font-weight: bold; font-size: 20px; border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; }
            .profit-row { font-size: 13px; color: #555; font-style: italic; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #333; border-top: 1px dashed #000; padding-top: 10px; }
            @media print { body { padding: 0; width: 100%; max-width: 100%; } .no-print { display: none; } }
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
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
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
          <div ref={printRef} className="bg-white border border-gray-100 rounded-xl p-6 font-mono text-sm shadow-inner">
            {/* Header */}
            <div className="header text-center border-b-2 border-dashed border-gray-400 pb-3 mb-3">
              <div className="shop-name text-2xl font-black tracking-wide">NexFlow Store</div>
              <div className="subtitle text-gray-500 text-xs">Inventory Management System</div>
              <div className="subtitle text-gray-400 text-[11px] mt-1">WhatsApp: +923013241531</div>
            </div>

            {/* Meta */}
            <div className="meta mb-2 space-y-0.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Date:</span>
                <span className="font-bold">{saleDate.toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time:</span>
                <span className="font-bold">{saleDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Receipt #:</span>
                <span className="font-bold">{sale._id?.slice(-8).toUpperCase() || 'N/A'}</span>
              </div>
            </div>

            {/* Divider */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>

            {/* Items Table */}
            <table className="w-full">
              <thead>
                <tr className="border-b border-dashed border-gray-300">
                  <th className="text-left py-1.5 text-[10px] uppercase text-gray-500 font-bold">Item</th>
                  <th className="text-center py-1.5 text-[10px] uppercase text-gray-500 font-bold px-2">Qty</th>
                  <th className="text-right py-1.5 text-[10px] uppercase text-gray-500 font-bold">Price</th>
                  <th className="text-right py-1.5 text-[10px] uppercase text-gray-500 font-bold">Total</th>
                </tr>
              </thead>
              <tbody>
                {sale.items.map((item, idx) => (
                  <tr key={idx} className="border-b border-dotted border-gray-200">
                    <td className="py-2 text-[11px] font-medium max-w-[120px] truncate">{item.name}</td>
                    <td className="py-2 text-center text-[11px] font-bold">{item.quantity}</td>
                    <td className="py-2 text-right text-[11px]">{item.price?.toLocaleString('en-PK')}</td>
                    <td className="py-2 text-right text-[11px] font-black text-gray-900">{item.subtotal?.toLocaleString('en-PK')}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Divider */}
            <div className="divider border-t border-dashed border-gray-400 my-2"></div>

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between total-row text-lg">
                <span>TOTAL</span>
                <span>Rs. {sale.totalAmount?.toLocaleString('en-PK')}</span>
              </div>
              {sale.totalProfit > 0 && (
                <div className="flex justify-between profit-row text-[10px] text-green-700">
                  <span>Profit</span>
                  <span>Rs. {sale.totalProfit?.toLocaleString('en-PK')}</span>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="footer text-center mt-4 pt-3 border-t border-dashed border-gray-300">
              <p className="text-sm text-gray-700 font-bold">Thank you for your business!</p>
              <p className="text-[10px] text-gray-400 mt-1">Powered by NexFlow</p>
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
