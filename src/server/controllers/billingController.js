const Billing = require('../models/Billing');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

const FIELD_LABELS = {
  invoiceNumber: 'Invoice Number',
  customerName: 'Customer Name',
  customerEmail: 'Customer Email',
  dueDate: 'Due Date',
  subtotal: 'Subtotal',
  total: 'Total',
  services: 'Services'
};

function formatValidationError(error) {
  if (error.name === 'ValidationError' && error.errors) {
    const messages = Object.entries(error.errors).map(([field]) => {
      const label = FIELD_LABELS[field] || field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
      return `${label} is required`;
    });
    return `Billing validation failed: ${messages.join(', ')}`;
  }
  return error.message;
}

async function generateInvoiceNumber() {
  const count = await Billing.countDocuments();
  return `INV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
}

function normalizeBillingPayload(body) {
  const payload = { ...body };

  if (!payload.customerName?.trim()) {
    return { error: 'Billing validation failed: Customer Name is required' };
  }
  if (!payload.customerEmail?.trim()) {
    return { error: 'Billing validation failed: Customer Email is required' };
  }
  if (!payload.services?.length) {
    return { error: 'Billing validation failed: Services are required' };
  }
  if (payload.total == null && payload.subtotal != null) {
    payload.total = payload.subtotal + (payload.tax || 0) - (payload.discount || 0);
  }
  if (payload.total == null) {
    return { error: 'Billing validation failed: Total amount is required' };
  }

  if (!payload.issueDate) {
    payload.issueDate = new Date();
  }
  if (!payload.dueDate) {
    const due = new Date(payload.issueDate);
    due.setDate(due.getDate() + 30);
    payload.dueDate = due;
  }

  if (payload.total && payload.dueAmount == null) {
    payload.dueAmount = Math.max(0, payload.total - (payload.paymentAmount || 0));
  }

  return { payload };
}

exports.getBillings = async (req, res) => {
  try {
    const { status, customerEmail } = req.query;
    let query = {};
    if (status) query.status = status;
    if (customerEmail) query.customerEmail = customerEmail;

    const billings = await Billing.find(query).sort('-issueDate').populate('createdBy', 'name email');
    res.json({ success: true, count: billings.length, data: billings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBilling = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id).populate('createdBy', 'name email');
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: billing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createBilling = async (req, res) => {
  try {
    const normalized = normalizeBillingPayload(req.body);
    if (normalized.error) {
      return res.status(400).json({ success: false, message: normalized.error });
    }

    const payload = normalized.payload;
    payload.createdBy = req.user._id;

    if (!payload.invoiceNumber) {
      payload.invoiceNumber = await generateInvoiceNumber();
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const duplicateQuery = {
      customerEmail: payload.customerEmail,
      issueDate: { $gte: today },
      status: { $ne: 'Cancelled' }
    };
    if (payload.containerId) duplicateQuery.containerId = payload.containerId;
    if (payload.vesselName) duplicateQuery.vesselName = payload.vesselName;

    const duplicate = await Billing.findOne(duplicateQuery);
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'An invoice for this customer and record already exists today',
        data: duplicate
      });
    }

    const billing = await Billing.create(payload);

    await createAuditLog({
      user: req.user,
      moduleName: 'Billing',
      actionType: 'generate',
      recordId: billing._id,
      updatedValues: { invoiceNumber: billing.invoiceNumber, total: billing.total },
      description: `Invoice ${billing.invoiceNumber} generated`
    });

    await sendNotification({
      module: 'Billing',
      action: 'Generate Invoice',
      message: `Invoice ${billing.invoiceNumber} generated for ${billing.customerName}`,
      recordId: billing._id,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Invoice created successfully', data: billing });
  } catch (error) {
    res.status(400).json({ success: false, message: formatValidationError(error) });
  }
};

exports.updateBilling = async (req, res) => {
  try {
    const billing = await Billing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, message: 'Invoice updated successfully', data: billing });
  } catch (error) {
    res.status(400).json({ success: false, message: formatValidationError(error) });
  }
};

exports.deleteBilling = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    await billing.deleteOne();
    res.json({ success: true, message: 'Invoice deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    billing.status = 'Paid';
    billing.paidDate = new Date();
    billing.paymentMethod = req.body.paymentMethod;
    billing.paymentAmount = billing.total;
    billing.dueAmount = 0;
    await billing.save();

    await sendNotification({
      module: 'Billing',
      action: 'Payment Received',
      message: `Payment received for invoice ${billing.invoiceNumber}: ${billing.total} ${billing.currency}`,
      recordId: billing._id,
      createdBy: req.user._id,
      dedupeKey: `billing:paid:${billing._id}`
    });

    res.json({ success: true, message: 'Invoice marked as paid', data: billing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    let query = { status: 'Paid' };
    if (startDate && endDate) {
      query.paidDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const billings = await Billing.find(query);
    const totalRevenue = billings.reduce((sum, bill) => sum + bill.total, 0);

    res.json({
      success: true,
      data: {
        totalRevenue,
        count: billings.length,
        billings
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.generatePDF = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    const lines = [
      'BDPortFlow Terminal Operating System',
      'INVOICE',
      '================================',
      `Invoice Number: ${billing.invoiceNumber}`,
      `Customer: ${billing.customerName}`,
      `Email: ${billing.customerEmail}`,
      `Issue Date: ${billing.issueDate.toISOString().split('T')[0]}`,
      `Due Date: ${billing.dueDate.toISOString().split('T')[0]}`,
      `Status: ${billing.status}`,
      '',
      'Services:',
      ...billing.services.map(s => `  ${s.description} x${s.quantity} @ ${s.rate} = ${s.amount}`),
      '',
      `Subtotal: ${billing.subtotal}`,
      `Tax: ${billing.tax}`,
      `Discount: ${billing.discount}`,
      `Total: ${billing.total} ${billing.currency}`,
      '',
      billing.notes ? `Notes: ${billing.notes}` : ''
    ].join('\n');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${billing.invoiceNumber}.pdf"`);

    const pdfContent = `%PDF-1.4
1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj
4 0 obj<</Length ${lines.length + 200}>>stream
BT /F1 10 Tf 50 750 Td
${lines.split('\n').map((line) => `(${line.replace(/[()\\]/g, '')}) Tj 0 -14 Td`).join('\n')}
ET
endstream endobj
5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj
xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000053 00000 n 
0000000102 00000 n 
0000000250 00000 n 
0000000500 00000 n 
trailer<</Size 6/Root 1 0 R>>
startxref
580
%%EOF`;

    res.send(Buffer.from(pdfContent, 'utf-8'));
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.previewInvoice = async (req, res) => {
  try {
    const billing = await Billing.findById(req.params.id);
    if (!billing) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }
    res.json({ success: true, data: billing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
