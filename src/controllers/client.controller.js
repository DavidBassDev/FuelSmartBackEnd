const service = require('../services/client.service');

exports.getClient = async (req, res) => {
  try {
    const clients = await service.getClient();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// TRAER PLACAS POR CLIENTE
exports.getPlatesByClient = async (req, res) => {
  try {
    const { id_cliente } = req.body;
    if (!id_cliente) {
      return res.status(400).json({
        ok: false,
        error: "id_cliente es requerido"
      });
    }

    const data = await service.getPlatesByClient({ id_cliente });

    res.json({
      data
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};