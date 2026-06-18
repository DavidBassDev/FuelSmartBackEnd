const express = require('express');
const router = express.Router();
const controller = require('./fuelrequest.controller.js');
const service = require('./fuelrequest.service.js');
const authMiddleware = require('../../middlewares/authMiddleware.js');

// SOLICITUD
router.post('/fuel-request', authMiddleware, controller.createFuelRequest);

// RESPUESTA
router.put('/updateFuelRequestStatus', authMiddleware, async (req, res) => {
  try {
    const result = await service.updateFuelRequestStatus(req.body);
    res.status(200).json(result);
  } catch (error) { 
    res.status(400).json({ error: error.message });
  }
});
//CONSULTA
router.get('/pendingRequests', authMiddleware, async (req, res) => {
  try {
    const data = await service.getAllPendingFuelRequests(); // ✅

    res.status(200).json({ ok: true, data });

  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
});

// CONSULTA DEL CONDUCTOR SOBRE SUS SOLICITUDES
router.get('/mypendingRequests', authMiddleware, async (req, res) => {
  try {
    const idSolicitante = req.user.id;

    const data = await service.getPendingFuelRequests(idSolicitante);

    res.status(200).json({
      ok: true,
      data,
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
});

//AUMENTAR CUPO VEHICULO
router.post('/addFuel', authMiddleware, controller.addFuelToVehicle);


module.exports = router;