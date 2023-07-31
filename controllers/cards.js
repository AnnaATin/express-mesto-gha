const Card = require('../models/card');
const NotFound = require('../errors/errorCodes');
const STATUS_CODE = require('../errors/errorCodes');

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(STATUS_CODE.successCreate).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'При создании карточки переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.status(STATUS_CODE.success).send(cards);
    })
    .catch(() => {
      res.status(STATUS_CODE.serverError).send({
        message: 'Произошла ошибка на сервере.',
      });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Для постановки лайка переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Передан несуществующий _id карточки.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Для дизлайка переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound();
    })
    .then((card) => {
      res.status(STATUS_CODE.success).send(card);
    })
    .catch((e) => {
      if (e.name === 'NotFound') {
        res.status(STATUS_CODE.notFound).send({
          message: 'Карточка с таким _id не найдена.',
        });
      } else if (e.name === 'CastError') {
        res.status(STATUS_CODE.dataError).send({
          message: 'Для удаления переданы некорректные данные.',
        });
      } else {
        res.status(STATUS_CODE.serverError).send({
          message: 'Произошла ошибка на сервере.',
        });
      }
    });
};
