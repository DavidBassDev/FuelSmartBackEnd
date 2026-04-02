const multer = require('multer'); //instalado con npm install multer
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
     cb(null, path.join(__dirname, '../../uploads/vouchers'));//subir dos niveles en la ruta, estaba leyendo en src
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

module.exports = upload;