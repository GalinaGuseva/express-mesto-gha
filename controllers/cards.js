const mongoose = require('mongoose');
const Card = require('../models/card');

const {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  DEFAULT_ERROR,
} = require('../utils/code');
const {
  CARD_NOT_FOUND,
  SERVER_ERROR,
  FORBIDDEN_ERROR,
  INCORRECT_ID,
  INCORRECT_DATA,
} = require('../utils/messages');

const getCards = (req, res) => {
  Card.find({})
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((cards) => res.send({ cards }))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR, err });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ card }))
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

const deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => {
      if (card.owner._id.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.cardId).then((element) => res.send(element));
      } else {
        res.status(BAD_REQUEST_ERROR).send({ message: FORBIDDEN_ERROR });
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND_ERROR).send({ message: CARD_NOT_FOUND });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST_ERROR).send({ message: INCORRECT_ID });
      }
      return res.status(DEFAULT_ERROR).send({ message: SERVER_ERROR });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
