const express = require('express');
const router = express.Router();
const { getStowage, moveContainer, removeContainer } = require('../controllers/stowageController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);
router.get('/', checkPermission('Ship Stowage', 'view'), getStowage);
router.post('/move', checkPermission('Ship Stowage', 'edit'), moveContainer);
router.delete('/:id', checkPermission('Ship Stowage', 'delete'), removeContainer);

module.exports = router;
