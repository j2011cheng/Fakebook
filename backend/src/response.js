
const db = require('./response.db');

exports.postResponse = async (req, res) => {
  const listing = req.params.id;
  const message = req.body.message;
  const created = await db.insertResponse(listing, message);
  if (created) {
    res.status(201).send();
  } else {
    res.status(404).send();
  }
};

exports.getResponses = async (req, res) => {
  const listing = req.query.listing;
  const owner = req.params.id;
  const responses = await db.selectResponses(listing, owner);
  if (responses.length > 0) {
    res.status(200).send(responses);
  } else {
    res.status(404).send();
  }
};
