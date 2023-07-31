const User = require('../models/users');
const NotFound = require('../errors/errorCodes');
const STATUS_CODE = require('../errors/errorCodes');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(STATUS_CODE.successCreate).send({ user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'При создании пользователя переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send({ user });
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь по такому _id не найден.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Запрашиваемый пользователь не найден.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(STATUS_CODE.success).send({ users });
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({
        message: 'Произошла ошибка на сервере.',
      });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send({ user });
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь с таким _id не найден.',
        });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'При обновлении профиля переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((user) => {
      res.status(STATUS_CODE.success).send(user);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Пользователь с таким _id не найден.',
        });
      } else if (e.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'При обновлении аватара переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};
