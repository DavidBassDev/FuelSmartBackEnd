const pool = require('../models/db');

exports.getClient = async () => {
  try {
    const query = `
      SELECT id_cliente, nombre
      FROM cliente
      ORDER BY nombre ASC
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error("Error en getClient:", error.message);
    throw error;
  }
};