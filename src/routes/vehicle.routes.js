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

//CREAR VEHICULO
router.post('/create', authMiddleware, async (req, res) => {
  try {

    console.log("BODY:", req.body); 

    const user = await vehiculoService.createVehicle(req.body);

    res.status(200).json({
      message: 'Vehiculo creado correctamente',
      user
    });

  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;