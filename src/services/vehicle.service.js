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
const createVehicle = async (data) => {
  const {
    usuario_id,
    placa,
    rendimiento_teorico,
    cupo_combustible,
    creado_por,
    id_tipo_vehiculo,
    rendimiento,
    id_proveedor // 👈 ESTE TE FALTA
  } = data;

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Crear vehículo
    const vehicleResult = await client.query(
      `INSERT INTO vehiculo 
      (usuario_id, placa, rendimiento_teorico, cupo_combustible, fecha_creacion, creado_por, id_tipo_vehiculo, rendimiento, estado)
      VALUES ($1,$2,$3,$4,NOW(),$5,$6,$7,true)
      RETURNING id_vehiculo;`,
      [
        usuario_id,
        placa,
        rendimiento_teorico,
        cupo_combustible,
        creado_por,
        id_tipo_vehiculo,
        rendimiento
      ]
    );

    const idVehiculo = vehicleResult.rows[0].id_vehiculo;

    //Insertar relacion con proveedor
    await client.query(
      `INSERT INTO vehiculo_proveedor 
      (id_vehiculo, id_proveedor, cupo_asignado, cupo_consumido)
      VALUES ($1, $2, 0, 0);`,
      [idVehiculo, id_proveedor]
    );

    await client.query('COMMIT');

    return { idVehiculo };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
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