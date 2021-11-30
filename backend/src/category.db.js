const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectCategory = async (id) => {
  const cat = {
    'category': {},
    'subcategories': [],
    'filters': [],
  };
  let select = 'SELECT id, category FROM categories';
  if (id) {
    select += ' WHERE id = $1';
  } else {
    select += ' WHERE parent_id IS NULL';
  }
  let query = {
    text: select,
    values: id ? [id] : [],
  };
  let rows;
  ({rows} = await pool.query(query));
  if (rows.length == 1) {
    cat.category.id = rows[0].id;
    cat.category.name = rows[0].category.name;
    // get list of subcatagories
    select = 'SELECT id, category FROM categories WHERE parent_id = $1';
    query = {
      text: select,
      values: [id],
    };
    ({rows} = await pool.query(query));
  } else if (rows.length > 1) {
    cat.category.name = 'root';
  }
  for (row in rows){
    cat.subcategories.push({
      'id': rows[row].id,
      'name': rows[row].category.name,
    });
  }
  return cat;
};
