const express = require('express');
const router = express.Router();
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

//MOSTRAR REPOSTAJE BAJO CAJA MENOR
exports.refuelingPettyCash = async ({ id_repostaje}) => {

  const result = await pool.query(
    `SELECT 
        r.vehiculo_id,
        r.id_repostaje,
        r.fecha_repostaje,
        r.galones_suministrados,
        r.valor_dinero,
        r.numero_soporte,
        r.vaucher_url,
        v.placa AS plate
     FROM repostaje r
     JOIN vehiculo v ON v.id_vehiculo = r.vehiculo_id
     WHERE r.id_repostaje = $1`,
    [id_repostaje]
  );

  if (result.rows.length === 0) {
    throw new Error('repostaje no encontrado');
  }

 

  return result.rows[0];
};