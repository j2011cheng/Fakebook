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

test('GET All Listings', async () => {
  await request.get('/v0/listings')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET Listings By Category', async () => {
  const cat = await request.get('/v0/category');
  await request.get(`/v0/listings?category=${cat.body.subcategories[0].id}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});

test('GET Listings Bad Category', async () => {
  const path = '/v0/listings?category=88888888-4444-4444-4444-111111111111';
  await request.get(path)
    .expect(404);
});

test('GET Listing By Id', async () => {
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
    .expect(404);
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
      name: 'Post Test Listing',
      price: 1,
      description: 'This is a test listing.',
      attributes: {},
      images: [''],
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
      name: 'Post Bad Test Listing',
      price: 1,
      description: 'This is a test listing.',
      images: [],
      attributes: {},
    })
    .expect(400);
});

test('GET Listings By Owner', async () => {
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
      name: 'Get By Owner Test Listing',
      price: 1,
      description: 'This is a test listing.',
      attributes: {},
      images: [''],
    });
  await request.get(`/v0/listings?owner=${owner.body.owner.id}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Category and Owner', async () => {
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
      name: 'Get By Owner Test Listing',
      price: 1,
      description: 'This is a test listing.',
      attributes: {},
      images: [''],
    });
  const ownerid = owner.body.owner.id;
  const catid = cat.body.subcategories[0].id;
  await request
    .get(`/v0/listings?category=${catid}&owner=${ownerid}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Keyword', async () => {
  await request.get('/v0/listings?search=a%20m')
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Category and Keyword', async () => {
  const cat = await request.get('/v0/category');
  await request
    .get(`/v0/listings?category=${cat.body.subcategories[0].id}&search=e`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
    });
});


test('GET No Listings By Keyword', async () => {
  const weirdString = 'therereallyshouldnotbeanylistingswiththisweirdstring';
  await request
    .get(`/v0/listings?search=${weirdString}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length === 0).toBeTruthy();
    });
});

test('GET Listings By Bad Keyword', async () => {
  await request.get('/v0/listings?search=')
    .expect(400);
});

test('GET Listings By Range', async () => {
  const q = {
    'MINprice': 1000,
    'MAXprice': 10000,
  };
  const str = new URLSearchParams(q).toString();
  await request.get(`/v0/listings?${str}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Bool', async () => {
  const q = {
    'electric': true,
  };
  const str = new URLSearchParams(q).toString();
  await request.get(`/v0/listings?${str}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Enum', async () => {
  const q = {
    'os': 'Mac',
  };
  const str = new URLSearchParams(q).toString();
  await request.get(`/v0/listings?${str}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .then((res) => {
      expect(res).toBeDefined();
      expect(res.body).toBeDefined();
      expect(res.body.length).toBeDefined();
      expect(res.body.length > 0).toBeTruthy();
    });
});

test('GET Listings By Bad Filter', async () => {
  const q = {
    'MINnotafilter': 1000,
    'alsonotafilter': 'fake',
    'stillnotafilter': false,
  };
  const str = new URLSearchParams(q).toString();
  await request.get(`/v0/listings?${str}`)
    .expect(404);
});
