const Notification = require('../models/Notification');

/**
 * Stakeholder routing by module and action.
 * Roles: admin, operator, berth, customs, finance, truck
 */
const STAKEHOLDER_MAP = {
  'Truck Booking': {
    'Booking Created': ['admin', 'operator', 'truck'],
    'Booking Updated': ['admin', 'operator', 'truck'],
    'Booking Cancelled': ['admin', 'operator', 'truck']
  },
  'Container Stack': {
    'Simulate Move': ['admin', 'operator'],
    'Optimize Stack': ['admin', 'operator'],
    'Stack Move Completed': ['admin', 'operator']
  },
  'Reefer Operations': {
    'Temperature Adjustment': ['admin', 'operator'],
    'Technician Request': ['admin', 'operator'],
    'Technician Dispatch': ['admin', 'operator'],
    'Technician Completion': ['admin', 'operator']
  },
  'Ship Stowage': {
    'Move Container': ['admin', 'berth', 'operator'],
    'Remove Container': ['admin', 'berth', 'operator']
  },
  'Gate Operations': {
    'Approve Entry': ['admin', 'operator', 'truck'],
    'Hold For Inspection': ['admin', 'operator', 'truck'],
    'Gate Status Change': ['admin', 'operator']
  },
  'Yard Density': {
    'Optimize Placement': ['admin', 'operator'],
    'Critical Density Alert': ['admin', 'operator']
  },
  'Rail Coordination': {
    'Schedule Train': ['admin', 'operator'],
    'Complete Loading': ['admin', 'operator'],
    'Report Delay': ['admin', 'operator'],
    'Assign Containers': ['admin', 'operator']
  },
  'Billing': {
    'Generate Invoice': ['admin', 'finance'],
    'Payment Received': ['admin', 'finance'],
    'Outstanding Payment Alert': ['admin', 'finance']
  },
  'User Management': {
    'Create User': ['admin'],
    'Update User': ['admin'],
    'Delete User': ['admin'],
    'Status Change': ['admin']
  },
  'Berth Planning': {
    'Schedule Vessel': ['admin', 'berth', 'operator'],
    'Update Schedule': ['admin', 'berth', 'operator'],
    'Vessel Delayed': ['admin', 'berth', 'operator'],
    'Delete Schedule': ['admin', 'berth']
  },
  'Permission Management': {
    'Update Permissions': ['admin']
  }
};

const TYPE_MAP = {
  'Booking Created': 'success',
  'Booking Cancelled': 'info',
  'Temperature Adjustment': 'warning',
  'Technician Request': 'error',
  'Technician Dispatch': 'error',
  'Technician Completion': 'success',
  'Hold For Inspection': 'warning',
  'Gate Status Change': 'info',
  'Report Delay': 'warning',
  'Vessel Delayed': 'warning',
  'Remove Container': 'warning',
  'Generate Invoice': 'success',
  'Payment Received': 'success',
  'Outstanding Payment Alert': 'warning',
  'Approve Entry': 'success',
  'Complete Loading': 'success',
  'Critical Density Alert': 'error',
  'Optimize Placement': 'info',
  'Stack Move Completed': 'success',
  'Simulate Move': 'info'
};

/**
 * Send stakeholder-targeted notification with duplicate prevention
 */
async function sendNotification({
  module,
  action,
  message,
  recordId = null,
  createdBy = null,
  type = null,
  targetUserId = null,
  targetRoles = null,
  dedupeKey = null
}) {
  const roles = targetRoles || STAKEHOLDER_MAP[module]?.[action] || ['admin'];
  const notificationType = type || TYPE_MAP[action] || 'info';
  const key = dedupeKey || `${module}:${action}:${recordId || message}:${Date.now()}`.slice(0, 200);

  try {
    if (dedupeKey) {
      const existing = await Notification.findOne({ dedupeKey: key });
      if (existing) return existing;
    }

    return await Notification.create({
      type: notificationType,
      message,
      module,
      action,
      recordId: recordId ? String(recordId) : null,
      targetRoles: roles,
      targetUserId,
      createdBy,
      dedupeKey: key
    });
  } catch (error) {
    if (error.code === 11000) return null;
    console.error('Notification error:', error.message);
    return null;
  }
}

module.exports = { sendNotification, STAKEHOLDER_MAP };
