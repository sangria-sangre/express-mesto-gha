const cardRoutes = require('express').Router();
const { getCards, postCard, deleteCard, likeCard, dislikeCard } = require('../controllers/cards');

cardRoutes.get('/cards', getCards);
cardRoutes.post('/cards', postCard);
cardRoutes.delete('/cards/:cardsId', deleteCard);
cardRoutes.put('/cards/:cardId/likes', likeCard);
cardRoutes.delete('/cards/:cardId/like', dislikeCard);

module.exports = cardRoutes;