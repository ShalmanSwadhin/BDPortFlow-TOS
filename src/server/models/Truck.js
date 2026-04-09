const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  truckNumber: {
    type: String,
    required: [true, 'Truck number is required'],
    trim: true,
    uppercase: true
  },
  driverName: {
    type: String,
    required: true,
    trim: true
  },
  driverContact: {
    type: String,
    required: true
  },
  company: {
    type: String,
    trim: true
  },
  containerId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Arrived', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  },
  purpose: {
    type: String,
    enum: ['Delivery', 'Pickup', 'Empty Return'],
    required: true
  },
  gateNumber: {
    type: String
  },
  qrCode: {
    type: String
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generate QR code on creation
truckSchema.pre('save', function(next) {
  if (!this.qrCode) {
    this.qrCode = `QR-${this.truckNumber}-${Date.now()}`;
  }
  next();
});

// Indexes
truckSchema.index({ truckNumber: 1 });
truckSchema.index({ status: 1 });
truckSchema.index({ appointmentDate: 1 });

module.exports = mongoose.model('Truck', truckSchema);
