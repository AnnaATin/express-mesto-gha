const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRouter);
router.use('/cards', cardRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Страницы не существует'));
});

module.exports = router;
