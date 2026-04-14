const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const userService = require('../services/user.service');

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

module.exports = router;