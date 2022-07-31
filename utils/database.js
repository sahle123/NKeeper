
const logger = require('./logger');
const mongoose = require('mongoose');

const database = 'NKeeper_0_1';
const mongoUri = `mongodb://localhost:27017/${database}`;


const mongooseConnect = callback => {
  mongoose
    .connect(mongoUri)
    .then(result => {
      logger.plog("Successfully connected to Mongo!");
      callback();
    })
    .catch(err => {
      logger.logError(err);
      throw err;
    });
};

exports.mongooseConnect = mongooseConnect;