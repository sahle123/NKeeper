/*
* Each activity is associated with a Contact.
*/

const logger = require('../utils/logger');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Schema
const activitySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  desc: { type: String, required: true },
  date: { type: Date, required: true }
});


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Methods
// ...


module.exports = mongoose.model('Activity', activitySchema);