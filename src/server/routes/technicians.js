const express = require('express');
const router = express.Router();
const { getRequests, createRequest, updateRequest } = require('../controllers/technicianController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);
router.get('/', checkPermission('Reefer Monitor', 'view'), getRequests);
router.post('/', checkPermission('Reefer Monitor', 'edit'), createRequest);
router.put('/:id', checkPermission('Reefer Monitor', 'edit'), updateRequest);

module.exports = router;
