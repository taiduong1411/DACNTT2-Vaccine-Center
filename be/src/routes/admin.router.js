const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const adminRole = require('../middlewares/adminAuth');


// Dashboard
router.get('/dashboard', adminRole, AdminController.dataDashboard);
// vaccine
router.get('/all-vaccines', AdminController.getAllVaccines);
router.get('/get-product/:_id', adminRole, AdminController.getVaccineById);
router.get('/vaccine/:pro_code', adminRole, AdminController.getVaccineByCode);
router.get('/search-vaccine/:key', adminRole, AdminController.getSearchVaccine);
router.post('/add-product', adminRole, AdminController.addVaccine);
router.post('/update-detail/:context/:pro_code', adminRole, AdminController.updateDetailByCode);
router.post('/update-product/:_id', adminRole, AdminController.updateVaccineById);
router.delete('/del-product/:_id', adminRole, AdminController.delVaccine);
// doctor
router.get('/all-doctors', adminRole, AdminController.getAllDoctors);
router.get('/search-doctor/:key', adminRole, AdminController.getSearchDoctor);
router.post('/add-doctor', adminRole, AdminController.addDoctor);
router.get('/getDataDoctorByIdCenter/:cid', adminRole, AdminController.getDoctorByIdCenter);
// center
router.get('/all-centers', adminRole, AdminController.allCenters);
router.post('/add-center', adminRole, AdminController.addCenter);
// blog
router.get('/all-blogs', adminRole, AdminController.getAllBlogs);
router.post('/add-blog', adminRole, AdminController.addBlog);
router.delete('/del-blog/:_id', adminRole, AdminController.delBlog);
router.get('/search-blog/:key', adminRole, AdminController.searchBlog);

// disease
router.get('/data-disease', adminRole, AdminController.getDataDisease);
router.delete('/delete-report/:_id/:cid', adminRole, AdminController.delReport);
router.get('/search-report/:key', adminRole, AdminController.searchReport);
router.post('/assign-disease', adminRole, AdminController.assignDisease);
module.exports = router;