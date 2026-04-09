const mongoose = require('mongoose');

const vesselSchema = new mongoose.Schema({
  vesselName: {
    type: String,
    required: [true, 'Vessel name is required'],
    trim: true
  },
  imoNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  vesselType: {
    type: String,
    enum: ['Container', 'Bulk', 'Tanker', 'General Cargo', 'RoRo'],
    default: 'Container'
  },
  flag: {
    type: String,
    trim: true
  },
  length: {
    type: Number,
    required: true
  },
  breadth: {
    type: Number,
    required: true
  },
  draft: {
    type: Number,
    required: true
  },
  berthNumber: {
    type: String,
    required: true
  },
  eta: {
    type: Date,
    required: true
  },
  etd: {
    type: Date,
    required: true
  },
  totalContainers: {
    type: Number,
    default: 0
  },
  loadedContainers: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['scheduled', 'berthed', 'loading', 'unloading', 'departed'],
    default: 'scheduled'
  },
  cargoDetails: {
    type: String,
    trim: true
  },
  agent: {
    type: String,
    trim: true
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

// Index for faster queries
vesselSchema.index({ vesselName: 1 });
vesselSchema.index({ status: 1 });
vesselSchema.index({ berthNumber: 1 });

module.exports = mongoose.model('Vessel', vesselSchema);
