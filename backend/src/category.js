const db = require('./category.db');

exports.getCategory = async (req, res) => {
  const categories = await db.selectCategory(req.query.category);
  console.log(categories);
  categories.category.name ?
    res.status(200).json(categories) :
    res.status(404).send();
};
