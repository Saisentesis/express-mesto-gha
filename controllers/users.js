const User = require('../models/user');
const { BadRequest, NotFound, InternalServerError } = require('../utils/constants');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.findUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

const updateUser = (req, res) => {
  User.findByIdAndUpdate(req.user._id, req.body, {
    new: true,
    runValidators: true,
    upsert: false,
  })
    .then((user) => {
      if (!user) {
        return res.status(NotFound).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  req.body = { name, about };
  updateUser(req, res);
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  req.body = { avatar };
  updateUser(req, res);
};
