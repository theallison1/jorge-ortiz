const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const createTables = require('./config/initDb');
const vehicleRoutes = require('./routes/vehicleRoutes'); // <-- 1. IMPORTAMOS LAS RUTAS

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Ejecutar la creación de tablas al arrancar
createTables();

// Rutas de la API
app.use('/api/vehicles', vehicleRoutes); // <-- 2. LAS CONECTAMOS A LA URL

// Ruta base de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: "API de OrtizAutomotores funcionando correctamente 🚗🔥" });
});

// Levantar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo activamente en http://localhost:${PORT}`);
});