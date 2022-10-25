const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT_ERROR,
} = require('../middlewares/errors/error-code');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ users }))
    .catch(() => res.status(DEFAULT_ERROR).send({ message: 'На сервере ошибка' }));
};

const getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.send({ data: user.toObject() });
    })
    .catch(next);
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { email, password, name, about, avatar } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ email, password: hash, name, about, avatar }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const login = (req, res) => {
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
        .send({
          email: user.email,
        })
        .end();
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(401).send({ message: 'Неправильные почта или пароль' });
      }
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => new Error('NotFound'))
    .then((user) => res.send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((newAvatar) => res.send(newAvatar))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res
          .status(NOT_FOUND)
          .send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
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
