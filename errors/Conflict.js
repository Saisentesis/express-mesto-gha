const { Conflict } = require('../utils/constants');

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = Conflict;
  }
}

module.exports = ConflictError;
