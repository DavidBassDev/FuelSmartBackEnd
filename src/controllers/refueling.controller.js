const refuelingService = require('../services/refueling.service');
exports.createRefueling = async (req, res) => {
  try {

    //Imagen
    const imagePath = req.file
      ? `/uploads/vouchers/${req.file.filename}`
      : null;

    //  Datos del body
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
      imagen_voucher: imagePath // LA RUTA
    });

    res.status(201).json(result);

  } catch (error) {
    console.error("Error en createRefueling:", error.message);
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
};

//TRAER LOS REPOSTAJES POR PLACA Y MES
exports.refuelingByPlateAndMonth = async (req, res) => {
  try {
    const { vehiculo_id, month } = req.query;

    if (!vehiculo_id || !month) {
      return res.status(400).json({
        ok: false,
        message: 'vehiculo_id y month son requeridos'
      });
    }

    const data = await refuelingService.refuelingByPlateAndMonth({
      vehiculo_id: Number(vehiculo_id),
      month: Number(month)
    });

    return res.json({
      ok: true,
      data
    });

  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message
    });
  }
};