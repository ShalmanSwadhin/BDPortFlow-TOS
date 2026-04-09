const mongoose = require('mongoose');

const reeferSchema = new mongoose.Schema({
  containerId: {
    type: String,
    required: [true, 'Container ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  location: {
    type: String,
    required: true
  },
  currentTemp: {
    type: Number,
    required: true
  },
  setPoint: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Normal', 'Warning', 'Critical', 'Offline'],
    default: 'Normal'
  },
  powerStatus: {
    type: String,
    enum: ['Connected', 'Disconnected'],
    default: 'Connected'
  },
  cargo: {
    type: String,
    trim: true
  },
  humidity: {
    type: Number,
    min: 0,
    max: 100
  },
  ventilation: {
    type: Number
  },
  alerts: [{
    type: {
      type: String,
      enum: ['Temperature', 'Power', 'Door', 'Humidity']
    },
    message: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical']
    }
  }],
  history: [{
    temperature: Number,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastMaintenance: {
    type: Date
  },
  nextMaintenance: {
    type: Date
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

// Index for fast lookups
reeferSchema.index({ status: 1 });
reeferSchema.index({ powerStatus: 1 });

module.exports = mongoose.model('Reefer', reeferSchema);
