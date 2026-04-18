const service = require('../services/telemetria.service');

// endpoint base (para probar que funciona)
const getTelemetria = async (req, res) => {
  res.json({ message: 'endpoint telemetria activo' });
};

// endpoint mensual
const getTelemetriaMensual = async (req, res) => {
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

    res.json(data || {});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTelemetria,
  getTelemetriaMensual
};