/*
* Model for all image storage.
*/

const logger = require('../utils/logger');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Schema

// data field should be first converted to Base64.
const imageSchema = new Schema({
  contactId: { type: Schema.Types.ObjectId, required: true },
  data: { type: String, required: true },
  fileExtension: { type: String, required: true },
  mimeType: { type: String, required: true }
});


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Methods

// Saves all data and metadata for photo and binary is 
// converted to Base64.
// Return: bool. Returns true on success and false on failure.
imageSchema.methods.saveImageDetails = function(details, contactId) {
  
  try {
    const temp = details.originalname.split('.');
    const fileExtension = temp[temp.length - 1];
  
    this.contactId = mongoose.Types.ObjectId(contactId.contactId);
    this.fileExtension = fileExtension;
    this.mimeType = details.mimetype;
    this.data = details.buffer.toString('base64');
    this.save();
    return true;
  }
  catch {
    logger.logError(this.$errors);
    return false;
  }
};

module.exports = mongoose.model('Image', imageSchema);