const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectListingsByCategory = async (category) => {
  // https://stackoverflow.com/questions/6654774/how-to-traverse-a-tree-work-with-hierarchical-data-in-sql-code
  // WITH Family As
  // (
  //     SELECT e.id, e.supervisorid, 0 as Depth
  //     FROM Employee e
  //     WHERE id = @SupervisorID
  //     UNION All
  //     SELECT e2.ID, e2.supervisorid, Depth + 1
  //     FROM Employee e2
  //         JOIN Family
  //             On Family.id = e2.supervisorid
  // )
  // SELECT*
  // FROM Family


  let select = '';
  if (category) {
    select +=
      `WITH RECURSIVE CategoryTree AS (
        SELECT c.id, c.parent_id
        FROM Categories c
        WHERE id = $1
        UNION ALL
        SELECT c2.id, c2.parent_id
        FROM Categories c2
          JOIN CategoryTree
            ON CategoryTree.id = c2.parent_id
      )
      SELECT DISTINCT listings.id, listings.listing
      FROM listings
      WHERE listings.category IN (
        SELECT id FROM CategoryTree
      )
      `;
  } else {
    select = 'SELECT id, listing FROM listings';
  }
  const query = {
    text: select,
    values: category ? [category] : [],
  };
  const {rows} = await pool.query(query);
  const listings = [];
  for (const row of rows) {
    const listing = {
      id: row.id,
      name: row.listing.name,
      price: row.listing.price,
    };
    if (row.listing.images) {
      listing.image = row.listing.images[0];
    }
    listings.push(listing);
  }
  return listings;
};

exports.selectListingById = async (listing) => {
  let select = `SELECT
      listings.id AS id,
      listings.listing AS listing,
      categories.id AS categoryid,
      categories.category AS category,
      people.id AS ownerid,
      people.person AS owner
    FROM listings
    INNER JOIN categories
    ON listings.category = categories.id
    INNER JOIN people
    ON listings.owner = people.id
    WHERE listings.id = $1`;
  const query = {
    text: select,
    values: [listing],
  };
  const {rows} = await pool.query(query);
  if (rows.length == 1) {
    const row = rows[0];
    const listing = row.listing;
    listing.id = row.id;
    listing.category = row.category;
    listing.category.id = row.categoryid;
    listing.owner = row.owner;
    listing.owner.id = row.ownerid;
    listing.attributes = {};
    listing.description = '';
    return listing;
  } else {
    return undefined;
  }
};

exports.insertListing = async (ownerId, categoryId, listing) => {
  const insert = `INSERT INTO listings(owner, category, listing)
    VALUES ($1, $2, $3)
    ON CONFLICT DO NOTHING;`;
  const query = {
    text: insert,
    values: [ownerId, categoryId, listing],
  };
  let rowCount
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
}
