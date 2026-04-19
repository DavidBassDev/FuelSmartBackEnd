const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const vehiculoService = require('../services/vehicle.service');

//listar todos los vehiculos
router.get('/listVehicles', authMiddleware, async (req, res) => {
  try {

    const vehiculos = await vehiculoService.listVehicles({
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