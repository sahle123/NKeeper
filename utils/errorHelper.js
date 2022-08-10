// Helper functions for generic HTTP error messages.
// Works in tandem w/ /controllers/error.js
//
// Requires: express.js in order to work.

const logger = require('./logger');


//
// 4xx
exports.redirect400 = (res, errMsg) => {
  const url = `/400?errorMsg=${errMsg}`;

  console.trace();
  logger.logError(errMsg);
  
  res.redirect(url);
};

exports.redirect404 = (res, errMsg) => {
  const url = `/404?errorMsg=${errMsg}`;

  console.trace();
  logger.logError(errMsg);

  res.redirect(url);
};

//
// 5xx
exports.redirect500 = (res, errMsg) => {
  const url = `/500?errorMsg=${errMsg}`;

  console.trace();
  logger.logError(errMsg);

  res.redirect(url);
};