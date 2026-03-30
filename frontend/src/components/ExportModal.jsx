import React, { useState } from 'react';
import { X, Download, MessageCircle, FileSpreadsheet, Package, AlertTriangle } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ExportModal({ isOpen, onClose, products = [], categories = [] }) {
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  if (!isOpen) return null;

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < minStock) return "Low Stock";
    return "In Stock";
  };

  const getFilteredData = (preset) => {
    let data = [...(products || [])];

    if (preset === 'low-stock') {
      data = data.filter(p => p.stock > 0 && p.stock <= p.minStock);
    } else if (preset === 'out-of-stock') {
      data = data.filter(p => p.stock === 0);
    } else if (preset === 'custom') {
      if (filterCategory !== "All") {
        data = data.filter((p) => p.category === filterCategory);
      }
      if (filterStatus !== "All") {
        data = data.filter((p) => {
          const status = getStockStatus(p.stock ?? 0, p.minStock ?? 0);
          return status === filterStatus;
        });
      }
    }

    return data;
  };

  const exportToExcel = (preset, filenameStr) => {
    const rawData = getFilteredData(preset);
    
    // Clean formatted report
    const cleanData = rawData.map(p => ({
      "Product Name": p.name || "N/A",
      "Category": p.category || "N/A",
      "Stock": p.stock ?? 0,
      "Min Stock": p.minStock ?? 0,
      "Price (Rs.)": p.price || 0,
      "Cost Price (Rs.)": p.costPrice || 0,
      "Status": getStockStatus(p.stock ?? 0, p.minStock ?? 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    
    // Add column widths
    worksheet['!cols'] = [
      { wch: 30 }, // Name
      { wch: 20 }, // Category
      { wch: 10 }, // Stock
      { wch: 10 }, // Min Stock
      { wch: 15 }, // Price
      { wch: 15 }, // Cost
      { wch: 15 }  // Status
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory Report");
    
    const dateStr = new Date().toISOString().split('T')[0];
    XLSX.writeFile(workbook, `NexFlow_${filenameStr}_${dateStr}.xlsx`);
    onClose();
  };

  const handleWhatsAppExport = () => {
    const outOfStockItems = (products || []).filter(p => p.stock === 0);
    const lowStockItems = (products || []).filter(p => p.stock > 0 && p.stock <= p.minStock);
    const totalValue = (products || []).reduce((sum, p) => sum + (p.stock * p.price), 0);

    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "+923013241531";
    const dateStr = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
    
    let message = `*NexFlow Inventory Summary*\n`;
    message += `Date: ${dateStr}\n\n`;
    
    message += `*Overview*\n`;
    message += `- Total Products: ${(products || []).length}\n`;
    message += `- Inventory Value: Rs. ${totalValue.toLocaleString('en-PK')}\n\n`;
    
    if (outOfStockItems.length > 0) {
      message += `*Out of Stock (${outOfStockItems.length})*\n`;
      outOfStockItems.forEach(p => {
        message += `- ${p.name}\n`;
      });
      message += `\n`;
    }
    
    if (lowStockItems.length > 0) {
      message += `*Low Stock (${lowStockItems.length})*\n`;
      lowStockItems.forEach(p => {
        message += `- ${p.name} (${p.stock} left)\n`;
      });
      message += `\n`;
    }
    
    if (outOfStockItems.length > 0 || lowStockItems.length > 0) {
      message += `Action: Restock low and out-of-stock items immediately\n\n`;
    }
    
    message += `NexFlow Dashboard`;
    
    const url = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Reports</h2>
              <p className="text-xs text-gray-500">Download inventory data or send summaries</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-6">
          {/* Quick Export Cards */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">Quick Export (Excel)</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button 
                onClick={() => exportToExcel('all', 'All_Products')}
                className="flex flex-col items-center gap-2 p-3 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all active:scale-95 group"
              >
                <FileSpreadsheet className="w-6 h-6 text-gray-400 group-hover:text-blue-500" />
                <span className="text-xs font-bold text-gray-700 group-hover:text-blue-700">All Products</span>
              </button>
              <button 
                onClick={() => exportToExcel('low-stock', 'Low_Stock')}
                className="flex flex-col items-center gap-2 p-3 border border-amber-200 bg-amber-50 rounded-xl hover:border-amber-300 hover:bg-amber-100 transition-all active:scale-95 group"
              >
                <AlertTriangle className="w-6 h-6 text-amber-500" />
                <span className="text-xs font-bold text-amber-900">Low Stock</span>
              </button>
              <button 
                onClick={() => exportToExcel('out-of-stock', 'Out_Of_Stock')}
                className="flex flex-col items-center gap-2 p-3 border border-red-200 bg-red-50 rounded-xl hover:border-red-300 hover:bg-red-100 transition-all active:scale-95 group"
              >
                <Package className="w-6 h-6 text-red-500" />
                <span className="text-xs font-bold text-red-900">Out of Stock</span>
              </button>
            </div>
          </div>

          {/* Custom Export */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-3">Custom Filter Export</h3>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="All">All Categories</option>
                    {(categories || []).filter(c => c !== "All").map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-gray-500 mb-1">Stock Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg text-sm px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={() => exportToExcel('custom', 'Custom_Report')}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-black transition-colors"
              >
                <Download className="w-4 h-4" />
                Export Filtered Data
              </button>
            </div>
          </div>

          <div className="w-full h-px bg-gray-200"></div>

          {/* WhatsApp Export */}
          <div>
            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-wider mb-2">Share Summary</h3>
            <button 
              onClick={handleWhatsAppExport}
              className="w-full flex items-center justify-between p-4 border border-green-200 bg-green-50 hover:bg-green-100 rounded-xl transition-all active:scale-95 group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-green-900">Send WhatsApp Summary</p>
                  <p className="text-xs text-green-700 font-medium">Sends total items, value, and alert counts</p>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
