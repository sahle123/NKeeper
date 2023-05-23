const path = require('path');
const logger = require('./utils/logger');
const express = require('express');
const session = require('express-session'); // For session management.

const cors = require('cors');
const mongooseConnect = require('./utils/database').mongooseConnect;
const MongoDBStore = require('connect-mongodb-session')(session); // For lightweight session storage in MongoDB.
const connectFlash = require('connect-flash'); // Handy package for error messages.

const app = express();

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// CONSTS
const PORT = 3000;
const MONGODB_URI = require('./utils/database').MONGODB_URI;
const corsPolicy = cors({
  origin: ['https://www.google.com/'],
  methods: ['GET']
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// SESSION SETUP
const seshStorage = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'UserSessions'
});


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

//
// Express app config
app.set('view engine', 'ejs');
app.set('views', './views');

//
// ROUTES INCLUDES
const errorRoutes = require('./routes/error');
const profileRoutes = require('./routes/profile');
const newContactRoutes = require('./routes/newContact');
const searchRoutes = require('./routes/search');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth.js');


// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MIDDLEWARE

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Allows the serving of static files in a certain directory. This is only read 
// access. Typically, the 'public' folder is where all the content is stored.
app.use(express.static(path.join(__dirname, "public")));

//
// Session management middleware
app.use(session({
  secret: 'always a beginner', // DEV-NOTE: (SAA-DEV) this needs to be changed before prod.
  resave: false,
  saveUninitialized: false,
  store: seshStorage,
  cookie: { /* cookies can be configured here as neededd */ }
}));

// Add connect-flash functionality to app.
app.use(connectFlash());

// For getting session data and conforming it into a Mongoose model
// that lets use use Mongoose methods.
app.use((req, res, next) => {
  
  // Non-logged in user.
  if(!req.session.user) {
    return next();
  }

  // User is logged in.
  User.findById(req.session.user._id)
    .then(user => {
      req.user = user; // This will give us the Mongoose model that lets use use mongoose methods.
      next();
    })
    .catch(err => logger.logError(err));
});

// Configuring all views to have these local variables available.
app.use((req, res, next) => {
  // The 'locals' filed is specific to express.js.
  // Read up more on this later...
  res.locals.isAuthenticated = req.session.isLoggedIn;
  // DEV-NOTE: (SAA-DEV) Add anti-CSRF here before going to prod.
  // res.locals.csrfToken = !!!!!!
  next();
})


//
// ROUTING MIDDLEWARE REGISTRATION
app.use('/main', corsPolicy, profileRoutes);
app.use('/newContact', corsPolicy, newContactRoutes);
app.use('/search', corsPolicy, searchRoutes);
app.use('/dashboard', corsPolicy, dashboardRoutes);
app.use(authRoutes);
// Make sure this one is last since the errors are the last resort.
app.use('/', errorRoutes);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
logger.log("Starting Node.js server...");
logger.log("Connecting to MongoDB...");

mongooseConnect(() => {
  app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
});