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
  await request.get('/v0/category')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.category).toBeDefined();
      expect(res.body.category.name).toEqual('root');
      expect(res.body.subcategories).toBeDefined();
      expect(res.body.filters).toBeDefined();
    });
});

test('Get Category', async () => {
  const cat = await request.get('/v0/category');
  await request.get('/v0/category?category=' + cat.body.subcategories[0].id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.category.id).toEqual(cat.body.subcategories[0].id);
      expect(res.body.category.name).toEqual(cat.body.subcategories[0].name);
      expect(res.body.subcategories).toBeDefined();
      expect(res.body.filters).toBeDefined();
    });
});

test('Get Bad Category', async () => {
  const path = '/v0/category?category=88888888-4444-4444-4444-111111111111';
  await request.get(path)
    .expect(404);
});
