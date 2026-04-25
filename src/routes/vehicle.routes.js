const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const vehiculoService = require('../services/vehicle.service');

//listar vehiculos asignados
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

//LISTAR TODOS LOS VEHICULOS
router.get('/listAllVehicles', async (req, res) => {
  try {

    const vehiculos = await vehiculoService.listAllVehicles();

    res.json(vehiculos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar todos los vehículos' });
  }
});

module.exports = router;