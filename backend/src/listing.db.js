const {Pool} = require('pg');

const pool = new Pool({
  host: 'localhost',
  post: 5432,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

exports.selectListings = async (q) => {
  let select = 'SELECT id, listing FROM listings';
  let query;
  const valuesList = [];
  let idx = 1;
  for (param in q) {
    if (param == 'category') {
      query = {
        text: `SELECT id FROM Categories`,
        values: [],
      };
      valuesList.push(q[param]);
      idx++;
      const {rows} = await pool.query(query);
      if (!rows.some((cat) => cat.id == q[param])) {
        return undefined;
      }
      select =
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
    } else if (param == 'owner') {
      select += (!q.category && idx == 1) ?
        ` WHERE owner = $${idx}` : ` AND owner = $${idx}`;
      valuesList.push(q[param]);
      idx++;
    } else if (param == 'search') {
      const keywords = q.search.split(' ');
      select += (!q.category && idx == 1) ?
        ` WHERE (jsonb_pretty(listing) LIKE ('%' || $${idx++} || '%')` :
        ` AND (jsonb_pretty(listing) LIKE ('%' || $${idx++} || '%')`;
      valuesList.push(keywords[0]);
      for (let i = 1; i < keywords.length; i++) {
        select += ` OR jsonb_pretty(listing) LIKE ('%' || $${idx++} || '%')`;
        valuesList.push(keywords[i]);
      }
      select += ')';
    } else {
      query = {
        text: `SELECT filter->>'name' FROM Filters`,
        values: [],
      };
      const {rows} = await pool.query(query);
      if (!rows.some((row) => row['?column?'] == param ||
        row['?column?'] == param.slice(3))) {
        return undefined;
      }
      select += (!q.category && idx == 1) ? ` WHERE` : ` AND`;
      if (!isNaN(Number(q[param])) && typeof Number(q.param) === 'number') {
        valuesList.push(param.slice(3));
        idx++;
        switch (true) {
        case /^MAX.+$/.test(param):
          valuesList.push(q[param]);
          select += ` (listing->'attributes'->>$${idx-1})::float <= $${idx++}`;
          break;
        case /^MIN.+$/.test(param):
          valuesList.push(q[param]);
          select += ` (listing->'attributes'->>$${idx-1})::float >= $${idx++}`;
          break;
        }
      } else {
        valuesList.push(param);
        idx++;
        valuesList.push(q[param]);
        select += ` listing->'attributes'->>$${idx-1} = $${idx++}`;
      }
    }
  }
  query = {
    text: select,
    values: valuesList,
  };
  const {rows} = await pool.query(query);
  const listings = [];
  for (const row of rows) {
    const listing = {
      id: row.id,
      name: row.listing.name,
      price: row.listing.attributes.price,
    };
    listing.image = row.listing.images[0];
    listings.push(listing);
  }
  return listings;
};

exports.selectListingById = async (listing) => {
  const select = `SELECT
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
    listing.attributes = row.listing.attributes;
    listing.description = row.listing.description;
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
