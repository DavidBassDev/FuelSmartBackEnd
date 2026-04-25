const service = require('../services/fuelsupplier.service');

exports.getFuelSupplier = async (req, res) => {
  try {
    const fuelSuppliers = await service.getProveedoresCombustible();
    res.json(fuelSuppliers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};