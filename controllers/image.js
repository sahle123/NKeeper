/*
* Controller for anything related to uploading/deleting images
*/
const logger = require('../utils/logger');
const errHelper = require('../utils/errorHelper');

const Image = require('../models/image');
const Contact = require('../models/contact');


// Gets all images for a contact's profile.
exports.getProfileImages = (req, res, next) => {
  const profileId = req.params.profileId;
  Contact
    .findById(profileId)
    .select('_id, images')
    .populate({ path: 'images', model: 'Image' })
    .then(result => {

      // Decode base64 images
      result.images.forEach((el, index, arr) => {
        arr[index].data = decodeBase64(el.data);
      });

      res.status(200)
      res.send(result.images);
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Uploads an image to MongoDB.
exports.uploadImage = async (req, res, next) => {
  try {
    logger.plog("Inside of uploadImage()");

    const image = new Image();
  
    const isUploadSuccess = image.saveImageDetails(req.file, req.body);
  
    if (isUploadSuccess) {
      
      contactResult = await Contact.findById(req.body.contactId);
      contactResult.images.push(image._id);
      await contactResult.save();
  
      res.status(200);
      res.send('Ok');
    }
    else {
      res.status(500);
      res.send('Failed to upload image');
    }
  }
  catch(err) { errHelper.redirect500(res, err); }
}


//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Support functions

// Decodes a single base64 image.
function decodeBase64(encodedImg) {
  return Buffer.from(encodedImg, 'base64');
}