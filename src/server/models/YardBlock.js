const mongoose = require('mongoose');

const yardBlockSchema = new mongoose.Schema({
  blockId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  type: {
    type: String,
    enum: ['import', 'export', 'reefer', 'mixed'],
    default: 'mixed'
  },
  lastOptimizedAt: {
    type: Date
  },
  optimizationNotes: {
    type: String,
    trim: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('YardBlock', yardBlockSchema);
