const path = require('path');

const express = require('express');

const profileController = require('../controllers/profile');

const router = express.Router();

// GET /profile/
router.get('/profile', profileController.getProfile);

module.exports = router;