//
// Routes for anything relating to creating a new contact.
//

const express = require('express');

const newContactController = require('../controllers/newContact');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// GET /
router.get('/', isAuth, newContactController.getNewContact);

// POST /
router.post('/', isAuth, newContactController.postNewContact);


module.exports = router;