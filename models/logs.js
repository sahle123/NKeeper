/*
*   Good ol' logging for the lumber mill
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  message: {
    type: String,
    required: true
  },
  databaseUri: {
    type: String,
    required: true
  },
  datetime: {
    type: Date,
    required: true,
    default: Date.now
  }
});

module.exports = mongoose.model('LumberMill', logSchema);