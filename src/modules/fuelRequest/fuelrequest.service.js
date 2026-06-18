const pool = require('../../models/db');

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
    solicitado_por,
  ];

  console.log("VALUES:", values); //DEBUG

  const result = await pool.query(query, values);
  return result.rows[0];
};

//MANEJAR SOLICITUD
exports.updateFuelRequestStatus = async ({
  id_solicitud,
  estado,
  respondido_por, //Quien aprobó la solicitud
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Actualizar solicitud
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

    // SI NO APRUEBA EL CODIGO LO TERMINO ACA
    if (estado !== 'aprobado') {
      await client.query('COMMIT');
      return request;
    }

    // Obtener datos del vehículo y proveedor combustible
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

    // sumar cupo
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

    // Update vehiculo (sumar a cupo_combustible)
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

//LISTAR SOLICITUDES DE AUMENTO
exports.getAllPendingFuelRequests = async () => {
  try {
    const query = `
      SELECT 
        sc.id_solicitud,
        sc.estado,
        sc.galones_solicitados,
        sc.comentario,
        v.id_vehiculo,
        v.placa,
        v.cupo_combustible
      FROM solicitud_combustible sc
      INNER JOIN vehiculo v 
        ON sc.id_vehiculo = v.id_vehiculo
      WHERE sc.estado = 'pendiente'
      ORDER BY sc.id_solicitud DESC;
    `;

    const result = await pool.query(query);

    return result.rows;

  } catch (error) {
    console.error(error);
    throw error;
  }
};
//TRAER SOLICITUDES PENDIENTES
exports.getPendingFuelRequests = async (id_solicitante) => {
  try {
    const query = `
      SELECT 
        sc.id_solicitud,
        sc.estado,
        v.placa
      FROM solicitud_combustible sc
      INNER JOIN vehiculo v 
        ON sc.id_vehiculo = v.id_vehiculo
      WHERE sc.solicitado_por = $1
      ORDER BY sc.id_solicitud DESC;
    `;

    const result = await pool.query(query, [id_solicitante]);

    return result.rows;

  } catch (error) {
    console.error("Error obteniendo solicitudes:", error);
    throw error;
  }

  
};

//ADICIONAR GALONES AL VEHICULO
exports.addFuelToVehicle = async ({
  id_vehiculo,
  galones,
}) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Obtener proveedor asociado al vehiculo para traerlo
    const proveedorQuery = `
      SELECT id_proveedor
      FROM vehiculo_proveedor
      WHERE id_vehiculo = $1
      LIMIT 1;
    `;

    const proveedorResult = await client.query(proveedorQuery, [
      id_vehiculo,
    ]);

    const proveedor = proveedorResult.rows[0];

    if (!proveedor) {
      throw new Error('No existe proveedor para este vehiculo');
    }

    const { id_proveedor } = proveedor;

    // Aumentar cupo en vehiculo_proveedor
    const updateProveedorQuery = `
      UPDATE vehiculo_proveedor
      SET cupo_asignado = COALESCE(cupo_asignado, 0) + $1
      WHERE id_vehiculo = $2
        AND id_proveedor = $3
      RETURNING cupo_asignado;
    `;

    const proveedorResultUpdate = await client.query(updateProveedorQuery, [
      galones,
      id_vehiculo,
      id_proveedor,
    ]);

  
    const updateVehiculoQuery = `
      UPDATE vehiculo
      SET cupo_combustible = COALESCE(cupo_combustible, 0) + $1
      WHERE id_vehiculo = $2
      RETURNING cupo_combustible;
    `;

    const vehiculoResult = await client.query(updateVehiculoQuery, [
      galones,
      id_vehiculo,
    ]);

    await client.query('COMMIT');

    return {
      proveedor: proveedorResultUpdate.rows[0],
      vehiculo: vehiculoResult.rows[0],
    };

  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};








