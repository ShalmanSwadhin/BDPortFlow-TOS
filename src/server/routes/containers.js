const express = require('express');
const router = express.Router();
const {
  getContainers,
  getContainer,
  createContainer,
  updateContainer,
  deleteContainer,
  getContainersByBlock,
  searchContainers
} = require('../controllers/containerController');
const { executeStackMove } = require('../controllers/stackController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Container Stack', 'view'), getContainers)
  .post(checkPermission('Container Stack', 'create'), createContainer);

router.get('/block/:block', checkPermission('Container Stack', 'view'), getContainersByBlock);
router.get('/search/:query', checkPermission('Container Stack', 'view'), searchContainers);
router.post('/stack/move', checkPermission('Container Stack', 'edit'), executeStackMove);

router.route('/:id')
  .get(checkPermission('Container Stack', 'view'), getContainer)
  .put(checkPermission('Container Stack', 'edit'), updateContainer)
  .delete(checkPermission('Container Stack', 'delete'), deleteContainer);

module.exports = router;
