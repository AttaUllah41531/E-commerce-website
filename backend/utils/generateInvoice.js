import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateInvoice = async (sale, filePath, settings = {}) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ 
        size: 'A4', 
        margin: 50,
        bufferPages: true 
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Default values from settings
      const shopName = settings.shopName || "NEXFLOW INVENTORY";
      const shopAddress = settings.address || "Smart Inventory & POS System";
      const shopPhone = settings.phone ? `Contact: ${settings.phone}` : "WhatsApp: +92 301 3241531";
      const currency = settings.currency || "Rs.";

      // ======================
      // 🏪 LOGO & HEADER
      // ======================
      const logoPath = path.join(__dirname, '..', 'assets', 'logo.png');
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 45, { width: 60 });
      }

      doc
        .fillColor("#444444")
        .fontSize(20)
        .text(shopName.toUpperCase(), 115, 50, { align: "right" })
        .fontSize(10)
        .text(shopAddress, 200, 70, { align: "right" })
        .text(shopPhone, 200, 85, { align: "right" })
        .moveDown();

      // Horizontal Line
      doc.strokeColor("#eeeeee").lineWidth(1).moveTo(50, 110).lineTo(550, 110).stroke();

      // ======================
      // INVOICE INFO
      // ======================
      doc.moveDown(2);
      
      const customerName = sale.customer || "Walk-in Customer";
      const cashierName = sale.cashierName || "System Admin";
      const invoiceId = sale._id.toString().slice(-8).toUpperCase();
      const date = new Date(sale.saleDate).toLocaleDateString('en-PK', { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      doc
        .fontSize(12)
        .font("Helvetica-Bold")
        .text("INVOICE DETAILS", 50, 140)
        .font("Helvetica")
        .fontSize(10)
        .text(`Invoice ID: #${invoiceId}`, 50, 160)
        .text(`Date & Time: ${date}`, 50, 175)
        .text(`Cashier: ${cashierName}`, 50, 190);

      doc
        .font("Helvetica-Bold")
        .text("BILL TO:", 350, 140)
        .font("Helvetica")
        .text(customerName, 350, 160)
        .text("Pakistan", 350, 175);

      doc.moveDown(4);

      // ======================
      // ITEMS TABLE HEADER
      // ======================
      const tableTop = 250;
      doc.font("Helvetica-Bold");
      
      doc.text("Item Description", 50, tableTop);
      doc.text("Qty", 280, tableTop, { width: 50, align: "center" });
      doc.text("Price", 350, tableTop, { width: 80, align: "right" });
      doc.text("Total", 450, tableTop, { width: 100, align: "right" });

      doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

      // ======================
      // ITEMS TABLE ROWS
      // ======================
      let i;
      let invoiceTableTop = 275;
      doc.font("Helvetica");

      for (i = 0; i < sale.items.length; i++) {
        const item = sale.items[i];
        const position = invoiceTableTop + (i * 25);
        
        doc.text(item.name, 50, position);
        doc.text(item.quantity.toString(), 280, position, { width: 50, align: "center" });
        doc.text(`${currency} ${item.price.toLocaleString('en-PK')}`, 350, position, { width: 80, align: "right" });
        doc.text(`${currency} ${(item.price * item.quantity).toLocaleString('en-PK')}`, 450, position, { width: 100, align: "right" });

        // Dotted line between items
        doc.strokeColor("#eeeeee").lineWidth(0.5).moveTo(50, position + 18).lineTo(550, position + 18).stroke();
      }

      // ======================
      // TOTAL SECTION
      // ======================
      const subtotalOverTop = invoiceTableTop + (i * 25) + 20;
      
      doc
        .strokeColor("#444444")
        .lineWidth(1)
        .moveTo(350, subtotalOverTop)
        .lineTo(550, subtotalOverTop)
        .stroke();

      doc
        .fontSize(14)
        .font("Helvetica-Bold")
        .text("TOTAL AMOUNT", 300, subtotalOverTop + 10)
        .text(`${currency} ${sale.totalAmount.toLocaleString('en-PK')}`, 450, subtotalOverTop + 10, { width: 100, align: "right" });

      doc.moveDown(4);

      // ======================
      // QR / BARCODE SECTION
      // ======================
      try {
        const qrData = await QRCode.toDataURL(`Invoice:${invoiceId}|Total:${sale.totalAmount}|Date:${date}`);
        doc.image(qrData, 50, subtotalOverTop + 50, { width: 80 });
        doc.fontSize(8).fillColor("#aaaaaa").text("Scan to verify invoice authenticity", 50, subtotalOverTop + 135);
      } catch (err) {
        console.error("QR Generation failed:", err);
      }

      // ======================
      // SIGNATURE SECTION
      // ======================
      doc
        .fillColor("#444444")
        .fontSize(10)
        .font("Helvetica")
        .text("------------------------------------", 350, subtotalOverTop + 100)
        .font("Helvetica-Bold")
        .text("Authorized Signature", 350, subtotalOverTop + 115)
        .text(`${shopName}`, 350, subtotalOverTop + 130);

      // Footer
      doc
        .fontSize(8)
        .fillColor("#aaaaaa")
        .text("Thank you for your business! This is a computer generated invoice.", 50, 780, { align: "center", width: 500 });

      doc.end();
      
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));

    } catch (error) {
      reject(error);
    }
  });
};
