const express = require('express');
const router = express.Router();
const {
  getTrucks,
  getTruck,
  createTruck,
  updateTruck,
  deleteTruck,
  checkIn,
  checkOut
} = require('../controllers/truckController');
const { protect } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permissions');

router.use(protect);

router.route('/')
  .get(checkPermission('Truck Booking', 'view'), getTrucks)
  .post(checkPermission('Truck Booking', 'create'), createTruck);

router.route('/:id')
  .get(checkPermission('Truck Booking', 'view'), getTruck)
  .put(checkPermission('Truck Booking', 'edit'), updateTruck)
  .delete(checkPermission('Truck Booking', 'delete'), deleteTruck);

router.patch('/:id/checkin', checkPermission('Truck Booking', 'edit'), checkIn);
router.patch('/:id/checkout', checkPermission('Truck Booking', 'edit'), checkOut);

module.exports = router;
