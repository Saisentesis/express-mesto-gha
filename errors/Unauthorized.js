const { Unauthorized } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Unauthorized;
  }
}

module.exports = UnauthorizedError;
