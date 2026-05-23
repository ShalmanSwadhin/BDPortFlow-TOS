const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Protect all routes and restrict to admin
router.use(protect);
router.use(authorize('admin'));

router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser);

router.patch('/:id/status', toggleUserStatus);

module.exports = router;
