//
// Routes for anything relating to a contact's details.
//
const express = require('express');

const profileController = require('../controllers/profile');
const imageController = require('../controllers/image');
const isAuth = require('../middleware/is-auth');

// For 'multipar/form-data' headers. i.e. file uploads.
const multer = require('multer');
const upload = multer();
//const upload = multer({dest: 'uploads/'});

const router = express.Router();

// GET /profile
router.get('/profile', isAuth, profileController.getProfile);

// GET /profile/{profileId}
router.get('/profile/:profileId', isAuth, profileController.getProfileById);

// POST /profile
router.post('/profile', isAuth, profileController.updateProfile);

// POST /profile/add-activity
router.post('/profile/add-activity', isAuth, profileController.addActivity);

// POST /profile/delete-activity
router.post('/profile/delete-activity', isAuth, profileController.deleteActivity);

// POST /profile/edit-activity
router.post('/profile/edit-activity', isAuth, profileController.editActivity);

// GET /profile/get-images
router.get('/profile/get-images/:profileId', isAuth, imageController.getProfileImages);

// POST /profile/upload-image
router.post('/profile/upload-image', isAuth, upload.single('img'), imageController.uploadImage);

// POST /profile/delete-image
router.post('/profile/delete-image/:imageId', isAuth, imageController.deleteImage);


module.exports = router;