const express = require('express');
const router = express.Router();
const {
  getBillings,
  getBilling,
  createBilling,
  updateBilling,
  deleteBilling,
  markAsPaid,
  getRevenue,
  generatePDF,
  previewInvoice
} = require('../controllers/billingController');
const { protect, authorize } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.get('/revenue', checkPermission('Billing & Tariff', 'view'), getRevenue);

router.route('/')
  .get(checkPermission('Billing & Tariff', 'view'), getBillings)
  .post(checkPermission('Billing & Tariff', 'create'), createBilling);

router.route('/:id')
  .get(checkPermission('Billing & Tariff', 'view'), getBilling)
  .put(checkPermission('Billing & Tariff', 'edit'), updateBilling)
  .delete(checkPermission('Billing & Tariff', 'delete'), deleteBilling);

router.patch('/:id/paid', checkPermission('Billing & Tariff', 'edit'), markAsPaid);
router.get('/:id/pdf', checkPermission('Billing & Tariff', 'view'), generatePDF);
router.get('/:id/preview', checkPermission('Billing & Tariff', 'view'), previewInvoice);

module.exports = router;
