export const VESSEL_STATUSES = [
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'incoming', label: 'Incoming' },
  { value: 'berthed', label: 'Berthed' },
  { value: 'loading', label: 'Loading' },
  { value: 'unloading', label: 'Unloading' },
  { value: 'delayed', label: 'Delayed' },
  { value: 'departed', label: 'Departed' },
] as const;

export const VESSEL_STATUS_LABELS: Record<string, string> = Object.fromEntries(
  VESSEL_STATUSES.map(s => [s.value, s.label])
);

export function formatRelativeTime(date: string | Date): string {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
}

export function mapContainerFromApi(c: any) {
  const type = c.type?.includes('reefer') ? 'reefer' : c.hazmat ? 'hazmat' : 'standard';
  const location = c.location?.block
    ? `${c.location.block}${c.location.bay ? `-${c.location.bay}` : ''}`
    : 'Unknown';
  return {
    id: c.containerId || c._id,
    _id: c._id,
    status: (c.customsStatus || c.status || 'ready').toLowerCase(),
    location,
    type,
    weight: c.weight || 0,
    destination: c.destination,
    temperature: c.temperature,
    targetTemp: c.temperature,
    cargo: c.cargo,
    alarm: c.customsStatus === 'Hold',
    raw: c
  };
}

function formatVesselClockTime(value: string | Date | undefined, fallbackIndex = 0): string {
  if (!value) return '--:--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--:--';

  if (date.getHours() === 0 && date.getMinutes() === 0) {
    const slots = [6, 8, 10, 14, 16, 18, 20, 22];
    const hour = slots[fallbackIndex % slots.length];
    const minute = (fallbackIndex * 13) % 60;
    return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
  }

  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false });
}

function formatVesselScheduleLabel(value: string | Date | undefined, fallbackIndex = 0): string {
  if (!value) return 'TBC';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'TBC';
  const day = date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  return `${day} ${formatVesselClockTime(value, fallbackIndex)}`;
}

export function mapVesselFromApi(v: any, index = 0) {
  const colors = ['#00ff88', '#00d4ff', '#ffd700', '#ff6b35', '#a855f7'];
  const etaTime = formatVesselClockTime(v.eta, index);
  const etdTime = formatVesselClockTime(v.etd, index + 3);
  return {
    id: v._id,
    _id: v._id,
    name: v.vesselName,
    voyageNumber: v.imoNumber,
    length: v.length,
    draft: v.draft,
    eta: etaTime,
    etd: etdTime,
    etaLabel: formatVesselScheduleLabel(v.eta, index),
    etdLabel: formatVesselScheduleLabel(v.etd, index + 3),
    berth: v.berthNumber ? parseInt(String(v.berthNumber).replace(/\D/g, ''), 10) || null : null,
    berthNumber: v.berthNumber,
    status: v.status,
    cargo: v.vesselType || v.cargoDetails || 'Container',
    containers: v.totalContainers || 0,
    progress: v.progress || 0,
    color: colors[index % colors.length],
    raw: v
  };
}

export function formatDateKey(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function mapBookingFromApi(t: any) {
  return {
    id: t._id,
    truck: t.truckNumber,
    container: t.containerId,
    slot: t.appointmentTime,
    date: formatDateKey(t.appointmentDate),
    status: t.status,
    driver: t.driverName,
    contact: t.driverContact,
    operationType: t.purpose,
    createdAt: t.createdAt,
    raw: t
  };
}

export function mapNotificationFromApi(n: any) {
  return {
    id: n._id,
    type: n.type,
    message: n.message,
    time: formatRelativeTime(n.createdAt),
    read: n.read ?? false,
    module: n.module,
    raw: n
  };
}

export function mapReeferFromApi(r: any) {
  return {
    id: r._id,
    containerId: r.containerId,
    location: r.location,
    currentTemp: r.currentTemp,
    setPoint: r.setPoint,
    status: r.status,
    powerStatus: r.powerStatus,
    cargo: r.cargo,
    humidity: r.humidity,
    alerts: r.alerts || [],
    history: r.history || [],
    raw: r
  };
}

export const ROLE_LABELS: Record<string, string> = {
  admin: 'Administrator',
  operator: 'Port Operator',
  berth: 'Berth Planner',
  customs: 'Customs Officer',
  finance: 'Finance Manager',
  truck: 'Truck Driver'
};

export const ROLE_VALUES: Record<string, string> = {
  'Administrator': 'admin',
  'Port Operator': 'operator',
  'Berth Planner': 'berth',
  'Customs Officer': 'customs',
  'Finance Manager': 'finance',
  'Truck Driver': 'truck'
};

export const SLOT_TIMES = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30'
];

export const MAX_BOOKINGS_PER_SLOT = 10;

export const SCREEN_MODULE_MAP: Record<string, string> = {
  dashboard: 'Dashboard',
  admin: 'User Management',
  berth: 'Berth Planning',
  reefer: 'Reefer Monitor',
  stacking: 'Container Stack',
  stowage: 'Ship Stowage',
  gate: 'Gate Operations',
  truck: 'Truck Booking',
  yard: 'Yard Density',
  rail: 'Rail Coordination',
  customs: 'Customs Clearance',
  billing: 'Billing & Tariff',
};
