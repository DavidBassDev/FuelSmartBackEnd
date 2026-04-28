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
exports.getPlatesByClient = async ({ id_cliente }) => {
  const result = await pool.query(
    `SELECT c.nombre AS cliente,
            COUNT(v.id_vehiculo) AS cantidad_placas
     FROM vehiculo v
     JOIN usuario u ON v.usuario_id = u.id_usuario
     JOIN cliente c ON u.cliente_id = c.id_cliente
     WHERE c.id_cliente = $1
     GROUP BY c.nombre;`,
    [id_cliente]
  );
console.log("ID en service:", id_cliente);
  return result.rows || [];
};