const pool = require('../models/db');

exports.createRefueling = async ({
  vehiculo_id,
  usuario_id,
  proveedor_id,
  fecha,
  galones,
  valor_total,
  odometro,
  numero_soporte,
  comentario,
  imagen_voucher
}) => {
  try {
    const query = `
      INSERT INTO repostaje (
        vehiculo_id,
        usuario_id,
        proveedor_id,
        fecha_repostaje,
        galones_suministrados,
        valor_dinero,
        odometro,
        numero_soporte,
        comentario,
        vaucher_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const params = [
      vehiculo_id,
      usuario_id,
      proveedor_id,
      fecha,
      galones,
      valor_total,
      odometro,
      numero_soporte,
      comentario,
      imagen_voucher
    ];

    const result = await pool.query(query, params);

    return result.rows[0];

  } catch (error) {
    console.error("Error en createRefueling:", error.message);
    throw error;
  }
};

// MOSTRAR REPOSTAJE BAJO CAJA MENOR
exports.refuelingPettyCash = async ({ id_repostaje }) => {
  const result = await pool.query(
    `
    SELECT 
      r.vehiculo_id,
      r.id_repostaje,
      r.fecha_repostaje,
      r.galones_suministrados,
      r.valor_dinero,
      r.numero_soporte,
      r.vaucher_url,
      v.placa AS plate
    FROM repostaje r
    JOIN vehiculo v 
      ON v.id_vehiculo = r.vehiculo_id
    WHERE r.id_repostaje = $1
    `,
    [id_repostaje]
  );

  if (result.rows.length === 0) {
    throw new Error('repostaje no encontrado');
  }

  return result.rows[0];
};

// CANTIDAD DE GALONES CONSUMIDOS POR MES Y VEHÍCULO (1 vehículo)
exports.refuelingByPlateAndMonth = async ({ vehiculo_id, month }) => {
  const result = await pool.query(
    `
    SELECT 
      v.placa,
      COALESCE(SUM(r.galones_suministrados), 0) AS total_galones
    FROM repostaje r
    INNER JOIN vehiculo v
      ON r.vehiculo_id = v.id_vehiculo
    WHERE r.vehiculo_id = $1
      AND EXTRACT(MONTH FROM r.fecha_repostaje) = $2
    GROUP BY v.placa;
    `,
    [vehiculo_id, month]
  );

  return result.rows[0];
};

// TODOS LOS VEHÍCULOS DE UN CLIENTE + GALONES CONSUMIDOS POR MES
exports.getVehiclesWithGallonsByClient = async ({ id_cliente, month }) => {
  const result = await pool.query(
    `
    SELECT
      v.id_vehiculo,
      v.placa,
      COALESCE(SUM(r.galones_suministrados), 0) AS total_galones
    FROM vehiculo v
    INNER JOIN usuario u
      ON v.usuario_id = u.id_usuario
    LEFT JOIN repostaje r
      ON v.id_vehiculo = r.vehiculo_id
      AND EXTRACT(MONTH FROM r.fecha_repostaje) = $2
    WHERE u.cliente_id = $1
    GROUP BY v.id_vehiculo, v.placa
    ORDER BY v.placa ASC;
    `,
    [id_cliente, month]
  );

  return result.rows;
};