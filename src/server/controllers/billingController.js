const Billing = require('../models/Billing');

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
    req.body.createdBy = req.user._id;
    const billing = await Billing.create(req.body);
    res.status(201).json({ success: true, message: 'Invoice created successfully', data: billing });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
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
    await billing.save();

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
