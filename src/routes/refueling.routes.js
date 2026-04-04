const express = require('express');
const router = express.Router();
const refuelingController = require('../controllers/refueling.controller');
const authMiddleware = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/uploadRefueling'); //ruta de donde almacena la imagen

router.post(
  '/refueling',
  authMiddleware,
  upload.single('imagen'), // nombre del campo que envía Flutter
  refuelingController.createRefueling
);
//MOSTRAR REPOSTAJE CAJA MENOR, PERO CON EL ID EN EL LINK
router.get(
  '/pettycash/:id',
  authMiddleware,
  refuelingController.getRefuelingPettyCash
);

module.exports = router;