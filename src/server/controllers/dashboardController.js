const Vessel = require('../models/Vessel');
const Container = require('../models/Container');
const Gate = require('../models/Gate');
const Reefer = require('../models/Reefer');
const Truck = require('../models/Truck');
const Billing = require('../models/Billing');

exports.getDashboardStats = async (req, res) => {
  try {
    // Get vessel stats
    const totalVessels = await Vessel.countDocuments();
    const activeVessels = await Vessel.countDocuments({ status: { $in: ['berthed', 'loading', 'unloading'] } });
    
    // Get container stats
    const totalContainers = await Container.countDocuments();
    const yardContainers = await Container.countDocuments({ status: 'In Yard' });
    
    // Calculate yard density
    const yardCapacity = 5000; // Assumed capacity
    const yardDensity = Math.round((yardContainers / yardCapacity) * 100);
    
    // Get gate stats
    const gates = await Gate.find();
    const totalProcessedToday = gates.reduce((sum, gate) => sum + gate.processedToday, 0);
    
    // Get reefer stats
    const activeReefers = await Reefer.countDocuments({ powerStatus: 'Connected' });
    const reeferAlerts = await Reefer.countDocuments({ status: { $in: ['Warning', 'Critical'] } });
    
    // Get truck appointments today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const appointmentsToday = await Truck.countDocuments({
      appointmentDate: { $gte: today, $lt: tomorrow }
    });
    
    // Get revenue (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentBillings = await Billing.find({
      status: 'Paid',
      paidDate: { $gte: thirtyDaysAgo }
    });
    const revenue = recentBillings.reduce((sum, bill) => sum + bill.total, 0);
    
    // Get pending customs clearances
    const pendingCustoms = await require('../models/Customs').countDocuments({ status: 'Pending' });

    res.json({
      success: true,
      data: {
        vessels: {
          total: totalVessels,
          active: activeVessels
        },
        containers: {
          total: totalContainers,
          inYard: yardContainers
        },
        yardDensity: {
          percentage: yardDensity,
          capacity: yardCapacity,
          occupied: yardContainers
        },
        gates: {
          total: gates.length,
          processedToday: totalProcessedToday
        },
        reefers: {
          active: activeReefers,
          alerts: reeferAlerts
        },
        trucks: {
          appointmentsToday
        },
        revenue: {
          last30Days: revenue
        },
        customs: {
          pending: pendingCustoms
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.getRecentActivity = async (req, res) => {
  try {
    // Get recent vessels (last 5)
    const recentVessels = await Vessel.find().sort('-createdAt').limit(5).select('vesselName status createdAt');
    
    // Get recent containers (last 5)
    const recentContainers = await Container.find().sort('-createdAt').limit(5).select('containerId status createdAt');
    
    // Get recent gate transactions
    const gates = await Gate.find();
    const allTransactions = [];
    gates.forEach(gate => {
      gate.transactions.forEach(t => {
        allTransactions.push({
          ...t.toObject(),
          gateNumber: gate.gateNumber
        });
      });
    });
    const recentTransactions = allTransactions.sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    res.json({
      success: true,
      data: {
        vessels: recentVessels,
        containers: recentContainers,
        transactions: recentTransactions
      }
    });
  } catch (error) {
    console.error('Recent activity error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.getChartData = async (req, res) => {
  try {
    const { type, days = 7 } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    let data = [];

    switch (type) {
      case 'revenue':
        const billings = await Billing.find({
          status: 'Paid',
          paidDate: { $gte: startDate }
        }).sort('paidDate');
        
        data = billings.map(b => ({
          date: b.paidDate.toISOString().split('T')[0],
          value: b.total
        }));
        break;

      case 'containers':
        const containers = await Container.find({
          createdAt: { $gte: startDate }
        }).sort('createdAt');
        
        data = containers.reduce((acc, c) => {
          const date = c.createdAt.toISOString().split('T')[0];
          const existing = acc.find(d => d.date === date);
          if (existing) {
            existing.value++;
          } else {
            acc.push({ date, value: 1 });
          }
          return acc;
        }, []);
        break;

      case 'gates':
        // Return daily gate statistics
        const gates = await Gate.find();
        data = gates.map(g => ({
          gate: g.gateNumber,
          value: g.processedToday
        }));
        break;
    }

    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Chart data error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
