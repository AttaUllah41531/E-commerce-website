import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding...');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.username);
    } else {
      const admin = new User({
        username: 'admin',
        password: 'admin123',
        fullName: 'System Admin',
        role: 'admin'
      });
      await admin.save();
      console.log('Default Admin created: admin / admin123');
    }

    // Create a demo cashier
    const existingCashier = await User.findOne({ username: 'cashier1' });
    if (!existingCashier) {
        const cashier = new User({
            username: 'cashier1',
            password: 'password123',
            fullName: 'Junior Cashier',
            role: 'cashier'
        });
        await cashier.save();
        console.log('Demo Cashier created: cashier1 / password123');
    }

    console.log('Seeding complete.');
    process.exit();
  } catch (error) {
    console.error('Seeding failed FULL ERROR:', error);
    if (error.errors) {
        console.error('VALIDATION ERRORS:', Object.keys(error.errors).map(key => error.errors[key].message));
    }
    process.exit(1);
  }
};

seedAdmin();
