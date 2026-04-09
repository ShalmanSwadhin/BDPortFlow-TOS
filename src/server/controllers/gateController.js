const Gate = require('../models/Gate');

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
    const gate = await Gate.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!gate) {
      return res.status(404).json({ success: false, message: 'Gate not found' });
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
