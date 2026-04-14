const pool = require('../models/db');

exports.listUsers = async ({ userId, rol }) => {
    try {
        let query = '';
        let params = [];

        console.log("ROL:", rol);
        console.log("USER ID:", userId);

        // ADMIN ve todos los usuarios
        if (rol === "admin") {
            query = `
      SELECT 
      u.id_usuario, 
      u.nombre_completo,
      u.id_vehiculo,
      uc.nombre AS nombre,
      v.placa
     FROM usuario u

     LEFT JOIN cliente uc 
      ON u.cliente_id = uc.id_cliente

     LEFT JOIN vehiculo v 
     ON u.id_vehiculo = v.id_vehiculo

     LEFT JOIN tipo_vehiculo tp 
     ON v.id_tipo_vehiculo = tp.id_tipovehiculo
     ORDER BY v.id_vehiculo;
      `;
        }

        // CONDUCTOR → solo sus vehículos
        else if (rol === "conductor") {
            query = `
        SELECT 
          v.id_vehiculo,
          v.usuario_id,
          v.placa,
          v.id_tipo_vehiculo,
          tv.nombre AS tipo_vehiculo,
          v.rendimiento_teorico,
          v.rendimiento,
          v.cupo_combustible,
          COALESCE(STRING_AGG(p.nombre_proveedor, ', '), '') AS proveedores
        FROM vehiculo v
        JOIN tipo_vehiculo tv 
          ON v.id_tipo_vehiculo = tv.id_tipovehiculo
        LEFT JOIN vehiculo_proveedor vp 
          ON v.id_vehiculo = vp.id_vehiculo
        LEFT JOIN proveedor_combustible p 
          ON vp.id_proveedor = p.id_proveedor
        WHERE v.usuario_id = $1
        GROUP BY 
          v.id_vehiculo, v.usuario_id, v.placa, 
          v.id_tipo_vehiculo, tv.nombre,
          v.rendimiento_teorico, v.rendimiento, v.cupo_combustible
        ORDER BY v.id_vehiculo;
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