const express = require('express');
const router = express.Router();

const refuelingController = require('../controllers/refueling.controller');
const authMiddleware = require('../middlewares/authMiddleware.js');
const upload = require('../middlewares/uploadRefueling');

// CREAR REPOSTAJE
router.post(
  '/refueling',
  authMiddleware,
  upload.single('imagen'), // nombre del campo que envía Flutter
  refuelingController.createRefueling
);

// MOSTRAR REPOSTAJE CAJA MENOR POR ID
router.get(
  '/pettycash/:id',
  authMiddleware,
  refuelingController.getRefuelingPettyCash
);

// TOTAL GALONES POR MES Y VEHÍCULO (1 vehículo)
router.get(
  '/totalByMonth',
  authMiddleware,
  refuelingController.refuelingByPlateAndMonth
);

// TODOS LOS VEHÍCULOS DE UN CLIENTE + GALONES CONSUMIDOS
router.get(
  '/vehiclesByClient',
  authMiddleware,
  refuelingController.getVehiclesWithGallonsByClient
);

module.exports = router;