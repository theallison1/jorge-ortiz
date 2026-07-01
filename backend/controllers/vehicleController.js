const axios = require("axios");
const pool = require("../config/db");

// ==========================================
// MERCADOLIBRE
// ==========================================

const getMercadoVehicles = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim() === "") {
      return res.status(400).json({
        error: "Debe indicar un término de búsqueda."
      });
    }

    const { data } = await axios.get(
      "https://api.mercadolibre.com/sites/MLA/search",
      {
        params: {
          q,
          limit: 6
        }
      }
    );

    return res.json(data);

  } catch (err) {

    console.error("Error MercadoLibre:");
    console.error(err.response?.data || err.message);

    return res.status(500).json({
      error: "No fue posible consultar MercadoLibre."
    });
  }
};

// ==========================================
// OBTENER TODOS LOS VEHÍCULOS
// ==========================================

const getVehicles = async (req, res) => {
  try {

    const result = await pool.query(
      "SELECT * FROM vehicles ORDER BY id DESC"
    );

    res.json(result.rows);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error al obtener los vehículos."
    });

  }
};

// ==========================================
// OBTENER VEHÍCULO POR ID
// ==========================================

const getVehicleById = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM vehicles WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Vehículo no encontrado."
      });

    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error al obtener el vehículo."
    });

  }

};

// ==========================================
// CREAR VEHÍCULO
// ==========================================

const createVehicle = async (req, res) => {

  try {

    const {
      marca,
      modelo,
      version,
      anio,
      combustible,
      transmision,
      kilometros,
      precio,
      color,
      patente,
      descripcion,
      imagenes
    } = req.body;

    const fotosArray =
      Array.isArray(imagenes)
        ? imagenes
        : [];

    const result = await pool.query(
      `INSERT INTO vehicles
      (
        marca,
        modelo,
        version,
        anio,
        combustible,
        transmision,
        kilometros,
        precio,
        color,
        patente,
        descripcion,
        imagenes
      )
      VALUES
      (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
      )
      RETURNING *`,
      [
        marca,
        modelo,
        version,
        anio,
        combustible,
        transmision,
        kilometros,
        precio,
        color,
        patente,
        descripcion,
        fotosArray
      ]
    );

    res.status(201).json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error:
        "Error al crear el vehículo. Verificá que la patente no exista."
    });

  }

};

// ==========================================
// ACTUALIZAR VEHÍCULO
// ==========================================

const updateVehicle = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      marca,
      modelo,
      version,
      anio,
      combustible,
      transmision,
      kilometros,
      precio,
      color,
      patente,
      descripcion,
      estado,
      imagenes
    } = req.body;

    const fotosArray =
      Array.isArray(imagenes)
        ? imagenes
        : [];

    const result = await pool.query(
      `UPDATE vehicles
      SET
      marca=$1,
      modelo=$2,
      version=$3,
      anio=$4,
      combustible=$5,
      transmision=$6,
      kilometros=$7,
      precio=$8,
      color=$9,
      patente=$10,
      descripcion=$11,
      estado=$12,
      imagenes=$13
      WHERE id=$14
      RETURNING *`,
      [
        marca,
        modelo,
        version,
        anio,
        combustible,
        transmision,
        kilometros,
        precio,
        color,
        patente,
        descripcion,
        estado,
        fotosArray,
        id
      ]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Vehículo no encontrado."
      });

    }

    res.json(result.rows[0]);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error al actualizar el vehículo."
    });

  }

};

// ==========================================
// ELIMINAR VEHÍCULO
// ==========================================

const deleteVehicle = async (req, res) => {

  try {

    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM vehicles WHERE id=$1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {

      return res.status(404).json({
        message: "Vehículo no encontrado."
      });

    }

    res.json({
      message: "Vehículo eliminado correctamente."
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "Error al eliminar el vehículo."
    });

  }

};

module.exports = {
  getMercadoVehicles,
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle
};
