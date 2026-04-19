const express = require('express');
const router = express.Router();
const controller = require('../controllers/client.controller');
router.get('/', controller.getClient);

module.exports = router;