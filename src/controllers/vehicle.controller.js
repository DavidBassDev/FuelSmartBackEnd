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

// traer solo un vehiculo
exports.getVehicle = async (req, res) => {
  try {
    const { vehiculo_id } = req.params;

    if (!vehiculo_id) {
      return res.status(400).json({
        ok: false,
        message: 'vehiculo_id es requerido'
      });
    }

    const vehiculo = await vehiculoService.getVehicle({
      vehiculo_id
    });

    if (!vehiculo) {
      return res.status(404).json({
        ok: false,
        message: 'Vehículo no encontrado'
      });
    }

    res.status(200).json({
      ok: true,
      data: vehiculo
    });

  } catch (error) {
    console.error('Error en controller traer vehiculo:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al traer el vehículo',
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

//INACTIVAR VEHICULO
exports.inactivateVehicle = async (req, res) => {
  try {
    const { id_vehiculo } = req.body;

    const data = await vehiculoService.inactivateVehicle({ id_vehiculo });

    res.status(200).json({
      ok: true,
      message: 'Vehículo inactivado correctamente',
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

