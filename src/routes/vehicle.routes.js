const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const vehiculoService = require('../services/vehicle.service');

router.get('/listDrivers', authMiddleware, async (req, res) => {
  try {

    const vehiculos = await vehiculoService.listVehicle({
      userId: req.user.id,
      rol: req.user.rol
    });

    res.json(vehiculos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar vehículos' });
  }
});

module.exports = router;