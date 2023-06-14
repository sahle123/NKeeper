/*
* Each activity is associated with a Contact.
*/

//const logger = require('../utils/logger');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Schema
const activitySchema = new Schema({
  contactId: { type: Schema.Types.ObjectId, required: true, ref: 'Contact' },
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  desc: { type: String, required: true },
  date: { type: Date, required: true },
  isActive: { type: Boolean, required: true, default: true }
});


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Methods
// ...


module.exports = mongoose.model('Activity', activitySchema);