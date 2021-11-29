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

test('POST Login', async () => {
  await request.post('/v0/authenticate')
    .send({
      loginName: 'dev@dev.dev',
      password: 'dev',
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.owner).toBeDefined();
      expect(res.body.owner.name).toEqual('dev');
      expect(res.body.owner.email).toEqual('dev@dev.dev');
      expect(res.body.accessToken).toBeDefined();
    });
});

test('POST Invalid Login', async () => {
  await request.post('/v0/authenticate')
    .send({
      loginName: 'invalid@invalid.invalid',
      password: 'invalid',
    })
    .expect(401)
    .expect('Content-Type', /text/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.text).toBeDefined();
      expect(res.text).toEqual('Email or phone or password is incorrect')
    });
});

test('POST New User', async () => {
  await request.post('/v0/newuser')
    .send({
      name: 'Test',
      email: 'user@test.com',
      password: '12345',
    })
    .expect(201);
});

test('POST New User Already Exists', async () => {
  await request.post('/v0/newuser')
    .send({
      name: 'New',
      email: 'user@new.com',
      password: '12345',
    });
  await request.post('/v0/newuser')
  .send({
    name: 'New',
    email: 'user@new.com',
    password: '12345',
  })
  .expect(409);
});

test('POST New User with Phone', async () => {
  await request.post('/v0/newuser')
    .send({
      name: 'New',
      email: 'user2@new.com',
      phone: 'Phone-Number',
      password: '12345',
    })
    .expect(201);
  await request.post('/v0/authenticate')
    .send({
      loginName: 'Phone-Number',
      password: '12345',
    })
    .expect(200);
});
