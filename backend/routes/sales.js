import express from 'express';
const router = express.Router();
import Sale from '../models/Sale.js';
import Item from '../models/Item.js';
import CashSession from '../models/CashSession.js';
import { generateInvoice } from '../utils/generateInvoice.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Settings from '../models/Settings.js';

// Helper to verify Owner Password (Anti-Theft)
const verifyOwnerPassword = async (req, res, next) => {
  try {
    const password = req.headers['x-owner-password'];
    const userRole = req.headers['x-user-role']?.toLowerCase();

    // Bypass if user is admin
    const isAdmin = ['admin', 'system admin'].includes(userRole);
    if (isAdmin) return next();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }
    const correctPassword = settings.ownerPassword;
    
    if (password !== correctPassword) {
      return res.status(403).json({ message: "Owner authorization required for this action." });
    }
    next();
  } catch (err) {
    res.status(500).json({ message: "Auth check failed" });
  }
};

// Get all sales
router.get('/', async (req, res) => {
  try {
    const sales = await Sale.find().sort({ saleDate: -1 });
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new sale
router.post('/', async (req, res) => {
  const { items, totalAmount, totalProfit, cashierName } = req.body;
  
  try {
    // 1. Fetch current settings for the invoice
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    // 2. Create the sale record
    const sale = new Sale({
      items,
      totalAmount,
      totalProfit,
      cashierName: cashierName || "System Admin"
    });
    
    // 3. Update stock for each item
    for (const item of items) {
      const product = await Item.findById(item.productId);
      if (!product) {
        throw new Error(`Product ${item.name} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for ${item.name}`);
      }
      product.stock -= item.quantity;
      await product.save();
    }
    
    const newSale = await sale.save();

    // 4. Update active CashSession (Anti-Theft / Reporting)
    const activeSession = await CashSession.findOne({ status: 'open' });
    if (activeSession) {
      activeSession.totalSales += totalAmount;
      activeSession.expectedCash += totalAmount;
      await activeSession.save();
    }

    // 5. Generate PDF Invoice
    const fileName = `invoice-${newSale._id}.pdf`;
    const invoicesDir = path.join(__dirname, '..', 'invoices');
    if (!fs.existsSync(invoicesDir)) {
      fs.mkdirSync(invoicesDir, { recursive: true });
    }
    const filePath = path.join(invoicesDir, fileName);
    
    try {
      await generateInvoice(newSale, filePath, settings);
      // Attach invoice URL to response
      const responseData = newSale.toObject();
      responseData.invoiceUrl = `/invoices/${fileName}`;
      res.status(201).json(responseData);
    } catch (pdfErr) {
      console.error("PDF Generation failed:", pdfErr);
      res.status(211).json({ ...newSale.toObject(), message: "Sale created but PDF failed" });
    }
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Return a sale (and reverse stock) - REQUIRE OWNER PASSWORD
router.put('/:id/return', verifyOwnerPassword, async (req, res) => {
  const { reason } = req.body;
  
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale || sale.status === 'returned') {
      return res.status(404).json({ message: 'Sale not found or already returned' });
    }

    // 1. Reverse stock for each item
    for (const item of sale.items) {
      await Item.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    // 2. Update sale record
    sale.status = 'returned';
    sale.returnReason = reason || "Customer Return";
    sale.returnDate = new Date();
    const updatedSale = await sale.save();

    // 3. Update active CashSession
    const activeSession = await CashSession.findOne({ status: 'open' });
    if (activeSession) {
      activeSession.totalReturns += sale.totalAmount;
      activeSession.expectedCash -= sale.totalAmount;
      await activeSession.save();
    }

    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Edit a sale (and adjust stock) - REQUIRE OWNER PASSWORD
router.put('/:id', verifyOwnerPassword, async (req, res) => {
  const { items, totalAmount, totalProfit } = req.body;
  
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const oldAmount = sale.totalAmount;

    // Adjust stock based on differences
    for (const newItem of items) {
      const oldItem = sale.items.find(i => i.productId.toString() === newItem.productId.toString());
      if (oldItem) {
        const qtyDifference = newItem.quantity - oldItem.quantity;
        if (qtyDifference !== 0) {
          const product = await Item.findById(newItem.productId);
          if (product) {
            if (qtyDifference > 0 && product.stock < qtyDifference) {
              throw new Error(`Insufficient stock for ${newItem.name}`);
            }
            product.stock -= qtyDifference;
            await product.save();
          }
        }
      }
    }

    // Update the sale record
    sale.items = items;
    sale.totalAmount = totalAmount;
    if (totalProfit !== undefined) {
      sale.totalProfit = totalProfit;
    }
    
    const updatedSale = await sale.save();

    // Update active CashSession
    const activeSession = await CashSession.findOne({ status: 'open' });
    if (activeSession) {
      activeSession.expectedCash += (totalAmount - oldAmount);
      activeSession.totalSales += (totalAmount - oldAmount);
      await activeSession.save();
    }

    res.json(updatedSale);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a sale (and reverse stock) - REQUIRE OWNER PASSWORD
router.delete('/:id', verifyOwnerPassword, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id);
    if (!sale) {
      return res.status(404).json({ message: 'Sale not found' });
    }

    const amountToDeduct = sale.totalAmount;

    // Reverse stock
    for (const item of sale.items) {
      await Item.findByIdAndUpdate(item.productId, {
        $inc: { stock: item.quantity }
      });
    }

    await Sale.findByIdAndDelete(req.params.id);

    // Update active CashSession
    const activeSession = await CashSession.findOne({ status: 'open' });
    if (activeSession) {
      activeSession.totalSales -= amountToDeduct;
      activeSession.expectedCash -= amountToDeduct;
      await activeSession.save();
    }

    res.json({ message: 'Sale deleted and stock reversed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
