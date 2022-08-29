/*
* Controller for anything related to creating a new contact
*/
const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');

exports.getNewContact = (req, res, next) => {
  logger.log("getNewContact UNDER CONSTRUCTION");

  res.render('newContact/index', {
    pageTitle: 'New contact'
  });
};