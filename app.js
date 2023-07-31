const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const STATUS_CODE = require('./errors/errorCodes');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '64c59da1d0c0b74317c34568',
  };
  next();
});

app.use(express.json());

app.use('/', userRouter);
app.use('/', cardRouter);
app.use('*', (req, res) => {
  res.status(STATUS_CODE.notFound).send({
    message: 'Страница не найдена',
  });
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
