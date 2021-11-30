const express = require('express');
const cors = require('cors');
const yaml = require('js-yaml');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const path = require('path');
const OpenApiValidator = require('express-openapi-validator');

const auth = require('./auth');
const category = require('./category');
const listing = require('./listing');
const filters = require('./filters');

const dummy = require('./dummy');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

const apiSpec = path.join(__dirname, '../api/openapi.yaml');

const apidoc = yaml.load(fs.readFileSync(apiSpec, 'utf8'));
app.use('/v0/api-docs', swaggerUi.serve, swaggerUi.setup(apidoc));

app.use(
  OpenApiValidator.middleware({
    apiSpec: apiSpec,
    validateRequests: true,
    validateResponses: true,
  }),
);

app.get('/v0/dummy', dummy.get);
// Your routes go here
app.post('/v0/authenticate', auth.authenticate);
app.post('/v0/newuser', auth.create);

app.get('/v0/category', category.getCategory);
app.get('/v0/listings', listing.getListings);
app.get('/v0/listing/:id', listing.getListing);
app.get('/v0/filters', filters.getFilters);

app.post('/v0/listing', auth.check, listing.postListing);

app.use((err, req, res, next) => {
  res.status(err.status).json({
    message: err.message,
    errors: err.errors,
    status: err.status,
  });
});

module.exports = app;
