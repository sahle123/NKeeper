/*
* Controller for anything related to the dashboard
*/

const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Contact = require('../models/contact');
const Activity = require('../models/activity');

exports.getDashboardPage = (req, res, next) => {
  res.render('dashboard/index', {
    pageTitle: 'Dashboard'
  });
};

//
// Dashboard fetch functions
//
// Gets most recent activity w/ the contact's details
exports.getMostRecentActivity = (req, res, next) => {
  Activity
    .findOne({}, {}, { sort: { 'date': -1 } })
    .populate({ path: 'userId', model: 'Contact' })
    .then(result => {
      if (result) {
        res.status(200);
        res.send(result);
      }
      else {
        res.status(500);
        res.send("Error fetching data...");
      }
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Gets number of contacts in total
exports.getNumOfContacts = (req, res, next) => {
  Contact
    .find({})
    .then(result => {
      const mappedObj = new Map(Object.entries(result));
      res.status(200);
      res.send(String(mappedObj.size));
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Gets contact's fullname with the most activities
// DEV-NOTE: Review this for help: https://stackoverflow.com/questions/14617379/mongoose-mongodb-count-elements-in-array
exports.getFriendWithMostActivities = (req, res, next) => {
  Contact
    .aggregate([
      {
        $project: {
          activities: 1,
          firstName: 1,
          middleName: 1,
          lastName: 1
        }
      },
      { $unwind: '$activities' },
      {
        $group: {
          _id: { _id: "$_id" },
          name: {
            "$first": {
              $concat: ["$firstName", " ", "$middleName", " ", "$lastName"]
            }
          },
          count: { $sum: 1 }
        }
      }
    ])
    .then(result => {
      if (result) {
        const contact = result.sort((a, b) => (a.count < b.count) ? 1 : -1);
        res.status(200);
        res.send(contact[0]);
      }
      else {
        throw "No contacts returned...";
      }
    })
    .catch(err => { errHelper.redirect500(res, err); });
}