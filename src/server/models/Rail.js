const mongoose = require('mongoose');

const railSchema = new mongoose.Schema({
  trainNumber: {
    type: String,
    required: [true, 'Train number is required'],
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Loading', 'Departed', 'Delayed', 'Cancelled'],
    default: 'Scheduled'
  },
  capacity: {
    type: Number,
    required: true,
    default: 40
  },
  loaded: {
    type: Number,
    default: 0
  },
  containers: [{
    containerId: {
      type: String,
      required: true
    },
    weight: Number,
    type: String,
    loadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  operator: {
    type: String,
    default: 'Bangladesh Railway'
  },
  route: {
    type: String
  },
  estimatedArrival: {
    type: Date
  },
  createdBy: {
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

// Calculate loaded percentage
railSchema.virtual('loadedPercentage').get(function() {
  return Math.round((this.loaded / this.capacity) * 100);
});

// Indexes
railSchema.index({ trainNumber: 1 });
railSchema.index({ status: 1 });
railSchema.index({ departureTime: 1 });

module.exports = mongoose.model('Rail', railSchema);
