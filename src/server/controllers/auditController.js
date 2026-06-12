const AuditLog = require('../models/AuditLog');

exports.getAuditLogs = async (req, res) => {
  try {
    const { moduleName, actionType, userId, limit = 100 } = req.query;
    const query = {};
    if (moduleName) query.moduleName = moduleName;
    if (actionType) query.actionType = actionType;
    if (userId) query.userId = userId;

    const logs = await AuditLog.find(query)
      .sort('-timestamp')
      .limit(parseInt(limit, 10))
      .populate('userId', 'name email role');

    res.json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAuditLog = async (req, res) => {
  try {
    const log = await AuditLog.findById(req.params.id).populate('userId', 'name email role');
    if (!log) {
      return res.status(404).json({ success: false, message: 'Audit log not found' });
    }
    res.json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
