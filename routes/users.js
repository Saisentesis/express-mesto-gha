const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, findUser, updateUser, getMyProfileInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyProfileInfo);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
}), findUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateUser);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateUser);

module.exports = router;
