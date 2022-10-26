const router = require('express').Router();
const { valNewCard, valIdCard } = require('../middlewares/validation');

const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/cards', getCards);

router.post('/cards', valNewCard, createCard);

router.delete('/cards/:cardId', valIdCard, deleteCard);

router.put('/cards/:cardId/likes', valIdCard, likeCard);

router.delete('/cards/:cardId/likes', valIdCard, dislikeCard);

module.exports = router;
