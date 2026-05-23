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
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getContainers)
  .post(authorize('admin', 'operator'), createContainer);

router.get('/block/:block', getContainersByBlock);
router.get('/search/:query', searchContainers);

router.route('/:id')
  .get(getContainer)
  .put(authorize('admin', 'operator'), updateContainer)
  .delete(authorize('admin'), deleteContainer);

module.exports = router;
