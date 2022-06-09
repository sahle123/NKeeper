
exports.getProfile = (req, res, next) => {
  res.render('main/profile', {
    pageTitle: 'User profile'
  });
};

// Fetches all images for this user's profile.
exports.getProfileImages = (req, res, next) => {
  // ...
};