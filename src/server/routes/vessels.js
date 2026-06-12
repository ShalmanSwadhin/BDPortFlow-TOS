const express = require('express');
const router = express.Router();
const {
  getVessels,
  getVessel,
  createVessel,
  updateVessel,
  deleteVessel,
  updateProgress
} = require('../controllers/vesselController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Berth Planning', 'view'), getVessels)
  .post(checkPermission('Berth Planning', 'create'), createVessel);

router.route('/:id')
  .get(checkPermission('Berth Planning', 'view'), getVessel)
  .put(checkPermission('Berth Planning', 'edit'), updateVessel)
  .delete(checkPermission('Berth Planning', 'delete'), deleteVessel);

router.patch('/:id/progress', checkPermission('Berth Planning', 'edit'), updateProgress);

module.exports = router;
