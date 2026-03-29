const refuelingService = require('../services/refueling.service');

exports.createRefueling = async (req, res) => {
  try {
    const usuario_id = req.user.id;

    const newRefueling = await refuelingService.createRefueling({
      ...req.body,
      usuario_id
    });

    res.status(201).json(newRefueling);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};