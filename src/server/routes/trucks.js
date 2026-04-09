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

router.use(protect);

router.route('/')
  .get(getTrucks)
  .post(createTruck);

router.route('/:id')
  .get(getTruck)
  .put(updateTruck)
  .delete(deleteTruck);

router.patch('/:id/checkin', checkIn);
router.patch('/:id/checkout', checkOut);

module.exports = router;
