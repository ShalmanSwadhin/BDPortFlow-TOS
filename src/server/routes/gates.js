const express = require('express');
const router = express.Router();
const {
  getGates,
  getGate,
  createGate,
  updateGate,
  deleteGate,
  processTransaction,
  getTransactions,
  approveEntry,
  holdForInspection,
  getAllTransactions
} = require('../controllers/gateController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.get('/transactions/all', checkPermission('Gate Operations', 'view'), getAllTransactions);

router.route('/')
  .get(checkPermission('Gate Operations', 'view'), getGates)
  .post(checkPermission('Gate Operations', 'create'), createGate);

router.route('/:id')
  .get(checkPermission('Gate Operations', 'view'), getGate)
  .put(checkPermission('Gate Operations', 'edit'), updateGate)
  .delete(checkPermission('Gate Operations', 'delete'), deleteGate);

router.post('/:id/transaction', checkPermission('Gate Operations', 'create'), processTransaction);
router.post('/:id/approve', checkPermission('Gate Operations', 'edit'), approveEntry);
router.post('/:id/hold', checkPermission('Gate Operations', 'edit'), holdForInspection);
router.get('/:id/transactions', checkPermission('Gate Operations', 'view'), getTransactions);

module.exports = router;
