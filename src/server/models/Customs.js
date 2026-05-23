const mongoose = require('mongoose');

const customsSchema = new mongoose.Schema({
  containerId: {
    type: String,
    required: [true, 'Container ID is required'],
    unique: true,
    trim: true,
    uppercase: true
  },
  billOfLading: {
    type: String,
    required: true,
    trim: true
  },
  importer: {
    type: String,
    required: true,
    trim: true
  },
  exporter: {
    type: String,
    trim: true
  },
  cargoDescription: {
    type: String,
    required: true
  },
  hsCode: {
    type: String,
    trim: true
  },
  value: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'BDT', 'EUR', 'GBP']
  },
  weight: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  origin: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Cleared', 'Hold', 'Rejected'],
    default: 'Pending'
  },
  submittedDate: {
    type: Date,
    default: Date.now
  },
  reviewedDate: {
    type: Date
  },
  clearedDate: {
    type: Date
  },
  documents: [{
    name: String,
    type: String,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  dutyAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalCharges: {
    type: Number,
    default: 0
  },
  remarks: {
    type: String
  },
  officer: {
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

// Indexes
customsSchema.index({ status: 1 });
customsSchema.index({ submittedDate: 1 });

module.exports = mongoose.model('Customs', customsSchema);
