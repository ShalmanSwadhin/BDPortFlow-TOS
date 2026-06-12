const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  moduleName: {
    type: String,
    required: true,
    trim: true
  },
  actionType: {
    type: String,
    enum: ['create', 'update', 'delete', 'approve', 'reject', 'hold', 'cancel', 'assign', 'release', 'login', 'logout', 'status_change', 'optimize', 'generate', 'dispatch'],
    required: true
  },
  recordId: {
    type: String,
    trim: true
  },
  previousValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  updatedValues: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  description: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: false
});

auditLogSchema.index({ moduleName: 1, timestamp: -1 });
auditLogSchema.index({ userId: 1, timestamp: -1 });
auditLogSchema.index({ actionType: 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
