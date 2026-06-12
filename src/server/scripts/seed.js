const mongoose = require('mongoose');
const dotenv = require('dotenv');

const User = require('../models/User');
const Vessel = require('../models/Vessel');
const Container = require('../models/Container');
const Gate = require('../models/Gate');
const Reefer = require('../models/Reefer');
const Truck = require('../models/Truck');
const Rail = require('../models/Rail');
const Billing = require('../models/Billing');
const Stowage = require('../models/Stowage');
const YardBlock = require('../models/YardBlock');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/bdportflow';
const RESET_MODE = process.argv.includes('--reset');

const DEFAULT_USERS = [
  { name: 'Admin User', email: 'admin@bdport.gov.bd', password: 'admin123', role: 'admin', status: 'active' },
  { name: 'Port Operator', email: 'operator@bdport.gov.bd', password: 'operator123', role: 'operator', status: 'active' },
  { name: 'Berth Planner', email: 'berth@bdport.gov.bd', password: 'berth123', role: 'berth', status: 'active' },
  { name: 'Customs Officer', email: 'customs@bdport.gov.bd', password: 'customs123', role: 'customs', status: 'active' },
  { name: 'Finance Manager', email: 'finance@bdport.gov.bd', password: 'finance123', role: 'finance', status: 'active' },
  { name: 'Truck Driver', email: 'driver@bdport.gov.bd', password: 'driver123', role: 'truck', status: 'active' },
];

async function upsertDefaultUsers(resetPasswords = false) {
  const users = [];

  for (const userData of DEFAULT_USERS) {
    let user = await User.findOne({ email: userData.email });

    if (user) {
      user.name = userData.name;
      user.role = userData.role;
      user.status = userData.status;
      if (resetPasswords) {
        user.password = userData.password;
      }
      await user.save();
    } else {
      user = await User.create(userData);
    }

    users.push(user);
  }

  return users;
}

async function loadSeedRoleUsers() {
  const users = await User.find({ email: { $in: DEFAULT_USERS.map((entry) => entry.email) } });
  const byEmail = Object.fromEntries(users.map((user) => [user.email, user]));

  return {
    admin: byEmail['admin@bdport.gov.bd'],
    operator: byEmail['operator@bdport.gov.bd'],
    berth: byEmail['berth@bdport.gov.bd'],
    customs: byEmail['customs@bdport.gov.bd'],
    finance: byEmail['finance@bdport.gov.bd'],
    driver: byEmail['driver@bdport.gov.bd'],
  };
}

async function clearOperationalCollections() {
  await Promise.all([
    Vessel.deleteMany(),
    Container.deleteMany(),
    Gate.deleteMany(),
    Reefer.deleteMany(),
    Truck.deleteMany(),
    Rail.deleteMany(),
    Billing.deleteMany(),
    Stowage.deleteMany(),
    YardBlock.deleteMany(),
  ]);
}

async function clearAllCollections() {
  await Promise.all([
    User.deleteMany(),
    Vessel.deleteMany(),
    Container.deleteMany(),
    Gate.deleteMany(),
    Reefer.deleteMany(),
    Truck.deleteMany(),
    Rail.deleteMany(),
    Billing.deleteMany(),
    Stowage.deleteMany(),
    YardBlock.deleteMany(),
  ]);
}

function printLoginCredentials() {
  console.log('\nLogin Credentials:');
  console.log('  Admin:    admin@bdport.gov.bd / admin123');
  console.log('  Operator: operator@bdport.gov.bd / operator123');
  console.log('  Berth:    berth@bdport.gov.bd / berth123');
  console.log('  Customs:  customs@bdport.gov.bd / customs123');
  console.log('  Finance:  finance@bdport.gov.bd / finance123');
  console.log('  Truck:    driver@bdport.gov.bd / driver123');
}

