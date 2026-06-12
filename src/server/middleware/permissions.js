const Permission = require('../models/Permission');
const { mapToObject } = require('../utils/defaultPermissions');

/**
 * Check if user role has permission for module/action
 */
exports.checkPermission = (moduleName, action = 'view') => {
  return async (req, res, next) => {
    try {
      if (req.user.role === 'admin') return next();

      const permission = await Permission.findOne({ role: req.user.role });
      if (!permission) {
        return res.status(403).json({ success: false, message: 'Permissions not configured for this role' });
      }

      const modules = mapToObject(permission.modules);
      const modulePerms = modules[moduleName];

      if (!modulePerms || !modulePerms[action]) {
        return res.status(403).json({
          success: false,
          message: `Not authorized: ${action} on ${moduleName}`
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
};

/**
 * Get permissions for current user's role
 */
exports.getMyPermissions = async (req, res) => {
  try {
    const permission = await Permission.findOne({ role: req.user.role });
    if (!permission) {
      return res.status(404).json({ success: false, message: 'Permissions not found' });
    }

    res.json({
      success: true,
      data: {
        role: permission.role,
        modules: mapToObject(permission.modules)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
