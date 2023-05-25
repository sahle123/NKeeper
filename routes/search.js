//
// Routes for anything relating to searching contacts
//

const express = require('express');

const searchController = require('../controllers/search');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /
router.get('/', isAuth, searchController.getSearchPage);

// POST /
router.post('/', isAuth, searchController.searchContacts);

module.exports = router;