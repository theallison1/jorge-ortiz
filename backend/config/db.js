const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Esta es la consulta que te va a confirmar si se conecta a Render o no
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos de Render:', err.stack);
  } else {
    console.log('🟢 Conexión exitosa a PostgreSQL en Render. Hora del servidor:', res.rows[0].now);
  }
});

module.exports = pool;