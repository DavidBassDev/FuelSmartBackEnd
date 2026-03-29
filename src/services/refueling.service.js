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
        vaucher_url
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
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
            imagen_voucher
        ];

        const result = await pool.query(query, params);

        return result.rows[0];

    } catch (error) {
        console.error("Error en createRefueling:", error.message);
        throw error;
    }
};