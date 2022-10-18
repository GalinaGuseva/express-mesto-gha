const mongoose = require('mongoose');
const User = require('../models/user');

const { BAD_REQUEST_ERROR, NOT_FOUND_ERROR, DEFAULT_ERROR } = require('../utils/code');
const {
  USER_NOT_FOUND,
  SERVER_ERROR,
  INCORRECT_ID,
  INCORRECT_DATA,
} = require('../utils/messages');

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
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
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_DATA });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
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
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_DATA });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
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
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_DATA });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
    });
};

module.exports = {
  getUsers,
  getUserId,
  createUser,
  updateUser,
  updateAvatar,
};
