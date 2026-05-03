const service = require('./fuelrequest.service');

// 🔹 CREAR SOLICITUD
exports.createFuelRequest = async (req, res) => {
  try {
    const { id_vehiculo, id_proveedor, galones_solicitados, comentario } = req.body;

    const solicitado_por = req.user.id;

    const data = await service.createFuelRequest({
      id_vehiculo,
      id_proveedor,
      galones_solicitados,
      comentario,
      solicitado_por,
    });

    return res.status(201).json({
      ok: true,
      message: 'Solicitud creada correctamente',
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error interno',
    });
  }
};

// 🔹 LISTAR SOLICITUDES PENDIENTES 🔥
exports.getPendingFuelRequests = async (req, res) => {
  try {
    const data = await service.getPendingFuelRequests();

    return res.status(200).json({
      ok: true,
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error obteniendo solicitudes',
    });
  }
};

// 🔹 ACTUALIZAR ESTADO (APROBAR / RECHAZAR)
exports.updateFuelRequestStatus = async (req, res) => {
  try {
    const { id_solicitud, estado } = req.body;

    const respondido_por = req.user.id; // 🔥 automático desde token

    const data = await service.updateFuelRequestStatus({
      id_solicitud,
      estado,
      respondido_por,
    });

    return res.status(200).json({
      ok: true,
      message: 'Solicitud actualizada',
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error actualizando solicitud',
    });
  }
};

 // 🔹 AUMENTAR CUPO DIRECTO
exports.addFuelToVehicle = async (req, res) => {
  try {
    const { id_vehiculo, galones } = req.body;
    const id_usuario = req.user.id;

    // 🔥 validación básica
    if (!id_vehiculo || !galones) {
      return res.status(400).json({
        ok: false,
        message: 'id_vehiculo y galones son obligatorios',
      });
    }

    const data = await service.addFuelToVehicle({
      id_vehiculo,
      galones,
      id_usuario,
    });

    return res.status(200).json({
      ok: true,
      message: 'Cupo actualizado correctamente',
      data,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      ok: false,
      message: 'Error al actualizar cupo',
    });
  }
};