const express = require('express');
const router = express.Router();
const {
  getBerths,
  getBerthUtilization,
  assignBerth,
  releaseBerth
} = require('../controllers/berthController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', getBerths);
router.get('/utilization', getBerthUtilization);
router.post('/assign', authorize('admin', 'berth', 'operator'), assignBerth);
router.post('/release', authorize('admin', 'berth', 'operator'), releaseBerth);

module.exports = router;
