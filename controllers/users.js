const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const NotFound = require('../errors/NotFoundError');
const Conflicted = require('../errors/ConflictError');
const BadRequest = require('../errors/BadRequestError');

const { JWT_KEY = 'my-secret-key' } = process.env;

module.exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      email: req.body.email,
      password: hash,
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    }))
    .then((user) => res.status(201).send({
      data: {
        email: user.email,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    }))
    .catch((e) => {
      if (e.code === 11000) {
        next(new Conflicted('Такой пользователь уже есть.'));
      } else if (e.name === 'ValidationError') {
        next(new BadRequest('При создании пользователя переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        JWT_KEY,
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: (7 * 24 * 60 * 60),
          httpOnly: true,
          sameSite: true,
        })
        .send({ token })
        .end();
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по такому _id не найден.');
    })
    .then((user) => {
      res.send({
        _id: user.id,
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Передан некорректный id.'));
      } else if (e.name === 'NotFoundError') {
        next(new NotFound('Пользователь по такому _id не найден.'));
      } else {
        next(e);
      }
    });
};

module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      throw new NotFound('Пользователь по такому _id не найден.');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Запрашиваемый пользователь не найден'));
      } else {
        next(e);
      }
    });
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send({ users });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
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
      throw new NotFound('Пользователь с таким _id не найден.');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequest('При обновлении профиля переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
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
      throw new NotFound('Пользователь с таким _id не найден.');
    })
    .then((user) => {
      res.send({ user });
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequest('При обновлении аватара переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};
