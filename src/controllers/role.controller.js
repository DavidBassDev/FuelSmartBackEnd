const service = require('../services/role.service');

exports.getRoles = async (req, res) => {
  try {
    const roles = await service.getRoles();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};