const express = require('express');
const router = express.Router();

// 🚨 IMPORTANTE: Aseguramos la ruta correcta hacia el controlador
const vehicleController = require('../controllers/vehicleController');

// 1. Obtener todos los vehículos
router.get('/', vehicleController.getVehicles);

// 2. Obtener un vehículo por ID
router.get('/:id', vehicleController.getVehicleById);

// 3. Crear un nuevo vehículo
router.post('/', vehicleController.createVehicle);

// 4. Actualizar un vehículo completo
router.put('/:id', vehicleController.updateVehicle);

// 5. Eliminar un vehículo
router.delete('/:id', vehicleController.deleteVehicle);

// 🚨 ESTO ES LO QUE SANA EL ERROR EN INDEX.JS:
// Exportamos obligatoriamente el objeto 'router' de Express, NO el controlador.
module.exports = router;