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
      // result.images.forEach((el, index, arr) => {
      //   arr[index].data = decodeBase64(el.data);
      // });

      res.status(200)
      res.send(result.images);
    })
    .catch(err => { errHelper.redirect500(res, err); });
};

// Uploads an image to MongoDB.
exports.uploadImage = async (req, res, next) => {
  try {
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

// Deletes an image in MongoDB for a given user.
exports.deleteImage = async (req, res, next) => {
  try {
    const imageId = req.params.imageId;

    logger.log("Need to do a security check here. Check src for comments.");
    // Contact
    //   .findById(profileId)
    //   .select('_id, images')
    //   .populate({ path: 'images', model: 'Image' })
    //   .then(result => {
    //     // DEV-NOTE: Security. Do a check to make sure that this
    //     // image to be deleted belongs to the user (not contact).
    //     logger.log("Need to do a security check here. Check src for comments.");
    //   })

    const imageResult = await Image.findById(imageId);
    const contactId = imageResult.contactId.toString();

    // Remove image from Contact document.
    await Image.findByIdAndDelete(imageId);

    // Remove image from Images document.
    await Contact.findByIdAndUpdate(contactId, {
      $pull: { images: imageId }
    });

    logger.plog("Deleted image: " + imageId);

    res.status(200);
    res.send('Ok');
  }
  catch (err) { errHelper.redirect500(res, err); }
}

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// Support functions

// Decodes a single base64 image.
function decodeBase64(encodedImg) {
  return Buffer.from(encodedImg, 'base64');
}