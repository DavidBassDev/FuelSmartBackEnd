const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'fuelsmart',
  password: 'fuelSmartBD',
  port: 5432,
});

pool.connect()
  .then(() => console.log('Base de datos conectada'))
  .catch(err => console.error('Error de conexion', err));

module.exports = pool;
