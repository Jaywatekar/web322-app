// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'drjtwtf20',
    api_key: '515913738451826',
    api_secret: '6k5qtHlGQRNg9V4AZ2kgEgg_9i4', // Replace this with your actual API Secret
    secure: true,
});

module.exports = cloudinary
