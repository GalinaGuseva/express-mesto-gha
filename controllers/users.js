const User = require("../models/user");
const mongoose = require("mongoose");
const {
  CODE_200,
  CODE_201,
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require("../utils/code");
const {
  USER_NOT_FOUND,
  SERVER_ERROR,
  INCORRECT_ID,
  INCORRECT_DATA,
} = require("../utils/messages");

const getUsers = (req, res) => {
  User.find({})
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((users) => res.send({ users }))
    .catch((err) => {
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const getUserId = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((user) => {
      return res.send(user);
    })
    .catch((err) => {
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: INCORRECT_ID, err });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(CODE_201).send(user);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_ERROR).send({
          message: INCORRECT_DATA,
          err,
        });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((user) =>
      res.send({
        name: user.name,
        about: user.about,
      })
    )
    .catch((err) => {
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: INCORRECT_DATA, err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: INCORRECT_ID, err });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => {
      throw new Error("NotFound");
    })
    .then((user) => {
      return res.status(CODE_200).send({
        avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.message === "NotFound") {
        return res.status(NOT_FOUND_ERROR).send({ message: USER_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.ValidationError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: INCORRECT_DATA, err });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res
          .status(BAD_REQUEST_ERROR)
          .send({ message: INCORRECT_ID, err });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

module.exports = { getUsers, getUserId, createUser, updateUser, updateAvatar };
