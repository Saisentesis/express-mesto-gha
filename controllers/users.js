const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFound');
const ConflictError = require('../errors/Conflict');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({ ...req.body, password: hash }))
    .then(() => res.send({
      name,
      email,
      about,
      avatar,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('Пользователь с таким email уже существует'));
        return;
      }
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.findUser = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь с указанным id не найден'); }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.getMyProfileInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) { throw new NotFoundError('Пользователь по указанному _id не найден.'); }
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
        return;
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};
