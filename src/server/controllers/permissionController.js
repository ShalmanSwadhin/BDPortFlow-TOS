const Permission = require('../models/Permission');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');
const { ensureDefaultPermissions, mapToObject } = require('../utils/defaultPermissions');

exports.getPermissions = async (req, res) => {
  try {
    await ensureDefaultPermissions();
    const permissions = await Permission.find().sort('role');
    const data = permissions.map(p => ({
      role: p.role,
      modules: mapToObject(p.modules),
      updatedAt: p.updatedAt
    }));
    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getRolePermissions = async (req, res) => {
  try {
    await ensureDefaultPermissions();
    const permission = await Permission.findOne({ role: req.params.role });
    if (!permission) {
      return res.status(404).json({ success: false, message: 'Role permissions not found' });
    }
    res.json({
      success: true,
      data: { role: permission.role, modules: mapToObject(permission.modules) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateRolePermissions = async (req, res) => {
  try {
    const { modules } = req.body;
    if (!modules || typeof modules !== 'object') {
      return res.status(400).json({ success: false, message: 'modules object is required' });
    }

    let permission = await Permission.findOne({ role: req.params.role });
    const previousValues = permission ? mapToObject(permission.modules) : null;

    if (!permission) {
      permission = await Permission.create({ role: req.params.role, modules, updatedBy: req.user._id });
    } else {
      permission.modules = modules;
      permission.updatedBy = req.user._id;
      permission.updatedAt = new Date();
      await permission.save();
    }

    await createAuditLog({
      user: req.user,
      moduleName: 'Permission Management',
      actionType: 'update',
      recordId: req.params.role,
      previousValues,
      updatedValues: modules,
      description: `Updated permissions for role ${req.params.role}`
    });

    await sendNotification({
      module: 'Permission Management',
      action: 'Update Permissions',
      message: `Permissions updated for role: ${req.params.role}`,
      recordId: req.params.role,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: 'Permissions updated successfully',
      data: { role: permission.role, modules: mapToObject(permission.modules) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
