const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

<<<<<<< HEAD
const uploadToCloudinary = async (fileBuffer, folder = 'texas_grill') => {
=======
const uploadToCloudinary = async (fileBuffer, folder = 'texas-grill') => {
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) reject(error);
        else resolve({
          url: result.secure_url,
          publicId: result.public_id
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

<<<<<<< HEAD
module.exports = { cloudinary, uploadToCloudinary };
=======
module.exports = { cloudinary, uploadToCloudinary };
>>>>>>> c99b81f7d7106760fdecb4b8ecc28cd834687b97
