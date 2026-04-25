const pool = require('../models/db');

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


const listAllVehicles = async () => {
  try {

    let query;
    let values = [];
 
      query = `
        SELECT id_vehiculo, placa FROM vehiculo
      `;
    

    const { rows } = await pool.query(query, values);
    return rows;

  } catch (error) {
    console.error(error);
    throw error;
  }
};
module.exports = {
  listVehicles,
  listAllVehicles,
  
};