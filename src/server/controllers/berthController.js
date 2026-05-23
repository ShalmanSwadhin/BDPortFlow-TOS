const Vessel = require('../models/Vessel');

exports.getBerths = async (req, res) => {
  try {
    // Get all berths with their current vessels
    const berths = ['Berth-1', 'Berth-2', 'Berth-3', 'Berth-4', 'Berth-5'];
    
    const berthStatus = await Promise.all(
      berths.map(async (berth) => {
        const vessel = await Vessel.findOne({ berthNumber: berth, status: { $ne: 'departed' } });
        return {
          berthNumber: berth,
          status: vessel ? 'occupied' : 'available',
          vessel: vessel || null
        };
      })
    );

    res.json({
      success: true,
      data: berthStatus
    });
  } catch (error) {
    console.error('Get berths error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.getBerthUtilization = async (req, res) => {
  try {
    const totalBerths = 5;
    const occupiedBerths = await Vessel.countDocuments({ 
      status: { $in: ['berthed', 'loading', 'unloading'] } 
    });
    
    const utilization = Math.round((occupiedBerths / totalBerths) * 100);

    res.json({
      success: true,
      data: {
        total: totalBerths,
        occupied: occupiedBerths,
        available: totalBerths - occupiedBerths,
        utilization
      }
    });
  } catch (error) {
    console.error('Get berth utilization error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.assignBerth = async (req, res) => {
  try {
    const { vesselId, berthNumber } = req.body;

    // Check if berth is available
    const existingVessel = await Vessel.findOne({ 
      berthNumber, 
      status: { $ne: 'departed' } 
    });

    if (existingVessel) {
      return res.status(400).json({
        success: false,
        message: 'Berth is already occupied'
      });
    }

    // Assign vessel to berth
    const vessel = await Vessel.findByIdAndUpdate(
      vesselId,
      { berthNumber, status: 'berthed' },
      { new: true, runValidators: true }
    );

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    res.json({
      success: true,
      message: 'Berth assigned successfully',
      data: vessel
    });
  } catch (error) {
    console.error('Assign berth error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

exports.releaseBerth = async (req, res) => {
  try {
    const { vesselId } = req.body;

    const vessel = await Vessel.findByIdAndUpdate(
      vesselId,
      { status: 'departed' },
      { new: true, runValidators: true }
    );

    if (!vessel) {
      return res.status(404).json({
        success: false,
        message: 'Vessel not found'
      });
    }

    res.json({
      success: true,
      message: 'Berth released successfully',
      data: vessel
    });
  } catch (error) {
    console.error('Release berth error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
