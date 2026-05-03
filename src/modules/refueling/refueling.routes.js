const express = require('express');
const router = express.Router();

const refuelingController = require('./refueling.controller.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');
const upload = require('../../middlewares/uploadRefueling.js');

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
  refuelingController.refuelingByPlateAndMonth
);

// TODOS LOS VEHÍCULOS DE UN CLIENTE + GALONES CONSUMIDOS
router.get(
  '/vehiclesByClient',
  authMiddleware,
  refuelingController.getVehiclesWithGallonsByClient
);
//TODOS LOS CONSUMOS DE UN VEHICULO EN MES ACTUAL
router.get(
  '/refuelingPlate',
  authMiddleware,
  refuelingController.getVehiclesWithGallonsList
);

module.exports = router;