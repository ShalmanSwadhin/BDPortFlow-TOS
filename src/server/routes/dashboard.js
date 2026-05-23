const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getRecentActivity,
  getChartData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getRecentActivity);
router.get('/charts', getChartData);

module.exports = router;
