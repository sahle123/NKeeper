/*
* Controller for anything related to profile services.
*/
const logger = require('../utils/logger');

const Contact = require('../models/contact');

// Fetches profile
exports.getProfile = (req, res, next) => {
  Contact
    .findOne()
    .then(result => {

      // Edge case for when DB is empty.
      if (!result) { add_temp_data_mongo(); }

      //console.log(result.activities[0]._id);

      res.render('main/profile', {
        prop: result,
        lastActivity: getLastActivityDate(result.activities),
        pageTitle: 'User profile'
      });
    })
    .catch(err => {
      const errorMsg = `Could not fetch any data. MongoDB may be empty. Try restarting. ${err}`;
      const url = `/500?errorMsg=${errorMsg}`;

      logger.logError(errorMsg);
      res.redirect(url);
    });
};

// Updates profile
exports.updateProfile = (req, res, next) => {

  console.log(req.body);
  logger.plog("Called update profile!");

};

// Calculates the last activity with this contact.
getLastActivityDate = (activities) => {
  const result = Math.max(
    ...activities.map(e => { return new Date(e.date); })
  );

  return new Date(result)
    .toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
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
    },
    activities: [{
      desc: 'We went to the movies',
      date: new Date(2016, 2, 21)
    }, {
      desc: 'Mary\'s Halloween party',
      date: new Date(2017, 10, 31)
    }, {
      desc: "Super stupidly long entry about how our times together we spend as friends is a metaphor for the... I don't know where this is going, but I intend to make this entry unnecessary and spacious, much like social media. God, I hate social media. It exists to take up as much space as possible and waste our time. I have a dream to live in a world where TikTok is a cardinal sin and excessive posting on Snapchat is a federal crime.",
      date: new Date(2018, 1, 15)
    }]
  });

  contact.save();
  logger.plog("Added dummy (Hey Arnold!) user.");
}