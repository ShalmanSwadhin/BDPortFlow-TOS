const Permission = require('../models/Permission');

const DEFAULT_PERMISSIONS = {
  admin: {
    'Dashboard': { view: true, edit: true, delete: true, create: true },
    'User Management': { view: true, edit: true, delete: true, create: true },
    'Berth Planning': { view: true, edit: true, delete: true, create: true },
    'Reefer Monitor': { view: true, edit: true, delete: true, create: true },
    'Container Stack': { view: true, edit: true, delete: true, create: true },
    'Ship Stowage': { view: true, edit: true, delete: true, create: true },
    'Gate Operations': { view: true, edit: true, delete: true, create: true },
    'Truck Booking': { view: true, edit: true, delete: true, create: true },
    'Yard Density': { view: true, edit: true, delete: true, create: true },
    'Rail Coordination': { view: true, edit: true, delete: true, create: true },
    'Customs Clearance': { view: true, edit: true, delete: true, create: true },
    'Billing & Tariff': { view: true, edit: true, delete: true, create: true },
    'Notification Management': { view: true, edit: true, delete: true, create: true },
    'System Settings': { view: true, edit: true, delete: true, create: true },
    'Audit Logs': { view: true, edit: false, delete: false, create: false }
  },
  operator: {
    'Dashboard': { view: true, edit: false, delete: false, create: false },
    'User Management': { view: false, edit: false, delete: false, create: false },
    'Berth Planning': { view: true, edit: true, delete: false, create: true },
    'Reefer Monitor': { view: true, edit: true, delete: false, create: false },
    'Container Stack': { view: true, edit: true, delete: false, create: true },
    'Ship Stowage': { view: true, edit: false, delete: false, create: false },
    'Gate Operations': { view: true, edit: true, delete: false, create: true },
    'Truck Booking': { view: true, edit: true, delete: false, create: false },
    'Yard Density': { view: true, edit: true, delete: false, create: false },
    'Rail Coordination': { view: true, edit: true, delete: false, create: true },
    'Customs Clearance': { view: true, edit: false, delete: false, create: false },
    'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
    'Notification Management': { view: true, edit: false, delete: false, create: false },
    'System Settings': { view: false, edit: false, delete: false, create: false },
    'Audit Logs': { view: false, edit: false, delete: false, create: false }
  },
  berth: {
    'Dashboard': { view: true, edit: false, delete: false, create: false },
    'User Management': { view: false, edit: false, delete: false, create: false },
    'Berth Planning': { view: true, edit: true, delete: true, create: true },
    'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
    'Container Stack': { view: true, edit: false, delete: false, create: false },
    'Ship Stowage': { view: true, edit: true, delete: false, create: true },
    'Gate Operations': { view: true, edit: false, delete: false, create: false },
    'Truck Booking': { view: true, edit: true, delete: false, create: false },
    'Yard Density': { view: true, edit: false, delete: false, create: false },
    'Rail Coordination': { view: true, edit: false, delete: false, create: false },
    'Customs Clearance': { view: false, edit: false, delete: false, create: false },
    'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
    'Notification Management': { view: true, edit: false, delete: false, create: false },
    'System Settings': { view: false, edit: false, delete: false, create: false },
    'Audit Logs': { view: false, edit: false, delete: false, create: false }
  },
  customs: {
    'Dashboard': { view: true, edit: false, delete: false, create: false },
    'User Management': { view: false, edit: false, delete: false, create: false },
    'Berth Planning': { view: true, edit: false, delete: false, create: false },
    'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
    'Container Stack': { view: true, edit: false, delete: false, create: false },
    'Ship Stowage': { view: true, edit: false, delete: false, create: false },
    'Gate Operations': { view: true, edit: false, delete: false, create: false },
    'Truck Booking': { view: true, edit: false, delete: false, create: false },
    'Yard Density': { view: true, edit: false, delete: false, create: false },
    'Rail Coordination': { view: true, edit: false, delete: false, create: false },
    'Customs Clearance': { view: true, edit: true, delete: false, create: true },
    'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
    'Notification Management': { view: true, edit: false, delete: false, create: false },
    'System Settings': { view: false, edit: false, delete: false, create: false },
    'Audit Logs': { view: true, edit: false, delete: false, create: false }
  },
  finance: {
    'Dashboard': { view: true, edit: false, delete: false, create: false },
    'User Management': { view: false, edit: false, delete: false, create: false },
    'Berth Planning': { view: true, edit: false, delete: false, create: false },
    'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
    'Container Stack': { view: true, edit: false, delete: false, create: false },
    'Ship Stowage': { view: true, edit: false, delete: false, create: false },
    'Gate Operations': { view: true, edit: false, delete: false, create: false },
    'Truck Booking': { view: true, edit: false, delete: false, create: false },
    'Yard Density': { view: true, edit: false, delete: false, create: false },
    'Rail Coordination': { view: true, edit: false, delete: false, create: false },
    'Customs Clearance': { view: true, edit: false, delete: false, create: false },
    'Billing & Tariff': { view: true, edit: true, delete: true, create: true },
    'Notification Management': { view: true, edit: false, delete: false, create: false },
    'System Settings': { view: false, edit: false, delete: false, create: false },
    'Audit Logs': { view: true, edit: false, delete: false, create: false }
  },
  truck: {
    'Dashboard': { view: true, edit: false, delete: false, create: false },
    'User Management': { view: false, edit: false, delete: false, create: false },
    'Berth Planning': { view: false, edit: false, delete: false, create: false },
    'Reefer Monitor': { view: false, edit: false, delete: false, create: false },
    'Container Stack': { view: false, edit: false, delete: false, create: false },
    'Ship Stowage': { view: false, edit: false, delete: false, create: false },
    'Gate Operations': { view: true, edit: false, delete: false, create: false },
    'Truck Booking': { view: true, edit: true, delete: true, create: true },
    'Yard Density': { view: false, edit: false, delete: false, create: false },
    'Rail Coordination': { view: false, edit: false, delete: false, create: false },
    'Customs Clearance': { view: false, edit: false, delete: false, create: false },
    'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
    'Notification Management': { view: true, edit: false, delete: false, create: false },
    'System Settings': { view: false, edit: false, delete: false, create: false },
    'Audit Logs': { view: false, edit: false, delete: false, create: false }
  }
};

async function ensureDefaultPermissions() {
  for (const [role, modules] of Object.entries(DEFAULT_PERMISSIONS)) {
    const existing = await Permission.findOne({ role });
    if (!existing) {
      await Permission.create({ role, modules });
    }
  }
}

function mapToObject(modules) {
  if (!modules) return {};
  if (modules instanceof Map) {
    const obj = {};
    modules.forEach((value, key) => { obj[key] = value; });
    return obj;
  }
  return modules;
}

module.exports = { DEFAULT_PERMISSIONS, ensureDefaultPermissions, mapToObject };
