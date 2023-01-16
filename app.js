const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mydb');

app.use((req, res, next) => {
  req.user = {
    _id: '63c44412a3541ad5b69d9571',
  };
  next();
});

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(400).send({ message: 'Некорректный путь' });
});

app.listen(PORT);