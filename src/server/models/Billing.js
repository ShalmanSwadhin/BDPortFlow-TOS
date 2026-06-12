const mongoose = require('mongoose');

const billingSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    unique: true,
    trim: true
  },
  customerName: {
    type: String,
    required: true,
    trim: true
  },
  companyName: {
    type: String,
    trim: true
  },
  serviceType: {
    type: String,
    enum: ['Container Storage', 'Handling', 'Reefer', 'Berth', 'Rail Service', 'Demurrage', 'Other'],
    default: 'Handling'
  },
  paymentAmount: {
    type: Number,
    default: 0
  },
  dueAmount: {
    type: Number,
    default: 0
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

async function generateInvoiceNumber() {
  const count = await mongoose.model('Billing').countDocuments();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
}

billingSchema.pre('validate', async function(next) {
  try {
    if (!this.invoiceNumber) {
      this.invoiceNumber = await generateInvoiceNumber();
    }
    if (!this.dueDate) {
      const issue = this.issueDate ? new Date(this.issueDate) : new Date();
      issue.setDate(issue.getDate() + 30);
      this.dueDate = issue;
    }
    next();
  } catch (err) {
    next(err);
  }
});

billingSchema.index({ status: 1 });
billingSchema.index({ customerEmail: 1 });

module.exports = mongoose.model('Billing', billingSchema);
