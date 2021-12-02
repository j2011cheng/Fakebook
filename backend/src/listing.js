
const db = require('./listing.db');

exports.getListings = async (req, res) => {
  const listings = await db.selectListings(req.query);
  if (listings) {
    res.status(200).json(listings);
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
