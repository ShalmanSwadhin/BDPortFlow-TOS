const Truck = require('../models/Truck');

exports.getTrucks = async (req, res) => {
  try {
    const { status, appointmentDate } = req.query;
    let query = {};
    
    // If user is a truck driver, only show their bookings
    if (req.user.role === 'truck') {
      query.user = req.user._id;
    }
    
    if (status) query.status = status;
    if (appointmentDate) {
      const start = new Date(appointmentDate);
      const end = new Date(appointmentDate);
      end.setDate(end.getDate() + 1);
      query.appointmentDate = { $gte: start, $lt: end };
    }

    const trucks = await Truck.find(query).sort('-appointmentDate').populate('user', 'name email');
    res.json({ success: true, count: trucks.length, data: trucks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id).populate('user', 'name email');
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }
    res.json({ success: true, data: truck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createTruck = async (req, res) => {
  try {
    // Validate required fields
    const { truckNumber, driverName, driverContact, containerId, appointmentDate, appointmentTime, purpose } = req.body;
    if (!truckNumber || !driverName || !driverContact || !containerId || !appointmentDate || !appointmentTime || !purpose) {
      console.error('Missing required fields:', { truckNumber, driverName, driverContact, containerId, appointmentDate, appointmentTime, purpose });
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields: truckNumber, driverName, driverContact, containerId, appointmentDate, appointmentTime, purpose' 
      });
    }

    // Ensure appointmentDate is a valid Date
    let appointmentDateObj = appointmentDate;
    if (typeof appointmentDate === 'string') {
      appointmentDateObj = new Date(appointmentDate);
    }

    // Validate user is authenticated
    if (!req.user || !req.user._id) {
      console.error('User not authenticated:', req.user);
      return res.status(401).json({ 
        success: false, 
        message: 'User not authenticated' 
      });
    }

    const truckData = {
      truckNumber: truckNumber.toUpperCase().trim(),
      driverName: driverName.trim(),
      driverContact: driverContact.trim(),
      containerId: containerId.toUpperCase().trim(),
      appointmentDate: appointmentDateObj,
      appointmentTime: appointmentTime.trim(),
      purpose: purpose,
      status: req.body.status || 'Scheduled',
      user: req.user._id
    };

    console.log('Creating truck with data:', truckData);
    const truck = await Truck.create(truckData);
    console.log('Truck created successfully:', truck._id);
    res.status(201).json({ success: true, message: 'Truck appointment booked successfully', data: truck });
  } catch (error) {
    console.error('Error creating truck:', {
      message: error.message,
      name: error.name,
      code: error.code,
      errors: error.errors,
      stack: error.stack
    });
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create truck appointment',
      details: error.errors ? Object.keys(error.errors).map(key => `${key}: ${error.errors[key].message}`) : undefined
    });
  }
};

exports.updateTruck = async (req, res) => {
  try {
    let truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }

    // Truck drivers can only update their own bookings
    if (req.user.role === 'truck' && truck.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    truck = await Truck.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, message: 'Truck appointment updated successfully', data: truck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }

    // Truck drivers can only delete their own bookings
    if (req.user.role === 'truck' && truck.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    await truck.deleteOne();
    res.json({ success: true, message: 'Truck appointment cancelled successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkIn = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }

    truck.status = 'Arrived';
    truck.checkInTime = new Date();
    await truck.save();

    res.json({ success: true, message: 'Truck checked in successfully', data: truck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.checkOut = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }

    truck.status = 'Completed';
    truck.checkOutTime = new Date();
    await truck.save();

    res.json({ success: true, message: 'Truck checked out successfully', data: truck });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
