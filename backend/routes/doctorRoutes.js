
const express = require('express');
const {
  getDoctors,
  getDoctor,
  updateDoctorProfile,
  updateAvailability
} = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getDoctors);

router.route('/:id')
  .get(getDoctor);

router.route('/profile')
  .put(protect, authorize('doctor'), updateDoctorProfile);

router.route('/availability')
  .put(protect, authorize('doctor'), updateAvailability);

module.exports = router;
