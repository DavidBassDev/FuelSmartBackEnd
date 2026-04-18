const pool = require('../models/db');

exports.getTelemetriaMensual = async ({ placa, mes, anio }) => {
  try {
    let query = `
      SELECT 
        t.placa,
        $2 AS mes,
        $3 AS anio,

        COALESCE(SUM(t.distancia_km), 0) AS total_distancia_km,
        COALESCE(SUM(t.tiempo_total_seg), 0) AS total_tiempo_seg,
        COALESCE(SUM(t.tiempo_detenido_seg), 0) AS total_detenido_seg,
        COALESCE(SUM(t.tiempo_ralenti_seg), 0) AS total_ralenti_seg

      FROM telemetria_gps t
      WHERE t.placa = $1
        AND t.fecha >= make_date($3, $2, 1)
        AND t.fecha < (make_date($3, $2, 1) + INTERVAL '1 month')
    `;

    const params = [placa, mes, anio];

    const result = await pool.query(query, params);

    return result.rows[0] || {};

  } catch (error) {
    console.error("Error en getTelemetriaMensual:", error.message);
    throw error;
  }
};