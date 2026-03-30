import mongoose from 'mongoose';

const SaleSchema = new mongoose.Schema({
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true
    },
    name: String,
    quantity: Number,
    price: Number,
    costPrice: { type: Number, default: 0 },
    subtotal: Number,
    profit: Number
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  saleDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'cancelled', 'returned'],
    default: 'completed'
  },
  returnReason: {
    type: String,
    default: ''
  },
  cashierId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cashierName: String
}, { timestamps: true });

export default mongoose.model('Sale', SaleSchema);
