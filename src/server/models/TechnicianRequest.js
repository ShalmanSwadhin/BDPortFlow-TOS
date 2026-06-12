const mongoose = require('mongoose');

const technicianRequestSchema = new mongoose.Schema({
  containerId: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  reeferId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Reefer'
  },
  issueType: {
    type: String,
    enum: ['Temperature', 'Power', 'Alarm', 'Maintenance', 'Other'],
    default: 'Temperature'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Dispatched', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  notes: {
    type: String,
    trim: true
  },
  technicianName: {
    type: String,
    trim: true
  },
  dispatchedAt: {
    type: Date
  },
  resolutionStatus: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Cancelled'],
    default: 'Open'
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

technicianRequestSchema.index({ containerId: 1, status: 1 });

module.exports = mongoose.model('TechnicianRequest', technicianRequestSchema);
