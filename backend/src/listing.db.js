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
  let query;
  if (category) {
    query = {
      text: `SELECT id FROM Categories`,
      values: [],
    };
    let {rows} = await pool.query(query);
    if (!rows.some(cat => cat.id == category)){
      return undefined;
    }
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
  query = {
    text: select,
    values: category ? [category] : [],
  };
  let {rows} = await pool.query(query);
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

exports.selectListingsByOwner = async (owner) => {
  const select = `SELECT id, listing FROM listings WHERE owner = $1;`;
  const query = {
    text: select,
    values: [owner],
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
    // console.log(listing);
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

exports.selectListingsByKeywords = async (keywords) => {
  let select = `SELECT id, listing FROM listings WHERE FALSE`;
  for (let i = 1; i <= keywords.length; i++) {
    select += ` OR jsonb_pretty(listing) LIKE ('%' || $${i} || '%')`;
  }
  select += ';';
  const query = {
    text: select,
    values: keywords,
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

exports.selectListingsByFilters = async (filters, values) => {
  let select = `SELECT id, listing FROM listings WHERE 1 = 1`;
  const valuesList = [];
  let idx = 1;
  for (let i = 0; i < filters.length; i++) {
    valuesList.push(filters[i].name);
    select += ` AND listing->'attributes' ? $${idx++}`;
    switch (filters[i].type) {
      case 'range':
        valuesList.push(values[i][0]);
        valuesList.push(values[i][1]);
        select += ` AND (listing->'attributes'->>$${idx-1})::float >= $${idx}
          AND (listing->'attributes'->>$${idx++ -1})::float <= $${idx++}`;
        break;
      case 'enum':
        valuesList.push(values[i]);
        select += ` AND listing->>$${idx-1} = $${idx++}`;
        break;
      case 'bool':
        valuesList.push(values[i]);
        select += ` AND (listing->'attributes'->>$${idx-1})::bool = $${idx++}`;
        break;
    }
  }
  const query = {
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
    if (row.listing.images && row.listing.images[0]) {
      listing.image = row.listing.images[0];
    }
    listings.push(listing);
  }
  return listings;
};
