/* 
* User login model.
*/
const { Int32 } = require('mongodb');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//const logger = require('../utils/logger');

const userSchema = new Schema({
  username: { type: String, required: false },
  email: { type: String, required: true },
  password: { type: String, required: true },
  loginAttempts: { type: Number, required: true, default: 0 },
  isActive: { type: Boolean, required: true, default: true }
});

module.exports = mongoose.model('User', userSchema);