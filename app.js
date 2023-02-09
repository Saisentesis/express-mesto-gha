require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const NotFoundError = require('./errors/NotFound');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { limiter } = require('./utils/constants');
const ErrorHandler = require('./errors/ErrorHandler');

const { PORT = 3000, MONGODB = 'mongodb://localhost:27017/mydb' } = process.env;
if (process.env.NODE_ENV !== 'production') {
  process.env.JWT_SECRET = 'some-secret-key';
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(MONGODB);

app.use(helmet());
app.use(limiter);
app.use(requestLogger);
app.use('/', require('./routes/auth'));

app.use(auth);
app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/', (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});

app.use(errorLogger);
app.use(errors());
app.use(ErrorHandler);

app.listen(PORT);
