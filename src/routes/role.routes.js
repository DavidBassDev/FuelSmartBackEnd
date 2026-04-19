const express = require('express');
const router = express.Router();
const controller = require('../controllers/role.controller');
const authMiddleware = require('../middlewares/authMiddleware');

router.get('/', controller.getRoles);

router.get('/listDrivers', authMiddleware, async (req, res) => {
  try {

    const vehiculos = await vehiculoService.listVehicle({
      userId: req.user.id,
      rol: req.user.rol
    });

    res.json(vehiculos);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar vehiculos' });
  }
});

module.exports = router;