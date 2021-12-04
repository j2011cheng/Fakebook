const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectFiltersByCategory = async (category) => {
  let select;
  if (category) {
    select = `WITH RECURSIVE CategoryTree AS (
      SELECT c.id, c.parent_id
      FROM Categories c
      WHERE id = $1
      UNION ALL
      SELECT c2.id, c2.parent_id
      FROM Categories c2
      JOIN CategoryTree
      ON CategoryTree.parent_id = c2.id
    )
    SELECT filter
    FROM filters
    WHERE 0 <> (
      SELECT COUNT(*) FROM CategoryTree
    )
    AND category IS NULL
    OR category IN (
      SELECT id FROM CategoryTree
    );`;
  } else {
    select = `SELECT filter
    FROM filters
    WHERE category IS NULL;`;
  }
  const query = {
    text: select,
    values: category ? [category] : [],
  };
  const {rows} = await pool.query(query);
  if (rows.length > 0) {
    const filters = [];
    for (const row of rows) {
      filters.push(row.filter);
    }
    return filters;
  } else {
    return undefined;
  }
};
