const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/admin.controller');
const adminRole = require('../middlewares/adminAuth');

router.get('/dashboard', adminRole, AdminController.dataDashboard);
router.get('/all-vaccines', AdminController.getAllVaccines);
router.get('/get-product/:_id', adminRole, AdminController.getVaccineById);
router.get('/vaccine/:pro_code', adminRole, AdminController.getVaccineByCode);



router.get('/all-centers', adminRole, AdminController.allCenters);
router.get('/all-doctors', adminRole, AdminController.getAllDoctors);
router.get('/all-blogs', adminRole, AdminController.getAllBlogs);


router.post('/add-product', adminRole, AdminController.addVaccine);
router.post('/update-detail/:context/:pro_code', adminRole, AdminController.updateDetailByCode);
router.post('/update-product/:_id', adminRole, AdminController.updateVaccineById);
router.post('/add-center', adminRole, AdminController.addCenter);
router.post('/add-doctor', adminRole, AdminController.addDoctor);
router.post('/add-blog', adminRole, AdminController.addBlog);



router.delete('/del-product/:_id', adminRole, AdminController.delVaccine);
router.delete('/del-blog/:_id', adminRole, AdminController.delBlog);
module.exports = router;