const Card = require('../models/card');
const { BadRequest, NotFound, InternalServerError } = require('../utils/constants');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ cards }))
    .catch(() => res.status(InternalServerError).send({ message: 'Произошла ошибка' }));
};

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => card.populate(['owner', 'likes']))
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then(((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(card);
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .then(((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(card);
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then(((card) => {
      if (!card) {
        return res.status(NotFound).send({ message: 'Карточка с указанным _id не найдена.' });
      }
      return res.send(card);
    }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(BadRequest).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(InternalServerError).send({ message: 'Произошла ошибка на сервере' });
    });
};
