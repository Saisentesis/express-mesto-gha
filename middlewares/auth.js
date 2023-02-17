const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Присланный токен некорректен'));
    } else {
      next(err);
    }
  }

  next();
};
