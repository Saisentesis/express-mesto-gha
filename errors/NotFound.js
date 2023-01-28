const { NotFound } = require('../utils/constants');

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = NotFound;
  }
}

module.exports = NotFoundError;
