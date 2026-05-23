const express = require('express');
const router = express.Router();
const {
  getCustomsClearances,
  getCustomsClearance,
  createCustomsClearance,
  updateCustomsClearance,
  deleteCustomsClearance,
  approveClearance,
  rejectClearance,
  holdClearance
} = require('../controllers/customsController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getCustomsClearances)
  .post(authorize('admin', 'customs', 'operator'), createCustomsClearance);

router.route('/:id')
  .get(getCustomsClearance)
  .put(authorize('admin', 'customs'), updateCustomsClearance)
  .delete(authorize('admin'), deleteCustomsClearance);

router.patch('/:id/approve', authorize('admin', 'customs'), approveClearance);
router.patch('/:id/reject', authorize('admin', 'customs'), rejectClearance);
router.patch('/:id/hold', authorize('admin', 'customs'), holdClearance);

module.exports = router;
