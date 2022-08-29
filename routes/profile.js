//
// Routes for anything relating to a contact's details.
//
const express = require('express');

const profileController = require('../controllers/profile');

const router = express.Router();

// GET /profile
router.get('/profile', profileController.getProfile);

// GET /profile/{profileId}
router.get('/profile/:profileId', profileController.getProfileById);

// POST /profile
router.post('/profile', profileController.updateProfile);

// POST /profile/add-activity
router.post('/profile/add-activity', profileController.addActivity);

// POST /profile/delete-activity
router.post('/profile/delete-activity', profileController.deleteActivity);

// POST /profile/edit-activity
router.post('/profile/edit-activity', profileController.editActivity);

module.exports = router;