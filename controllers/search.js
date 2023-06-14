/*
* Controller for anything related to searching contacts
*/

const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');

const _returnLimit = 10; // Max amount of returns from Mongoose.

exports.getSearchPage = (req, res, next) => {
  res.render('search/index', {
    pageTitle: 'Search for contacts'
  });
}

exports.searchContacts = (req, res, next) => {
  const names = req.body.contact.split(" ");

  // DEV-NOTE: Should make this more robust later...
  const firstName = (names.length > 0) ? names[0] : "";
  const middleName = (names.length > 1) ? names[1] : "";
  const lastName = (names.length > 2) ? names[2] : "";

  Contact
    .find({
      userId: req.session.user._id,
      isActive: true,
      firstName: { "$regex": firstName, "$options": 'i' },
      middleName: { "$regex": middleName, "$options": 'i' },
      lastName: { "$regex": lastName, "$options": 'i' }
    }, null, { limit: _returnLimit })
    .then((result) => {
      //logger.plog(result);

      res.status(200);
      res.send(result);
    })
    .catch(err => { errHelper.redirect500(res, err); });
}