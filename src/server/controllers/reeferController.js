const Reefer = require('../models/Reefer');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

exports.getReefers = async (req, res) => {
  try {
    const { status, powerStatus } = req.query;
    let query = {};
    if (status) query.status = status;
    if (powerStatus) query.powerStatus = powerStatus;

    const reefers = await Reefer.find(query).sort('-createdAt');
    res.json({ success: true, count: reefers.length, data: reefers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    res.json({ success: true, data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createReefer = async (req, res) => {
  try {
    const reefer = await Reefer.create(req.body);
    res.status(201).json({ success: true, message: 'Reefer created successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }

    const previousValues = {
      currentTemp: reefer.currentTemp,
      setPoint: reefer.setPoint,
      status: reefer.status
    };

    if (req.body.currentTemp !== undefined || req.body.setPoint !== undefined) {
      reefer.history.push({
        temperature: req.body.currentTemp ?? reefer.currentTemp,
        timestamp: new Date()
      });
    }

    Object.assign(reefer, req.body);
    await reefer.save();

    if (req.body.currentTemp !== undefined || req.body.setPoint !== undefined) {
      await createAuditLog({
        user: req.user,
        moduleName: 'Reefer Operations',
        actionType: 'update',
        recordId: reefer._id,
        previousValues,
        updatedValues: { currentTemp: reefer.currentTemp, setPoint: reefer.setPoint }
      });

      await sendNotification({
        module: 'Reefer Operations',
        action: 'Temperature Adjustment',
        message: `Temperature adjusted for reefer ${reefer.containerId}: ${reefer.currentTemp}°C (set: ${reefer.setPoint}°C)`,
        recordId: reefer._id,
        createdBy: req.user._id
      });
    }

    res.json({ success: true, message: 'Reefer updated successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteReefer = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    await reefer.deleteOne();
    res.json({ success: true, message: 'Reefer deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.addAlert = async (req, res) => {
  try {
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }
    reefer.alerts.push(req.body);
    await reefer.save();
    res.json({ success: true, message: 'Alert added successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.adjustTemperature = async (req, res) => {
  try {
    const { setPoint, currentTemp } = req.body;
    const reefer = await Reefer.findById(req.params.id);
    if (!reefer) {
      return res.status(404).json({ success: false, message: 'Reefer not found' });
    }

    const previousValues = { currentTemp: reefer.currentTemp, setPoint: reefer.setPoint };

    if (setPoint !== undefined) reefer.setPoint = setPoint;
    if (currentTemp !== undefined) reefer.currentTemp = currentTemp;

    reefer.history.push({ temperature: reefer.currentTemp, timestamp: new Date() });
    await reefer.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Reefer Operations',
      actionType: 'update',
      recordId: reefer._id,
      previousValues,
      updatedValues: { currentTemp: reefer.currentTemp, setPoint: reefer.setPoint }
    });

    await sendNotification({
      module: 'Reefer Operations',
      action: 'Temperature Adjustment',
      message: `Temperature adjusted for ${reefer.containerId}`,
      recordId: reefer._id,
      createdBy: req.user._id
    });

    res.json({ success: true, message: 'Temperature updated successfully', data: reefer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
