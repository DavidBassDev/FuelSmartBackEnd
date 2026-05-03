const service = require('./telemetria.service');

exports.getTelemetriaMensual = async (req, res) => {
  try {
    const { placa, mes, anio } = req.query;

    if (!placa || !mes || !anio) {
      return res.status(400).json({
        message: 'placa, mes y anio son requeridos'
      });
    }

    const data = await service.getTelemetriaMensual({
      placa,
      mes: parseInt(mes),
      anio: parseInt(anio)
    });

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Traer telemetria del vehiculo, mes actual
exports.getTelemetryVehicleList = async (req, res) => {
  try {
    const { placa } = req.query;

    if (!placa) {
      return res.status(400).json({
        message: 'placa es requerida'
      });
    }

    const data = await service.getTelemetryVehicleList({
      placa
    });

    res.json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};