const Container = require('../models/Container');

// @desc    Get all containers
// @route   GET /api/containers
// @access  Private
exports.getContainers = async (req, res) => {
  try {
    const { status, location, vesselName } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (location) query['location.block'] = location;
    if (vesselName) query.vesselName = vesselName;

    const containers = await Container.find(query).sort('-createdAt');

    res.json({
      success: true,
      count: containers.length,
      data: containers
    });
  } catch (error) {
    console.error('Get containers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single container
// @route   GET /api/containers/:id
// @access  Private
exports.getContainer = async (req, res) => {
  try {
    const container = await Container.findOne({ 
      $or: [
        { _id: req.params.id },
        { containerId: req.params.id.toUpperCase() }
      ]
    }).populate('vessel', 'vesselName');

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    res.json({
      success: true,
      data: container
    });
  } catch (error) {
    console.error('Get container error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create container
// @route   POST /api/containers
// @access  Private
exports.createContainer = async (req, res) => {
  try {
    const container = await Container.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Container created successfully',
      data: container
    });
  } catch (error) {
    console.error('Create container error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Container with this ID already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update container
// @route   PUT /api/containers/:id
// @access  Private
exports.updateContainer = async (req, res) => {
  try {
    let container = await Container.findOne({
      $or: [
        { _id: req.params.id },
        { containerId: req.params.id.toUpperCase() }
      ]
    });

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    container = await Container.findByIdAndUpdate(container._id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      message: 'Container updated successfully',
      data: container
    });
  } catch (error) {
    console.error('Update container error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete container
// @route   DELETE /api/containers/:id
// @access  Private/Admin
exports.deleteContainer = async (req, res) => {
  try {
    const container = await Container.findOne({
      $or: [
        { _id: req.params.id },
        { containerId: req.params.id.toUpperCase() }
      ]
    });

    if (!container) {
      return res.status(404).json({
        success: false,
        message: 'Container not found'
      });
    }

    await container.deleteOne();

    res.json({
      success: true,
      message: 'Container deleted successfully'
    });
  } catch (error) {
    console.error('Delete container error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get containers by block
// @route   GET /api/containers/block/:block
// @access  Private
exports.getContainersByBlock = async (req, res) => {
  try {
    const containers = await Container.find({ 
      'location.block': req.params.block 
    });

    res.json({
      success: true,
      count: containers.length,
      data: containers
    });
  } catch (error) {
    console.error('Get containers by block error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Search containers
// @route   GET /api/containers/search/:query
// @access  Private
exports.searchContainers = async (req, res) => {
  try {
    const query = req.params.query;
    
    const containers = await Container.find({
      $or: [
        { containerId: { $regex: query, $options: 'i' } },
        { vesselName: { $regex: query, $options: 'i' } },
        { consignee: { $regex: query, $options: 'i' } },
        { destination: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);

    res.json({
      success: true,
      count: containers.length,
      data: containers
    });
  } catch (error) {
    console.error('Search containers error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
