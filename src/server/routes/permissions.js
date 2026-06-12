const express = require('express');
const router = express.Router();
const {
  getPermissions,
  getRolePermissions,
  updateRolePermissions
} = require('../controllers/permissionController');
const { protect, authorize } = require('../middleware/auth');
const { getMyPermissions } = require('../middleware/permissions');

router.use(protect);
router.get('/me', getMyPermissions);
router.get('/', authorize('admin'), getPermissions);
router.get('/:role', authorize('admin'), getRolePermissions);
router.put('/:role', authorize('admin'), updateRolePermissions);

module.exports = router;
