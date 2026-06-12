const express = require('express');
const router = express.Router();
const {
  getReefers,
  getReefer,
  createReefer,
  updateReefer,
  deleteReefer,
  addAlert,
  adjustTemperature
} = require('../controllers/reeferController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Reefer Monitor', 'view'), getReefers)
  .post(checkPermission('Reefer Monitor', 'create'), createReefer);

router.route('/:id')
  .get(checkPermission('Reefer Monitor', 'view'), getReefer)
  .put(checkPermission('Reefer Monitor', 'edit'), updateReefer)
  .delete(checkPermission('Reefer Monitor', 'delete'), deleteReefer);

router.post('/:id/alert', checkPermission('Reefer Monitor', 'edit'), addAlert);
router.patch('/:id/temperature', checkPermission('Reefer Monitor', 'edit'), adjustTemperature);

module.exports = router;
