const { NOT_FOUND } = require('./error-code');

class NotFoundError extends Error {
  constructor(message = 'Запрашиваемый ресурс не найден') {
    super(message);
    this.statusCode = NOT_FOUND;
  }
}

module.exports = NotFoundError;
