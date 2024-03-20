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
router.get('/confirm-success/:id', doctorRole, DoctorController.getConfirmSuccess);
router.get('/confirm-cancel/:id', doctorRole, DoctorController.getConfirmCancel);
// Vaccine
router.get('/all-vaccines', DoctorController.getAllVaccines);
router.post('/add-vaccine', doctorRole, DoctorController.addVaccine);
router.delete('/del-vaccine/:_id', doctorRole, DoctorController.delVaccine);
router.get('/get-vaccine/:_id', doctorRole, DoctorController.getVaccineById);
router.post('/update-vaccine/:_id', doctorRole, DoctorController.updateVaccineById);
router.get('/search-vaccine/:key', doctorRole, DoctorController.getSearchVaccine);
router.get('/vaccine/:pro_code', doctorRole, DoctorController.getVaccineByCode);
router.post('/update-detail/:context/:pro_code', doctorRole, DoctorController.updateDetailByCode);

// center
router.get('/all-centers', doctorRole, DoctorController.allCenters);
// blog
router.get('/all-blogs', doctorRole, DoctorController.getAllBlogs);
router.post('/add-blog', doctorRole, DoctorController.addBlog);
router.delete('/del-blog/:_id', doctorRole, DoctorController.delBlog);
router.get('/search-blog/:key', doctorRole, DoctorController.searchBlog);
router.get('/blog-by-id/:id', doctorRole, DoctorController.getBlogById);
router.post('/update-blog/:id', doctorRole, DoctorController.updateBlog);
// disease
router.get('/data-disease', doctorRole, DoctorController.getDataDisease);
router.delete('/delete-report/:_id', doctorRole, DoctorController.delReport);
router.get('/accept-report/:_id', doctorRole, DoctorController.acceptReport);
router.get('/search-report/:key', doctorRole, DoctorController.searchReport);





module.exports = router;