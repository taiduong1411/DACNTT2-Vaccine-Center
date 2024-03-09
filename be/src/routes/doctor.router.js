const express = require('express');
const router = express.Router();
const DoctorController = require('../controllers/doctor.controller');
const userRole = require('../middlewares/userAuth');
const doctorRole = require('../middlewares/doctorAuth');
router.post('/booking', userRole, DoctorController.postBooking);
router.post('/updateBooking/:id', doctorRole, DoctorController.postUpdateBooking);

router.get('/data-booking', doctorRole, DoctorController.getDataBooking);
router.get('/getDataBookingById/:id', doctorRole, DoctorController.getDataBookingById);
router.get('/confirm-booking/:id', doctorRole, DoctorController.getConfirmBooking);
router.get('/search-booking/:key', doctorRole, DoctorController.getSearchBooking);
module.exports = router;