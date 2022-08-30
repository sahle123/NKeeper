//
// Routes for anything relating to creating a new contact.
//

const express = require('express');

const newContactController = require('../controllers/newContact');

const router = express.Router();

// GET /
router.get('/', newContactController.getNewContact);

// POST /
router.post('/', newContactController.postNewContact);


module.exports = router;