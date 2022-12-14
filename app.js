const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const routes = require('./routes');
const errorHandler = require('./middlewares/errors/errorHandler');

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

mongoose.connect(MONGO_URL);

const app = express();

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use(routes);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
