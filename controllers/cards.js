const Card = require('../models/card');
const NotFound = require('../errors/NotFoundError');
const BadRequest = require('../errors/BadRequestError');
const Forbidden = require('../errors/ForbiddenError');

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequest('При создании карточки переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.send({ cards });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки.');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Для постановки лайка переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFound('Передан несуществующий _id карточки.');
    })
    .then((card) => {
      res.send({ card });
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Для дизлайка переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с таким _id не найдена.');
    })
    .then((card) => {
      const owner = card.owner.toString();
      if (req.user._id === owner) {
        Card.deleteOne(card)
          .then(() => {
            res.send({ card });
          });
      } else {
        throw new Forbidden('Карточку невозможно удалить.');
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequest('Для удаления переданы некорректные данные.'));
      } else {
        next(e);
      }
    });
};
