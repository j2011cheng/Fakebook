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

test('GET All', async () => {
  await request.get('/v0/listings')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET Category', async () => {
  const cat = await request.get('/v0/category');
  await request.get('/v0/listings?category=' + cat.body.subcategories[0].id)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET Bad Category', async () => {
  await request.get('/v0/listings?category=88888888-4444-4444-4444-111111111111')
    .expect(404)
});

test('GET Listing', async () => {
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

test('GET Bad Listing', async () => {
  await request.get('/v0/listing/88888888-4444-4444-4444-111111111111')
    .expect(404)
});

test('POST Listing', async () => {
  const cat = await request.get('/v0/category');
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  await request.post('/v0/listing')
    .set('Authorization', `Bearer ${owner.body.accessToken}`)
    .send({
    category: cat.body.subcategories[0],
    owner: owner.body.owner,
    name: 'Test Listing',
    price: '$1',
    description: 'This is a test listing.',
    attributes: {},
  })
    .expect(201);
});

test('POST Bad Listing', async () => {
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  await request.post('/v0/listing')
    .set('Authorization', `Bearer ${owner.body.accessToken}`)
    .send({
    category: {
      name: 'Bad Category',
      id: '88888888-4444-4444-4444-111111111111',
    },
    owner: owner.body.owner,
    name: 'Test Listing',
    price: '$1',
    description: 'This is a test listing.',
    images: [],
    attributes: {},
  })
    .expect(400);
});
