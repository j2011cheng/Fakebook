
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
    price: req.body.price,
    description: req.body.description,
    attributes: req.body.attributes,
  };
  if (req.body.images) {
    listing.images = req.body.images;
  }
  let created = await db.insertListing(ownerId, categoryId, listing);
  if (created) {
    res.status(201).send();
  } else {
    res.status(400).send();
  }
};
