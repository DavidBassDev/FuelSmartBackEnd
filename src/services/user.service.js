const pool = require('../models/db');

//listar conductores
exports.listDrivers = async ({ rol }) => {
  try {

    if (rol !== "admin") {
      throw new Error("No autorizado");
    }

    const query = `
    SELECT 
  u.id_usuario,
  u.nombre_completo,
  r.nombre AS rol,
  u.id_vehiculo,
  v.placa,
  uc.nombre AS nombre_proyecto
FROM usuario u
LEFT JOIN rol r 
  ON u.rol_id = r.id_rol
LEFT JOIN vehiculo v 
  ON u.id_vehiculo = v.id_vehiculo
LEFT JOIN cliente uc 
  ON u.cliente_id = uc.id_cliente
WHERE r.nombre = 'conductor'
ORDER BY u.id_usuario;
    `;

    const result = await pool.query(query);

    return {
      users: result.rows || []
    };

  } catch (error) {
    console.error("Error en listar usuarios:", error.message);
    throw error;
  }
};


//listar usuarios supervisores

exports.listSupervisor = async ({ rol }) => {
  try {

    if (rol !== "admin") {
      throw new Error("No autorizado");
    }

    const query = `
     SELECT 
  u.id_usuario,
  u.nombre_completo,
  r.nombre AS rol,
  u.id_vehiculo,
  v.placa,
  uc.nombre AS nombre
FROM usuario u
LEFT JOIN rol r 
  ON u.rol_id = r.id_rol
LEFT JOIN vehiculo v 
  ON u.id_vehiculo = v.id_vehiculo
LEFT JOIN cliente uc 
  ON u.cliente_id = uc.id_cliente
  WHERE r.nombre ='coordinador'
ORDER BY u.id_usuario;
    `;

    const result = await pool.query(query);

    return {
      users: result.rows || []
    };

  } catch (error) {
    console.error("Error en listar usuarios:", error.message);
    throw error;
  }
};

//listar todos los usuarios
exports.listAdmin = async ({ rol }) => {
  try {

    if (rol !== "admin") {
      throw new Error("No autorizado");
    }

    const query = `
   SELECT 
  u.id_usuario,
  u.nombre_completo,
  r.nombre AS rol,
  u.id_vehiculo,
  v.placa,
  uc.nombre AS nombre
FROM usuario u
LEFT JOIN rol r 
  ON u.rol_id = r.id_rol
LEFT JOIN vehiculo v 
  ON u.id_vehiculo = v.id_vehiculo
LEFT JOIN cliente uc 
  ON u.cliente_id = uc.id_cliente
  WHERE r.nombre = 'admin'
ORDER BY u.id_usuario;
    `;

    const result = await pool.query(query);

    return {
      users: result.rows || []
    };

  } catch (error) {
    console.error("Error en listar usuarios:", error.message);
    throw error;
  }
};


//Editar usuario

exports.editUser = async ({ id_usuario, rol_id, cliente_id, id_vehiculo }) => {

  const result = await pool.query(
    `UPDATE usuario
     SET rol_id = $1,
         cliente_id = $2,
         id_vehiculo = $3
     WHERE id_usuario = $4
     RETURNING nombre_completo, rol_id, cliente_id, id_vehiculo`,
    [
      rol_id,
      cliente_id,
      id_vehiculo,
      id_usuario
    ]
  );

  return result.rows[0];
};