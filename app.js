const path = require('path');

const express = require('express');

const cors = require('cors');

const app = express();

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// CONSTS
const PORT = 50822;
const corsPolicy = cors({
  origin: ['https://www.google.com/'],
  methods: ['GET']
});

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------

app.set('view engine', 'ejs');
app.set('views', './views');

// ROUTES INCLUDES
const errorRoutes = require('./routes/error');
const profileRoutes = require('./routes/profile');

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// MIDDLEWARE

app.use(express.urlencoded({ extended: true }));
// Allows the serving of static files in a certain directory. This is only read 
// access. Typically, the 'public' folder is where all the content is stored.
app.use(express.static(path.join(__dirname, "public")));

// ROUTING MIDDLEWARE REGISTRATION
app.use('/main',corsPolicy, profileRoutes);
// Make sure this one is last since the errors are the last resort.
app.use('/', errorRoutes);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
app.listen(PORT, () => {
  console.log("[ ] Starting Node.js server...");
  console.log(`[ ] Listening on port ${PORT}`);
});