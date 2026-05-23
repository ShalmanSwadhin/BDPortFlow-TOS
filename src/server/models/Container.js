const mongoose = require('mongoose');

const containerSchema = new mongoose.Schema({
  containerId: {
    type: String,
    required: [true, 'Container ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['20ft', '40ft', '40ft HC', 'reefer', 'tank', 'flat rack', 'open top'],
    required: true
  },
  size: {
    type: String,
    enum: ['20', '40', '45'],
    required: true
  },
  status: {
    type: String,
    enum: ['Empty', 'Full', 'In Transit', 'At Berth', 'In Yard', 'On Vessel', 'Gate Out', 'Gate In'],
    default: 'In Yard'
  },
  location: {
    block: {
      type: String,
      required: true
    },
    bay: String,
    row: String,
    tier: String
  },
  weight: {
    type: Number,
    required: true
  },
  cargo: {
    type: String,
    trim: true
  },
  vessel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vessel'
  },
  vesselName: {
    type: String,
    trim: true
  },
  consignee: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  destination: {
    type: String,
    trim: true
  },
  arrivalDate: {
    type: Date,
    default: Date.now
  },
  departureDate: {
    type: Date
  },
  hazmat: {
    type: Boolean,
    default: false
  },
  hazmatClass: {
    type: String
  },
  temperature: {
    type: Number
  },
  customsStatus: {
    type: String,
    enum: ['Pending', 'Cleared', 'Hold', 'Rejected'],
    default: 'Pending'
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

// Indexes for efficient queries
containerSchema.index({ status: 1 });
containerSchema.index({ 'location.block': 1 });
containerSchema.index({ vesselName: 1 });

module.exports = mongoose.model('Container', containerSchema);
