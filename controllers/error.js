// All 4xx and 5xx HTTP errors are handled here.

const B = require('../utils/basic');

exports.get400 = (req, res, next) => {
  let msg = 'Unknown';
  if (!B.isEmpty(req.params.errorMsg)) {
    msg = req.params.errorMsg;
  }

  res
    .status(400)
    .render('error/errorPage', {
      pageTitle: 'Bad Request',
      errorMsg: msg
    });
}

exports.get404 = (req, res, next) => {
  res
    .status(404)
    .render('errors/errorPage', { 
      pageTitle: 'Page Not Found',
      errorMessage: '404 page was not found!'
    });
};

exports.get500 = (req, res, next) => {
  res
    .status(500)
    .render('errors/errorPage', { 
      pageTitle: 'Internal Server Error',
      errorMessage: 'Internal server error! :('
    });
};