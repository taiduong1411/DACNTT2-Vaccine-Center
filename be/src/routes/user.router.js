const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');



router.get('/all-blogs', UserController.getBlogs);
router.get('/blog/:slug', UserController.getBlogBySlug);
router.get('/detail-vaccine/:slug', UserController.getDataVaccineDetail);
router.get('/data-center', UserController.getDataCenter);
router.get('/data-vaccine', UserController.getDataVaccine);
module.exports = router;