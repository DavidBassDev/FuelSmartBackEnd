const refuelingService = require('../services/refueling.service');
exports.createRefueling = async (req, res) => {
  try {

    // 📸 Imagen (si viene)
    const imagePath = req.file
      ? `/uploads/vouchers/${req.file.filename}`
      : null;

    // 📦 Datos del body
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

    // 💾 Guardar en BD
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
      imagen_voucher: imagePath // 👈 AQUÍ VA LA RUTA
    });

    res.status(201).json(result);

  } catch (error) {
    console.error("Error en createRefueling:", error.message);
    res.status(500).json({ error: error.message });
  }
};