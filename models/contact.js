/*
* A contact represents a person who the user has some sort
* of relationship with. It doesn't matter if it's intimate or
* purely professional; they are called contacts regardless.
*/

const logger = require('../utils/logger');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Schema
const contactSchema = new Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, required: false },
  lastName: { type: String, required: true },
  dob: { type: Date, required: false },
  summary: { type: String, required: false },
  contactInfo: {
    mobile: { type: String, required: false },
    email: { type: String, required: false },
    whatsApp: { type: String, required: false },
    nationality: { type: String, required: false },
    livingIn: { type: String, required: false }
  },
  activities: [{ type: Schema.Types.ObjectId, required: false }],
  images: [{ type: Schema.Types.ObjectId, required: false }]
});


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Methods
// ...


module.exports = mongoose.model('Contact', contactSchema);