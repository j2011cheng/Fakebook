
const db = require('./listing.db');

exports.getListings = async (req, res) => {
  const listings = await db.selectListingsByCategory(req.query.category);
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
