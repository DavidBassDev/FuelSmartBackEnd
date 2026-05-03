const pool = require('../../models/db');

exports.getLowFuelVehicles = async () => {
  const result = await pool.query(`
    SELECT 
  v.placa,
  v.id_vehiculo,
  v.cupo_combustible,
  c.nombre AS cliente_nombre,
  COALESCE(SUM(r.galones_suministrados), 0) AS total_galones,
  v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0) AS cupo_restante
FROM vehiculo v
LEFT JOIN repostaje r 
  ON r.vehiculo_id = v.id_vehiculo
  AND r.fecha_repostaje >= DATE_TRUNC('month', CURRENT_DATE)
  AND r.fecha_repostaje < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
LEFT JOIN usuario u 
  ON u.id_usuario = r.usuario_id
LEFT JOIN cliente c 
  ON c.id_cliente = u.cliente_id
GROUP BY 
  v.placa, 
  v.id_vehiculo,
  v.cupo_combustible,
  c.nombre
HAVING 
  (v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0)) <= 30;
  `);

  return result.rows;
};

exports.getNoFuelVehicles = async () => {
  const result = await pool.query(`
    SELECT 
  v.placa,
  v.id_vehiculo,
  v.cupo_combustible,
  c.nombre AS cliente_nombre,
  COALESCE(SUM(r.galones_suministrados), 0) AS total_galones,
  v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0) AS cupo_restante
FROM vehiculo v
LEFT JOIN repostaje r 
  ON r.vehiculo_id = v.id_vehiculo
  AND r.fecha_repostaje >= DATE_TRUNC('month', CURRENT_DATE)
  AND r.fecha_repostaje < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month'
LEFT JOIN usuario u 
  ON u.id_usuario = r.usuario_id
LEFT JOIN cliente c 
  ON c.id_cliente = u.cliente_id
GROUP BY 
  v.placa, 
  v.id_vehiculo,
  v.cupo_combustible,
  c.nombre
HAVING 
  (v.cupo_combustible - COALESCE(SUM(r.galones_suministrados), 0)) <= 0.0;
  `);

  return result.rows;
};