const PREFIXES = ['TCLU', 'MSCU', 'CMAU', 'MAEU', 'HLCU', 'OOLU', 'EGLV', 'COSU'];
const CARGO_TYPES = [
  'Readymade Garments', 'Jute Products', 'Frozen Shrimp', 'Electronics',
  'Ceramic Tiles', 'Leather Goods', 'Pharmaceuticals', 'Tea', 'Steel Coils',
  'Rice', 'Furniture', 'Textile Yarn', 'Fish Meal', 'Chemicals', 'Footwear'
];
const CONSIGNEES = [
  'Square Textiles Ltd', 'Beximco Industries', 'Akij Group', 'PRAN-RFL Group',
  'Walton Hi-Tech', 'Summit Power Ltd', 'Meghna Group', 'City Group',
  'Ha-Meem Group', 'DBL Group', 'Pacific Jeans Ltd', 'KDS Group'
];
const ORIGINS = ['Chittagong', 'Singapore', 'Dubai', 'Shanghai', 'Colombo', 'Port Klang'];
const DESTINATIONS = ['Dhaka', 'Chittagong', 'Singapore', 'Dubai', 'Rotterdam', 'Hamburg', 'Mumbai'];

const YARD_BLOCKS = [
  { blockId: 'A', capacity: 120, type: 'mixed' },
  { blockId: 'B', capacity: 100, type: 'export' },
  { blockId: 'C', capacity: 80, type: 'reefer' },
  { blockId: 'D', capacity: 150, type: 'import' },
  { blockId: 'E', capacity: 100, type: 'mixed' },
  { blockId: 'F', capacity: 120, type: 'export' },
  { blockId: 'G', capacity: 90, type: 'import' },
  { blockId: 'H', capacity: 110, type: 'mixed' }
];

// Per-block container counts tuned for density: A,C,G high; B,F low
const BLOCK_CONTAINER_COUNTS = {
  A: 108, B: 12, C: 72, D: 22, E: 18, F: 14, G: 82, H: 20
};

function daysFromNow(days, hour = 8, minute = 30) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  d.setHours(hour, minute, 0, 0);
  return d;
}

function scheduleWindow(startDays, startHour, startMinute, endDays, endHour, endMinute) {
  return {
    eta: daysFromNow(startDays, startHour, startMinute),
    etd: daysFromNow(endDays, endHour, endMinute),
  };
}

function hoursFromNow(hours) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function generateContainerId(index) {
  const prefix = PREFIXES[index % PREFIXES.length];
  const num = String(1000000 + index).slice(1);
  return `${prefix}${num}`;
}

function buildContainers(vessels) {
  const containers = [];
  let index = 0;
  const reeferIds = [];

  for (const [blockId, count] of Object.entries(BLOCK_CONTAINER_COUNTS)) {
    for (let i = 0; i < count; i++) {
      const isReefer = blockId === 'C' && i < 8;
      const isHazmat = !isReefer && (index % 17 === 0);
      const isExport = ['B', 'F', 'E'].includes(blockId);
      const containerId = generateContainerId(index);
      const vessel = randomItem(vessels);

      if (isReefer) reeferIds.push(containerId);

      containers.push({
        containerId,
        type: isReefer ? 'reefer' : (index % 3 === 0 ? '20ft' : '40ft'),
        size: isReefer || index % 3 !== 0 ? '40' : '20',
        status: 'In Yard',
        location: {
          block: `${blockId}-${pad2(i + 1)}`,
          bay: pad2((i % 12) + 1),
          row: pad2((i % 8) + 1),
          tier: pad2((i % 4) + 1)
        },
        weight: isReefer ? 22000 + (index % 5) * 500 : 16000 + (index % 10) * 800,
        cargo: isReefer ? randomItem(['Frozen Shrimp', 'Frozen Fish', 'Fresh Vegetables', 'Pharmaceuticals']) : randomItem(CARGO_TYPES),
        vessel: vessel._id,
        vesselName: vessel.vesselName,
        consignee: randomItem(CONSIGNEES),
        origin: isExport ? 'Chittagong' : randomItem(ORIGINS),
        destination: isExport ? randomItem(['Singapore', 'Dubai', 'Rotterdam']) : randomItem(['Dhaka', 'Chittagong', 'Singapore']),
        arrivalDate: daysFromNow(-(index % 14)),
        hazmat: isHazmat,
        hazmatClass: isHazmat ? randomItem(['Class 3', 'Class 6.1', 'Class 8', 'Class 9']) : undefined,
        temperature: isReefer ? randomItem([-18, -20, 2, 4]) : undefined,
        customsStatus: randomItem(['Pending', 'Cleared', 'Cleared', 'Hold'])
      });
      index++;
    }
  }

  return { containers, reeferIds };
}

