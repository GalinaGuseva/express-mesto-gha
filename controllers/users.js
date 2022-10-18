const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Пользователи не найдены' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
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
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный id' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный id' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(404).send({ message: 'Запрашиваемый пользователь не найден' });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).send({ message: 'Переданы некорректные данные' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(400).send({ message: 'Некорректный id' });
      }
      return res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
