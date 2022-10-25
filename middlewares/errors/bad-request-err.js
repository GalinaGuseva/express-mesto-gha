const { BAD_REQUEST } = require('./error-code');

class BadRequestError extends Error {
  constructor(message = 'Переданы некорректные данные') {
    super(message);
    this.statusCode = BAD_REQUEST;
  }
}

module.exports = BadRequestError;
