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
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Customs Clearance', 'view'), getCustomsClearances)
  .post(checkPermission('Customs Clearance', 'create'), createCustomsClearance);

router.route('/:id')
  .get(checkPermission('Customs Clearance', 'view'), getCustomsClearance)
  .put(checkPermission('Customs Clearance', 'edit'), updateCustomsClearance)
  .delete(checkPermission('Customs Clearance', 'delete'), deleteCustomsClearance);

router.patch('/:id/approve', checkPermission('Customs Clearance', 'edit'), approveClearance);
router.patch('/:id/reject', checkPermission('Customs Clearance', 'edit'), rejectClearance);
router.patch('/:id/hold', checkPermission('Customs Clearance', 'edit'), holdClearance);

module.exports = router;
