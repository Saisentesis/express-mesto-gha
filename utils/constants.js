const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const BadRequest = 400;
const Unauthorized = 401;
const Forbidden = 403;
const NotFound = 404;
const Conflict = 409;

module.exports = {
  BadRequest, Unauthorized, Forbidden, NotFound, Conflict, limiter,
};
