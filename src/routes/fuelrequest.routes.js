const express = require('express');
const router = express.Router();
const controller = require('../controllers/fuelrequest.controller.js');
const service = require('../services/fuelrequest.service.js');
const authMiddleware = require('../middlewares/authMiddleware.js');

// 🔹 SOLICITUD
router.post('/fuel-request', authMiddleware, controller.createFuelRequest);

// 🔹 RESPUESTA
router.put('/updateFuelRequestStatus', authMiddleware, async (req, res) => {
  try {
    const result = await service.updateFuelRequestStatus(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;