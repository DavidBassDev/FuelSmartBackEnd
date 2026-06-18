const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FuelSmart',
  password: 'FuelSmartBD',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error('Error de conexion', err));

module.exports = pool;
