const express = require('express');
const router = express.Router();
const controller = require('../controllers/telemetria.controller');

router.get('/', controller.getTelemetria);
router.get('/mensual', controller.getTelemetriaMensual);

module.exports = router;