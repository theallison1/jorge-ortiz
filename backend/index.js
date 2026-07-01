const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const createTables = require('./config/initDb');
const vehicleRoutes = require('./routes/vehicleRoutes'); 
const authRoutes = require('./routes/authRoutes'); // <-- 1. IMPORTAMOS LAS RUTAS DE AUTH

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// 🚀 CAMBIO CLAVE: Aumentamos el límite para soportar las fotos en Base64 desde el celular
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

createTables();

// 🚀 EJECUTOR SQL AUTOMÁTICO
const adaptarBaseDeDatos = async () => {
  try {
    await pool.query(`ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS imagenes TEXT[] DEFAULT '{}';`);
  } catch (err) {
    console.error(err.message);
  }
};
adaptarBaseDeDatos();

// Rutas de la API
app.use('/api/vehicles', vehicleRoutes); 
app.use('/api/auth', authRoutes); // <-- 2. CONECTAMOS EL LOGIN A LA URL

app.get('/', (req, res) => {
  res.json({ mensaje: "API de OrtizAutomotores funcionando correctamente 🚗🔥" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo activamente en el puerto ${PORT}`);
});
