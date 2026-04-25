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
  uc.nombre AS nombre_proyecto
FROM usuario u
LEFT JOIN rol r ON u.rol_id = r.id_rol
LEFT JOIN vehiculo v ON u.id_vehiculo = v.id_vehiculo
LEFT JOIN cliente uc ON u.cliente_id = uc.id_cliente
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
  uc.nombre AS nombre_proyecto
FROM usuario u
LEFT JOIN rol r ON u.rol_id = r.id_rol
LEFT JOIN vehiculo v ON u.id_vehiculo = v.id_vehiculo
LEFT JOIN cliente uc ON u.cliente_id = uc.id_cliente
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

exports.inactivateUser = async ({ id_usuario }) => {
  try {

    const result = await pool.query(
      `UPDATE usuario
       SET estado = false
       WHERE id_usuario = $1
       RETURNING nombre_completo, estado`,
      [id_usuario]
    );

    return result.rows[0];

  } catch (error) {
    console.error(error);
    throw error;
  }
};


//CREAR USUARIO

exports.createUser = async ({ nameUser, email, hashedPassword, id_rol, createdBy,cliente }) => {

  const result = await pool.query(
    `INSERT INTO usuario 
    (nombre_completo, correo_electronico, password_hash, rol_id, creado_por, cliente, estado)
    VALUES ($1, $2, $3, $4, $5, $6, true)
    RETURNING nombre_completo, correo_electronico, rol_id`,
    [
      nombre_completo,
      email,
      hashedPassword,
      id_rol,
      createdBy,  
      cliente
    ]
  );

  return result.rows[0];
};
