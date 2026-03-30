import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  minStock: {
    type: Number,
    required: true,
    default: 0,
  },
  price: { 
    type: Number, 
    required: true 
  },
  costPrice: { 
    type: Number, 
    default: 0 
  },
  images: { 
    type: [String], 
    default: [] 
  },
  description: { 
    type: String, 
    default: '' 
  },
  mfgDate: {
    type: Date
  },
  expiryDate: {
    type: Date
  },
  lastUpdated: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

export default mongoose.model('Item', itemSchema);
