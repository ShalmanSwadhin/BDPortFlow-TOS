const Vessel = require('../models/Vessel');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

// @desc    Get all vessels
// @route   GET /api/vessels
// @access  Private
exports.getVessels = async (req, res) => {
  try {
    const { status, berthNumber } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (berthNumber) query.berthNumber = berthNumber;

    const vessels = await Vessel.find(query).sort('-createdAt');

    res.json({
      success: true,
      count: vessels.length,
      data: vessels
    });
  } catch (error) {
    console.error('Get vessels error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single vessel
// @route   GET /api/vessels/:id
// @access  Private
exports.getVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id).populate('createdBy', 'name email');

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    res.json({
      success: true,
      data: vessel
    });
  } catch (error) {
    console.error('Get vessel error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create vessel
// @route   POST /api/vessels
// @access  Private
exports.createVessel = async (req, res) => {
  try {
    req.body.createdBy = req.user._id;
    
    const vessel = await Vessel.create(req.body);

    await createAuditLog({
      user: req.user,
      moduleName: 'Berth Planning',
      actionType: 'create',
      recordId: vessel._id,
      updatedValues: { vesselName: vessel.vesselName, berthNumber: vessel.berthNumber }
    });

    await sendNotification({
      module: 'Berth Planning',
      action: 'Schedule Vessel',
      message: `Vessel ${vessel.vesselName} scheduled at ${vessel.berthNumber}`,
      recordId: vessel._id,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'Vessel created successfully',
      data: vessel
    });
  } catch (error) {
    console.error('Create vessel error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update vessel
// @route   PUT /api/vessels/:id
// @access  Private
exports.updateVessel = async (req, res) => {
  try {
    let vessel = await Vessel.findById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    const previousValues = vessel.toObject();

    vessel = await Vessel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    await createAuditLog({
      user: req.user,
      moduleName: 'Berth Planning',
      actionType: 'update',
      recordId: vessel._id,
      previousValues,
      updatedValues: vessel.toObject()
    });

    if (req.body.status === 'delayed' || req.body.status === 'Delayed') {
      await sendNotification({
        module: 'Berth Planning',
        action: 'Vessel Delayed',
        message: `Vessel ${vessel.vesselName} reported delayed`,
        recordId: vessel._id,
        createdBy: req.user._id
      });
    } else {
      await sendNotification({
        module: 'Berth Planning',
        action: 'Update Schedule',
        message: `Vessel schedule updated: ${vessel.vesselName}`,
        recordId: vessel._id,
        createdBy: req.user._id
      });
    }

    res.json({
      success: true,
      message: 'Vessel updated successfully',
      data: vessel
    });
  } catch (error) {
    console.error('Update vessel error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete vessel
// @route   DELETE /api/vessels/:id
// @access  Private/Admin
exports.deleteVessel = async (req, res) => {
  try {
    const vessel = await Vessel.findById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    const previousValues = vessel.toObject();
    await vessel.deleteOne();

    await createAuditLog({
      user: req.user,
      moduleName: 'Berth Planning',
      actionType: 'delete',
      recordId: req.params.id,
      previousValues,
      description: `Vessel schedule deleted: ${previousValues.vesselName}`
    });

    await sendNotification({
      module: 'Berth Planning',
      action: 'Delete Schedule',
      message: `Vessel schedule deleted: ${previousValues.vesselName}`,
      recordId: req.params.id,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: 'Vessel deleted successfully'
    });
  } catch (error) {
    console.error('Delete vessel error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update vessel progress
// @route   PATCH /api/vessels/:id/progress
// @access  Private
exports.updateProgress = async (req, res) => {
  try {
    const { loadedContainers, progress } = req.body;
    
    const vessel = await Vessel.findById(req.params.id);

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    if (loadedContainers !== undefined) vessel.loadedContainers = loadedContainers;
    if (progress !== undefined) vessel.progress = progress;

    await vessel.save();

    res.json({
      success: true,
      message: 'Vessel progress updated successfully',
      data: vessel
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
