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

test('Get Category', async () => {
  // replace with uuid of vehicles category
  const cat = await request.get('/v0/category');
  await request.get('/v0/category?category=' + cat.body.category.id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.category.id).toEqual(cat.body.category.id);
      expect(res.body.category.name).toEqual(cat.body.category.name);
      expect(res.body.subcategories).toBeDefined();
      expect(res.body.filters).toBeDefined();
    });
});

test('Get Bad Category', async () => {
  await request.get('/v0/category?category=88888888-4444-4444-4444-111111111111')
    .expect(404)
});
