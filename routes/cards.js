const router = require('express').Router();
const { valNewCard, valId } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);

router.post('/', valNewCard, createCard);

router.delete('/:_id', valId, deleteCard);

router.put('/:_id/likes', valId, likeCard);

router.delete('/:_id/likes', valId, dislikeCard);

module.exports = router;