function buildReefers(reeferContainerIds, containers) {
  const reeferContainers = containers.filter(c => c.type === 'reefer');
  const extraReeferIds = ['RFER1000001', 'RFER1000002'];

  const allReeferData = [
    ...reeferContainers.map((c, i) => ({
      containerId: c.containerId,
      location: `Block ${c.location.block.split('-')[0]}`,
      currentTemp: c.temperature + (i % 2 === 0 ? -0.5 : 0.3),
      setPoint: c.temperature,
      status: i === 2 ? 'Warning' : i === 5 ? 'Critical' : 'Normal',
      powerStatus: i === 7 ? 'Disconnected' : 'Connected',
      cargo: c.cargo,
      humidity: 60 + (i % 25),
      alerts: i === 2 ? [{
        type: 'Temperature',
        message: 'Temperature deviation detected (+2.3°C)',
        severity: 'Medium'
      }] : i === 5 ? [{
        type: 'Temperature',
        message: 'Critical temperature rise detected',
        severity: 'Critical'
      }] : []
    })),
    {
      containerId: extraReeferIds[0],
      location: 'Block C',
      currentTemp: 3.8,
      setPoint: 4.0,
      status: 'Normal',
      powerStatus: 'Connected',
      cargo: 'Fresh Mangoes',
      humidity: 88
    },
    {
      containerId: extraReeferIds[1],
      location: 'Block C',
      currentTemp: -19.2,
      setPoint: -18.0,
      status: 'Warning',
      powerStatus: 'Connected',
      cargo: 'Frozen Hilsa',
      humidity: 72,
      alerts: [{
        type: 'Temperature',
        message: 'Below set-point threshold',
        severity: 'Medium'
      }]
    }
  ];

  return { reefers: allReeferData, extraReeferIds };
}

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${MONGODB_URI}`);

    if (RESET_MODE) {
      console.warn('\nRESET MODE: Deleting ALL collections, including manually created users.');
      console.warn('Use this only when you intentionally want a full database reset.\n');
      await clearAllCollections();
      console.log('Cleared existing seed collections');
      await User.create(DEFAULT_USERS);
    } else {
      console.log('\nSAFE SEED: Preserving manually created users.');
      console.log('Use "npm run seed:reset" only for a full destructive reset.\n');
      await upsertDefaultUsers(false);

      const containerCount = await Container.countDocuments();
      if (containerCount > 0) {
        const totalUsers = await User.countDocuments();
        console.log('Demo data already exists. Skipping operational data reseed.');
        console.log(`Preserved ${totalUsers} user account(s) in MongoDB.`);
        printLoginCredentials();
        await mongoose.disconnect();
        process.exit(0);
        return;
      }

      console.log('Empty operational data detected. Seeding demo data without deleting users.');
      await clearOperationalCollections();
    }

    const { admin, operator, berth, customs, finance, driver } = await loadSeedRoleUsers();
    if (!admin || !operator || !berth || !customs || !finance || !driver) {
      throw new Error('Default seed users are missing after upsert/create step.');
    }

    const now = new Date();
    const vessels = await Vessel.create([
      {
        vesselName: 'MV BANGLA STAR',
        imoNumber: 'IMO9123456',
        vesselType: 'Container',
        flag: 'Bangladesh',
        length: 294, breadth: 32, draft: 12.8,
        berthNumber: 'Berth-3',
        eta: scheduleWindow(2, 6, 30, 5, 20, 15).eta,
        etd: scheduleWindow(2, 6, 30, 5, 20, 15).etd,
        totalContainers: 320, loadedContainers: 0, progress: 0,
        status: 'scheduled',
        cargoDetails: 'Import containers from Singapore',
        agent: 'CPA Terminal Services',
        createdBy: berth._id
      },
      {
        vesselName: 'MV CHITTAGONG EXPRESS',
        imoNumber: 'IMO9234567',
        vesselType: 'Container',
        flag: 'Panama',
        length: 280, breadth: 40, draft: 12.5,
        berthNumber: 'Berth-1',
        eta: hoursFromNow(4), etd: daysFromNow(3, 16, 45),
        totalContainers: 280, loadedContainers: 45, progress: 16,
        status: 'incoming',
        cargoDetails: 'Mixed import/export',
        agent: 'Maersk Bangladesh',
        createdBy: operator._id
      },
      {
        vesselName: 'MV HARMONY',
        imoNumber: 'IMO9345678',
        vesselType: 'Container',
        flag: 'Singapore',
        length: 300, breadth: 48, draft: 13.0,
        berthNumber: 'Berth-2',
        eta: scheduleWindow(-1, 6, 0, 2, 19, 30).eta,
        etd: scheduleWindow(-1, 6, 0, 2, 19, 30).etd,
        totalContainers: 350, loadedContainers: 180, progress: 51,
        status: 'berthed',
        cargoDetails: 'Garments export to Dubai',
        agent: 'MSC Chittagong',
        createdBy: berth._id
      },
      {
        vesselName: 'MV DHAKA TRADER',
        imoNumber: 'IMO9456789',
        vesselType: 'Container',
        flag: 'Liberia',
        length: 265, breadth: 38, draft: 11.8,
        berthNumber: 'Berth-1',
        eta: scheduleWindow(-2, 7, 15, 1, 18, 0).eta,
        etd: scheduleWindow(-2, 7, 15, 1, 18, 0).etd,
        totalContainers: 240, loadedContainers: 195, progress: 81,
        status: 'loading',
        cargoDetails: 'Loading export containers',
        agent: 'Hapag-Lloyd',
        createdBy: operator._id
      },
      {
        vesselName: 'MV MEGHNA CARRIER',
        imoNumber: 'IMO9567890',
        vesselType: 'Container',
        flag: 'Marshall Islands',
        length: 290, breadth: 42, draft: 12.2,
        berthNumber: 'Berth-4',
        eta: scheduleWindow(-3, 5, 45, 0, 21, 30).eta,
        etd: scheduleWindow(-3, 5, 45, 0, 21, 30).etd,
        totalContainers: 310, loadedContainers: 120, progress: 39,
        status: 'unloading',
        cargoDetails: 'Unloading import from Dubai',
        agent: 'CMA CGM Bangladesh',
        createdBy: operator._id
      },
      {
        vesselName: 'MV BAY OF BENGAL',
        imoNumber: 'IMO9678901',
        vesselType: 'Container',
        flag: 'Hong Kong',
        length: 275, breadth: 40, draft: 12.0,
        berthNumber: 'Berth-5',
        eta: scheduleWindow(-1, 9, 30, 4, 17, 0).eta,
        etd: scheduleWindow(-1, 9, 30, 4, 17, 0).etd,
        totalContainers: 260, loadedContainers: 0, progress: 0,
        status: 'delayed',
        cargoDetails: 'Delayed due to monsoon weather',
        agent: 'Evergreen Marine',
        createdBy: berth._id
      },
      {
        vesselName: 'MV PADMA SPIRIT',
        imoNumber: 'IMO9789012',
        vesselType: 'Container',
        flag: 'Singapore',
        length: 285, breadth: 40, draft: 12.4,
        berthNumber: 'Berth-2',
        eta: scheduleWindow(-5, 14, 0, -2, 6, 30).eta,
        etd: scheduleWindow(-5, 14, 0, -2, 6, 30).etd,
        totalContainers: 300, loadedContainers: 300, progress: 100,
        status: 'departed',
        cargoDetails: 'Departed for Colombo',
        agent: 'OOCL Bangladesh',
        createdBy: operator._id
      }
    ]);

    const primaryVessel = vessels[2]; // MV HARMONY - berthed, used for stowage

    const { containers: containerData, reeferIds } = buildContainers(vessels);
    const seededContainers = await Container.create(containerData);

    const yardBlocks = await YardBlock.create(
      YARD_BLOCKS.map(b => ({ ...b, updatedBy: operator._id }))
    );

    const gateContainerIds = seededContainers.slice(0, 12).map(c => c.containerId);
    const gates = await Gate.create([
      {
        gateNumber: 'Gate-1',
        status: 'Open',
        waitingCount: 4,
        processedToday: 52,
        transactions: [
          {
            truckNumber: 'CTG-TK-4521', driverName: 'Abdul Karim', driverContact: '+8801712345678',
            licensePlate: 'CTG-TK-4521', containerId: gateContainerIds[0], type: 'Entry',
            purpose: 'Delivery', weight: 24500, approvalStatus: 'Approved',
            processedBy: customs._id, gatePass: 'GP-2026-06001', timestamp: hoursFromNow(-2)
          },
          {
            truckNumber: 'DHA-TK-8834', driverName: 'Rafiqul Islam', driverContact: '+8801812345678',
            licensePlate: 'DHA-TK-8834', containerId: gateContainerIds[1], type: 'Exit',
            purpose: 'Pickup', weight: 22800, approvalStatus: 'Pending',
            timestamp: hoursFromNow(-1)
          },
          {
            truckNumber: 'CTG-TK-1190', driverName: 'Shahidul Haque', driverContact: '+8801912345678',
            licensePlate: 'CTG-TK-1190', containerId: gateContainerIds[2], type: 'Entry',
            purpose: 'Delivery', weight: 26200, approvalStatus: 'Hold For Inspection',
            verificationNotes: 'Hazmat documentation incomplete',
            processedBy: customs._id, timestamp: hoursFromNow(-0.5)
          }
        ]
      },
      {
        gateNumber: 'Gate-2',
        status: 'Busy',
        currentVehicle: 'CTG-TK-7745',
        waitingCount: 6,
        processedToday: 41,
        transactions: [
          {
            truckNumber: 'CTG-TK-7745', driverName: 'Mizanur Rahman', driverContact: '+8801612345678',
            licensePlate: 'CTG-TK-7745', containerId: gateContainerIds[3], type: 'Exit',
            purpose: 'Pickup', weight: 21500, approvalStatus: 'Approved',
            processedBy: customs._id, gatePass: 'GP-2026-06002', timestamp: hoursFromNow(-3)
          },
          {
            truckNumber: 'SYL-TK-3302', driverName: 'Nurul Amin', driverContact: '+8801512345678',
            licensePlate: 'SYL-TK-3302', containerId: gateContainerIds[4], type: 'Entry',
            purpose: 'Empty Return', weight: 4200, approvalStatus: 'Pending',
            timestamp: hoursFromNow(-0.25)
          }
        ]
      },
      {
        gateNumber: 'Gate-3',
        status: 'Open',
        waitingCount: 2,
        processedToday: 38,
        transactions: [
          {
            truckNumber: 'CTG-TK-5567', driverName: 'Jamal Uddin', driverContact: '+8801412345678',
            licensePlate: 'CTG-TK-5567', containerId: gateContainerIds[5], type: 'Exit',
            purpose: 'Pickup', weight: 23100, approvalStatus: 'Hold For Inspection',
            verificationNotes: 'Customs hold - pending duty payment',
            processedBy: customs._id, timestamp: hoursFromNow(-4)
          },
          {
            truckNumber: 'BAR-TK-9021', driverName: 'Kamal Hossain', driverContact: '+8801312345678',
            licensePlate: 'BAR-TK-9021', containerId: gateContainerIds[6], type: 'Entry',
            purpose: 'Delivery', weight: 25800, approvalStatus: 'Approved',
            processedBy: customs._id, gatePass: 'GP-2026-06003', timestamp: hoursFromNow(-5)
          }
        ]
      },
      {
        gateNumber: 'Gate-4',
        status: 'Open',
        waitingCount: 1,
        processedToday: 29,
        transactions: [
          {
            truckNumber: 'CTG-TK-6612', driverName: 'Truck Driver', driverContact: '+8801212345678',
            licensePlate: 'CTG-TK-6612', containerId: gateContainerIds[7], type: 'Entry',
            purpose: 'Delivery', weight: 24000, approvalStatus: 'Pending',
            timestamp: hoursFromNow(-0.1)
          },
          {
            truckNumber: 'CTG-TK-4488', driverName: 'Anwar Hossain', driverContact: '+8801112345678',
            licensePlate: 'CTG-TK-4488', containerId: gateContainerIds[8], type: 'Exit',
            purpose: 'Pickup', weight: 21900, approvalStatus: 'Approved',
            processedBy: customs._id, gatePass: 'GP-2026-06004', timestamp: hoursFromNow(-6)
          }
        ]
      }
    ]);

    const { reefers: reeferData, extraReeferIds } = buildReefers(reeferIds, containerData);

    // Add two standalone reefer containers not already in yard blocks
    await Container.create(extraReeferIds.map((id, i) => ({
      containerId: id,
      type: 'reefer',
      size: '40',
      status: 'In Yard',
      location: { block: `C-${pad2(70 + i)}`, bay: '01', row: '01', tier: '01' },
      weight: 22000,
      cargo: reeferData[reeferData.length - 2 + i].cargo,
      vessel: primaryVessel._id,
      vesselName: primaryVessel.vesselName,
      consignee: 'Fresh Foods Bangladesh',
      origin: 'Chittagong',
      destination: i === 0 ? 'Dhaka' : 'Singapore',
      temperature: reeferData[reeferData.length - 2 + i].setPoint,
      customsStatus: 'Cleared'
    })));

    const reefers = await Reefer.create(reeferData);

    const today = daysFromNow(0);
    const tomorrow = daysFromNow(1);
    const truckSlots = ['08:00', '09:30', '11:00', '13:00', '14:30', '16:00', '08:30', '10:00', '12:00', '15:00'];
    const trucks = await Truck.create(
      truckSlots.map((time, i) => ({
        truckNumber: `CTG-TK-${7000 + i}`,
        driverName: driver.name,
        driverContact: '+8801711000001',
        company: 'Chittagong Logistics Ltd',
        containerId: seededContainers[i + 20].containerId,
        appointmentDate: i < 5 ? today : tomorrow,
        appointmentTime: time,
        status: i === 0 ? 'Arrived' : i === 1 ? 'In Progress' : 'Scheduled',
        purpose: i % 2 === 0 ? 'Pickup' : 'Delivery',
        gateNumber: `Gate-${(i % 4) + 1}`,
        user: driver._id,
        checkInTime: i === 0 ? hoursFromNow(-1) : undefined
      }))
    );

    const railContainerPool = seededContainers.filter(
      c => c.location.block.startsWith('B') || c.location.block.startsWith('F')
    );
    const toRailContainer = (c) => ({
      containerId: c.containerId,
      weight: c.weight,
      type: c.get('type')
    });
    const rails = await Rail.create([
      {
        trainNumber: 'Freight A',
        destination: 'Dhaka ICD, Kamlapur',
        departureTime: hoursFromNow(6),
        status: 'Loading',
        capacity: 40,
        loaded: 18,
        route: 'Chittagong Port → Dhaka ICD',
        estimatedArrival: hoursFromNow(18),
        operator: 'Bangladesh Railway',
        createdBy: operator._id,
        containers: railContainerPool.slice(0, 6).map(toRailContainer)
      },
      {
        trainNumber: 'Freight B',
        destination: 'Chittagong Pangaon ICD',
        departureTime: hoursFromNow(10),
        status: 'Scheduled',
        capacity: 40,
        loaded: 8,
        route: 'Chittagong Port → Pangaon',
        estimatedArrival: hoursFromNow(14),
        operator: 'Bangladesh Railway',
        createdBy: operator._id,
        containers: railContainerPool.slice(6, 10).map(toRailContainer)
      },
      {
        trainNumber: 'Export C',
        destination: 'Singapore (via Dhaka corridor)',
        departureTime: hoursFromNow(-2),
        status: 'Departed',
        capacity: 50,
        loaded: 42,
        route: 'Chittagong → Dhaka → Singapore rail corridor',
        estimatedArrival: daysFromNow(3),
        operator: 'Bangladesh Railway',
        createdBy: operator._id,
        containers: seededContainers.slice(50, 58).map(toRailContainer)
      },
      {
        trainNumber: 'Import D',
        destination: 'Chittagong Port Yard',
        departureTime: hoursFromNow(2),
        status: 'Delayed',
        capacity: 45,
        loaded: 12,
        route: 'Dhaka ICD → Chittagong Port',
        estimatedArrival: hoursFromNow(20),
        operator: 'Bangladesh Railway',
        createdBy: operator._id,
        containers: seededContainers.slice(58, 64).map(toRailContainer)
      }
    ]);

    const billingRecords = [
      { company: 'Square Textiles Ltd', service: 'Handling', vessel: 'MV HARMONY', status: 'Paid', total: 12500, paid: 12500, due: 0, daysAgo: 5 },
      { company: 'Beximco Industries', service: 'Container Storage', vessel: 'MV CHITTAGONG EXPRESS', status: 'Pending', total: 8400, paid: 0, due: 8400, daysAgo: 3 },
      { company: 'Akij Group', service: 'Reefer', vessel: 'MV HARMONY', status: 'Overdue', total: 15600, paid: 5000, due: 10600, daysAgo: 25 },
      { company: 'PRAN-RFL Group', service: 'Berth', vessel: 'MV DHAKA TRADER', status: 'Paid', total: 22000, paid: 22000, due: 0, daysAgo: 8 },
      { company: 'Walton Hi-Tech', service: 'Rail Service', vessel: null, status: 'Pending', total: 6800, paid: 0, due: 6800, daysAgo: 2 },
      { company: 'Summit Power Ltd', service: 'Demurrage', vessel: 'MV MEGHNA CARRIER', status: 'Overdue', total: 9200, paid: 2000, due: 7200, daysAgo: 30 },
      { company: 'Meghna Group', service: 'Handling', vessel: 'MV BANGLA STAR', status: 'Pending', total: 11500, paid: 0, due: 11500, daysAgo: 1 },
      { company: 'City Group', service: 'Container Storage', vessel: 'MV HARMONY', status: 'Paid', total: 7300, paid: 7300, due: 0, daysAgo: 10 },
      { company: 'Ha-Meem Group', service: 'Reefer', vessel: 'MV MEGHNA CARRIER', status: 'Pending', total: 14200, paid: 0, due: 14200, daysAgo: 4 },
      { company: 'Pacific Jeans Ltd', service: 'Handling', vessel: 'MV DHAKA TRADER', status: 'Overdue', total: 9800, paid: 3000, due: 6800, daysAgo: 22 }
    ];

    const billings = await Billing.create(
      billingRecords.map((b, i) => {
        const issueDate = daysFromNow(-b.daysAgo);
        const dueDate = daysFromNow(15 - b.daysAgo);
        return {
          invoiceNumber: `INV-2026-${String(i + 1).padStart(5, '0')}`,
          customerName: b.company.split(' ')[0] + ' Accounts',
          companyName: b.company,
          serviceType: b.service,
          customerEmail: `${b.company.toLowerCase().replace(/[^a-z]/g, '')}@company.bd`,
          customerAddress: 'Chittagong Export Processing Zone, Bangladesh',
          vesselName: b.vessel || undefined,
          containerId: seededContainers[i * 3]?.containerId,
          services: [{
            description: `${b.service} charges`,
            quantity: 1,
            rate: b.total,
            amount: b.total
          }],
          subtotal: b.total,
          tax: Math.round(b.total * 0.05),
          total: b.total + Math.round(b.total * 0.05),
          paymentAmount: b.paid,
          dueAmount: b.due,
          currency: 'USD',
          status: b.status,
          issueDate,
          dueDate,
          paidDate: b.status === 'Paid' ? daysFromNow(-b.daysAgo + 2) : undefined,
          paymentMethod: b.status === 'Paid' ? 'Bank Transfer' : undefined,
          createdBy: finance._id
        };
      })
    );

    const stowageTypes = ['import', 'export', 'reefer', 'hazmat', 'standard'];
    const stowageDestinations = ['Dhaka', 'Chittagong', 'Singapore', 'Dubai', 'Rotterdam'];
    const stowagePlacements = [];
    let bay = 1;
    for (let i = 0; i < 18; i++) {
      const row = (i % 6) + 1;
      const tier = Math.floor(i / 6) + 1;
      const type = stowageTypes[i % stowageTypes.length];
      stowagePlacements.push({
        vessel: primaryVessel._id,
        vesselName: primaryVessel.vesselName,
        containerId: seededContainers[i].containerId,
        bay,
        row,
        tier,
        weight: seededContainers[i].weight,
        type,
        destination: stowageDestinations[i % stowageDestinations.length],
        status: 'placed',
        createdBy: operator._id
      });
      if (row === 6) bay++;
    }

    for (let i = 18; i < 22; i++) {
      stowagePlacements.push({
        vessel: primaryVessel._id,
        vesselName: primaryVessel.vesselName,
        containerId: seededContainers[i].containerId,
        bay: 1,
        row: 1,
        tier: 1,
        weight: seededContainers[i].weight,
        type: 'standard',
        destination: stowageDestinations[i % stowageDestinations.length],
        status: 'pending',
        createdBy: operator._id
      });
    }

    const stowages = await Stowage.create(stowagePlacements);

    const totalContainers = seededContainers.length + extraReeferIds.length;

    console.log('\nDatabase seeded successfully!\n');
    console.log('SEED SUMMARY');
    console.log('='.repeat(55));
    console.log(`Users:        ${await User.countDocuments()} total (${DEFAULT_USERS.length} default seed accounts upserted)`);
    console.log(`Vessels:      ${vessels.length} (scheduled, incoming, berthed, loading, unloading, delayed, departed)`);
    console.log(`Containers:   ${totalContainers} across blocks A-H (A/C/G high density, B/F low)`);
    console.log(`Yard Blocks:  ${yardBlocks.length} (A-H with capacities ${YARD_BLOCKS.map(b => b.capacity).join(', ')})`);
    console.log(`Gates:        ${gates.length} with ${gates.reduce((s, g) => s + g.transactions.length, 0)} transactions`);
    console.log(`Reefers:      ${reefers.length} monitoring units (linked to reefer containers)`);
    console.log(`Trucks:       ${trucks.length} appointments (today + tomorrow, driver-linked)`);
    console.log(`Rails:        ${rails.length} trains (Freight A/B, Export C, Import D)`);
    console.log(`Billing:      ${billings.length} June 2026 invoices (Paid/Pending/Overdue)`);
    console.log(`Stowage:      ${stowages.length} placements on ${primaryVessel.vesselName}`);
    console.log('='.repeat(55));
    printLoginCredentials();

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedData();
