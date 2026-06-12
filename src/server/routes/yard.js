const express = require('express');
const router = express.Router();
const { getBlocks, optimizePlacement, updateBlock } = require('../controllers/yardController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);
router.get('/', checkPermission('Yard Density', 'view'), getBlocks);
router.post('/optimize', checkPermission('Yard Density', 'edit'), optimizePlacement);
router.put('/:id', checkPermission('Yard Density', 'edit'), updateBlock);

module.exports = router;
