const Gate = require('../models/Gate');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

exports.getGates = async (req, res) => {
  try {
    const gates = await Gate.find().sort('gateNumber');
    res.json({ success: true, count: gates.length, data: gates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }
    res.json({ success: true, data: gate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createGate = async (req, res) => {
  try {
    const gate = await Gate.create(req.body);
    res.status(201).json({ success: true, message: 'Gate created successfully', data: gate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }

    const previousValues = { status: gate.status };
    Object.assign(gate, req.body);
    await gate.save();

    if (req.body.status && req.body.status !== previousValues.status) {
      await createAuditLog({
        user: req.user,
        moduleName: 'Gate Operations',
        actionType: 'update',
        recordId: gate._id,
        previousValues,
        updatedValues: { status: gate.status },
        description: `Gate ${gate.gateNumber} status changed to ${gate.status}`
      });

      await sendNotification({
        module: 'Gate Operations',
        action: 'Gate Status Change',
        message: `Gate ${gate.gateNumber} status changed to ${gate.status}`,
        recordId: gate._id,
        createdBy: req.user._id,
        dedupeKey: `gate:status:${gate._id}:${gate.status}`
      });
    }

    res.json({ success: true, message: 'Gate updated successfully', data: gate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteGate = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }
    await gate.deleteOne();
    res.json({ success: true, message: 'Gate deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.processTransaction = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }

    const transaction = {
      ...req.body,
      processedBy: req.user._id,
      gatePass: `GP-${Date.now()}`
    };

    gate.transactions.push(transaction);
    gate.processedToday += 1;
    await gate.save();

    res.json({ success: true, message: 'Transaction processed successfully', data: { gate, gatePass: transaction.gatePass } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveEntry = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }

    const { truckNumber, containerId, driverName, driverContact, licensePlate, verificationNotes, weight, purpose } = req.body;

    if (!truckNumber || !containerId || !driverName) {
      return res.status(400).json({ success: false, message: 'truckNumber, containerId, and driverName are required' });
    }

    const transaction = {
      truckNumber,
      containerId: containerId.toUpperCase(),
      driverName,
      driverContact,
      licensePlate,
      verificationNotes,
      weight,
      purpose: purpose || 'Delivery',
      type: 'Entry',
      approvalStatus: 'Approved',
      processedBy: req.user._id,
      gatePass: `GP-${Date.now()}`
    };

    gate.transactions.push(transaction);
    gate.processedToday += 1;
    gate.currentVehicle = truckNumber;
    await gate.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Gate Operations',
      actionType: 'approve',
      recordId: gate._id,
      updatedValues: transaction,
      description: `Entry approved for ${truckNumber}`
    });

    await sendNotification({
      module: 'Gate Operations',
      action: 'Approve Entry',
      message: `Gate entry approved: ${truckNumber} / ${containerId}`,
      recordId: gate._id,
      createdBy: req.user._id
    });

    res.json({ success: true, message: 'Entry approved successfully', data: { gate, transaction } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.holdForInspection = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id);
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }

    const { truckNumber, containerId, driverName, driverContact, licensePlate, verificationNotes, purpose } = req.body;

    const transaction = {
      truckNumber,
      containerId: containerId?.toUpperCase(),
      driverName,
      driverContact,
      licensePlate,
      verificationNotes,
      purpose: purpose || 'Delivery',
      type: 'Entry',
      approvalStatus: 'Hold For Inspection',
      processedBy: req.user._id,
      gatePass: null
    };

    gate.transactions.push(transaction);
    await gate.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'Gate Operations',
      actionType: 'hold',
      recordId: gate._id,
      updatedValues: transaction,
      description: `Hold for inspection: ${truckNumber}`
    });

    await sendNotification({
      module: 'Gate Operations',
      action: 'Hold For Inspection',
      message: `Vehicle held for inspection: ${truckNumber}`,
      recordId: gate._id,
      createdBy: req.user._id
    });

    res.json({ success: true, message: 'Vehicle held for inspection', data: { gate, transaction } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const gate = await Gate.findById(req.params.id).populate('transactions.processedBy', 'name');
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
    }
    res.json({ success: true, data: gate.transactions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const gates = await Gate.find();
    const transactions = gates.flatMap(g => {
      const txs = Array.isArray(g.transactions) ? g.transactions : [];
      return txs.map(t => {
        const txObj = typeof t.toObject === 'function' ? t.toObject() : { ...t };
        return { ...txObj, gateNumber: g.gateNumber, gateId: g._id };
      });
    }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    res.json({ success: true, count: transactions.length, data: transactions.slice(0, 50) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
