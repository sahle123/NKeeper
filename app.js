const path = require('path');
const logger = require('./utils/logger');
const express = require('express');

const cors = require('cors');
const mongooseConnect = require('./utils/database').mongooseConnect;

const app = express();

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// CONSTS
const PORT = 3000;
const corsPolicy = cors({
  origin: ['https://www.google.com/'],
  methods: ['GET']
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

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MIDDLEWARE

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
// Allows the serving of static files in a certain directory. This is only read 
// access. Typically, the 'public' folder is where all the content is stored.
app.use(express.static(path.join(__dirname, "public")));

//
// ROUTING MIDDLEWARE REGISTRATION
app.use('/main', corsPolicy, profileRoutes);
app.use('/newContact', corsPolicy, newContactRoutes);
// Make sure this one is last since the errors are the last resort.
app.use('/', errorRoutes);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
logger.log("Starting Node.js server...");

mongooseConnect(() => {
  app.listen(PORT, () => {
    logger.log(`Listening on port ${PORT}`);
  });
});