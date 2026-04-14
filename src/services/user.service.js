const pool = require('../models/db');

//listar conductores
exports.listDrivers = async ({ rol }) => {
    try {

        if (rol !== "admin") {
            throw new Error("No autorizado");
        }

        const query = `
      SELECT 
  u.id_usuario,
  u.nombre_completo,
  u.rol_id,
  u.id_vehiculo,
  v.placa,
  uc.nombre AS nombre
FROM usuario u
LEFT JOIN cliente uc 
  ON u.cliente_id = uc.id_cliente
LEFT JOIN vehiculo v 
  ON u.id_vehiculo = v.id_vehiculo
WHERE u.rol_id = $1
ORDER BY u.id_usuario;
    `;

        const result = await pool.query(query);

        return result.rows || [];

    } catch (error) {
        console.error("Error en listar usuarios:", error.message);
        throw error;
    }
};