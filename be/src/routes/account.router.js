const express = require('express');
const router = express.Router();
const AccountController = require('../controllers/account.controller');

router.post('/login', AccountController.login);
router.post('/register', AccountController.register);
router.post('/forgot-password', AccountController.forgotPassword);
router.post('/reset-password', AccountController.resetPassword);
router.post('/update-information', AccountController.updateInformation);

router.get('/my-info', AccountController.getMyInfo);
module.exports = router;