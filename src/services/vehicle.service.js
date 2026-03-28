const pool = require('../models/db');

exports.listVehicle = async ({ userId, rol }) => {
  try {
    let query = '';
    let params = [];

    console.log("ROL:", rol);
    console.log("USER ID:", userId);

    if (rol === "admin") {
      query = `
        SELECT 
          id_vehiculo, 
          usuario_id,
          proveedor_id,
          placa, 
          id_tipo_vehiculo,
          rendimiento_teorico,
          rendimiento,
          cupo_combustible
        FROM vehiculo
      `;
    }
    else if (rol === "conductor") {
      query = `SELECT v.id_vehiculo,
       v.usuario_id,
       v.proveedor_id,
       p.nombre_proveedor AS proveedor,
       v.placa,
       v.id_tipo_vehiculo,
       tv.nombre AS tipo_vehiculo, v.rendimiento_teorico,
       v.rendimiento,
       v.cupo_combustible FROM vehiculo v
       JOIN proveedor_combustible p 
       ON v.proveedor_id = p.id_proveedor
       JOIN tipo_vehiculo tv 
       ON v.id_tipo_vehiculo = tv.id_tipovehiculo
       WHERE v.usuario_id = $1;
       `;

      params = [userId];
    }
    else {
      throw new Error(`Rol no permitido: ${rol}`);
    }

    const result = await pool.query(query, params);

    return result.rows || [];

  } catch (error) {
    console.error("Error en listVehicle:", error.message);
    throw error;
  }
};