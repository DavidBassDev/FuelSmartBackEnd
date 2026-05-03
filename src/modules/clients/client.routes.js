const express = require('express');
const router = express.Router();
const controller = require('./client.controller');
router.get('/', controller.getClient);
router.get('/listPlates', controller.getPlatesByClient);
router.get('/listVehicles', controller.getVehiclesByClient);

module.exports = router;