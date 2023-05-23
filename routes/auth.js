//
// All routes pertaining to user authentication goes here.
//

const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

// GET Signup

// POST Login
router.post('/login', authController.postLogin);

// POST Signup
// POST Logout

module.exports = router;