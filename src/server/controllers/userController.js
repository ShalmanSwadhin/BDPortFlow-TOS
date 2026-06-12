const User = require('../models/User');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Create user
// @route   POST /api/users
// @access  Private/Admin
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check if user exists
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password,
      role: role || 'operator',
      status: status || 'active'
    });

    await createAuditLog({
      user: req.user,
      moduleName: 'User Management',
      actionType: 'create',
      recordId: user._id,
      updatedValues: { name: user.name, email: user.email, role: user.role, status: user.status }
    });

    await sendNotification({
      module: 'User Management',
      action: 'Create User',
      message: `New user created: ${user.name} (${user.role})`,
      recordId: user._id,
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousValues = { name: user.name, email: user.email, role: user.role, status: user.status };

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (status) user.status = status;

    await user.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'User Management',
      actionType: 'update',
      recordId: user._id,
      previousValues,
      updatedValues: { name: user.name, email: user.email, role: user.role, status: user.status }
    });

    await sendNotification({
      module: 'User Management',
      action: 'Update User',
      message: `User updated: ${user.name}`,
      recordId: user._id,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: 'User updated successfully',
      data: user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousValues = { name: user.name, email: user.email, role: user.role, status: user.status };

    await user.deleteOne();

    await createAuditLog({
      user: req.user,
      moduleName: 'User Management',
      actionType: 'delete',
      recordId: req.params.id,
      previousValues,
      description: `User deleted: ${previousValues.name}`
    });

    await sendNotification({
      module: 'User Management',
      action: 'Delete User',
      message: `User deleted: ${previousValues.name}`,
      recordId: req.params.id,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};

// @desc    Toggle user status
// @route   PATCH /api/users/:id/status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const previousStatus = user.status;
    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    await createAuditLog({
      user: req.user,
      moduleName: 'User Management',
      actionType: 'status_change',
      recordId: user._id,
      previousValues: { status: previousStatus },
      updatedValues: { status: user.status }
    });

    await sendNotification({
      module: 'User Management',
      action: 'Status Change',
      message: `User ${user.name} ${user.status === 'active' ? 'activated' : 'deactivated'}`,
      recordId: user._id,
      createdBy: req.user._id
    });

    res.json({
      success: true,
      message: `User ${user.status === 'active' ? 'activated' : 'deactivated'} successfully`,
      data: user
    });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Server error'
    });
  }
};
