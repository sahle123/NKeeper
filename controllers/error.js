// All 4xx and 5xx HTTP errors are handled here.

exports.get404 = (req, res, next) => {
  res.status(404)
    .render('errorPage', { 
      pageTitle: 'Page Not Found',
      errorMessage: '404 page was not found!'
    });
};

exports.get500 = (req, res, next) => {
  res.status(500)
    .render('errorPage', { 
      pageTitle: 'Internal Server Error',
      errorMessage: 'Internal server error! :('
    });
};