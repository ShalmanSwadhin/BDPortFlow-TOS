const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
const DEV_CLIENT_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
];

const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim()).filter(Boolean)
  : DEV_CLIENT_ORIGINS;

app.use(cors({
  origin: configuredOrigins,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bdportflow')
  .then(async () => {
    console.log('✅ MongoDB Connected Successfully');
    await ensureDefaultPermissions();
    console.log('✅ Default permissions initialized');
  })
  .catch(err => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });

// Import Routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const vesselRoutes = require('./routes/vessels');
const containerRoutes = require('./routes/containers');
const gateRoutes = require('./routes/gates');
const berthRoutes = require('./routes/berths');
const reeferRoutes = require('./routes/reefers');
const truckRoutes = require('./routes/trucks');
const railRoutes = require('./routes/rails');
const customsRoutes = require('./routes/customs');
const billingRoutes = require('./routes/billing');
const dashboardRoutes = require('./routes/dashboard');
const auditRoutes = require('./routes/audit');
const notificationRoutes = require('./routes/notifications');
const permissionRoutes = require('./routes/permissions');
const stowageRoutes = require('./routes/stowage');
const yardRoutes = require('./routes/yard');
const technicianRoutes = require('./routes/technicians');
const { ensureDefaultPermissions } = require('./utils/defaultPermissions');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vessels', vesselRoutes);
app.use('/api/containers', containerRoutes);
app.use('/api/gates', gateRoutes);
app.use('/api/berths', berthRoutes);
app.use('/api/reefers', reeferRoutes);
app.use('/api/trucks', truckRoutes);
app.use('/api/bookings', truckRoutes);
app.use('/api/rails', railRoutes);
app.use('/api/customs', customsRoutes);
app.use('/api/billing', billingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/stowage', stowageRoutes);
app.use('/api/yard', yardRoutes);
app.use('/api/technicians', technicianRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'BDPortFlow API Server Running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
