const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const db = require('./user.db');

const secrets = require('../data/secrets');

exports.create = async (req, res) => {
  const {name, email, password} = req.body;
  const user = {
    name: name,
    email: email,
  };
  if (req.body.phone) {
    user.phone = req.body.phone;
  }
  const response = await db.selectUserByLoginName(user.email);
  if (response) {
    res.status(409).send();
  } else {
    hash = bcrypt.hashSync(password, 10);
    await db.insertUser(user, hash);
    res.status(201).send();
  }
};

exports.authenticate = async (req, res) => {
  const {loginName, password} = req.body;
  const response = await db.selectUserByLoginName(loginName);
  if (response && bcrypt.compareSync(password, response.hash)) {
    const user = {
      name: response.person.name,
      email: response.person.email,
      id: response.id,
    };
    if (response.person.phone) {
      user.phone = response.person.phone;
    }
    const accessToken = jwt.sign(
      {email: user.email},
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256',
      });
    res.status(200).json({
      owner: user,
      accessToken: accessToken,
    });
  } else {
    res.status(401).send('Email or phone or password is incorrect');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];
  jwt.verify(token, secrets.accessToken, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};
