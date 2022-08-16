/*
* Controller for anything related to profile services.
*/
const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');
const Activity = require('../models/activity');


// Fetches profile
exports.getProfile = (req, res, next) => {
  Contact
    .findOne()
    .populate({ path: 'activities', model: 'Activity' })
    .sort({ date: 1 })
    .then(result => {

      // Edge case for when DB is empty.
      if (!result) { add_temp_data_mongo(); }

      // Sort activities DESC
      result.activities.sort((a, b) => { return dateTimeDesc(a, b) });

      res.render('main/profile', {
        prop: result,
        lastActivity: getLastActivityDate(result),
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
      //contact.dob
      contact.summary = req.body.summary;
      contact.contactInfo.mobile = req.body.phone;
      contact.contactInfo.email = req.body.email;
      contact.contactInfo.whatsApp = req.body.whatsapp;
      contact.save();
    })
    .then(result => { res.redirect("/main/profile"); })
    .catch(err => { errHelper.redirect500(res, err); });

  logger.plog("Called update profile!");
};

// Adds activity for some contact.
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

    res.redirect('/main/profile');

    logger.plog("Added new activity!!!");
  }
  catch (err) { errHelper.redirect500(res, err); }
}

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
      $pull: { activities: activityId }
    });

    logger.plog("Deleted activity " + activityId);

    res.redirect('/main/profile');
  }
  catch (err) { errHelper.redirect500(res, err); }
}

// Calculates the last activity with this contact.
getLastActivityDate = (contact) => {
  const msg = "- None - ";

  if (!contact.activities)
    return msg;

  if (contact.activities.length <= 0)
    return msg;

  const result = Math.max(
    ...contact.activities.map(e => { return new Date(e.date); })
  );

  return new Date(result)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
      email: 'arnold.shortman@some-mail.com'
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