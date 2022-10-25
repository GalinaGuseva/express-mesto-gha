const { DEFAULT_ERROR } = require('./error-code');

class DefaultError extends Error {
  constructor(message = 'На сервере произошла ошибка') {
    super(message);
    this.statusCode = DEFAULT_ERROR;
  }
}

module.exports = DefaultError;
