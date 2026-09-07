const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'campus-food-ordering',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    // Keep uploads reasonably sized and consistent
    transformation: [{ width: 1600, height: 1600, crop: 'limit' }]
  }
});

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG and WEBP images are allowed.'));
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
