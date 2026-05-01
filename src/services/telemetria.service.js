// services/telemetria.service.js
const pool = require('../models/db');

exports.getTelemetriaMensual = async ({ placa, mes, anio }) => {
  const query = `
    SELECT 
      $1::text AS placa,
      $2::int AS mes,
      $3::int AS anio,

      COALESCE(SUM(distancia_km), 0) AS total_distancia_km,
      COALESCE(SUM(tiempo_total_seg), 0) AS total_tiempo_seg,
      COALESCE(SUM(tiempo_detenido_seg), 0) AS total_detenido_seg,
      COALESCE(SUM(tiempo_ralenti_seg), 0) AS total_ralenti_seg

    FROM telemetria_gps
    WHERE placa = $1
      AND EXTRACT(MONTH FROM fecha)::int = $2
      AND EXTRACT(YEAR FROM fecha)::int = $3;
  `;

  const values = [
    placa,
    parseInt(mes),
    parseInt(anio),
  ];

  const result = await pool.query(query, values);

  return result.rows[0];
};

//TRAER EL LISTADO DE GPS EN EL MES ACTUAL

exports.getTelemetryVehicleList = async ({ placa }) => {
  const query = `
    SELECT 
      id,
      placa,
      fecha,
      distancia_km,
      tiempo_total_seg,
      tiempo_detenido_seg,
      tiempo_ralenti_seg,

      EXTRACT(MONTH FROM fecha)::int AS mes,
      EXTRACT(YEAR FROM fecha)::int AS anio

    FROM telemetria_gps
    WHERE placa = $1
      AND EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)

    ORDER BY fecha DESC;
  `;

  const result = await pool.query(query, [placa]);

  return result.rows;
};