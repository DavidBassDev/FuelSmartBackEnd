const pool = require('../models/db');

exports.getRoles = async () => {
  try {
    const query = `
      SELECT id_rol, nombre
      FROM rol
      ORDER BY id_rol
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error("Error en getRoles:", error.message);
    throw error;
  }
};