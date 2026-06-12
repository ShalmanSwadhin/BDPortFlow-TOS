const express = require('express');
const router = express.Router();
const {
  getRails,
  getRail,
  createRail,
  updateRail,
  deleteRail,
  addContainer,
  removeContainer
} = require('../controllers/railController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Rail Coordination', 'view'), getRails)
  .post(checkPermission('Rail Coordination', 'create'), createRail);

router.route('/:id')
  .get(checkPermission('Rail Coordination', 'view'), getRail)
  .put(checkPermission('Rail Coordination', 'edit'), updateRail)
  .delete(checkPermission('Rail Coordination', 'delete'), deleteRail);

router.post('/:id/container', checkPermission('Rail Coordination', 'edit'), addContainer);
router.delete('/:id/container/:containerId', checkPermission('Rail Coordination', 'edit'), removeContainer);

module.exports = router;
