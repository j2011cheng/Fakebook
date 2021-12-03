const db = require('./category.db');

exports.getCategory = async (req, res) => {
  const categories = await db.selectCategory(req.query.category);
  categories.category.name ?
    res.status(200).json(categories) :
    res.status(404).send();
};

exports.getAll = async (req, res) => {
  const categories = await db.getAll();
  categories[0] ?
    res.status(200).json(categories) :
    res.status(404).send();
};