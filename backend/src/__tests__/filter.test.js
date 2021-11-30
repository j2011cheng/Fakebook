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

test('GET Root Category Filter', async () => {
  await request.get('/v0/filters').send()
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body[0].name).toBeDefined();
    });
});

test('GET Category Filters', async () => {
  const cat = await request.get('/v0/category');
  await request.get('/v0/filters?category=' + cat.body.subcategories[0].id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body.length > 1).toBeTruthy();
    });
});

test('GET Bad Category Filters', async () => {
  await request.get('/v0/filters?category=88888888-4444-4444-4444-111111111111')
    .expect(404);
});
