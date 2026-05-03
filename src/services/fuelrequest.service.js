const pool = require('../models/db');

exports.createFuelRequest = async ({
  id_vehiculo,
  id_proveedor,
  galones_solicitados,
  comentario,
  solicitado_por,
}) => {
  const query = `
    INSERT INTO solicitud_combustible
    (id_vehiculo, id_proveedor, galones_solicitados, comentario, solicitado_por)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    id_vehiculo,
    id_proveedor,
    galones_solicitados,
    comentario,
    solicitado_por, // 🔥 ESTE ES EL QUE FALTA
  ];

  console.log("VALUES:", values); // 👈 DEBUG

  const result = await pool.query(query, values);
  return result.rows[0];
};

//MANEJAR SOLICITUD
exports.updateFuelRequestStatus = async ({
  id_solicitud,
  estado,
  respondido_por,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1️⃣ Actualizar solicitud
    const updateRequestQuery = `
      UPDATE solicitud_combustible
      SET estado = $1,
          fecha_respuesta = NOW(),
          respondido_por = $2
      WHERE id_solicitud = $3
      RETURNING *;
    `;

    const requestResult = await client.query(updateRequestQuery, [
      estado,
      respondido_por,
      id_solicitud,
    ]);

    const request = requestResult.rows[0];

    // 👉 si no es aprobado, termina aquí
    if (estado !== 'aprobado') {
      await client.query('COMMIT');
      return request;
    }

    // 2️⃣ Obtener datos del vehículo + proveedor
    const dataQuery = `
      SELECT 
        sc.galones_solicitados,
        sc.id_vehiculo,
        vp.id_proveedor
      FROM solicitud_combustible sc
      LEFT JOIN vehiculo_proveedor vp 
        ON sc.id_vehiculo = vp.id_vehiculo
      WHERE sc.id_solicitud = $1;
    `;

    const dataResult = await client.query(dataQuery, [id_solicitud]);
    const data = dataResult.rows[0];

    if (!data) throw new Error("Solicitud no encontrada");

    const { galones_solicitados, id_vehiculo, id_proveedor } = data;

    // 3️⃣ Update proveedor (sumar cupo)
    const updateProveedorQuery = `
      UPDATE vehiculo_proveedor
      SET cupo_asignado = COALESCE(cupo_asignado, 0) + $1
      WHERE id_vehiculo = $2
        AND id_proveedor = $3;
    `;

    await client.query(updateProveedorQuery, [
      galones_solicitados,
      id_vehiculo,
      id_proveedor,
    ]);

    // 4️⃣ Update vehículo (sumar cupo_combustible)
    const updateVehiculoQuery = `
      UPDATE vehiculo
      SET cupo_combustible = COALESCE(cupo_combustible, 0) + $1
      WHERE id_vehiculo = $2;
    `;

    await client.query(updateVehiculoQuery, [
      galones_solicitados,
      id_vehiculo,
    ]);

    await client.query('COMMIT');

    return request;

  } catch (error) {
    await client.query('ROLLBACK');
    console.error("Error en updateFuelRequestStatus:", error);
    throw error;
  } finally {
    client.release();
  }
};
//TRAER SOLICITUDES PENDIENTES POR AUMENTO
exports.getPendingFuelRequests = async () => {
  try {
    const query = `
      SELECT 
  sc.id_solicitud,
  sc.galones_solicitados,
  sc.comentario,
  sc.estado,

  v.id_vehiculo,
  v.placa,
  v.cupo_combustible,

  COALESCE(c.nombre, 'Sin cliente') AS cliente, -- 🔥 fallback

  COALESCE(SUM(r.galones_suministrados), 0) AS galones_consumidos

FROM solicitud_combustible sc

INNER JOIN vehiculo v 
  ON sc.id_vehiculo = v.id_vehiculo

INNER JOIN usuario u 
  ON v.usuario_id = u.id_usuario

LEFT JOIN cliente c   -- 🔥 CAMBIO CLAVE
  ON u.cliente_id = c.id_cliente

LEFT JOIN repostaje r 
  ON v.id_vehiculo = r.vehiculo_id

WHERE sc.estado = 'pendiente'

GROUP BY 
  sc.id_solicitud,
  v.id_vehiculo,
  c.nombre

ORDER BY sc.id_solicitud DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error("Error obteniendo solicitudes:", error);
    throw error;
  }
};
