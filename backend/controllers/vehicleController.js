const pool = require('../config/db');

// OBTENER AUTOS DE MERCADOL
// controllers/vehicleController.js

const getMercadoVehicles = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ results: [] });
  }

  try {
    // Usamos el fetch nativo de Node.js directamente (No requiere imports raros)
    const response = await fetch(
      `https://api.mercadolibre.com/sites/MLA/search?q=${encodeURIComponent(q)}&category=MLA1743&limit=6`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        }
      }
    );

    if (!response.ok) {
      console.error(`Error en la respuesta de MercadoLibre. Status: ${response.status}`);
      throw new Error('Error en MercadoLibre');
    }
    
    const data = await response.json();
    return res.json(data);

  } catch (error) {
    console.error('Error detallado al escanear mercado:', error.message);
    return res.status(500).json({ error: 'Error al consultar el mercado online' });
  }
};

// 1. OBTENER TODOS LOS VEHÍCULOS
const getVehicles = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM vehicles ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener los vehículos" });
  }
};

// 2. OBTENER UN SOLO VEHÍCULO POR ID
const getVehicleById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM vehicles WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al obtener el vehículo" });
  }
};

// 3. CREAR UN NUEVO VEHÍCULO
const createVehicle = async (req, res) => {
  try {
    const { 
      marca, modelo, version, anio, combustible, transmision, 
      kilometros, precio, color, patente, descripcion, imagenes 
    } = req.body;
    
    const fotosArray = imagenes && Array.isArray(imagenes) ? imagenes : [];

    const queryText = `
      INSERT INTO vehicles (marca, modelo, version, anio, combustible, transmision, kilometros, precio, color, patente, descripcion, imagenes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *;
    `;
    const values = [marca, modelo, version, anio, combustible, transmision, kilometros, precio, color, patente, descripcion, fotosArray];
    
    const result = await pool.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al crear el vehículo (Verificá si la patente ya existe)" });
  }
};

// 4. ACTUALIZAR UN VEHÍCULO
const updateVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      marca, modelo, version, anio, combustible, transmision, 
      kilometros, precio, color, patente, descripcion, estado, imagenes 
    } = req.body;

    const fotosArray = imagenes && Array.isArray(imagenes) ? imagenes : [];

    const queryText = `
      UPDATE vehicles 
      SET marca = $1, modelo = $2, version = $3, anio = $4, combustible = $5, transmision = $6, kilometros = $7, precio = $8, color = $9, patente = $10, descripcion = $11, estado = $12, imagenes = $13
      WHERE id = $14 RETURNING *;
    `;
    const values = [marca, modelo, version, anio, combustible, transmision, kilometros, precio, color, patente, descripcion, estado, fotosArray, id];

    const result = await pool.query(queryText, values);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado para actualizar" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al actualizar el vehículo" });
  }
};

// 5. ELIMINAR UN VEHÍCULO
const deleteVehicle = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM vehicles WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Vehículo no encontrado" });
    }
    res.json({ message: "Vehículo eliminado correctamente" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Error al eliminar el vehículo" });
  }
};

// Exportación limpia (Agregamos getMercadoVehicles al listado)
module.exports = {
  getMercadoVehicles,
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
