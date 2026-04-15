const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'fuelsmart_secret';

exports.register = async ({
  nombre_completo,
  correo_electronico,
  password,
  rol_id,
  creado_por
}) => {

  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `INSERT INTO usuario 
    (nombre_completo, correo_electronico, password_hash, rol_id, creado_por)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id_usuario, nombre_completo, correo_electronico, rol_id`,
    [
      nombre_completo,
      correo_electronico,
      hashedPassword,
      rol_id || 1,
      creado_por || null
    ]
  );

  return result.rows[0];
};

exports.login = async ({ correo_electronico, password }) => {

  const result = await pool.query(
    `SELECT 
        u.id_usuario,
        u.nombre_completo,
        u.correo_electronico,
        u.password_hash,
        r.nombre AS rol
     FROM usuario u
     JOIN rol r ON u.rol_id = r.id_rol
     WHERE u.correo_electronico = $1
     AND u.estado = true`,
    [correo_electronico]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado o inactivo');
  }

  const user = result.rows[0];

  const validPassword = await bcrypt.compare(password, user.password_hash);

  if (!validPassword) {
    throw new Error('Contraseña incorrecta');
  }

  // actualizar ultimo acceso
  await pool.query(
    `UPDATE usuario 
     SET fecha_ultimo_acceso = CURRENT_TIMESTAMP 
     WHERE id_usuario = $1`,
    [user.id_usuario]
  );

  // generar token
  const token = jwt.sign(
    {
      id: user.id_usuario,
      rol: user.rol
    },
    SECRET,
    { expiresIn: '8h' }
  );

  return {
    token,
    usuario: {
      id: user.id_usuario,
      nombre: user.nombre_completo,
      correo: user.correo_electronico,
      rol: user.rol
    }
  };
};
//Cambiar contraseña usuario
exports.changePassword = async ({ id_usuario, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `UPDATE usuario
     SET password_hash = $1
     WHERE id_usuario = $2
     RETURNING nombre_completo, correo_electronico`,
    [
      hashedPassword,
      id_usuario
    ]
  );

  return result.rows[0];
};