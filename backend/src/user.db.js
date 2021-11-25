const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.insertUser = async (user) => {
  const insert = 'INSERT INTO people(person) VALUES ($1)';
  const query = {
    text: insert,
    values: [user],
  };
  await pool.query(query);
};

exports.selectUserByEmail = async (email) => {
  let select = `SELECT id,person FROM people WHERE person->>'email' = $1`;
  const query = {
    text: select,
    values: [email],
  };
  const {rows} = await pool.query(query);
  return rows[0];
}
