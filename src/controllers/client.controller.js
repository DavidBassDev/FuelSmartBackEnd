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
    const { id_cliente, rol } = req.query;

    // Solo validar id_cliente si NO es admin
    if (parseInt(rol) !== 1 && !id_cliente) {
      return res.status(400).json({
        ok: false,
        error: "id_cliente es requerido"
      });
    }

    const data = await service.getPlatesByClient({
      id_cliente: id_cliente ? parseInt(id_cliente) : null,
      rol: parseInt(rol),
    });

    res.json({ data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// TRAER VEHICULOS POR CLIENTE
exports.getVehiclesByClient = async (req, res) => {
  try {
    const { id_cliente } = req.query;
    const id = parseInt(id_cliente);

    if (!id_cliente || isNaN(id)) {
      return res.status(400).json({
        ok: false,
        error: "id_cliente requerido"
      });
    }

    const data = await service.getVehiclesByClient({
      id_cliente: id,
    });

    res.json({
      ok: true,
      data: data || null
    });

  } catch (error) {
    res.status(500).json({
      ok: false,
      error: error.message
    });
  }
};