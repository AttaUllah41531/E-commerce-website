import React from 'react';
import { X, Download, MessageCircle, FileSpreadsheet, TrendingUp } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function ExportModal({ isOpen, onClose, products = [], sales = [], categories = [] }) {

  if (!isOpen) return null;

  // --- ORIGINAL LOGIC UNTOUCHED ---
  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < minStock) return "Low Stock";
    return "In Stock";
  };

  const exportInventoryToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const allData = [...(products || [])];
    const lowStock = allData.filter(p => p.stock > 0 && p.stock <= p.minStock);
    const outOfStock = allData.filter(p => p.stock === 0);
    const borderStyle = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };

    const createInventorySheet = (name, data) => {
      const sheet = workbook.addWorksheet(name);
      sheet.mergeCells("A1:F1");
      const titleCell = sheet.getCell("A1");
      titleCell.value = "NexFlow Inventory Report";
      titleCell.font = { size: 16, bold: true };
      titleCell.alignment = { horizontal: "center", vertical: "middle" };
      sheet.mergeCells("A2:F2");
      const dateCell = sheet.getCell("A2");
      dateCell.value = `Date: ${new Date().toLocaleDateString("en-PK")}`;
      dateCell.alignment = { horizontal: "center" };
      for (let i = 1; i <= 6; i++) {
        sheet.getCell(1, i).border = borderStyle;
        sheet.getCell(2, i).border = borderStyle;
      }
      const headers = ["Product Name", "Category", "Stock", "Min Stock", "Price (Rs.)", "Status"];
      const headerRow = sheet.addRow(headers);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.border = borderStyle;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE8F4FD' } };
      });
      data.forEach(p => {
        const row = sheet.addRow([
          p.name || "N/A",
          p.category || "N/A",
          p.stock ?? 0,
          p.minStock ?? 0,
          p.price || 0,
          getStockStatus(p.stock ?? 0, p.minStock ?? 0)
        ]);
        row.eachCell(cell => { cell.border = borderStyle; });
      });
      sheet.columns = [{ width: 25 }, { width: 15 }, { width: 10 }, { width: 12 }, { width: 15 }, { width: 15 }];
    };

    createInventorySheet("All Products", allData);
    createInventorySheet(`Low Stock (${lowStock.length})`, lowStock);
    createInventorySheet(`Out of Stock (${outOfStock.length})`, outOfStock);

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `NexFlow_Inventory_${new Date().toISOString().split('T')[0]}.xlsx`);
    onClose();
  };

  const exportSalesToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const allSales = [...(sales || [])].filter(s => s.status !== 'returned');
    const returnedSales = [...(sales || [])].filter(s => s.status === 'returned');
    const borderStyle = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };

    const addHeaderRow = (sheet, headers, fgColor = 'FFE8F4FD') => {
      const headerRow = sheet.addRow(headers);
      headerRow.eachCell(cell => {
        cell.font = { bold: true };
        cell.border = borderStyle;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: fgColor } };
      });
      return headerRow;
    };

    const txSheet = workbook.addWorksheet("All Transactions");
    txSheet.mergeCells("A1:F1");
    const t1 = txSheet.getCell("A1");
    t1.value = "NexFlow Sales Report";
    t1.font = { size: 16, bold: true };
    t1.alignment = { horizontal: "center", vertical: "middle" };
    txSheet.mergeCells("A2:F2");
    txSheet.getCell("A2").value = `Generated: ${new Date().toLocaleDateString("en-PK")}`;
    txSheet.getCell("A2").alignment = { horizontal: "center" };
    for (let i = 1; i <= 6; i++) {
      txSheet.getCell(1, i).border = borderStyle;
      txSheet.getCell(2, i).border = borderStyle;
    }
    addHeaderRow(txSheet, ["Date", "Time", "Invoice ID", "Items", "Total (Rs.)", "Status"]);
    sales.forEach(s => {
      const d = new Date(s.saleDate);
      txSheet.addRow([
        d.toLocaleDateString('en-PK'),
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        s._id.slice(-8).toUpperCase(),
        s.items.map(i => `${i.name} x${i.quantity}`).join(', '),
        s.totalAmount,
        s.status?.toUpperCase() || 'PAID'
      ]).eachCell(cell => { cell.border = borderStyle; });
    });
    txSheet.columns = [{ width: 14 }, { width: 10 }, { width: 15 }, { width: 40 }, { width: 15 }, { width: 12 }];

    const sumSheet = workbook.addWorksheet("Summary");
    sumSheet.mergeCells("A1:B1");
    sumSheet.getCell("A1").value = "Business Summary";
    sumSheet.getCell("A1").font = { size: 14, bold: true };
    sumSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };
    sumSheet.getCell(1, 1).border = borderStyle;
    sumSheet.getCell(1, 2).border = borderStyle;
    const totalRevenue = allSales.reduce((s, x) => s + x.totalAmount, 0);
    const totalReturns = returnedSales.reduce((s, x) => s + x.totalAmount, 0);
    const summaryRows = [["Total Transactions", allSales.length], ["Total Revenue (Rs.)", totalRevenue], ["Total Returns (Rs.)", totalReturns], ["Net Revenue (Rs.)", totalRevenue - totalReturns], ["Returned Transactions", returnedSales.length]];
    summaryRows.forEach(([label, value]) => {
      const row = sumSheet.addRow([label, value]);
      row.getCell(1).font = { bold: true };
      row.eachCell(c => c.border = borderStyle);
    });
    sumSheet.columns = [{ width: 28 }, { width: 18 }];

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `NexFlow_Sales_${new Date().toISOString().split('T')[0]}.xlsx`);
    onClose();
  };

  const handleWhatsAppExport = () => {
    const outOfStockItems = (products || []).filter(p => p.stock === 0);
    const lowStockItems = (products || []).filter(p => p.stock > 0 && p.stock <= p.minStock);
    const totalValue = (products || []).reduce((sum, p) => sum + (p.stock * p.price), 0);
    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "+923013241531";
    const dateStr = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });
    let message = `*NexFlow Inventory Summary*\nDate: ${dateStr}\n\n*Overview*\n• Total Products: ${(products || []).length}\n• Inventory Value: Rs. ${totalValue.toLocaleString('en-PK')}\n\n`;
    if (outOfStockItems.length > 0) {
      message += `*Out of Stock (${outOfStockItems.length})*\n`;
      outOfStockItems.forEach(p => { message += `• ${p.name}\n`; });
      message += `\n`;
    }
    if (lowStockItems.length > 0) {
      message += `*Low Stock (${lowStockItems.length})*\n`;
      lowStockItems.forEach(p => { message += `• ${p.name} (${p.stock} left)\n`; });
      message += `\n`;
    }
    message += `Action: Restock items immediately\n\nNexFlow System`;
    const url = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };
  // --- END LOGIC ---

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={onClose} />

      {/* Explicit width 'max-w-md' and flex-col ensures no width collapse */}
      <div className="relative w-full max-w-md min-w-[320px] bg-white rounded-[2.5rem] shadow-premium overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-50 rounded-2xl">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Export Reports</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">NexusOS Intelligence</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Body */}
        <div className="p-6 space-y-6">

          {/* Inventory Excel Export */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Inventory Assets</h3>
            <button
              onClick={exportInventoryToExcel}
              className="w-full flex items-center justify-center gap-3 py-4 bg-blue-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-premium transition-all active:scale-[0.98]"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Download Inventory Spreadsheet
            </button>
          </div>

          {/* Sales Excel Export */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Financial Data</h3>
            <button
              onClick={exportSalesToExcel}
              disabled={sales.length === 0}
              className="w-full flex items-center justify-center gap-3 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black shadow-premium transition-all active:scale-[0.98] disabled:opacity-40"
            >
              <TrendingUp className="w-5 h-5" />
              Generate Sales Performance Report
            </button>
          </div>

          {/* WhatsApp */}
          <div className="space-y-3">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Social Distribution</h3>
            <button
              onClick={handleWhatsAppExport}
              className="w-full flex items-center justify-between p-5 border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 rounded-[2rem] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-200 text-white group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-emerald-900">WhatsApp Summary</p>
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tight">Send instant stock alerts</p>
                </div>
              </div>
            </button>
          </div>

        </div>

        {/* Simple Footer Spacer */}
        <div className="h-6 shrink-0" />
      </div>
    </div>
  );
}