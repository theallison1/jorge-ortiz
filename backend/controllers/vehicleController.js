const pool = require('../config/db');

// OBTENER AUTOS DE MERCADOLIBRE (Estrategia segura anti-403)
const getMercadoVehicles = async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.json({ results: [] });
  }

  try {
    // 1. Armamos la URL pública simulando la barra de búsqueda del navegador
    const urlPublica = `https://autos.mercadolibre.com.ar/${encodeURIComponent(q).replace(/%20/g, '-')}`;

    // 2. Traemos el HTML fingiendo ser un Chrome de escritorio real
    const response = await fetch(urlPublica, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'es-AR,es;q=0.9,en-US;q=0.8,en;q=0.7'
      }
    });

    if (!response.ok) {
      console.error(`Error al acceder a la web pública. Status: ${response.status}`);
      throw new Error('Bloqueo de plataforma');
    }

    const html = await response.text();

    // 3. Extraemos la información del HTML de la página usando Regex estructurados
    const titulos = [...html.matchAll(/<h2 class="[^"]*ui-search-item__title[^"]*">([^<]+)<\/h2>/g)].map(m => m[1].trim());
    const enlaces = [...html.matchAll(/<a [^>]*href="([^"]+)" [^>]*class="[^"]*ui-search-link[^"]*"/g)].map(m => m[1]);
    const precios = [...html.matchAll(/<span class="[^"]*andes-money-amount__fraction[^"]*">([^<]+)<\/span>/g)].map(m => m[1].trim());
    const imagenes = [...html.matchAll(/<img [^>]*src="([^"]+)"[^>]*class="[^"]*ui-search-result-image__element[^"]*"/g)].map(m => m[1]);

    // 4. Mapeamos respetando la estructura original que espera tu frontend (Next.js)
    const resultados = [];
    const limite = Math.min(titulos.length, 6); // Extraemos los primeros 6 resultados

    for (let i = 0; i < limite; i++) {
      if (titulos[i] && enlaces[i]) {
        resultados.push({
          id: `ml-${i}-${Date.now()}`,
          title: titulos[i],
          // Saneamos el string de precio quitando los puntos y convirtiéndolo a número
          price: precios[i] ? parseInt(precios[i].replace(/\./g, ''), 10) : 0, 
          address: { state_name: "Argentina" },
          // Convertimos la imagen miniatura a resolución completa original
          thumbnail: imagenes[i] ? imagenes[i].replace('-I.jpg', '-O.jpg').replace('-V.jpg', '-O.jpg') : 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80',
          permalink: enlaces[i]
        });
      }
    }

    return res.json({ results: resultados });

  } catch (error) {
    console.error('Error en el raspado seguro del mercado:', error.message);
    
    // ENLACE DE RESPALDO: Si falla el raspado por algún cambio imprevisto en ML, enviamos una tarjeta con link directo para que no quede vacío
    return res.json({
      results: [
        {
          id: 'fb-1',
          title: `Buscar en MercadoLibre de forma directa: ${q}`,
          price: 0,
          address: { state_name: "Enlace Directo" },
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

// Exportación limpia
