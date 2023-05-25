/*
* Controller for anything related to creating a new contact
*/
const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');

exports.getNewContact = (req, res, next) => {
  res.render('newContact/index', {
    pageTitle: 'New contact'
  });
};


exports.postNewContact = (req, res, next) => {

  // DEV-NOTE: Add server-side validators here.

  const contact = new Contact({
    userId: req.session.user._id,
    firstName: req.body.firstName,
    middleName: req.body.middleName,
    lastName: req.body.lastName,
    summary: req.body.summary,
    dob: new Date(req.body.dob),
    contactInfo: {
      mobile: req.body.phone,
      email: req.body.email,
      whatsApp: req.body.whatsApp,
      nationality: req.body.nationality,
      livingIn: req.body.livingIn
    }
  });

  contact
    .save()
    .then(result => {
      logger.plog("Successfully created a new contact: " + String(result._id));
      res.redirect(`/main/profile/${String(result._id)}`);
    })
    .catch(err => { errHelper.redirect500(res, err); });  
};