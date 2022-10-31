const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../middlewares/errors/not-found-err');
const { auth } = require('../middlewares/auth');
const { login, createUser } = require('../controllers/users');
const { register, signin } = require('../middlewares/validation');

router.post('/signin', signin, login);
router.post('/signup', register, createUser);
router.get('/signout', (req, res) => {
  res.clearCookie('jwt').send({ message: 'Выход' });
});

router.use(auth);
router.use(userRouter);
router.use(cardRouter);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
