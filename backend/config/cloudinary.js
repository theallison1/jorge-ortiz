const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Reemplazá estos valores con tus credenciales de tu cuenta de Cloudinary (es gratis crearla)
cloudinary.config({
  cloud_name: 'davvba78z',
  api_key: '195711759267693',
  api_secret: 'heB29ecWpr1VajKt0A9c6fWYHbQ'
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ortiz_automotores',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;