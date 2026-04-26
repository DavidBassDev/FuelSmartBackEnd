const vehiculoService = require('../services/vehicle.service');

exports.listVehicles = async (req, res) => {
  try {
    const { id, rol } = req.user;

    const vehiculos = await vehiculoService.listVehicles({
      userId: id,
      rol: rol
    });

    res.status(200).json(vehiculos);

  } catch (error) {
    console.error('Error en controller listVehicles:', error);

    res.status(500).json({
      message: 'Error al listar vehículos',
      error: error.message
    });
  }
};

//todos los vehiculos
exports.listAllVehicles = async (req, res) => {
  try {

    const vehiculos = await vehiculoService.listAllVehicles({

    });

    res.status(200).json(vehiculos);

  } catch (error) {
    console.error('Error en controller listVehicles:', error);

    res.status(500).json({
      message: 'Error al listar todos los vehículos',
      error: error.message
    });
  }
};

//Exportar todos los tipos de vehiculos
exports.listVehicleTypes = async (req, res) => {
  try {
    const vehicleType = await vehiculoService.getVehicleType();
    res.json(vehicleType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

