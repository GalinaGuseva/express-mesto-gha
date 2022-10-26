const { celebrate, Joi } = require('celebrate');

const patternUrl = /https?:\/\/(w{3}\.)?[-\w@:%.+~#=]+\.[\w()]+([-\w()@:%+.~#?&=/]*)/;

const register = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().pattern(patternUrl),
  }),
});

const signin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const valGetUser = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().required().length(24),
  }),
});

const valUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
});

const valNewAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(patternUrl),
  }),
});

const valNewCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().pattern(patternUrl),
  }),
});

const valIdCard = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().required().length(24),
  }),
});

module.exports = {
  register,
  signin,
  valGetUser,
  valUpdateUser,
  valNewAvatar,
  valNewCard,
  valIdCard,
};
