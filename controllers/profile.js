/*
* Controller for anything related to profile services.
*/
const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');
const Activity = require('../models/activity');


// Fetches any profile
// DEV-NOTE: Might need removal later.
exports.getProfile = (req, res, next) => {
  Contact
    .findOne()
    .populate({ path: 'activities', model: 'Activity' })
    .populate({ path: 'images', model: 'Image' })
    .sort({ date: 1 })
    .then(result => {

      // Edge case for when DB is empty.
      if (!result) { add_temp_data_mongo(); }

      // Sort activities DESC
      result.activities.sort((a, b) => { return dateTimeDesc(a, b); });

      res.render('main/profile', {
        prop: result,
        lastActivity: getLastActivityDate(result),
        age: getAge(result.dob),
        pageTitle: 'User profile'
      });
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Fetches a profile by its ID
exports.getProfileById = (req, res, next) => {
  const profileId = req.params.profileId;
  Contact
    .findById(profileId)
    .populate({ path: 'activities', model: 'Activity' })
    .populate({ path: 'images', model: 'Image' })
    .sort({ date: 1 })
    .then(result => {

      // Sort activities DESC
      result.activities.sort((a, b) => { return dateTimeDesc(a, b); });

      res.render('main/profile', {
        prop: result,
        lastActivity: getLastActivityDate(result),
        age: getAge(result.dob),
        pageTitle: 'User profile'
      });
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Updates profile
// DEV-NOTE: Needs text sanitizers
exports.updateProfile = (req, res, next) => {

  Contact
    .findById(req.body.userId)
    .then(contact => {
      contact.firstName = req.body.firstName;
      contact.middleName = req.body.middleName;
      contact.lastName = req.body.lastName;
      contact.dob = req.body.dob;
      contact.summary = req.body.summary;
      contact.contactInfo.mobile = req.body.phone;
      contact.contactInfo.email = req.body.email;
      contact.contactInfo.whatsApp = req.body.whatsapp;
      contact.contactInfo.nationality = req.body.nationality;
      contact.contactInfo.livingIn = req.body.livingIn;
      contact.save();
    })
    .then(result => { res.redirect("/main/profile"); })
    .catch(err => { errHelper.redirect500(res, err); });

  logger.plog("Called update profile!");
};

// Adds activity for some contact.
// DEV-NOTE: Needs text sanitizers
exports.addActivity = async (req, res, next) => {

  try {
    // Default date to now if no date was passed in.
    const activityDate = req.body.date ? req.body.date : Date.now();

    const activity = new Activity({
      userId: req.body.userId,
      desc: req.body.desc,
      date: new Date(activityDate)
    });

    const activityResult = await activity.save();
    const contactResult = await Contact.findById(activityResult.userId);

    contactResult.activities.push(activityResult._id);
    await contactResult.save();

    logger.plog("Added new activity!!!");
    // res.status(200);
    // res.send('');
    res.redirect('/main/profile');
  }
  catch (err) { errHelper.redirect500(res, err); }
};

// Deletes activity for some contact.
exports.deleteActivity = async (req, res, next) => {
  try {
    const activityId = req.body.activityId;

    const activityResult = await Activity.findById(activityId);
    const userId = activityResult.userId.toString();

    // Remove activity from Activities document.
    await Activity.findByIdAndDelete(activityId);

    // Remove activity ID from Contacts document.
    await Contact.findByIdAndUpdate(userId, {
      // https://www.mongodb.com/docs/manual/reference/operator/update/pull/#-pull
      $pull: { activities: activityId }
    });

    logger.plog("Deleted activity " + activityId);

    res.redirect('/main/profile');
  }
  catch (err) { errHelper.redirect500(res, err); }
};

// Edits an activity
// DEV-NOTE: Needs text saniitizers
exports.editActivity = async (req, res, next) => {
  try {
    const activityResult = await Activity.findById(req.body.activityId);

    if (String(activityResult.userId) === String(req.body.userId)) {
      activityResult.desc = req.body.desc;
      // activity date is not changeable for now.
      await activityResult.save();

      logger.plog("Edited activity ID: " + req.body.activityId);

      res.status(200);
      res.send('');
    }
    else {
      throw "User ID mismatch for editActivity()";
    }
  }
  catch (err) { errHelper.redirect500(res, err); }
};


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Support functions

// Calculates the last activity with this contact.
const getLastActivityDate = (contact) => {
  const msg = "- None - ";

  if (!contact.activities)
    return msg;

  if (contact.activities.length <= 0)
    return msg;

  const result = Math.max(
    ...contact.activities.map(e => { return new Date(e.date); })
  );

  return new Date(result)
    .toLocaleDateString('fr-CA', { year: 'numeric', month: 'numeric', day: 'numeric' });
}

// Calculates age based on passed in date string.
// Kudos: https://stackoverflow.com/a/7091965/6369752
const getAge = (dateString) => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();

  // Checking if the month in the year has passed or not.
  // Don't want to add a year prematurely.
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

// Sorts arrays of dates DESC
// DEV-NOTE: Move to a utils class later...
function dateTimeDesc(a, b) {
  return new Date(b.date) - new Date(a.date);
}

// Sorts arrays of dates ASC
// DEV-NOTE: Move to a utils class later...
function dateTimeAsc(a, b) {
  return new Date(a.date) - new Date(b.date);
}

// DEV-NOTE: Temporary measure for adding data to mongo
// This should be removed at a later point.
function add_temp_data_mongo() {

  const contact = new Contact({
    firstName: 'Arnold',
    middleName: 'Philip',
    lastName: 'Shortman',
    dob: new Date(1990, 3, 25),
    summary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer sodales feugiat scelerisque. Proin turpis odio, fermentum eu vestibulum a, elementum quis lectus. Donec et pulvinar ligula. Aliquam eu sollicitudin lectus, vitae rutrum odio. Proin feugiat fringilla nibh quis volutpat. Maecenas ultrices nibh vitae tortor volutpat, sollicitudin semper lorem pulvinar. Donec nec urna felis. Donec feugiat tortor non varius tincidunt. Donec sit amet pretium magna. Sed et neque auctor, fermentum justo et, convallis lectus. In hac habitasse platea dictumst. Integer ornare congue nisl, sit amet semper arcu varius a. Maecenas feugiat nibh ut iaculis efficitur. Suspendisse sit amet scelerisque risus, ut euismod purus. Aenean imperdiet mauris enim, a bibendum leo scelerisque sed. Suspendisse suscipit sollicitudin augue in elementum.',
    contactInfo: {
      mobile: '+966 53 384 4827',
      whatsApp: '+966 53 384 4827',
      email: 'arnold.shortman@some-mail.com',
      nationality: 'American',
      livingIn: 'New York City, USA'
    }
  });

  const activities = [
    new Activity({
      userId: contact._id,
      desc: 'We went to the movies',
      date: new Date(2016, 2, 21)
    }),
    new Activity({
      userId: contact._id,
      desc: 'Mary\'s Halloween party',
      date: new Date(2017, 10, 31)
    }),
    new Activity({
      userId: contact._id,
      desc: "Super stupidly long entry about how our times together we spend as friends is a metaphor for the... I don't know where this is going, but I intend to make this entry unnecessary and spacious, much like social media. God, I hate social media. It exists to take up as much space as possible and waste our time. I have a dream to live in a world where TikTok is a cardinal sin and excessive posting on Snapchat is a federal crime.",
      date: new Date(2018, 1, 15)
    }),
  ];

  // Save all activity IDs in the contact model.
  for (i = 0; i < activities.length; i++) {
    contact.activities.push(activities[i]._id);
  }

  contact.save();
  activities.forEach((i) => { i.save(); })

  logger.plog("Added dummy (Hey Arnold!) user.");
}