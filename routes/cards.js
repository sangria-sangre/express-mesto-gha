const cardRoutes = require('express').Router();
const { getCards, postCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

cardRoutes.get('/', getCards);
cardRoutes.post('/', postCard);
cardRoutes.delete('/:cardId', deleteCard);
cardRoutes.put('/:cardId/likes', likeCard);
cardRoutes.delete('/:cardId/likes', dislikeCard);

module.exports = cardRoutes;