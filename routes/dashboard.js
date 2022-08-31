//
// Routes for anything relating to the dashboard
//

const express = require('express');

const dashboardController = require('../controllers/dashboard');

const router = express.Router();

// GET /
router.get('/', dashboardController.getDashboardPage);

// GET /get-most-recent-activity
router.get('/get-most-recent-activity', dashboardController.getMostRecentActivity);

// GET /get-num-of-contacts
router.get('/get-num-of-contacts', dashboardController.getNumOfContacts);

// GET /get-friend-with-most-activities
router.get('/get-friend-with-most-activities', dashboardController.getFriendWithMostActivities);


module.exports = router;