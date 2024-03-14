const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const userRole = require('../middlewares/userAuth');




router.get('/all-blogs', UserController.getBlogs);
router.get('/blog/:slug', UserController.getBlogBySlug);
router.get('/detail-vaccine/:slug', UserController.getDataVaccineDetail);
router.get('/data-center', UserController.getDataCenter);
router.get('/all-data-vaccine', UserController.getAllDataVaccine);
router.get('/history-vaccine', userRole, UserController.getHistoryVaccine);
router.get('/current-booking', userRole, UserController.getCurrentBooking);
router.get('/cancel-booking/:id', userRole, UserController.getCancelBooking);
router.post('/data-vaccine/:id', UserController.DataVaccineByCenter);
router.post('/report-disease', UserController.postReportDisease);
module.exports = router;