// All 4xx and 5xx HTTP errors are handled here.

const B = require('../utils/basic');


exports.get400 = (req, res, next) => {
  const msg = getErrorMessage(req.query.errorMsg);

  res
    .status(400)
    .render('error/errorPage', {
      pageTitle: 'Bad Request',
      errorMsg: msg
    });
};

exports.get404 = (req, res, next) => {
  const msg = getErrorMessage(req.query.errorMsg, 'Page not found');

  res
    .status(404)
    .render('errors/errorPage', { 
      pageTitle: 'Page Not Found',
      errorMessage: msg
    });
};

exports.get500 = (req, res, next) => {
  const msg = getErrorMessage(req.query.errorMsg, 'Internal server error');

  res
    .status(500)
    .render('errors/errorPage', { 
      pageTitle: 'Internal Server Error',
      errorMessage: msg
    });
};

// Private function for getting error messages
// or returning a default.
function getErrorMessage(errMsg, defaultMsg = 'Unknown') {
  if(!B.isEmpty(errMsg))
    return errMsg;
  else
    return defaultMsg;
}