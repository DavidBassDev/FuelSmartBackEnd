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
//listar todos los usuarios
router.get('/listUsers', authMiddleware, async (req, res) => {
    try {
        const users = await userService.listUsers({
            userId: req.user.id,
            rol: req.user.rol,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar usuarios' });
    }
});

module.exports = router;