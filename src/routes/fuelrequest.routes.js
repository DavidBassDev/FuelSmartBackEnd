const express = require('express');
const router = express.Router();
const controller = require('../controllers/fuelrequest.controller.js');

//  SOLICITUD
router.post('/fuel-request', controller.createFuelRequest);

// RESPUESTA
router.put('/fuel-request/respond', controller.updateFuelRequestStatus);

module.exports = router;