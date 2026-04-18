// services/telemetria.service.js
const pool = require('../models/db');

exports.getTelemetriaMensual = async ({ placa, mes, anio }) => {
  const query = `
    SELECT 
      placa,
      EXTRACT(MONTH FROM fecha) AS mes,
      EXTRACT(YEAR FROM fecha) AS anio,

      COALESCE(SUM(distancia_km), 0) AS total_distancia_km,
      COALESCE(SUM(tiempo_total_seg), 0) AS total_tiempo_seg,
      COALESCE(SUM(tiempo_detenido_seg), 0) AS total_detenido_seg,
      COALESCE(SUM(tiempo_ralenti_seg), 0) AS total_ralenti_seg

    FROM telemetria_gps
    WHERE placa = $1
      AND EXTRACT(MONTH FROM fecha) = $2
      AND EXTRACT(YEAR FROM fecha) = $3

    GROUP BY placa, mes, anio
  `;

  const values = [placa, mes, anio];

  const result = await pool.query(query, values);

  return result.rows[0];
};