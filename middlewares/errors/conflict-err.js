const { CONFLICT_ERROR } = require('./error-code');

class ConflictError extends Error {
  constructor(message = 'Такой уже email уже существует') {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}

module.exports = ConflictError;
