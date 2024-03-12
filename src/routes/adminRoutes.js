const express = require('express');
const router = express.Router();
const { isAdminAuthenticated } = require('../middleware/auth.middleware');
const adminController = require('./../controller/adminController');

router.post('/login', adminController.login);
router.get('/states', isAdminAuthenticated, adminController.getAllStates);
router.get('/status', isAdminAuthenticated, adminController.getAllStatus);

router.post('/drivers', isAdminAuthenticated, adminController.getDrivers);
router.post('/waitlist', isAdminAuthenticated, adminController.getWaitlist);


module.exports = router;