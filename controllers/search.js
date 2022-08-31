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
  
  const firstName = req.body.contact;
  // DEV-NOTE: Separate name by parts

  Contact
    .find( { firstName: { "$regex": firstName, "$options": 'i'} }, null, { limit: _returnLimit} )
    .then((result) => {
      //logger.plog(result);

      res.status(200);
      res.send(result);
    })
    .catch(err => { errHelper.redirect500(res, err); });
}