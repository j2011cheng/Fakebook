const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const db = require('./user.db');

const secrets = require('../data/secrets');

exports.create = async (req, res) => {
  const {name, email, password} = req.body;
  let user = {
    name: name,
    email: email,
  };
  const response = await db.selectUserByEmail(user.email);
  if (response) {
    res.status(409).send();
  } else {
    user.hash = bcrypt.hashSync(password, 10);
    await db.insertUser(user);
    res.status(200).send();
  }
};

exports.authenticate = async (req, res) => {
  const {email, password} = req.body;
  const response = await db.selectUserByEmail(email);
  if (response && bcrypt.compareSync(password, response.person.hash)) {
    const user = {
      name: response.person.name,
      email: response.person.email,
      id: response.id,
    }
    const accessToken = jwt.sign(
      {email: user.email},
      secrets.accessToken, {
        expiresIn: '30m',
        algorithm: 'HS256'
      });
    res.status(200).json({
      owner: user,
      accessToken: accessToken,
    });
  } else {
    res.status(401).send('Email or password is incorrect');
  }
};

exports.check = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, secrets.accessToken, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
    next();
  } else {
    res.sendStatus(401);
  }
};
