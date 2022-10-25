const { FORBIDDEN } = require('./error-code');

class ForbiddenError extends Error {
  constructor(message = 'Не достаточно прав для удаления карточки') {
    super(message);
    this.statusCode = FORBIDDEN;
  }
}

module.exports = ForbiddenError;
