const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const NotFoundError = require('../middlewares/errors/not-found-err');
const BadRequestError = require('../middlewares/errors/bad-request-err');
const ConflictError = require('../middlewares/errors/conflict-err');
const UnauthorizedError = require('../middlewares/errors/unauthorized-err');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => next(err));
};

const getUserId = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id'));
      }
      return next(err);
    });
};

const createUser = (req, res, next) => {
  const { email, password, name, about, avatar } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Пользователь с таким email уже зарегистрирован');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'one-secret-key', {
        expiresIn: '7d',
      });

      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .json({ message: 'Успешная авторизация' });
    })
    .catch(() => {
      next(new UnauthorizedError('Некорректный id'));
    });
};

const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((user) => res.send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError('Пользователь с таким id не найден');
    })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
  login,
  getCurrentUser,
};
