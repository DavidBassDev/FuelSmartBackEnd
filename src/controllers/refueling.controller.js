const refuelingService = require('../services/refueling.service');

exports.createRefueling = async (req, res) => {
  try {
    // Imagen
    const imagePath = req.file
      ? `/uploads/vouchers/${req.file.filename}`
      : null;

    // Datos del body
    const {
      vehiculo_id,
      usuario_id,
      proveedor_id,
      fecha,
      galones,
      valor_total,
      odometro,
      numero_soporte,
      comentario,
    } = req.body;

    // Guardar en BD
    const result = await refuelingService.createRefueling({
      vehiculo_id,
      usuario_id,
      proveedor_id,
      fecha,
      galones,
      valor_total,
      odometro,
      numero_soporte,
      comentario,
      imagen_voucher: imagePath,
    });

    res.status(201).json(result);

  } catch (error) {
    console.error("Error en createRefueling:", error.message);
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

exports.getRefuelingPettyCash = async (req, res) => {
  try {
    const repostaje = await refuelingService.refuelingPettyCash({
      id_repostaje: req.params.id,
    });

    res.json(repostaje);

  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// TRAER LOS REPOSTAJES POR PLACA Y MES (1 vehículo)
exports.refuelingByPlateAndMonth = async (req, res) => {
  try {
    const { vehiculo_id, month } = req.query;

    if (!vehiculo_id || !month) {
      return res.status(400).json({
        ok: false,
        message: "vehiculo_id y month son requeridos",
      });
    }

    const data = await refuelingService.refuelingByPlateAndMonth({
      vehiculo_id: Number(vehiculo_id),
      month: Number(month),
    });

    return res.json({
      ok: true,
      data,
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// TRAER TODOS LOS VEHÍCULOS DE UN CLIENTE + GALONES CONSUMIDOS
exports.getVehiclesWithGallonsByClient = async (req, res) => {
  try {
    const { id_cliente, month } = req.query;

    if (!id_cliente || !month) {
      return res.status(400).json({
        ok: false,
        message: "id_cliente y month son requeridos",
      });
    }

    const data = await refuelingService.getVehiclesWithGallonsByClient({
      id_cliente: Number(id_cliente),
      month: Number(month),
    });

    return res.json({
      ok: true,
      data,
    });

  } catch (error) {
    console.error("Error getVehiclesWithGallonsByClient:", error.message);

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

//TRAER LISTA DE TODOS LOS CONSUMOS DE UNA PLACA, MES ACTUAL
// TRAER LISTA DE CONSUMOS DE UN VEHICULO (MES ACTUAL)
exports.getVehiclesWithGallonsList = async (req, res) => {
  try {
    const { vehiculo_id } = req.query;

    if (!vehiculo_id) {
      return res.status(400).json({
        ok: false,
        message: "vehiculo_id es requerido",
      });
    }

    const data = await refuelingService.getVehiclesWithGallonsList({
      vehiculo_id: Number(vehiculo_id),
    });

    return res.json({
      ok: true,
      data,
    });

  } catch (error) {
    console.error("Error trayendo listado:", error);

    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};