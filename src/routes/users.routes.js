const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const userService = require('../services/user.service');

//listar conductores
router.get('/listDrivers', authMiddleware, async (req, res) => {
    try {
        const users = await userService.listDrivers({
            userId: req.user.id,
            rol: req.user.rol,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar usuarios' });
    }
});
//listar supervisores
router.get('/listSupervisor', authMiddleware, async (req, res) => {
    try {
        const users = await userService.listSupervisor({
            userId: req.user.id,
            rol: req.user.rol,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar usuarios' });
    }
});

//listar usuarios Administradores
router.get('/listAdmin', authMiddleware, async (req, res) => {
    try {
        const users = await userService.listAdmin({
            userId: req.user.id,
            rol: req.user.rol,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar usuarios' });
    }
});

// editar usuario
router.put('/editUser', authMiddleware, async (req, res) => {
  try {
    const user = await userService.editUser(req.body);
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;