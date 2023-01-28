const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers, findUser, updateProfile, updateAvatar, getMyProfileInfo,
} = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getMyProfileInfo);

router.get('/users/:id', celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24),
  }),
}), findUser);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateProfile);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(/^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s@]*$/),
  }),
}), updateAvatar);

module.exports = router;
