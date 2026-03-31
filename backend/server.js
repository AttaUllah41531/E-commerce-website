import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import cookieParser from 'cookie-parser';


dotenv.config();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: true, // Dynamically allow the origin of the request
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-owner-password', 'x-user-role'],
  exposedHeaders: ['x-owner-password', 'x-user-role']
}));
app.use(express.json());
app.use(cookieParser());


// Static Folders
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

import itemsRoutes from './routes/items.js';
import uploadRoutes from './routes/upload.js';
import salesRoutes from './routes/sales.js';
import cashSessionsRoutes from './routes/cashSessions.js';
import usersRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';
import settingsRoutes from './routes/settings.js';

// Routes
app.use('/api/items', itemsRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/cash-sessions', cashSessionsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err);
  res.status(500).json({
    message: err.message || 'Server Error',
    error: err
  });
});

// Root route
app.get('/', (req, res) => {
  res.send('Inventory API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
