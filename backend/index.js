const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./config/db');
const createTables = require('./config/initDb');
const vehicleRoutes = require('./routes/vehicleRoutes'); 
const authRoutes = require('./routes/authRoutes'); 

// 📍 IMPORTAMOS EL CONTROLADOR NUEVO QUE CORREGIMOS ANTES
const { getMercadoVehicles } = require('./controllers/vehicleController');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

createTables();

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
app.use('/api/auth', authRoutes); 

// 🚀 CONECTAMOS LA RUTA DE MERCADOLIBRE (Va a responder en https://jorge-ortiz.onrender.com/api/mercado)
app.get('/api/mercado', getMercadoVehicles);

app.get('/', (req, res) => {
  res.json({ mensaje: "API de OrtizAutomotores funcionando correctamente 🚗🔥" });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo activamente en el puerto ${PORT}`);
});
