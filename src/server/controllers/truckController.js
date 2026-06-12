const Truck = require('../models/Truck');
const { createAuditLog } = require('../utils/auditLogger');
const {
  parseDateParam,
  normalizeAppointmentDate,
  formatDateKey,
  todayDateKey,
} = require('../utils/dateUtils');

async function findDuplicateBooking({ truckNumber, appointmentDate, appointmentTime, excludeId = null }) {
  const dateKey = formatDateKey(appointmentDate);
  const range = parseDateParam(dateKey);
  if (!range) return null;

  const query = {
    truckNumber: truckNumber.toUpperCase().trim(),
    appointmentDate: { $gte: range.start, $lt: range.end },
    appointmentTime: appointmentTime.trim(),
    status: { $nin: ['Cancelled'] },
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  return Truck.findOne(query);
}

exports.getTrucks = async (req, res) => {
  try {
    const { status, includeCancelled } = req.query;
    const dateParam = req.query.date || req.query.appointmentDate || todayDateKey();
    const range = parseDateParam(dateParam);

    if (!range) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date. Use YYYY-MM-DD format.',
      });
    }

    const query = {
      appointmentDate: { $gte: range.start, $lt: range.end },
    };

    if (req.user.role === 'truck') {
      query.user = req.user._id;
    }

    if (status) {
      query.status = status;
    } else if (includeCancelled !== 'true') {
      query.status = { $ne: 'Cancelled' };
    }

    const trucks = await Truck.find(query)
      .sort('appointmentTime')
      .populate('user', 'name email');

    res.json({
      success: true,
      count: trucks.length,
      date: range.dateKey,
      data: trucks,
    });
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
    const { truckNumber, driverName, driverContact, containerId, appointmentDate, appointmentTime, purpose } = req.body;
    if (!truckNumber || !driverName || !driverContact || !containerId || !appointmentDate || !appointmentTime || !purpose) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: truckNumber, driverName, driverContact, containerId, appointmentDate, appointmentTime, purpose',
      });
    }

    let appointmentDateObj;
    try {
      appointmentDateObj = normalizeAppointmentDate(appointmentDate);
    } catch {
      return res.status(400).json({ success: false, message: 'Invalid appointmentDate. Use YYYY-MM-DD format.' });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: 'User not authenticated' });
    }

    const duplicate = await findDuplicateBooking({
      truckNumber,
      appointmentDate: appointmentDateObj,
      appointmentTime,
    });
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'A booking already exists for this truck, date, and time slot',
      });
    }

    const truckData = {
      truckNumber: truckNumber.toUpperCase().trim(),
      driverName: driverName.trim(),
      driverContact: driverContact.trim(),
      containerId: containerId.toUpperCase().trim(),
      appointmentDate: appointmentDateObj,
      appointmentTime: appointmentTime.trim(),
      purpose,
      status: req.body.status || 'Scheduled',
      user: req.user._id,
    };

    const truck = await Truck.create(truckData);

    await createAuditLog({
      user: req.user,
      moduleName: 'Truck Booking',
      actionType: 'create',
      recordId: truck._id,
      updatedValues: truck.toObject(),
      description: `Booking created for truck ${truck.truckNumber} on ${formatDateKey(truck.appointmentDate)} ${appointmentTime}`,
    });

    const { sendNotification } = require('../utils/notificationService');
    await sendNotification({
      module: 'Truck Booking',
      action: 'Booking Created',
      message: `Truck booking confirmed: ${truck.truckNumber} for ${truck.containerId} on ${formatDateKey(truck.appointmentDate)} ${appointmentTime}`,
      recordId: truck._id,
      createdBy: req.user._id,
      targetUserId: truck.user,
      dedupeKey: `truck:create:${truck._id}`,
    });

    res.status(201).json({ success: true, message: 'Truck appointment booked successfully', data: truck });
  } catch (error) {
    console.error('Error creating truck:', error.message);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create truck appointment',
      details: error.errors
        ? Object.keys(error.errors).map((key) => `${key}: ${error.errors[key].message}`)
        : undefined,
    });
  }
};

exports.updateTruck = async (req, res) => {
  try {
    let truck = await Truck.findById(req.params.id);
    if (!truck) {
      return res.status(404).json({ success: false, message: 'Truck booking not found' });
    }

    if (req.user.role === 'truck' && truck.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this booking' });
    }

    const previousValues = truck.toObject();
    const updateData = { ...req.body };

    if (updateData.appointmentDate) {
      try {
        updateData.appointmentDate = normalizeAppointmentDate(updateData.appointmentDate);
      } catch {
        return res.status(400).json({ success: false, message: 'Invalid appointmentDate. Use YYYY-MM-DD format.' });
      }
    }
    if (updateData.appointmentTime) {
      updateData.appointmentTime = updateData.appointmentTime.trim();
    }
    if (updateData.truckNumber) {
      updateData.truckNumber = updateData.truckNumber.toUpperCase().trim();
    }

    const truckNumber = updateData.truckNumber || truck.truckNumber;
    const appointmentDate = updateData.appointmentDate || truck.appointmentDate;
    const appointmentTime = updateData.appointmentTime || truck.appointmentTime;

    if (updateData.appointmentDate || updateData.appointmentTime) {
      const duplicate = await findDuplicateBooking({
        truckNumber,
        appointmentDate,
        appointmentTime,
        excludeId: truck._id,
      });
      if (duplicate) {
        return res.status(400).json({
          success: false,
          message: 'A booking already exists for this truck, date, and time slot',
        });
      }
    }

    truck = await Truck.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    const isReschedule = updateData.appointmentDate || updateData.appointmentTime;
    await createAuditLog({
      user: req.user,
      moduleName: 'Truck Booking',
      actionType: isReschedule ? 'update' : 'update',
      recordId: truck._id,
      previousValues,
      updatedValues: truck.toObject(),
      description: isReschedule
        ? `Booking rescheduled for truck ${truck.truckNumber} to ${formatDateKey(truck.appointmentDate)} ${truck.appointmentTime}`
        : `Booking updated for truck ${truck.truckNumber}`,
    });

    const { sendNotification } = require('../utils/notificationService');
    await sendNotification({
      module: 'Truck Booking',
      action: 'Booking Updated',
      message: isReschedule
        ? `Truck booking rescheduled: ${truck.truckNumber} moved to ${formatDateKey(truck.appointmentDate)} ${truck.appointmentTime}`
        : `Truck booking updated: ${truck.truckNumber} — status ${truck.status}`,
      recordId: truck._id,
      createdBy: req.user._id,
      targetUserId: truck.user,
      dedupeKey: `truck:update:${truck._id}:${Date.now()}`,
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

    if (req.user.role === 'truck' && truck.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    const previousValues = truck.toObject();
    truck.status = 'Cancelled';
    await truck.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Truck Booking',
      actionType: 'cancel',
      recordId: truck._id,
      previousValues,
      updatedValues: { status: 'Cancelled' },
      description: `Booking cancelled for truck ${truck.truckNumber}`,
    });

    const { sendNotification } = require('../utils/notificationService');
    await sendNotification({
      module: 'Truck Booking',
      action: 'Booking Cancelled',
      message: `Truck booking cancelled: ${truck.truckNumber} for ${truck.containerId}`,
      recordId: truck._id,
      createdBy: req.user._id,
      targetUserId: truck.user,
      dedupeKey: `truck:cancel:${truck._id}`,
    });

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
