const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});

afterAll((done) => {
  server.close(done);
});

test('Get All', async () => {
  await request.get('/v0/listings')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('Get Category', async () => {
  const cat = await request.get('/v0/category');
  await request.get('/v0/listings?category=' + cat.body.category.id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('Get Bad Category', async () => {
  await request.get('/v0/listings?category=88888888-4444-4444-4444-111111111111')
    .expect(404)
});

test('Get Listing', async () => {
  const listings = await request.get('/v0/listings');
  await request.get('/v0/listing/' + listings.body[0].id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.id).toEqual(listings.body[0].id);
    });
});

test('Get Bad Listing', async () => {
  await request.get('/v0/listing/88888888-4444-4444-4444-111111111111')
    .expect(404)
});

