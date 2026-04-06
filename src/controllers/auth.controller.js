const authService = require('../services/auth.service');

exports.register = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const id_usuario = req.user.id;
    const { password } = req.body;

    const result = await authService.changePassword({
      id_usuario,
      password,
    });

    res.json({
      ok: true,
      data: result
    });

  } catch (error) {
    res.status(400).json({
      ok: false,
      message: error.message
    });
  }
};


