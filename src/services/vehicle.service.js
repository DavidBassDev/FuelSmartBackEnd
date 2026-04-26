const pool = require('../models/db');



//listar todos los vehiculos segun rol
const listVehicles = async ({ userId, rol }) => {
  try {
    let query;
    let values = [];

    if (rol === 'admin') {
      query = `SELECT * FROM vehiculo`;
    } else {
      query = `
        SELECT v.*
        FROM vehiculo v
        INNER JOIN usuario u ON u.id_vehiculo = v.id_vehiculo
        WHERE u.id_usuario = $1
      `;
      values = [userId];
    }

    const { rows } = await pool.query(query, values);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//traer todas las placas, con su id

const listAllVehicles = async () => {
  try {
    const query = `SELECT id_vehiculo, placa FROM vehiculo`;
    const { rows } = await pool.query(query);
    return rows;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

//Crear vehiculo
const createVehicle = async ({
  usuario_id,
  placa,
  rendimiento_teorico,
  cupo_combustible,
  fecha_creacion,
  creado_por,
  id_tipo_vehiculo,
}) => {
  const result = await pool.query(
    `INSERT INTO vehiculo 
    (usuario_id, placa, rendimiento_teorico, cupo_combustible, fecha_creacion, creado_por, id_tipo_vehiculo, rendimiento, estado, fecha_actualizacion)
    VALUES ($1, $2, $3, $4, $5, $6, $7, 32, true, null)
    RETURNING placa;`,
    [
      usuario_id,
      placa,
      rendimiento_teorico,
      cupo_combustible,
      fecha_creacion,
      creado_por,
      id_tipo_vehiculo,
    ]
  );

  return result.rows[0];
};

//Listar tipos de vehiculo
const getVehicleType = async () => {
  try {
    const query = `
      SELECT id_tipovehiculo, nombre
      FROM tipo_vehiculo
      ORDER BY nombre ASC
    `;
    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    console.error("Error en listar tipos de vehiculos: ", error.message);
    throw error;
  }
};

module.exports = {
  listVehicles,
  listAllVehicles,
  createVehicle,
  getVehicleType,
};