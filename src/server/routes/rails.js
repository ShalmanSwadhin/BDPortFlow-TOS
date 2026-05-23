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
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getRails)
  .post(authorize('admin', 'operator'), createRail);

router.route('/:id')
  .get(getRail)
  .put(authorize('admin', 'operator'), updateRail)
  .delete(authorize('admin'), deleteRail);

router.post('/:id/container', authorize('admin', 'operator'), addContainer);
router.delete('/:id/container/:containerId', authorize('admin', 'operator'), removeContainer);

module.exports = router;
