const express = require('express');
const router = express.Router();
const refuelingController = require('../controllers/refueling.controller');
const authMiddleware = require('../middlewares/authMiddleware.js');

router.post('/refueling', authMiddleware, refuelingController.createRefueling);

module.exports = router;