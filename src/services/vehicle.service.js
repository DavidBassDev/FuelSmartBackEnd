const pool = require('../models/db');

exports.listVehicle = async ({ userId, rol }) => {

  let query;
  let params = [];

  console.log("ROL:", rol);
  console.log("TIPO:", typeof rol);

  if (rol === "admin") {

    query = `
      SELECT id_vehiculo, placa, tipo_vehiculo_id,
             rendimiento_teorico, rendimiento, cupo_combustible
      FROM vehiculo
    `;

  } else if (rol === "conductor") {

    query = `
      SELECT id_vehiculo, placa, tipo_vehiculo_id,
             rendimiento_teorico, cupo_combustible
      FROM vehiculo
      WHERE usuario_id = $1
    `;

    params = [userId];

  } else {
    throw new Error('rol aun no manejado');
  }

  const result = await pool.query(query, params);
  return result.rows;
};