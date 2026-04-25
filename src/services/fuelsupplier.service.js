const pool = require('../models/db');

// Listar los proveedores de combustible
exports.getProveedoresCombustible = async () => {
  try {
    const query = `
      SELECT 
        id_proveedor,
        nombre_proveedor
      FROM proveedor_combustible
      WHERE id_proveedor != 3
      ORDER BY nombre_proveedor ASC
    `;

    const result = await pool.query(query);

    return result.rows;
  } catch (error) {
    throw error;
  }
};