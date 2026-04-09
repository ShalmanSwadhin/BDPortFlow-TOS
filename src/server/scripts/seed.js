const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Vessel = require('../models/Vessel');
const Container = require('../models/Container');
const Gate = require('../models/Gate');
const Reefer = require('../models/Reefer');

dotenv.config();

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/bdportflow", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Vessel.deleteMany();
    await Container.deleteMany();
    await Gate.deleteMany();
    await Reefer.deleteMany();

    console.log('📦 Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@bdport.gov.bd',
        password: 'admin123',
        role: 'admin',
        status: 'active'
      },
      {
        name: 'Port Operator',
        email: 'operator@bdport.gov.bd',
        password: 'operator123',
        role: 'operator',
        status: 'active'
      },
      {
        name: 'Berth Planner',
        email: 'berth@bdport.gov.bd',
        password: 'berth123',
        role: 'berth',
        status: 'active'
      },
      {
        name: 'Customs Officer',
        email: 'customs@bdport.gov.bd',
        password: 'customs123',
        role: 'customs',
        status: 'active'
      },
      {
        name: 'Finance Manager',
        email: 'finance@bdport.gov.bd',
        password: 'finance123',
        role: 'finance',
        status: 'active'
      },
      {
        name: 'Truck Driver',
        email: 'driver@bdport.gov.bd',
        password: 'driver123',
        role: 'truck',
        status: 'active'
      }
    ]);

    console.log('✅ Created users');

    // Create vessels
    const vessels = await Vessel.create([
      {
        vesselName: 'MV HARMONY',
        imoNumber: 'IMO9876543',
        vesselType: 'Container',
        flag: 'Singapore',
        length: 280,
        breadth: 40,
        draft: 12.5,
        berthNumber: 'Berth-1',
        eta: new Date('2024-03-10T08:00:00'),
        etd: new Date('2024-03-12T18:00:00'),
        totalContainers: 245,
        loadedContainers: 160,
        progress: 65,
        status: 'loading',
        agent: 'Maersk Line',
        createdBy: users[1]._id
      },
      {
        vesselName: 'MV PACIFIC STAR',
        imoNumber: 'IMO9876544',
        vesselType: 'Container',
        flag: 'Panama',
        length: 300,
        breadth: 48,
        draft: 13.0,
        berthNumber: 'Berth-2',
        eta: new Date('2024-03-11T10:00:00'),
        etd: new Date('2024-03-13T20:00:00'),
        totalContainers: 320,
        loadedContainers: 95,
        progress: 30,
        status: 'berthed',
        agent: 'MSC',
        createdBy: users[2]._id
      }
    ]);

    console.log('✅ Created vessels');

    // Create containers
    const containers = await Container.create([
      {
        containerId: 'TCLU4567890',
        type: '40ft',
        size: '40',
        status: 'In Yard',
        location: { block: 'A-1', bay: '05', row: '03', tier: '02' },
        weight: 24000,
        cargo: 'Electronics',
        vessel: vessels[0]._id,
        vesselName: 'MV HARMONY',
        consignee: 'Tech Import Ltd',
        origin: 'Shanghai',
        destination: 'Dhaka',
        hazmat: false
      },
      {
        containerId: 'MSCU8765432',
        type: '20ft',
        size: '20',
        status: 'At Berth',
        location: { block: 'B-2', bay: '12', row: '05', tier: '01' },
        weight: 18000,
        cargo: 'Garments',
        vessel: vessels[1]._id,
        vesselName: 'MV PACIFIC STAR',
        consignee: 'Fashion Export BD',
        origin: 'Chittagong',
        destination: 'Rotterdam',
        hazmat: false
      },
      {
        containerId: 'CMAU3456789',
        type: 'reefer',
        size: '40',
        status: 'In Yard',
        location: { block: 'R-1', bay: '08', row: '02', tier: '01' },
        weight: 22000,
        cargo: 'Frozen Fish',
        vesselName: 'MV HARMONY',
        consignee: 'Marine Foods Ltd',
        origin: 'Cox\'s Bazar',
        destination: 'Tokyo',
        hazmat: false,
        temperature: -18
      }
    ]);

    console.log('✅ Created containers');

    // Create gates
    const gates = await Gate.create([
      {
        gateNumber: 'Gate-1',
        status: 'Open',
        waitingCount: 3,
        processedToday: 45
      },
      {
        gateNumber: 'Gate-2',
        status: 'Open',
        waitingCount: 5,
        processedToday: 38
      },
      {
        gateNumber: 'Gate-3',
        status: 'Busy',
        currentVehicle: 'DHA-GA-1234',
        waitingCount: 2,
        processedToday: 52
      },
      {
        gateNumber: 'Gate-4',
        status: 'Open',
        waitingCount: 0,
        processedToday: 41
      }
    ]);

    console.log('✅ Created gates');

    // Create reefers
    const reefers = await Reefer.create([
      {
        containerId: 'CMAU3456789',
        location: 'Block R-1',
        currentTemp: -18.5,
        setPoint: -18.0,
        status: 'Normal',
        powerStatus: 'Connected',
        cargo: 'Frozen Fish',
        humidity: 65
      },
      {
        containerId: 'TEMU7654321',
        location: 'Block R-2',
        currentTemp: 2.3,
        setPoint: 2.0,
        status: 'Normal',
        powerStatus: 'Connected',
        cargo: 'Fresh Vegetables',
        humidity: 85
      },
      {
        containerId: 'MAEU9876543',
        location: 'Block R-1',
        currentTemp: -15.2,
        setPoint: -18.0,
        status: 'Warning',
        powerStatus: 'Connected',
        cargo: 'Frozen Meat',
        humidity: 70,
        alerts: [{
          type: 'Temperature',
          message: 'Temperature deviation detected',
          severity: 'Medium'
        }]
      }
    ]);

    console.log('✅ Created reefers');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login Credentials:');
    console.log('='.repeat(50));
    console.log('Admin:    admin@bdport.gov.bd / admin123');
    console.log('Operator: operator@bdport.gov.bd / operator123');
    console.log('Berth:    berth@bdport.gov.bd / berth123');
    console.log('Customs:  customs@bdport.gov.bd / customs123');
    console.log('Finance:  finance@bdport.gov.bd / finance123');
    console.log('Truck:    driver@bdport.gov.bd / driver123');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
