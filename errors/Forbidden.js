const { Forbidden } = require('../utils/constants');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Forbidden;
  }
}

module.exports = ForbiddenError;
