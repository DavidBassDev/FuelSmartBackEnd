const service = require('../services/fuelrequest.service');

exports.createFuelRequest = async (req, res) => {
  try {
    const { id_vehiculo, id_proveedor, galones_solicitados, comentario } = req.body;

    const solicitado_por = req.user.id; //  viene del JWT del BD

    if (!id_vehiculo || !id_proveedor || !galones_solicitados) {
      return res.status(400).json({
        ok: false,
        message: 'Campos obligatorios faltantes',
      });
    }

    const data = await service.createFuelRequest({
      id_vehiculo,
      id_proveedor,
      galones_solicitados,
      comentario,
      solicitado_por,
    });

    return res.status(201).json({
      ok: true,
      message: 'Solicitud creada correctamente',
      data,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
};

//MANEJO SOLICITUD 
exports.updateFuelRequestStatus = async ({
  id_solicitud,
  estado,
  respondido_por,
}) => {
  const query = `
    UPDATE solicitud_combustible
    SET estado = $1,
        fecha_respuesta = NOW(),
        respondido_por = $2
    WHERE id_solicitud = $3
    RETURNING *;
  `;

  const values = [estado, respondido_por, id_solicitud];

  const result = await pool.query(query, values);
  return result.rows[0];
};