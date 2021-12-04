
const db = require('./listing.db');

exports.getListings = async (req, res) => {
  let distance;
  let lat;
  let long;
  if (req.query.distance) {
    distance = req.query.distance;
    lat = req.query.lat;
    long = req.query.long;
  } else {
    distance = 0;
    lat = 0;
    long = 0;
  }
  delete req.query.distance;
  delete req.query.lat;
  delete req.query.long;
  const listings = await db.selectListings(req.query);
  if (listings) {
    if (distance) {
      res.status(200).json(listings.filter((listing) => {
        // https://gist.github.com/manix/7ce097c73728e07178af74cb4c62a341
        const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
          const deg2rad = (deg) => deg * 0.017453293;
          const a =
            Math.pow(Math.sin(deg2rad(lat2 - lat1) / 2), 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.pow(Math.sin(deg2rad(lon2 - lon1) / 2), 2);
          return 12742 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        };
        return distance > getDistanceFromLatLonInKm(lat,
          long,
          listing.location.latitude,
          listing.location.longitude,
        );
      }).map((listing) => {
        delete listing.location;
        return listing;
      }));
    } else {
      res.status(200).json(listings.map((listing) => {
        delete listing.location;
        return listing;
      }));
    }
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
    location: {
      latitude: 0,
      longitude: 0,
    },
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
