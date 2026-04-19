const service = require('../services/client.service');

exports.getClient = async (req, res) => {
  try {
    const clients = await service.getClient();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};