const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  BAD_REQUEST,
  NOT_FOUND,
  DEFAULT_ERROR,
} = require('../middlewares/errors/error-code');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(() => {
      res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  Card.create({ name: req.body.name, link: req.body.link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
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
        res.status(400).send({ message: 'Недостаточно прав для удаления карточки' });
      }
    })
    .catch((err) => {
      if (err.message === 'NotFound') {
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
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
        return res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      }
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Некорректный id' });
      }
      return res.status(DEFAULT_ERROR).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
