const express = require('express');
const router = express.Router();
const { getAuditLogs, getAuditLog } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);
router.get('/', authorize('admin', 'customs', 'finance'), checkPermission('Audit Logs', 'view'), getAuditLogs);
router.get('/:id', authorize('admin'), checkPermission('Audit Logs', 'view'), getAuditLog);

module.exports = router;
