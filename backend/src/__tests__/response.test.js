const supertest = require('supertest');
const http = require('http');

const db = require('./db');
const app = require('../app');

let server;
let auth;
let listings;

beforeAll(() => {
  server = http.createServer(app);
  server.listen();
  request = supertest(server);
  return db.reset();
});
afterAll((done) => {
  server.close(done);
});

test('GET No Responses', async () => {
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  auth = owner.body;
  listings = await request.get(`/v0/listings?owner=${auth.owner.id}`);
  const listing = '88888888-4444-4444-4444-111111111111';
  const path = `/v0/response/${auth.owner.id}?listing=${listing}`;
  await request.get(path)
    .set('Authorization', `Bearer ${auth.accessToken}`)
    .expect(404);
});

test('POST Response', async () => {
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  auth = owner.body;
  listings = await request.get(`/v0/listings?owner=${auth.owner.id}`);
  const path = `/v0/response/${listings.body[0].id}`;
  await request.post(path)
    .set('Authorization', `Bearer ${auth.accessToken}`)
    .send({
      message: 'This is a nice listing.',
      owner: auth.owner.id,
    })
    .expect(201);
});

test('POST Bad Response', async () => {
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  auth = owner.body;
  listings = await request.get(`/v0/listings?owner=${auth.owner.id}`);
  await request.post('/v0/response/88888888-4444-4444-4444-111111111111')
    .set('Authorization', `Bearer ${auth.accessToken}`)
    .send({
      message: 'This is a bad response.',
    })
    .expect(404);
});

test('GET Responses', async () => {
  const owner = await request.post('/v0/authenticate').send({
    loginName: 'dev@dev.dev',
    password: 'dev',
  });
  auth = owner.body;
  listings = await request.get(`/v0/listings?owner=${auth.owner.id}`);
  const path = `/v0/response/${auth.owner.id}?listing=${listings.body[0].id}`;
  await request.get(path)
    .set('Authorization', `Bearer ${auth.accessToken}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});
