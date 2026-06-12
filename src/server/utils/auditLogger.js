const AuditLog = require('../models/AuditLog');

/**
 * Create a permanent audit log entry
 */
async function createAuditLog({
  user,
  moduleName,
  actionType,
  recordId = null,
  previousValues = null,
  updatedValues = null,
  description = null,
  ipAddress = null
}) {
  if (!user || !moduleName || !actionType) return null;

  try {
    return await AuditLog.create({
      userId: user._id,
      username: user.name || user.email,
      moduleName,
      actionType,
      recordId: recordId ? String(recordId) : null,
      previousValues,
      updatedValues,
      description,
      ipAddress,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Audit log error:', error.message);
    return null;
  }
}

module.exports = { createAuditLog };
