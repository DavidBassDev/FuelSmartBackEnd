const express = require('express');
const router = express.Router();
const dashboardService = require('./dashboard.service');
const authMiddleware = require('../../middlewares/authMiddleware');

//Listar vehículos con poco cupo
router.get('/LowFuelVehicles', authMiddleware, async (req, res) => {
    try {
        const data = await dashboardService.getLowFuelVehicles();

        return res.json({
            ok: true,
            data,
        });

    } catch (error) {
        console.error('Error low-fuel:', error.message);

        return res.status(500).json({
            ok: false,
            message: 'Error al obtener vehículos con bajo cupo',
        });
    }
}
);

//Listar vehículos con cupo agotado
router.get('/AllGallonsConsumed', authMiddleware, async (req, res) => {
    try {
        const data = await dashboardService.getNoFuelVehicles();

        return res.json({
            ok: true,
            data,
        });

    } catch (error) {
        console.error('Error sin cupo:', error.message);

        return res.status(500).json({
            ok: false,
            message: 'Error al obtener vehículos con cupo agotado',
        });
    }
}
);

module.exports = router;