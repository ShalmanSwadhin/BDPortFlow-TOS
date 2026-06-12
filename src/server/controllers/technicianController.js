const TechnicianRequest = require('../models/TechnicianRequest');
const Reefer = require('../models/Reefer');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

exports.getRequests = async (req, res) => {
  try {
    const { status, containerId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (containerId) query.containerId = containerId.toUpperCase();

    const requests = await TechnicianRequest.find(query)
      .sort('-createdAt')
      .populate('requestedBy', 'name email');

    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createRequest = async (req, res) => {
  let request = null;

  try {
    const { containerId, issueType, priority, notes, reeferId, technicianName } = req.body;

    if (!containerId) {
      return res.status(400).json({ success: false, message: 'containerId is required' });
    }
    if (!technicianName?.trim()) {
      return res.status(400).json({ success: false, message: 'technicianName is required' });
    }

    const normalizedContainerId = containerId.toUpperCase();
    const dispatchTime = new Date();
    const normalizedTechnician = technicianName.trim();
    const normalizedPriority = priority || 'High';

    let reefer = null;
    if (reeferId) {
      reefer = await Reefer.findById(reeferId);
      if (!reefer) {
        return res.status(404).json({ success: false, message: 'Reefer not found' });
      }
    }

    request = await TechnicianRequest.create({
      containerId: normalizedContainerId,
      reeferId,
      issueType: issueType || 'Temperature',
      priority: normalizedPriority,
      notes: notes || `Technician ${normalizedTechnician} dispatched to ${normalizedContainerId}`,
      technicianName: normalizedTechnician,
      status: 'Dispatched',
      dispatchedAt: dispatchTime,
      resolutionStatus: 'Open',
      requestedBy: req.user._id,
    });

    try {
      if (reefer) {
        reefer.alerts.push({
          type: 'Technician Request',
          message: `${normalizedTechnician} dispatched for maintenance`,
          severity: normalizedPriority === 'Critical'
            ? 'Critical'
            : normalizedPriority === 'High'
              ? 'High'
              : 'Medium',
          timestamp: dispatchTime,
        });
        await reefer.save();
      }

      await createAuditLog({
        user: req.user,
        moduleName: 'Reefer Operations',
        actionType: 'dispatch',
        recordId: request._id,
        updatedValues: {
          reeferId,
          containerId: normalizedContainerId,
          technicianName: normalizedTechnician,
          dispatchedAt: dispatchTime,
          status: 'Dispatched',
          resolutionStatus: 'Open',
        },
        description: `Technician Dispatch: ${normalizedTechnician} assigned to reefer container ${normalizedContainerId}`,
      });

      await sendNotification({
        module: 'Reefer Operations',
        action: 'Technician Dispatch',
        message: `Technician ${normalizedTechnician} dispatched to reefer container ${normalizedContainerId}`,
        recordId: request._id,
        createdBy: req.user._id,
        dedupeKey: `technician:dispatch:${request._id}`,
      });

      return res.status(201).json({
        success: true,
        message: 'Technician dispatched successfully',
        data: request,
      });
    } catch (postCreateError) {
      await TechnicianRequest.findByIdAndDelete(request._id);
      throw postCreateError;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRequest = async (req, res) => {
  try {
    const existing = await TechnicianRequest.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    const updates = { ...req.body };
    if (req.body.status === 'Completed' && existing.status !== 'Completed') {
      updates.completedAt = new Date();
      updates.resolutionStatus = 'Resolved';
    } else if (req.body.status === 'Cancelled' && existing.status !== 'Cancelled') {
      updates.resolutionStatus = 'Cancelled';
    } else if (req.body.status === 'In Progress' && existing.resolutionStatus === 'Open') {
      updates.resolutionStatus = 'In Progress';
    }

    const request = await TechnicianRequest.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (req.body.status === 'Completed' && existing.status !== 'Completed') {
      await sendNotification({
        module: 'Reefer Operations',
        action: 'Technician Completion',
        message: `Technician request completed for container ${request.containerId}`,
        recordId: request._id,
        createdBy: req.user._id,
        dedupeKey: `technician:complete:${request._id}`,
      });
    }

    res.json({ success: true, message: 'Request updated', data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
