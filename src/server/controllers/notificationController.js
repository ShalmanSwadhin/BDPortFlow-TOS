const Notification = require('../models/Notification');

exports.getNotifications = async (req, res) => {
  try {
    const { all } = req.query;
    let query;

    if (req.user.role === 'admin' && all === 'true') {
      query = {};
    } else {
      query = {
        $or: [
          { targetRoles: req.user.role },
          { targetUserId: req.user._id },
          { createdBy: req.user._id }
        ]
      };
    }

    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .limit(200)
      .populate('createdBy', 'name email');

    const data = notifications.map(n => ({
      ...n.toObject(),
      read: n.readBy.some(r => r.userId.toString() === req.user._id.toString())
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    const alreadyRead = notification.readBy.some(r => r.userId.toString() === req.user._id.toString());
    if (!alreadyRead) {
      notification.readBy.push({ userId: req.user._id, readAt: new Date() });
      await notification.save();
    }

    res.json({ success: true, message: 'Notification marked as read', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.markAllAsRead = async (req, res) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { targetRoles: req.user.role },
        { targetUserId: req.user._id }
      ],
      'readBy.userId': { $ne: req.user._id }
    });

    await Promise.all(notifications.map(async (n) => {
      n.readBy.push({ userId: req.user._id, readAt: new Date() });
      await n.save();
    }));

    res.json({ success: true, message: 'All notifications marked as read', count: notifications.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    await notification.deleteOne();
    res.json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.createNotification = async (req, res) => {
  try {
    const { sendNotification } = require('../utils/notificationService');
    const { module, action, message, recordId, type, targetUserId } = req.body;

    if (!module || !action || !message) {
      return res.status(400).json({ success: false, message: 'module, action, and message are required' });
    }

    const notification = await sendNotification({
      module,
      action,
      message,
      recordId,
      type,
      targetUserId,
      createdBy: req.user._id
    });

    res.status(201).json({ success: true, message: 'Notification created', data: notification });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
