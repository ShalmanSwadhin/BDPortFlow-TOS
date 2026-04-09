const express = require('express');
const router = express.Router();
const {
  getGates,
  getGate,
  createGate,
  updateGate,
  deleteGate,
  processTransaction,
  getTransactions
} = require('../controllers/gateController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getGates)
  .post(authorize('admin'), createGate);

router.route('/:id')
  .get(getGate)
  .put(authorize('admin', 'operator'), updateGate)
  .delete(authorize('admin'), deleteGate);

router.post('/:id/transaction', authorize('admin', 'operator'), processTransaction);
router.get('/:id/transactions', getTransactions);

module.exports = router;
