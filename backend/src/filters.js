
const db = require('./filters.db.js');

exports.getFilters = async (req, res) => {
  const filters = await db.selectFiltersByCategory(req.query.category);
  if (filters) {
    res.status(200).send(filters);
  } else {
    res.status(404).send();
  }
};
