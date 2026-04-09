const express = require('express');
const router = express.Router();
const {
  getReefers,
  getReefer,
  createReefer,
  updateReefer,
  deleteReefer,
  addAlert
} = require('../controllers/reeferController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getReefers)
  .post(authorize('admin', 'operator'), createReefer);

router.route('/:id')
  .get(getReefer)
  .put(authorize('admin', 'operator'), updateReefer)
  .delete(authorize('admin'), deleteReefer);

router.post('/:id/alert', authorize('admin', 'operator'), addAlert);

module.exports = router;
