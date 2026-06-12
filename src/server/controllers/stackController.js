const Container = require('../models/Container');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');
const { findContainerByIdentifier } = require('../utils/containerLookup');

exports.executeStackMove = async (req, res) => {
  try {
    const {
      containerId,
      sourceStackId,
      destStackId,
      placements,
      optimizationApplied = false,
      overrideWarning = false
    } = req.body;

    if (!containerId || !sourceStackId || !destStackId || !Array.isArray(placements) || !placements.length) {
      return res.status(400).json({
        success: false,
        message: 'containerId, sourceStackId, destStackId, and placements are required'
      });
    }

    const container = await findContainerByIdentifier(containerId);

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found with given container number'
      });
    }

    if (container.customsStatus === 'Hold') {
      return res.status(400).json({
        success: false,
        message: 'Container is locked (customs hold) and cannot be moved'
      });
    }

    const previousLocation = container.location ? container.toObject().location : null;

    const placementMap = new Map();
    for (const placement of placements) {
      if (!placement?.containerId || !placement.location?.block) continue;
      placementMap.set(String(placement.containerId).toUpperCase(), placement);
    }

    const updatedContainers = [];

    for (const placement of placementMap.values()) {
      const target = await findContainerByIdentifier(placement.containerId);
      if (!target) {
        return res.status(404).json({
          success: false,
          message: `Container not found with given container number: ${placement.containerId}`
        });
      }

      target.set({
        location: {
          block: String(placement.location.block).toUpperCase(),
          bay: String(placement.location.bay || '01').padStart(2, '0'),
          row: String(placement.location.row || '01').padStart(2, '0'),
          tier: String(placement.location.tier || '01').padStart(2, '0')
        }
      });
      target.markModified('location');
      await target.save();

      updatedContainers.push({
        containerId: target.containerId,
        location: target.location,
        _id: target._id
      });
    }

    const moved = updatedContainers.find(c => c.containerId === container.containerId);
    if (!moved) {
      return res.status(400).json({
        success: false,
        message: 'Failed to update container location — moved container was not included in placements'
      });
    }

    await createAuditLog({
      user: req.user,
      moduleName: 'Container Stack',
      actionType: 'update',
      recordId: container._id,
      previousValues: {
        location: previousLocation,
        sourceStack: sourceStackId
      },
      updatedValues: {
        location: moved.location,
        destStack: destStackId,
        optimizationApplied,
        overrideWarning,
        placements: updatedContainers
      },
      description: `Stack move: ${container.containerId} from ${sourceStackId} to ${destStackId}${
        optimizationApplied ? ' (optimization applied)' : overrideWarning ? ' (safety override)' : ''
      }`
    });

    await sendNotification({
      module: 'Container Stack',
      action: 'Stack Move Completed',
      message: `Container ${container.containerId} moved from ${sourceStackId} to ${destStackId}${
        optimizationApplied ? ' with stack optimization' : overrideWarning ? ' (override)' : ''
      }`,
      recordId: container._id,
      createdBy: req.user._id,
      dedupeKey: `stack:move:${container._id}:${Date.now()}`
    });

    res.json({
      success: true,
      message: 'Stack move completed successfully',
      data: {
        containerId: container.containerId,
        sourceStackId,
        destStackId,
        optimizationApplied,
        overrideWarning,
        updatedCount: updatedContainers.length,
        movedContainer: moved,
        updatedContainers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
