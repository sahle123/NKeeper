//
// Routes for anything relating to the dashboard
//

const express = require('express');

const dashboardController = require('../controllers/dashboard');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /
router.get('/', isAuth, dashboardController.getDashboardPage);

// GET /get-most-recent-activity
router.get('/get-most-recent-activity', isAuth, dashboardController.getMostRecentActivity);

// GET /get-num-of-contacts
router.get('/get-num-of-contacts', isAuth, dashboardController.getNumOfContacts);

// GET /get-friend-with-most-activities
router.get('/get-friend-with-most-activities', isAuth, dashboardController.getFriendWithMostActivities);


module.exports = router;