const Stowage = require('../models/Stowage');
const Vessel = require('../models/Vessel');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

exports.getStowage = async (req, res) => {
  try {
    const { vesselId } = req.query;
    const query = { status: { $in: ['placed', 'pending'] } };
    if (vesselId) query.vessel = vesselId;

    const assignments = await Stowage.find(query).sort('bay row tier').populate('vessel', 'vesselName');
    res.json({ success: true, count: assignments.length, data: assignments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.moveContainer = async (req, res) => {
  try {
    const { vesselId, containerId, bay, row, tier, weight, type, destination } = req.body;

    if (!vesselId || !containerId || !bay || !row || !tier) {
      return res.status(400).json({ success: false, message: 'vesselId, containerId, bay, row, tier are required' });
    }

    const vessel = await Vessel.findById(vesselId);
    if (!vessel) {
      return res.status(404).json({ success: false, message: 'Vessel not found' });
    }

    const slotTaken = await Stowage.findOne({ vessel: vesselId, bay, row, tier, status: 'placed' });
    if (slotTaken) {
      return res.status(400).json({ success: false, message: 'Slot already occupied' });
    }

    const existing = await Stowage.findOne({ containerId: containerId.toUpperCase(), status: 'placed' });
    const previousValues = existing ? existing.toObject() : null;

    if (existing) {
      existing.status = 'removed';
      existing.updatedBy = req.user._id;
      await existing.save();
    }

    const assignment = await Stowage.create({
      vessel: vesselId,
      vesselName: vessel.vesselName,
      containerId: containerId.toUpperCase(),
      bay, row, tier,
      weight: weight || 0,
      type: type || 'standard',
      destination,
      createdBy: req.user._id,
      updatedBy: req.user._id
    });

    await createAuditLog({
      user: req.user,
      moduleName: 'Ship Stowage',
      actionType: 'update',
      recordId: assignment._id,
      previousValues,
      updatedValues: assignment.toObject(),
      description: `Moved container ${containerId} to bay ${bay}, row ${row}, tier ${tier}`
    });

    await sendNotification({
      module: 'Ship Stowage',
      action: 'Move Container',
      message: `Container ${containerId} moved to ${vessel.vesselName} bay ${bay}`,
      recordId: assignment._id,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Container moved successfully', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.removeContainer = async (req, res) => {
  try {
    const assignment = await Stowage.findById(req.params.id);
    if (!assignment || assignment.status === 'removed') {
      return res.status(404).json({ success: false, message: 'Stowage assignment not found' });
    }

    const previousValues = assignment.toObject();
    assignment.status = 'removed';
    assignment.updatedBy = req.user._id;
    await assignment.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Ship Stowage',
      actionType: 'delete',
      recordId: assignment._id,
      previousValues,
      updatedValues: { status: 'removed' },
      description: `Removed container ${assignment.containerId} from stowage`
    });

    await sendNotification({
      module: 'Ship Stowage',
      action: 'Remove Container',
      message: `Container ${assignment.containerId} removed from ${assignment.vesselName}`,
      recordId: assignment._id,
      createdBy: req.user._id
    });

    res.json({ success: true, message: 'Container removed from stowage', data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
