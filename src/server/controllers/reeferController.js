const Reefer = require('../models/Reefer');

exports.getReefers = async (req, res) => {
  try {
    const { status, powerStatus } = req.query;
    let query = {};
    if (status) query.status = status;
    if (powerStatus) query.powerStatus = powerStatus;

    const reefers = await Reefer.find(query).sort('-createdAt');
    res.json({ success: true, count: reefers.length, data: reefers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    res.json({ success: true, data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReefer = async (req, res) => {
  try {
    const reefer = await Reefer.create(req.body);
    res.status(201).json({ success: true, message: 'Reefer created successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    res.json({ success: true, message: 'Reefer updated successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    await reefer.deleteOne();
    res.json({ success: true, message: 'Reefer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAlert = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    reefer.alerts.push(req.body);
    await reefer.save();
    res.json({ success: true, message: 'Alert added successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
