const pool = require('./db');

const createTables = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS vehicles (
      id SERIAL PRIMARY KEY,
      marca VARCHAR(100) NOT NULL,
      modelo VARCHAR(100) NOT NULL,
      version VARCHAR(100),
      anio INTEGER NOT NULL,
      combustible VARCHAR(50),
      transmision VARCHAR(50),
      kilometros VARCHAR(50),
      precio VARCHAR(50) NOT NULL,
      color VARCHAR(50),
      patente VARCHAR(50) UNIQUE,
      descripcion TEXT,
      estado VARCHAR(50) DEFAULT 'Disponible',
      images TEXT[] DEFAULT '{}',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await pool.query(queryText);
    console.log('✨ Tabla "vehicles" verificada/creada con éxito en PostgreSQL.');
  } catch (err) {
    console.error('❌ Error al crear la tabla "vehicles":', err);
  }
};

module.exports = createTables;