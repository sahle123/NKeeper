/* 
* User login model.
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logger = require('../utils/logger');

const userSchema = new Schema({
  username: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);