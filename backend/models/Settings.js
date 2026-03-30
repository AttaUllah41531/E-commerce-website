import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  shopName: { type: String, default: 'NexFlow POS' },
  address: { type: String, default: '' },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  currency: { type: String, default: '$' },
  ownerPassword: { type: String, default: 'admin123' }, // Stored as plain text for simplicity as per current requirement, but could be hashed later
  taxRate: { type: Number, default: 0 }
}, { timestamps: true });

const Settings = mongoose.model('Settings', SettingsSchema);
export default Settings;
