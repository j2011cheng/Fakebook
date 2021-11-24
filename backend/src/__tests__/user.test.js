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
  await request.post('/authenticate')
    .send({
      email: 'dev',
      password: 'dev',
    })
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.email).toBeDefined();
      expect(res.body.email).toEqual('dev');
      expect(res.body.accessToken).toBeDefined();
    });
});

test('POST Invalid Login', async () => {
  await request.post('/authenticate')
    .send({
      name: 'invalid',
      password: 'invalid',
    })
    .expect(401)
    .expect('Content-Type', /text/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.text).toBeDefined();
      expect(res.text).toEqual('Username or password incorrect')
    });
});
