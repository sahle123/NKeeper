// Packages
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/user');

// Utils
const logger = require('../utils/logger');
const basic = require('../utils/basic');

// GET Login
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    errorMessage: basic.getFlashErrorMsg(req.flash('error'))
  })
}

// GET Signup

// POST Login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email: email })
    .then(user => {

      // User exists
      if (user) {
        bcrypt
          .compare(password, user.password)
          .then(isMatch => {

            // Passwords match
            if(isMatch) {
              req.session.isLoggedIn = true;
              req.session.user = user;
              // Not always needed, but in scenarios where latency can affect the result, this is a good idea to call.
              // i.e. res.redirect() will run regardless if the session data was finished writing to MongoDB or not.
              return req.session.save((err) => {
                if(err) { logger.logError(err); }
                res.redirect('/dashboard');
              });
            }
            // Mismatched password
            else {
              req.flash('error', "Invalid email or password.");
              loginError(res, "Email/Password combo wrong or user doesn't exist.");
            }
          })
      }
      // Otherwise, wrong email/passwordd combo.
      else {
        req.flash('error', "Invalid email or password.");
        loginError(res, "Email/Password combo wrong or user doesn't exist.");
      }
    })
    .catch(err => logger.logError(err));
}

// POST Signup
// POST Logout


// DRY code for login errors.
const loginError = (res, msg) => {
  logger.logError(msg);
  res.redirect('/login');
}