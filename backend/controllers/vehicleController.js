// Al principio de tu controllers/vehicleController.js (arriba de todo), agregá esto:
const cheerio = require('cheerio');
const pool = require('../config/db');



// Reemplazá la función getMercadoVehicles por esta:
const getMercadoVehicles = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ results: [] });
  }

  try {
    // 1. URL de búsqueda global compatible
    const urlPublica = `https://listado.mercadolibre.com.ar/vehiculos/${encodeURIComponent(q)}`;

    const response = await fetch(urlPublica, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9'
      }
    });

    if (!response.ok) throw new Error('Error al conectar con MercadoLibre');

    const html = await response.text();
    
    // 2. Cargamos el HTML en cheerio para manejarlo como si fuera el DOM
    const $ = cheerio.load(html);
    const resultados = [];

    // 3. Buscamos el contenedor de cada publicación de auto
    $('.ui-search-layout__item').each((i, elemento) => {
      if (resultados.length >= 6) return false; // Límite de 6 elementos

      // Extraemos los datos usando selectores CSS estables de MercadoLibre
      const title = $(elemento).find('.ui-search-item__title').text().trim();
      const permalink = $(elemento).find('.ui-search-link').attr('href');
      const priceText = $(elemento).find('.andes-money-amount__fraction').first().text().trim();
      
      // Manejo inteligente de imágenes fijándose en atributos diferidos (lazy load)
      let thumbnail = $(elemento).find('.ui-search-result-image__element').attr('data-src') || 
                      $(elemento).find('.ui-search-result-image__element').attr('src');

      if (title && permalink) {
        // Limpiamos los puntos del precio para pasarlo a número puro
        const price = priceText ? parseInt(priceText.replace(/\./g, ''), 10) : 0;

        // Convertimos la imagen a máxima calidad
        if (thumbnail) {
          thumbnail = thumbnail.replace('-I.jpg', '-O.jpg').replace('-V.jpg', '-O.jpg');
        }

        resultados.push({
          id: `ml-${i}-${Date.now()}`,
          title,
          price,
          address: { state_name: "Argentina" },
          thumbnail: thumbnail || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          permalink
        });
      }
    });

    // 4. Si fallan los selectores específicos por algún rediseño imprevisto, mantenemos la contingencia prolija
    if (resultados.length === 0) {
      return res.json({
        results: [
          {
            id: 'fb-1',
            title: `Ver listado completo de: ${q}`,
            price: 0,
            address: { state_name: "MercadoLibre 🚗" },
            thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
            permalink: `https://autos.mercadolibre.com.ar/${encodeURIComponent(q).replace(/%20/g, '-')}`
          }
        ]
      });
    }

    return res.json({ results: resultados });

  } catch (error) {
    console.error('Error en el buscador auxiliar:', error.message);
    return res.json({
      results: [
        {
          id: 'fb-critical',
          title: `Buscar en la web directa: ${q}`,
          price: 0,
          address: { state_name: "Enlace Web" },
          thumbnail: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          permalink: `https://autos.mercadolibre.com.ar/${encodeURIComponent(q).replace(/%20/g, '-')}`
        }
      ]
    });
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

// 📦 EXPORTACIÓN COMPLETA
module.exports = {
  getMercadoVehicles,
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
