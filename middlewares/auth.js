const jwt = require('jsonwebtoken');
const UnauthorizedError = require('./errors/unauthorized-err');

module.exports = (req, res, next) => {
  const token = () => {
    if (req.cookies.jwt) {
      return req.cookies.jwt;
    } if (req.headers.authorization) {
      return req.headers.authorization.replace('Bearer ', '');
    }
    next(new UnauthorizedError('Необходима авторизация'));
  };
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
