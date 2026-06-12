const mongoose = require('mongoose');

const stowageSchema = new mongoose.Schema({
  vessel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel',
    required: true
  },
  vesselName: {
    type: String,
    required: true,
    trim: true
  },
  containerId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  bay: {
    type: Number,
    required: true,
    min: 1
  },
  row: {
    type: Number,
    required: true,
    min: 1
  },
  tier: {
    type: Number,
    required: true,
    min: 1
  },
  weight: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    default: 'standard'
  },
  destination: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'placed', 'removed'],
    default: 'placed'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

stowageSchema.index({ vessel: 1, bay: 1, row: 1, tier: 1 }, { unique: true, partialFilterExpression: { status: 'placed' } });
stowageSchema.index({ containerId: 1, status: 1 });

module.exports = mongoose.model('Stowage', stowageSchema);
