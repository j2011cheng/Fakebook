const puppeteer = require('puppeteer');
const http = require('http');
const path = require('path');
const express = require('express');
const {createProxyMiddleware} = require('http-proxy-middleware');

require('dotenv').config();
const app = require('../../backend/src/app');

let backend;
let frontend;
let browser;
let page;

beforeAll(() => {
  backend = http.createServer(app);
  backend.listen(3011, () => {
    console.log('Backend Running at http://localhost:3011');
  });
  frontend = http.createServer(
    express()
      .use('/v0', createProxyMiddleware({
        target: 'http://localhost:3011/',
        changeOrigin: true}))
      .use('/static', express.static(
        path.join(__dirname, '..', '..', 'frontend', 'build', 'static')))
      .get('*', function(req, res) {
        res.sendFile('index.html',
            {root:  path.join(__dirname, '..', '..', 'frontend', 'build')})
      })
  );
  frontend.listen(3001, () => {
    console.log('Frontend Running at http://localhost:3001');
  });
});

afterAll((done) => {
  backend.close(() => {
    frontend.close(done);
  });
});

beforeEach(async () => {
  browser = await puppeteer.launch({
    args: [
      '--no-sandbox',
      '--headless',
    ],
  });
  page = await browser.newPage();
});

afterEach(async () => {
  await browser.close();
});

test('Create New User', async () => {
  await page.goto('http://localhost:3001');

  const login = await page.$('aria/log in');
  let cont = await (await login.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Log In');
  await page.click('aria/log in');

  const newUser = await page.$('aria/create new account');
  cont = await (await newUser.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Create New Account');
  await page.click('aria/create new account');

  await page.waitForSelector('aria/name');
  await page.click('aria/name');
  let textField = await page.evaluateHandle(() => document.activeElement);
  await textField.type('Jane Doe');
  await page.click('aria/continue');

  await page.waitForSelector('aria/email');
  await page.click('aria/email');
  textField = await page.evaluateHandle(() => document.activeElement);
  await textField.type('jane.doe@soe.ucsc.edu');
  await page.click('aria/continue');

  await page.waitForSelector('aria/phone number');
  await page.click('aria/continue');
  //
  await page.waitForSelector('aria/password');
  await page.click('aria/password');
  textField = await page.evaluateHandle(() => document.activeElement);
  await textField.type('Salt and hash is good for breakfast and passwords');
  await page.click('aria/continue');

  await page.waitForSelector('aria/sign up')
  const signUpButton = await page.$('aria/sign up');
  cont = await (await signUpButton.getProperty('textContent')).jsonValue();
  expect(cont).toBe('Sign Up');
  await page.click('aria/sign up');

  // rest doesn't work because .type() doesn't properly interact with element
  // values

  // await page.waitForSelector('aria/email or phone');
  // await page.click('aria/email or phone');
  // await page.type('jane.doe@soe.ucsc.edu');
  // textField = await page.evaluateHandle(() => document.activeElement);

}, 10000);

test('Search for an iPhone', async () => {
  await page.goto('http://localhost:3001');

  await page.waitForSelector('aria/electronics');
  // page.click('aria/electronics');
  // const electronics = await page.$('aria/electronics');
  // let cont = await (await electronics.getProperty('textContent')).jsonValue();
  // expect(cont).toBe('electronics');
  // console.log(await (await (await page.$('div')).getProperty('textContent')).jsonValue());
}, 10000);
