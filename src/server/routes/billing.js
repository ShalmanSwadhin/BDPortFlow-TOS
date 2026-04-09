const express = require('express');
const router = express.Router();
const {
  getBillings,
  getBilling,
  createBilling,
  updateBilling,
  deleteBilling,
  markAsPaid,
  getRevenue
} = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/revenue', authorize('admin', 'finance'), getRevenue);

router.route('/')
  .get(getBillings)
  .post(authorize('admin', 'finance'), createBilling);

router.route('/:id')
  .get(getBilling)
  .put(authorize('admin', 'finance'), updateBilling)
  .delete(authorize('admin'), deleteBilling);

router.patch('/:id/paid', authorize('admin', 'finance'), markAsPaid);

module.exports = router;
