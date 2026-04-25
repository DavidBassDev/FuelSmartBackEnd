const express = require('express');
const router = express.Router();
const fuelSupplierService = require('../services/fuelsupplier.service');
const authMiddleware = require('../middlewares/authMiddleware');

// Listar proveedores de combustible
router.get('/', authMiddleware, async (req, res) => {
    try {
        const fuelSuppliers = await fuelSupplierService.getProveedoresCombustible();

        res.json(fuelSuppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar proveedores de combustible' });
    }
});

module.exports = router;