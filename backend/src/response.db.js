const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.insertResponse = async (listing, owner, message) => {
  const insert = `INSERT INTO responses(listing, owner, message)
    VALUES ($1,$2,$3);`;
  const query = {
    text: insert,
    values: [listing, owner, message],
  };
  let rowCount;
  try {
    ({rowCount} = await pool.query(query));
  } catch (error) {
    rowCount = 0;
  }
  if (rowCount) {
    return true;
  } else {
    return false;
  }
};

exports.selectResponses = async (listing, owner) => {
  const select = `SELECT responses.message AS message,
    people.person->>'name' AS name FROM responses
    INNER JOIN listings
    ON responses.listing = listings.id
    INNER JOIN people
    ON listings.owner = people.id
    WHERE listings.owner = $2
    AND listings.id = $1
    ORDER BY responses.id DESC;`;
  const query = {
    text: select,
    values: [listing, owner],
  };
  const {rows} = await pool.query(query);
  const responses = [];
  if (rows.length > 0) {
    for (const row of rows) {
      responses.push({
        message: row.message,
        owner: row.name,
      });
    }
  }
  return responses;
};
