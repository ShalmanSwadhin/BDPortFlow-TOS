const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['success', 'warning', 'error', 'info'],
    default: 'info'
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  module: {
    type: String,
    required: true,
    trim: true
  },
  action: {
    type: String,
    trim: true
  },
  recordId: {
    type: String,
    trim: true
  },
  targetRoles: [{
    type: String,
    enum: ['admin', 'operator', 'berth', 'customs', 'finance', 'truck']
  }],
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  readBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dedupeKey: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

notificationSchema.index({ targetRoles: 1, createdAt: -1 });
notificationSchema.index({ targetUserId: 1, createdAt: -1 });
notificationSchema.index({ dedupeKey: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Notification', notificationSchema);
