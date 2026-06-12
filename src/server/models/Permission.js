const mongoose = require('mongoose');

const permissionActionSchema = new mongoose.Schema({
  view: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  create: { type: Boolean, default: false }
}, { _id: false });

const permissionSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['admin', 'operator', 'berth', 'customs', 'finance', 'truck'],
    required: true,
    unique: true
  },
  modules: {
    type: Map,
    of: permissionActionSchema,
    default: {}
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Permission', permissionSchema);
