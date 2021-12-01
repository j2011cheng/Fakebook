
const db = require('./listing.db');

exports.getListings = async (req, res) => {
  let listings;
  if (req.query.category) {
    listings = await db.selectListingsByCategory(req.query.category);
  } else if (req.query.owner) {
    listings = await db.selectListingsByOwner(req.query.owner);
  } else {
    listings = await db.selectListingsByCategory(undefined);
  }
  if (listings.length) {
    res.status(200).send(listings);
  }
  res.status(404).send();
};

exports.getListing = async (req, res) => {
  const listing = await db.selectListingById(req.params.id);
  if (listing) {
    res.status(200).send(listing);
  } else {
    res.status(404).send();
  }
};

exports.postListing = async (req, res) => {
  const ownerId = req.body.owner.id;
  const categoryId = req.body.category.id;
  const listing = {
    name: req.body.name,
    description: req.body.description,
    attributes: req.body.attributes,
  };
  listing.attributes.price = req.body.price;
  listing.images = req.body.images;
  const created = await db.insertListing(ownerId, categoryId, listing);
  if (created) {
    res.status(201).send();
  } else {
    res.status(400).send();
  }
};

exports.searchListings = async (req, res) => {
  const keywords = req.body.search.split(' ');
  const listings = await db.selectListingsByKeywords(keywords);
  if (listings.length) {
    res.status(200).send(listings);
  } else {
    res.status(404).send();
  }
};

exports.filterListings = async (req, res) => {
  const filters = req.body.filters;
  const values = req.body.values;
  if (filters.length === values.length) {
    const listings = await db.selectListingsByFilters(filters, values);
    if (listings.length) {
      res.status(200).send(listings);
    } else {
      res.status(404).send();
    }
  } else {
    res.status(400).send();
  }
};
