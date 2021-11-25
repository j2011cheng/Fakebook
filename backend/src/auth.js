const jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');

const secrets = require('../data/secrets');

exports.create = async (req, res) => {
  const {name, email, password} = req.body;
  bcrypt.hash(password, 10, (err, hash) => {
    // Store hash in user DB and return status
    console.log(hash);
    res.status(200).send();
  });
};

exports.authenticate = async (req, res) => {
  const {email, password} = req.body;
  // Replace this with searching database for user
  // const user = users.find((user) => {
  //   return user.email === email &&
  //   bcrypt.compareSync(password, user.password);
  // });
  const user = {
    email: email,
  };
  // For now use username dev and password dev
  if (user.email === 'dev@dev.dev' && password === 'dev') {
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
    res.status(401).send('Username or password incorrect');
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
