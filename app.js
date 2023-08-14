const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { createUserValidation, loginValidation } = require('./middlewares/validation');
const { createUser, login } = require('./controllers/users');

const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(cookieParser());
app.post('/signin', loginValidation, login);
app.post('/signup', createUserValidation, createUser);
app.use(auth);
app.use(router);
app.use(errors());

app.use((e, req, res, next) => {
  const { status = 500, message } = e;
  res.status(status).send({ message: status === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT, () => {
  console.log(`Приложение запущено на порту ${PORT}`);
});
