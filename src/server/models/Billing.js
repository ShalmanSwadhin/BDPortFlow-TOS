const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  customerAddress: {
    type: String,
    trim: true
  },
  vesselName: {
    type: String,
    trim: true
  },
  containerId: {
    type: String,
    trim: true
  },
  services: [{
    description: {
      type: String,
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    rate: {
      type: Number,
      required: true
    },
    amount: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  tax: {
    type: Number,
    default: 0
  },
  discount: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'BDT']
  },
  status: {
    type: String,
    enum: ['Draft', 'Pending', 'Paid', 'Overdue', 'Cancelled'],
    default: 'Pending'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  paidDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    enum: ['Bank Transfer', 'Cash', 'Check', 'Online']
  },
  notes: {
    type: String
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

// Auto-generate invoice number
billingSchema.pre('save', async function(next) {
  if (!this.invoiceNumber) {
    const count = await mongoose.model('Billing').countDocuments();
    this.invoiceNumber = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Indexes
billingSchema.index({ status: 1 });
billingSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Billing', billingSchema);
