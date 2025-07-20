const cloudinary = require('../config/cloudinaryConfig');

exports.uploadImage = async (filePath, folder = 'uploads') => {
  return await cloudinary.uploader.upload(filePath, { folder });
};

exports.deleteImage = async (publicId) => {
  return await cloudinary.uploader.destroy(publicId);
};

exports.transformImage = (publicId, width, height, crop = 'fill') => {
  return cloudinary.url(publicId, { width, height, crop });
};
