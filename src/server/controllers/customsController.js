const Customs = require('../models/Customs');

exports.getCustomsClearances = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const clearances = await Customs.find(query).sort('-submittedDate').populate('officer', 'name email');
    res.json({ success: true, count: clearances.length, data: clearances });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCustomsClearance = async (req, res) => {
  try {
    const clearance = await Customs.findById(req.params.id).populate('officer', 'name email');
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }
    res.json({ success: true, data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createCustomsClearance = async (req, res) => {
  try {
    const clearance = await Customs.create(req.body);
    res.status(201).json({ success: true, message: 'Customs clearance created successfully', data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateCustomsClearance = async (req, res) => {
  try {
    const clearance = await Customs.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }
    res.json({ success: true, message: 'Customs clearance updated successfully', data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteCustomsClearance = async (req, res) => {
  try {
    const clearance = await Customs.findById(req.params.id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }
    await clearance.deleteOne();
    res.json({ success: true, message: 'Customs clearance deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveClearance = async (req, res) => {
  try {
    const clearance = await Customs.findById(req.params.id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }

    clearance.status = 'Cleared';
    clearance.clearedDate = new Date();
    clearance.officer = req.user._id;
    clearance.remarks = req.body.remarks || '';
    await clearance.save();

    res.json({ success: true, message: 'Clearance approved successfully', data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.rejectClearance = async (req, res) => {
  try {
    const clearance = await Customs.findById(req.params.id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }

    clearance.status = 'Rejected';
    clearance.reviewedDate = new Date();
    clearance.officer = req.user._id;
    clearance.remarks = req.body.remarks || '';
    await clearance.save();

    res.json({ success: true, message: 'Clearance rejected', data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.holdClearance = async (req, res) => {
  try {
    const clearance = await Customs.findById(req.params.id);
    if (!clearance) {
      return res.status(404).json({ success: false, message: 'Customs clearance not found' });
    }

    clearance.status = 'Hold';
    clearance.reviewedDate = new Date();
    clearance.officer = req.user._id;
    clearance.remarks = req.body.remarks || '';
    await clearance.save();

    res.json({ success: true, message: 'Clearance put on hold', data: clearance });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
