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
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getVessels)
  .post(authorize('admin', 'berth', 'operator'), createVessel);

router.route('/:id')
  .get(getVessel)
  .put(authorize('admin', 'berth', 'operator'), updateVessel)
  .delete(authorize('admin'), deleteVessel);

router.patch('/:id/progress', authorize('admin', 'berth', 'operator'), updateProgress);

module.exports = router;
