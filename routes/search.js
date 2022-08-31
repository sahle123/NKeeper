//
// Routes for anything relating to searching contacts
//

const express = require('express');

const searchController = require('../controllers/search');

const router = express.Router();

// GET /
router.get('/', searchController.getSearchPage);

// POST /
router.post('/', searchController.searchContacts);

module.exports = router;