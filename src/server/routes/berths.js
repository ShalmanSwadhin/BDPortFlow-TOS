const express = require('express');
const router = express.Router();
const {
  getBerths,
  getBerthUtilization,
  assignBerth,
  releaseBerth
} = require('../controllers/berthController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.get('/', checkPermission('Berth Planning', 'view'), getBerths);
router.get('/utilization', checkPermission('Berth Planning', 'view'), getBerthUtilization);
router.post('/assign', checkPermission('Berth Planning', 'edit'), assignBerth);
router.post('/release', checkPermission('Berth Planning', 'edit'), releaseBerth);

module.exports = router;
