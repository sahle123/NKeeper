const path = require('path');

const express = require('express');

const profileController = require('../controllers/profile');

const router = express.Router();

// GET /profile/
router.get('/profile', profileController.getProfile);

// POST /profile/
router.post('/profile', profileController.updateProfile);

// POST /profile/add-activity/
router.post('/profile/add-activity', profileController.addActivity);

module.exports = router;