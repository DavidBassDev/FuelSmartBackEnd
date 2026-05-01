const pool = require('../models/db');

exports.getLowFuelVehicles = async () => {
  const result = await pool.query(`
    SELECT 
      v.placa,
      v.cupo_combustible,
      COALESCE(SUM(r.galones_suministrados), 0) AS total_galones,
      v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0) AS cupo_restante
    FROM vehiculo v
    LEFT JOIN repostaje r 
      ON r.vehiculo_id = v.id_vehiculo
      AND r.fecha_repostaje >= DATE_TRUNC('month', CURRENT_DATE)
      AND r.fecha_repostaje < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
    GROUP BY v.placa, v.cupo_combustible
    HAVING (v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0)) <= 30
  `);

  return result.rows;
};

exports.getNoFuelVehicles = async () => {
  return await pool.query(`
    SELECT * FROM vehiculo
    WHERE cupo_actual <= 0
  `);
};