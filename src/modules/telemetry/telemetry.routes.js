const express = require('express');
const router = express.Router();
const controller = require('./telemetry.controller');

router.get('/mensual', controller.getTelemetriaMensual);
router.get('/getTelemetryVehicle', controller.getTelemetryVehicleList);

module.exports = router;