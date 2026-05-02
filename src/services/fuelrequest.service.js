const pool = require('../models/db');

exports.createFuelRequest = async ({
  id_vehiculo,
  id_proveedor,
  galones_solicitados,
  comentario,
  solicitado_por,
}) => {
  const query = `
    INSERT INTO solicitud_combustible
    (id_vehiculo, id_proveedor, galones_solicitados, comentario, solicitado_por)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    id_vehiculo,
    id_proveedor,
    galones_solicitados,
    comentario,
    solicitado_por,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

//MANEJAR LA SOLICITUD ANTERIOR
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