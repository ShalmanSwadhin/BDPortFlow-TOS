const Rail = require('../models/Rail');

exports.getRails = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status) query.status = status;

    const rails = await Rail.find(query).sort('-departureTime').populate('createdBy', 'name email');
    res.json({ success: true, count: rails.length, data: rails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRail = async (req, res) => {
  try {
    const rail = await Rail.findById(req.params.id).populate('createdBy', 'name email');
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }
    res.json({ success: true, data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRail = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    const rail = await Rail.create(req.body);
    res.status(201).json({ success: true, message: 'Rail schedule created successfully', data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRail = async (req, res) => {
  try {
    const rail = await Rail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }
    res.json({ success: true, message: 'Rail schedule updated successfully', data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteRail = async (req, res) => {
  try {
    const rail = await Rail.findById(req.params.id);
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }
    await rail.deleteOne();
    res.json({ success: true, message: 'Rail schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addContainer = async (req, res) => {
  try {
    const rail = await Rail.findById(req.params.id);
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }

    if (rail.loaded >= rail.capacity) {
      return res.status(400).json({ success: false, message: 'Rail capacity full' });
    }

    rail.containers.push(req.body);
    rail.loaded += 1;
    await rail.save();

    res.json({ success: true, message: 'Container added to rail successfully', data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeContainer = async (req, res) => {
  try {
    const rail = await Rail.findById(req.params.id);
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }

    rail.containers = rail.containers.filter(c => c.containerId !== req.params.containerId);
    rail.loaded = rail.containers.length;
    await rail.save();

    res.json({ success: true, message: 'Container removed from rail successfully', data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
