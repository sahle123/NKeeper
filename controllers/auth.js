// Packages
const bcrypt = require('bcryptjs');

// Models
const User = require('../models/user');

// Utils
const logger = require('../utils/logger');
const basic = require('../utils/basic');
const toast = require('../utils/enums').toastMessageTypes;

// GET Login
exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    pageTitle: 'Login',
    errorMessage: basic.getFlashMsg(req.flash(toast.error))
  })
};

// GET Signup
exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign-up',
    errorMessage: basic.getFlashMsg(req.flash(toast.error))
  });
};

// POST Login
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User
    .findOne({ email: email, isActive: true })
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
              user.loginAttempts = 0;
              user.save();
              
              // Not always needed, but in scenarios where latency can affect the result, this is a good idea to call.
              // i.e. res.redirect() will run regardless if the session data was finished writing to MongoDB or not.
              return req.session.save((err) => {
                if(err) { logger.logError(err); }

                //req.flash(toast.info, "Logged in successfully");
                res.redirect('/dashboard');
              });
            }
            // Mismatched password
            else {
              user.loginAttempts += 1;
              user.save();

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
};

// POST Signup
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // DEV-NOTE: (SAA-DEV) Add email validator here.
  if(!email) {
    req.flash('error', 'Invalid email provided.');
    return res.redirect('/signup');
  }

  // Password validation.
  if(password !== confirmPassword) {
    req.flash('error', 'Passwords are mismatched. Please retype them again');
    return res.redirect('/signup');
  }

  // Check if user already exists.
  User
    .findOne({
      email: email
    })
    .then(userDoc => {
      // User already exists.
      if(userDoc) {
        req.flash('error', 'Email already exists. Please choose another email address.');
        logger.logError(`This user (${email}) already exists!`);
        return res.redirect('/signup');
      }

      // Otherwise, create the new user.
      // Hash password async. 12 rounds of hashing.
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          // Create new user
          const newSignup = new User({
            email: email,
            password: hashedPassword,
            username: "TEST USER"
          });

          return newSignup.save();
        })
        .then(result => {
          logger.plog(`New user (${email}) successfully created!`);
          res.redirect('/login');
        })
        .catch(err => { logger.logError(err); });
    })
    .catch(err => { logger.logError(err); });
};

// POST Logout
exports.postLogout = (req, res, next) => {
  // This 'destroy' method is provided by express's session library.
  req.session.destroy(err => {
    if(err) { logger.logError(err); }
    res.redirect('/login');
  })
};


// DRY code for login errors.
const loginError = (res, msg) => {
  logger.logError(msg);
  res.redirect('/login');
};