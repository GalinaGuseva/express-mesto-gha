const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/unauthorized-err');
const SECRET = require('../utils/constants');

const auth = (req, res, next) => {
  const token = () => {
    if (req.cookies.jwt) {
      return req.cookies.jwt;
    } if (req.headers.authorization) {
      return req.headers.authorization.replace('Bearer ', '');
    } return next(new UnauthorizedError('Необходима авторизация'));
  };

  let payload;

  try {
    payload = jwt.verify(token, SECRET);
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};

module.exports = auth;
