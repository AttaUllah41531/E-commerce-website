import mongoose from 'mongoose';
import Item from './models/Item.js';
import dotenv from 'dotenv';
dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/inventory_dashboard');
    console.log('Connected to MongoDB for seeding...');
    
    // Clear existing items
    await Item.deleteMany({});
    console.log('Cleared existing products.');
    
    process.exit();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
