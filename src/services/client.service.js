const { Client } = require('pg');
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


//TRAER CLIENTES CON CANTIDAD DE PLACAS
exports.getPlatesByClient = async ({ id_cliente, rol }) => {
  let result;

  if (rol === 1) {
    result = await pool.query(`
      SELECT c.id_cliente,
             c.nombre AS cliente,
             COUNT(v.id_vehiculo) AS cantidad_placas
      FROM cliente c
      LEFT JOIN usuario u ON u.cliente_id = c.id_cliente
      LEFT JOIN vehiculo v ON v.usuario_id = u.id_usuario
      GROUP BY c.id_cliente, c.nombre
      ORDER BY c.nombre ASC;
    `);

  } else {
    
    result = await pool.query(
      `SELECT c.id_cliente,
              c.nombre AS cliente,
              COUNT(v.id_vehiculo) AS cantidad_placas
       FROM vehiculo v
       JOIN usuario u ON v.usuario_id = u.id_usuario
       JOIN cliente c ON u.cliente_id = c.id_cliente
       WHERE c.id_cliente = $1
       GROUP BY c.id_cliente, c.nombre;`,
      [id_cliente]
    );
  }

  return result.rows || [];
};