const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { register, signin } = require('./middlewares/validation');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const users = require('./routes/users');
const cards = require('./routes/cards');
const NotFoundError = require('./middlewares/errors/not-found-err');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

app.post('/signin', signin, login);
app.post('/signup', register, createUser);

app.use(auth);

app.use('/cards', cards);
app.use('/users', users);

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const code = err.statusCode || 500;
  res
    .status(code)
    .send({ message: code === 500 ? 'На сервере произошла ошибка' : err.message, err });

  next();
});

app.listen(PORT);
