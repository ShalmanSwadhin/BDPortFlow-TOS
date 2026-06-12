const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentActivity,
  getChartData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.get('/stats', checkPermission('Dashboard', 'view'), getDashboardStats);
router.get('/activity', checkPermission('Dashboard', 'view'), getRecentActivity);
router.get('/charts', checkPermission('Dashboard', 'view'), getChartData);

module.exports = router;
