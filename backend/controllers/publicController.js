const Material = require('../models/Material');

/** Public aggregate only — no file URLs or titles exposed. */
const getMaterialStats = async (req, res) => {
  try {
    const totalMaterials = await Material.countDocuments();
    res.send({ totalMaterials });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

module.exports = { getMaterialStats };
