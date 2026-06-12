const Rail = require('../models/Rail');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

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
    const { trainNumber, destination, departureTime } = req.body;
    if (!trainNumber || !destination || !departureTime) {
      return res.status(400).json({ success: false, message: 'trainNumber, destination, and departureTime are required' });
    }

    const duplicate = await Rail.findOne({ trainNumber, departureTime: new Date(departureTime), status: { $ne: 'Cancelled' } });
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'A train schedule with this number and departure time already exists' });
    }

    req.body.createdBy = req.user._id;
    const rail = await Rail.create(req.body);

    await createAuditLog({
      user: req.user,
      moduleName: 'Rail Coordination',
      actionType: 'create',
      recordId: rail._id,
      updatedValues: rail.toObject()
    });

    await sendNotification({
      module: 'Rail Coordination',
      action: 'Schedule Train',
      message: `Train ${rail.trainNumber} scheduled for ${rail.destination}`,
      recordId: rail._id,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Rail schedule created successfully', data: rail });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRail = async (req, res) => {
  try {
    const rail = await Rail.findById(req.params.id);
    if (!rail) {
      return res.status(404).json({ success: false, message: 'Rail schedule not found' });
    }

    const previousValues = rail.toObject();
    Object.assign(rail, req.body);
    await rail.save();

    const action = req.body.status === 'Departed' ? 'Complete Loading'
      : req.body.status === 'Delayed' ? 'Report Delay' : 'Schedule Train';

    await createAuditLog({
      user: req.user,
      moduleName: 'Rail Coordination',
      actionType: 'update',
      recordId: rail._id,
      previousValues,
      updatedValues: rail.toObject()
    });

    await sendNotification({
      module: 'Rail Coordination',
      action,
      message: `Train ${rail.trainNumber} status updated to ${rail.status}`,
      recordId: rail._id,
      createdBy: req.user._id
    });

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

    const existing = rail.containers.find(c => c.containerId === req.body.containerId);
    if (existing) {
      return res.status(400).json({ success: false, message: 'Container already assigned to this train' });
    }

    rail.containers.push(req.body);
    rail.loaded += 1;
    await rail.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Rail Coordination',
      actionType: 'assign',
      recordId: rail._id,
      updatedValues: { containerId: req.body.containerId }
    });

    await sendNotification({
      module: 'Rail Coordination',
      action: 'Assign Containers',
      message: `Container ${req.body.containerId} assigned to train ${rail.trainNumber}`,
      recordId: rail._id,
      createdBy: req.user._id
    });

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
