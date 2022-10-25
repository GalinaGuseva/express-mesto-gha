const { NOT_AUTH } = require('./error-code');

class UnauthorizedError extends Error {
  constructor(message = 'Неправильный логин или пароль') {
    super(message);
    this.statusCode = NOT_AUTH;
  }
}

module.exports = UnauthorizedError;
