const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.insertUser = async (user, hash) => {
  const insert = 'INSERT INTO people(person, hash) VALUES ($1, $2)';
  const query = {
    text: insert,
    values: [user, hash],
  };
  await pool.query(query);
};

exports.selectUserByLoginName = async (loginName) => {
  const select = `SELECT id,hash,person FROM people WHERE person->>'email' = $1
    OR person->>'phone' = $1`;
  const query = {
    text: select,
    values: [loginName],
  };
  const {rows} = await pool.query(query);
  return rows[0];
};
