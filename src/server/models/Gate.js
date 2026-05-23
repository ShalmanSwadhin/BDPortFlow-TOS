const mongoose = require('mongoose');

const gateSchema = new mongoose.Schema({
  gateNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['Open', 'Closed', 'Busy'],
    default: 'Open'
  },
  currentVehicle: {
    type: String,
    trim: true
  },
  waitingCount: {
    type: Number,
    default: 0
  },
  processedToday: {
    type: Number,
    default: 0
  },
  transactions: [{
    truckNumber: {
      type: String,
      required: true
    },
    driverName: {
      type: String,
      required: true
    },
    containerId: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Entry', 'Exit'],
      required: true
    },
    weight: {
      type: Number
    },
    purpose: {
      type: String,
      enum: ['Delivery', 'Pickup', 'Empty Return'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gatePass: {
      type: String
    }
  }],
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

// Index for queries
gateSchema.index({ status: 1 });

module.exports = mongoose.model('Gate', gateSchema);
