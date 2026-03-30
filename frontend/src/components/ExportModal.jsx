import React from 'react';
import { X, Download, MessageCircle, FileSpreadsheet, TrendingUp } from 'lucide-react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

export function ExportModal({ isOpen, onClose, products = [], sales = [], categories = [] }) {

  if (!isOpen) return null;

  const getStockStatus = (stock, minStock) => {
    if (stock === 0) return "Out of Stock";
    if (stock < minStock) return "Low Stock";
    return "In Stock";
  };

  // ======================
  // INVENTORY EXPORT
  // ======================
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

      // Apply borders to Title and Date merged cells (all 6 columns)
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
        row.eachCell(cell => {
          cell.border = borderStyle;
        });
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


  // ======================
  // SALES EXPORT
  // ======================
  const exportSalesToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const allSales = [...(sales || [])].filter(s => s.status !== 'returned');
    const returnedSales = [...(sales || [])].filter(s => s.status === 'returned');

    const fmt = (n) => (n || 0).toLocaleString('en-PK');
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

    // Sheet 1: All Transactions
    const txSheet = workbook.addWorksheet("All Transactions");
    txSheet.mergeCells("A1:F1");
    const t1 = txSheet.getCell("A1");
    t1.value = "NexFlow Sales Report";
    t1.font = { size: 16, bold: true };
    t1.alignment = { horizontal: "center", vertical: "middle" };
    txSheet.mergeCells("A2:F2");
    txSheet.getCell("A2").value = `Generated: ${new Date().toLocaleDateString("en-PK")}`;
    txSheet.getCell("A2").alignment = { horizontal: "center" };

    // Borders for transactions title/date
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
      ]).eachCell(cell => {
        cell.border = borderStyle;
      });
    });
    txSheet.columns = [{ width: 14 }, { width: 10 }, { width: 15 }, { width: 40 }, { width: 15 }, { width: 12 }];

    // Sheet 2: Summary
    const sumSheet = workbook.addWorksheet("Summary");
    sumSheet.mergeCells("A1:B1");
    sumSheet.getCell("A1").value = "Business Summary";
    sumSheet.getCell("A1").font = { size: 14, bold: true };
    sumSheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

    // Borders for summary title
    sumSheet.getCell(1, 1).border = borderStyle;
    sumSheet.getCell(1, 2).border = borderStyle;

    const totalRevenue = allSales.reduce((s, x) => s + x.totalAmount, 0);
    const totalReturns = returnedSales.reduce((s, x) => s + x.totalAmount, 0);

    const summaryRows = [
      ["Total Transactions", allSales.length],
      ["Total Revenue (Rs.)", totalRevenue],
      ["Total Returns (Rs.)", totalReturns],
      ["Net Revenue (Rs.)", totalRevenue - totalReturns],
      ["Returned Transactions", returnedSales.length],
    ];
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


  // ======================
  // WHATSAPP EXPORT
  // ======================
  const handleWhatsAppExport = () => {
    const outOfStockItems = (products || []).filter(p => p.stock === 0);
    const lowStockItems = (products || []).filter(p => p.stock > 0 && p.stock <= p.minStock);
    const totalValue = (products || []).reduce((sum, p) => sum + (p.stock * p.price), 0);

    const phone = import.meta.env.VITE_WHATSAPP_NUMBER || "+923013241531";
    const dateStr = new Date().toLocaleDateString('en-PK', { day: '2-digit', month: 'short', year: 'numeric' });

    let message = `*NexFlow Inventory Summary*\n`;
    message += `Date: ${dateStr}\n\n`;
    message += `*Overview*\n`;
    message += `• Total Products: ${(products || []).length}\n`;
    message += `• Inventory Value: Rs. ${totalValue.toLocaleString('en-PK')}\n\n`;

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

    message += `Action: Restock low and out-of-stock items immediately\n\nNexFlow Inventory Management System`;

    const url = `https://wa.me/${phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative">

        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Download className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Export Reports</h2>
              <p className="text-xs text-gray-500">Download inventory & sales data or send summaries</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">

          {/* Inventory Excel Export */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Inventory Reports</h3>
            <button
              onClick={exportInventoryToExcel}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <FileSpreadsheet className="w-5 h-5" />
              Export Inventory Report (Multi-Sheet)
            </button>
          </div>

          {/* Sales Excel Export */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">Sales Reports</h3>
            <button
              onClick={exportSalesToExcel}
              disabled={sales.length === 0}
              className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TrendingUp className="w-5 h-5" />
              Export Sales Report (Transactions + Summary)
            </button>
          </div>

          {/* WhatsApp */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Share Summary</h3>
            <button
              onClick={handleWhatsAppExport}
              className="w-full flex items-center justify-between p-4 border border-green-200 bg-green-50 hover:bg-green-100 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-full">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-green-900">Send WhatsApp Summary</p>
                  <p className="text-xs text-green-700">Includes stock alerts</p>
                </div>
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}