const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectListingsByCategory = async (category) => {
  let select = 'SELECT id, listing FROM listings';
  if (category) {
    select += 'WHERE listings.category = $1;';
  } else {
    select += ';';
  }
  const query = {
    text: select,
    values: [category],
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
      categories.id AS categoryId,
      categories.category AS category,
      people.id AS ownerId,
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
    const listing = rows.listing;
    listing.id = rows.id;
    listing.category = rows.category;
    listing.category.id = rows.categoryId;
    listing.owner = rows.owner;
    listing.owner.id = rows.ownerId;
    return listing;
  } else {
    return undefined;
  }
}
