const cardRouter = require('express').Router();
const {
  createCard,
  getCards,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, cardByIdValidation } = require('../middlewares/validation');

cardRouter.get('/', getCards);
cardRouter.post('/', createCardValidation, createCard);
cardRouter.delete('/:cardId', cardByIdValidation, deleteCard);
cardRouter.put('/:cardId/likes', cardByIdValidation, likeCard);
cardRouter.delete('/:cardId/likes', cardByIdValidation, dislikeCard);

module.exports = cardRouter;
